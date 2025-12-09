


import { User, UserRole, SystemConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_USERS = 'rectus_users';
const STORAGE_KEY_CURRENT_USER = 'rectus_current_user';
const STORAGE_KEY_INVITE_CODE = 'rectus_invite_code';
const STORAGE_KEY_CONFIG = 'rectus_system_config';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Default System Config
const DEFAULT_CONFIG: SystemConfig = {
  allowMinecraftBots: false,
  systemName: 'Rectus AI',
  weeklySiteLimit: 5,
  maintenanceMode: false
};

export const getSystemConfig = (): SystemConfig => {
  const cfg = localStorage.getItem(STORAGE_KEY_CONFIG);
  return cfg ? JSON.parse(cfg) : DEFAULT_CONFIG;
};

export const updateSystemConfig = (newConfig: Partial<SystemConfig>) => {
  const current = getSystemConfig();
  const updated = { ...current, ...newConfig };
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
  return updated;
};

// Initialize Creator (God Mode) if not exists
const initializeCreator = () => {
  const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
  let users: any[] = usersStr ? JSON.parse(usersStr) : [];
  
  // Find Enes
  const enesIndex = users.findIndex(u => u.email === 'eneskorkutkaan@gmail.com');
  
  const creatorUser = {
    id: 'creator-001',
    name: 'Enes (Creator)',
    email: 'eneskorkutkaan@gmail.com',
    password: 'enes13579',
    role: 'creator' as UserRole, // FORCE CREATOR ROLE
    siteUsage: { count: 0, weekStart: Date.now() }
  };

  if (enesIndex === -1) {
    users.push(creatorUser);
  } else {
    // Ensure Enes is always Creator even if previously saved as Admin
    users[enesIndex] = { ...users[enesIndex], ...creatorUser };
  }
  
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

// --- Invite Code Management ---

const generateRandomCode = () => {
  return 'MOD-' + Math.random().toString(36).substring(2, 7).toUpperCase();
};

export const getInviteCode = (): string => {
  let code = localStorage.getItem(STORAGE_KEY_INVITE_CODE);
  if (!code) {
    code = generateRandomCode();
    localStorage.setItem(STORAGE_KEY_INVITE_CODE, code);
  }
  return code;
};

export const setInviteCode = (code: string) => {
  localStorage.setItem(STORAGE_KEY_INVITE_CODE, code);
};

export const rotateInviteCode = () => {
  const newCode = generateRandomCode();
  localStorage.setItem(STORAGE_KEY_INVITE_CODE, newCode);
  return newCode;
};

// --- Site Limit Management ---

export const checkSiteLimit = (userId: string): { allowed: boolean; remaining: number; resetDate?: string } => {
  const config = getSystemConfig();
  const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
  const users: User[] = usersStr ? JSON.parse(usersStr) : [];
  const user = users.find(u => u.id === userId);

  // Admins and Creators have no limit
  if (!user || user.role === 'admin' || user.role === 'creator') return { allowed: true, remaining: 999 };

  const now = Date.now();
  let usage = user.siteUsage || { count: 0, weekStart: now };

  // Reset if week passed
  if (now - usage.weekStart > WEEK_MS) {
    usage = { count: 0, weekStart: now };
  }

  const limit = config.weeklySiteLimit;
  const remaining = Math.max(0, limit - usage.count);
  return { allowed: remaining > 0, remaining };
};

export const incrementSiteUsage = (userId: string): User | null => {
  const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
  let users: User[] = usersStr ? JSON.parse(usersStr) : [];
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) return null;

  const user = users[userIndex];
  
  // Skip for admin/creator
  if (user.role === 'admin' || user.role === 'creator') return user;

  const now = Date.now();
  let usage = user.siteUsage || { count: 0, weekStart: now };

  if (now - usage.weekStart > WEEK_MS) {
    usage = { count: 0, weekStart: now };
  }

  usage.count += 1;
  user.siteUsage = usage;
  
  users[userIndex] = user;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  
  const currentUserStr = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
  if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === userId) {
          localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      }
  }

  return user;
};

// --- Role Management (Creator Only) ---
export const makeUserAdmin = (email: string): boolean => {
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    let users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
        users[index].role = 'admin';
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        return true;
    }
    return false;
};

// --- Auth Functions ---

export const login = (email: string, password: string): { success: boolean; user?: User; error?: string } => {
  initializeCreator(); // Ensure creator exists check
  const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const foundUser = users.find((u: any) => u.email === email && u.password === password);
  
  if (foundUser) {
    const { password, ...safeUser } = foundUser;
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }
  
  return { success: false, error: 'E-posta veya şifre hatalı.' };
};

export const register = (name: string, email: string, password: string, inviteCode?: string): { success: boolean; user?: User; error?: string } => {
  initializeCreator();
  const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  if (users.find((u: any) => u.email === email)) {
    return { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' };
  }
  
  let role: UserRole = 'user';
  let isModRegistration = false;
  
  if (inviteCode) {
    const currentCode = getInviteCode();
    if (inviteCode.trim().toUpperCase() === currentCode.toUpperCase()) {
      role = 'moderator';
      isModRegistration = true;
    } else {
       return { success: false, error: 'Geçersiz davet kodu.' };
    }
  }
  
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    role,
    siteUsage: { count: 0, weekStart: Date.now() }
  };
  
  const userToStore = { ...newUser, password };
  
  users.push(userToStore);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  
  if (isModRegistration) {
    rotateInviteCode();
  }
  
  localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(newUser));
  
  return { success: true, user: newUser };
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};