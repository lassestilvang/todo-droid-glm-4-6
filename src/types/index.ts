export interface Task {
  id: string;
  name: string;
  description?: string;
  date?: Date;
  deadline?: Date;
  reminders?: Date[];
  estimate?: string; // HH:mm format
  actualTime?: string; // HH:mm format
  labels?: Label[];
  priority: Priority;
  subtasks: Subtask[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  attachments?: string[];
  isCompleted: boolean;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isDefault: boolean; // For the "Inbox" 
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'completed' | 'deleted';
  changes?: Record<string, { old: unknown; new: unknown }>;
  timestamp: Date;
}

export type Priority = 'high' | 'medium' | 'low' | 'none';

export type RecurringPattern = {
  type: 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom';
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: Date;
};

export type ViewType = 'today' | 'next7days' | 'upcoming' | 'all';
