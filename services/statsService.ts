
import { User } from '../types';

const STORAGE_KEY_USERS = 'rectus_users';

export interface SystemStats {
  totalRAM: string;     // e.g., "1024 GB"
  usedRAM: string;      // e.g., "128.5 GB"
  freeRAM: string;      // e.g., "895.5 GB"
  siteConsumption: string; // e.g., "45 GB"
  totalSites: number;
  lastUpgrade: string;
}

export const calculateSystemStats = (): SystemStats => {
  // 1. Get real usage data
  const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
  const users: User[] = usersStr ? JSON.parse(usersStr) : [];

  // 2. Calculate Total Sites Generated across all users
  const totalSites = users.reduce((acc, user) => acc + (user.siteUsage?.count || 0), 0);

  // 3. Define Virtual Hardware Specs
  // Let's assume a powerful AI Server
  const TOTAL_RAM_GB = 4096; // 4 TB RAM
  const BASE_SYSTEM_USAGE_GB = 64.5; // OS + AI Kernel
  const RAM_PER_SITE_GB = 1.2; // Avg RAM per generated site container

  // 4. Calculate Dynamics
  const siteConsumptionVal = totalSites * RAM_PER_SITE_GB;
  const totalUsedVal = BASE_SYSTEM_USAGE_GB + siteConsumptionVal;
  const freeVal = TOTAL_RAM_GB - totalUsedVal;

  // 5. Upgrade Logic (Simulated)
  // Determine an "upgrade" amount based on load
  const upgradeAmount = totalSites > 50 ? "2048 GB (Quantum Module A)" : "512 GB (Standard Expansion)";

  return {
    totalRAM: `${TOTAL_RAM_GB} GB`,
    usedRAM: `${totalUsedVal.toFixed(2)} GB`,
    freeRAM: `${freeVal.toFixed(2)} GB`,
    siteConsumption: `${siteConsumptionVal.toFixed(2)} GB`,
    totalSites: totalSites,
    lastUpgrade: `Son yükseltmede ${upgradeAmount} eklendi. Sistem şu an Stabil.`
  };
};
