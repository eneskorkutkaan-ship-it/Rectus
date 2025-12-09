


import { GoogleGenAI, Chat, GenerateContentResponse, LiveServerMessage, Modality } from "@google/genai";
import { MODEL_NAME_TEXT, MODEL_NAME_IMAGE, SYSTEM_INSTRUCTION } from "../constants";

let genAI: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key is missing. Please set process.env.API_KEY.");
      throw new Error("API Key missing");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const initializeChat = () => {
  try {
    const ai = getGenAI();
    chatSession = ai.chats.create({
      model: MODEL_NAME_TEXT,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
  }
};

interface SendMessageOptions {
  message: string;
  image?: string; // Base64 for input vision
  isImageGeneration?: boolean; // Request to generate an image
  systemContext?: string; // HIDDEN CONTEXT for Admin stats
}

export const sendMessageStream = async function* ({ message, image, isImageGeneration, systemContext }: SendMessageOptions) {
  const ai = getGenAI();

  // 1. Image Generation Request
  if (isImageGeneration) {
    try {
      yield "Görsel oluşturuluyor, lütfen bekleyin...\n"; 
      
      const response = await ai.models.generateContent({
        model: MODEL_NAME_IMAGE,
        contents: {
          parts: [{ text: message }]
        },
      });
      
      const parts = response.candidates?.[0]?.content?.parts;
      let hasImage = false;

      if (parts) {
        for (const part of parts) {
           if (part.inlineData) {
             const base64 = part.inlineData.data;
             const mimeType = part.inlineData.mimeType || 'image/png';
             yield `[IMAGE]:data:${mimeType};base64,${base64}`;
             hasImage = true;
           }
        }
      }
      
      if (!hasImage) {
          if (response.text) {
             yield "\n(Model yanıtı): " + response.text;
          } else {
             yield "\nGörsel oluşturulamadı. Lütfen tekrar deneyin.";
          }
      }

    } catch (error) {
      console.error("Image Gen Error:", error);
      yield "\nBir hata oluştu. Lütfen daha basit bir açıklama ile tekrar deneyin.";
    }
    return;
  }

  // 2. Chat with Vision or Text
  if (!chatSession) {
    initializeChat();
  }
  if (!chatSession) {
    throw new Error("Chat session could not be initialized.");
  }

  try {
    let result;
    
    // Inject System Context invisibly if provided
    let finalMessage = message;
    if (systemContext) {
        // IMPORTANT: System Context is prepended clearly to override model behavior
        finalMessage = `${systemContext}\n\n[USER REQUEST]: ${message}`;
    }

    if (image) {
       const base64Data = image.split(',')[1] || image;
       const parts = [
         { text: finalMessage || "Bu görseli analiz et." },
         { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
       ];
       // @ts-ignore 
       result = await chatSession.sendMessageStream({ message: parts });
    } else {
       result = await chatSession.sendMessageStream({ message: finalMessage });
    }
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    yield "Bir hata oluştu. Lütfen bağlantınızı kontrol edin.";
  }
};

/* --- LIVE API (VOICE CHAT) --- */

// Helper: Encode raw PCM to Base64 (for sending to API)
function base64EncodeAudio(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  let binary = '';
  const bytes = new Uint8Array(int16Array.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Decode Base64 to AudioBuffer (for playing from API)
async function decodeAudioData(base64: string, ctx: AudioContext): Promise<AudioBuffer> {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000); // Model output is 24kHz
  const channelData = buffer.getChannelData(0);
  
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export class LiveVoiceManager {
  private ai: GoogleGenAI;
  private inputContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private nextStartTime = 0;
  private isActive = false;
  private sessionPromise: Promise<any> | null = null;

  constructor() {
    this.ai = getGenAI();
  }

  async connect(
    onStatusChange: (status: string) => void, 
    onVolume: (vol: number) => void // visualizer
  ) {
    this.isActive = true;
    onStatusChange("Bağlanıyor...");

    try {
      // Setup Audio Contexts
      this.inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Get Mic Stream
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Connect to Gemini Live
      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Deep voice
          },
          systemInstruction: SYSTEM_INSTRUCTION + " Konuşarak kısa ve öz cevaplar ver. Türkçe konuş.",
        },
        callbacks: {
          onopen: () => {
             onStatusChange("Bağlandı");
             this.startAudioInput();
          },
          onmessage: async (msg: LiveServerMessage) => {
             if (!this.isActive) return;
             
             // Handle Audio Output
             const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData && this.outputContext) {
                // Visualizer trigger (simulated for output)
                onVolume(0.8); 
                
                const buffer = await decodeAudioData(audioData, this.outputContext);
                this.playAudioBuffer(buffer);
             }
             
             if (msg.serverContent?.interrupted) {
                this.nextStartTime = 0;
             }
          },
          onclose: () => {
             if (this.isActive) onStatusChange("Bağlantı kesildi");
          },
          onerror: (err) => {
             console.error("Live API Error:", err);
             onStatusChange("Hata oluştu");
          }
        }
      });

    } catch (e) {
      console.error("Connection Failed:", e);
      onStatusChange("Mikrofon hatası");
      this.disconnect();
    }
  }

  private startAudioInput() {
    if (!this.inputContext || !this.stream) return;

    this.source = this.inputContext.createMediaStreamSource(this.stream);
    this.processor = this.inputContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (!this.isActive) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate volume for visualizer
      let sum = 0;
      for (let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
      const rms = Math.sqrt(sum / inputData.length);
      // We can callback volume here if we want detailed input viz
      
      const base64Audio = base64EncodeAudio(inputData);
      
      this.sessionPromise?.then(session => {
         session.sendRealtimeInput({
            media: {
               mimeType: 'audio/pcm;rate=16000',
               data: base64Audio
            }
         });
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.inputContext.destination);
  }

  private playAudioBuffer(buffer: AudioBuffer) {
    if (!this.outputContext) return;
    
    const source = this.outputContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputContext.destination);
    
    const currentTime = this.outputContext.currentTime;
    // Ensure smooth playback sequence
    if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
    }
    
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
  }

  disconnect() {
    this.isActive = false;
    
    if (this.source) { this.source.disconnect(); this.source = null; }
    if (this.processor) { this.processor.disconnect(); this.processor = null; }
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    if (this.inputContext) { this.inputContext.close(); this.inputContext = null; }
    if (this.outputContext) { this.outputContext.close(); this.outputContext = null; }
    
    // Close session if method exists (it might not be exposed on the promise type directly, but usually session object has close)
    // this.sessionPromise?.then(s => s.close && s.close());
  }
}