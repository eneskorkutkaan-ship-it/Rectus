

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  image?: string; // Base64 string for generated images or uploaded images
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastUpdated: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  STREAMING = 'STREAMING',
  ERROR = 'ERROR'
}

export interface ChatState {
  messages: Message[];
  status: LoadingState;
  error?: string;
}

// Added 'creator' role
export type UserRole = 'user' | 'moderator' | 'admin' | 'creator';

export interface SiteUsage {
  count: number;
  weekStart: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  siteUsage?: SiteUsage; // Track weekly site generation
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// System Configuration for Creator Dashboard
export interface SystemConfig {
  allowMinecraftBots: boolean; // Global override
  systemName: string;
  weeklySiteLimit: number;
  maintenanceMode: boolean;
}