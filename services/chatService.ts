import { ChatSession, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_CHATS = 'rectus_chat_history';

const getStorageKey = (userId: string) => `${STORAGE_KEY_CHATS}_${userId}`;

export const getUserChats = (userId: string): ChatSession[] => {
  try {
    const data = localStorage.getItem(getStorageKey(userId));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load chats", error);
    return [];
  }
};

export const saveUserChats = (userId: string, chats: ChatSession[]) => {
  try {
    // Sort by lastUpdated desc
    const sorted = chats.sort((a, b) => b.lastUpdated - a.lastUpdated);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(sorted));
  } catch (error) {
    console.error("Failed to save chats", error);
  }
};

export const createNewSession = (userId: string, firstMessage?: Message): ChatSession => {
  const newSession: ChatSession = {
    id: uuidv4(),
    title: 'Yeni Sohbet',
    messages: firstMessage ? [firstMessage] : [],
    createdAt: Date.now(),
    lastUpdated: Date.now()
  };
  
  const chats = getUserChats(userId);
  chats.unshift(newSession);
  saveUserChats(userId, chats);
  
  return newSession;
};

export const updateChatSession = (userId: string, sessionId: string, newMessages: Message[]) => {
  const chats = getUserChats(userId);
  const index = chats.findIndex(c => c.id === sessionId);
  
  if (index !== -1) {
    chats[index].messages = newMessages;
    chats[index].lastUpdated = Date.now();
    
    // Auto-update title based on first user message if it's "New Chat"
    if (chats[index].title === 'Yeni Sohbet') {
      const firstUserMsg = newMessages.find(m => m.role === 'user');
      if (firstUserMsg) {
        chats[index].title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
      }
    }
    
    saveUserChats(userId, chats);
  } else {
    // If session doesn't exist (edge case), create it
    const newSession: ChatSession = {
        id: sessionId,
        title: 'Sohbet Geçmişi',
        messages: newMessages,
        createdAt: Date.now(),
        lastUpdated: Date.now()
    };
    chats.unshift(newSession);
    saveUserChats(userId, chats);
  }
};

export const deleteChatSession = (userId: string, sessionId: string) => {
    let chats = getUserChats(userId);
    chats = chats.filter(c => c.id !== sessionId);
    saveUserChats(userId, chats);
    return chats;
};

// --- MODERATOR FUNCTIONS ---

// Fetch ALL chat sessions from ALL users
export const getAllUserChats = (): { userId: string; sessions: ChatSession[] }[] => {
  const allData: { userId: string; sessions: ChatSession[] }[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_CHATS)) {
      const userId = key.replace(`${STORAGE_KEY_CHATS}_`, '');
      try {
        const sessions = JSON.parse(localStorage.getItem(key) || '[]');
        if (sessions.length > 0) {
          allData.push({ userId, sessions });
        }
      } catch (e) {
        console.error("Error parsing chat data for mod", e);
      }
    }
  }
  return allData;
};

// Simulate reporting a message
export const reportMessageToAdmin = (messageId: string, content: string, reason: string) => {
    // In a real app, this would send data to backend.
    // For now, we log to console and could store in a 'reports' key
    const reports = JSON.parse(localStorage.getItem('rectus_reports') || '[]');
    reports.push({
        id: uuidv4(),
        messageId,
        content,
        reason,
        timestamp: Date.now()
    });
    localStorage.setItem('rectus_reports', JSON.stringify(reports));
    console.log("REPORT SUBMITTED", { messageId, content, reason });
};