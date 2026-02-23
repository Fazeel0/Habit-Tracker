// ============================================
// Islamic Habit Tracker - TypeScript Types
// ============================================

// Habit Categories (Islamic-themed)
export type HabitCategory = 
  | 'prayer'       // Salah (5 daily prayers)
  | 'quran'        // Quran reading
  | 'fasting'      // Ramadan/specific days
  | 'charity'      // Zakat/Sadaqah
  | 'dhikr'        // Remembrances (Morning/Evening)
  | 'worship'      // Worship & Spirituality
  | 'health'       // Health & Fitness
  | 'work'         // Work & Career
  | 'personal'     // Personal Development
  | 'social'       // Social & Relationships
  | 'hobbies'      // Hobbies & Interests
  | 'finance'      // Finance
  | 'other';       // Other habits

// User types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

// Habit types
export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetCount: number; // e.g., 5 for 5 prayers
  color?: string; // Custom color for the habit
  icon?: string; // Icon name
  isActive: boolean;
  isDefault?: boolean; // Mark if this is a default habit
  createdAt: Date;
  updatedAt: Date;
}

// Habit Completion Record
export interface Completion {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  count?: number; // How many times completed (e.g., 3/5 prayers)
  notes?: string;
  syncedAt?: Date; // When synced to Firebase
  localUpdatedAt: Date; // Last updated locally (for offline sync)
}

// Sync Queue Item (for offline-first)
export interface SyncQueueItem {
  id: string;
  type: 'completion' | 'habit' | 'user';
  action: 'create' | 'update' | 'delete';
  data: any;
  createdAt: Date;
  retryCount: number;
}

// Statistics types
export interface HabitStats {
  habitId: string;
  habitName: string;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // Percentage
  lastCompletedDate?: string;
}

export interface UserStats {
  totalHabits: number;
  activeHabits: number;
  totalCompletionsToday: number;
  overallCompletionRate: number;
  currentGlobalStreak: number;
  longestGlobalStreak: number;
}

// App State types
export interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt?: Date;
  pendingSyncCount: number;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  DailyTracker: undefined;
  Analytics: undefined;
  Goals: undefined;
  Profile: undefined;
};

// Form types
export interface HabitFormData {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetCount: number;
  color?: string;
  icon?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Category icons mapping (for UI display)
export const CATEGORY_ICONS: Record<HabitCategory, string> = {
  prayer: '🕌',
  quran: '📖',
  fasting: '🌙',
  charity: '💝',
  dhikr: '✨',
  worship: '🕌',
  health: '🏃',
  work: '💼',
  personal: '🎓',
  social: '👥',
  hobbies: '🎨',
  finance: '💰',
  other: '📝',
};

// Category colors mapping
export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  prayer: '#667eea',    // Purple-blue
  quran: '#764ba2',     // Purple
  fasting: '#f093fb',  // Pink
  charity: '#4facfe',  // Blue
  dhikr: '#ffd200',    // Gold/Yellow
  worship: '#667eea',
  health: '#10B981',
  work: '#3B82F6',
  personal: '#8B5CF6',
  social: '#EC4899',
  hobbies: '#F59E0B',
  finance: '#EF4444',
  other: '#6B7280',    // Default
};
