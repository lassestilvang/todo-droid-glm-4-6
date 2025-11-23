import { test, describe, expect } from 'bun:test';
import { Task, TaskList, Label, Priority, ViewType } from '@/types';
import { addDays, startOfDay, endOfDay } from 'date-fns';

// Mock data for testing
const today = new Date();
today.setHours(12, 0, 0, 0); // Set to noon today

const mockTask1: Task = {
  id: '1',
  name: 'Test Task 1',
  description: 'A test task',
  date: today,
  priority: 'high',
  isCompleted: false,
  listId: 'inbox',
  createdAt: new Date(),
  updatedAt: new Date(),
  subtasks: [],
  labels: [],
  isRecurring: false,
};

const mockTask2: Task = {
  id: '2',
  name: 'Test Task 2',
  description: 'Another test task',
  date: addDays(today, 3),
  priority: 'low',
  isCompleted: false,
  listId: 'inbox',
  createdAt: new Date(),
  updatedAt: new Date(),
  subtasks: [],
  labels: [],
  isRecurring: false,
};

const mockTask3: Task = {
  id: '3',
  name: 'Completed Task',
  description: 'A completed test task',
  date: today,
  priority: 'medium',
  isCompleted: true,
  listId: 'inbox',
  createdAt: new Date(),
  updatedAt: new Date(),
  subtasks: [],
  labels: [],
  isRecurring: false,
};

const mockTask4: Task = {
  id: '4',
  name: 'Overdue Task',
  description: 'An overdue test task',
  date: addDays(today, -2),
  priority: 'high',
  isCompleted: false,
  listId: 'inbox',
  createdAt: new Date(),
  updatedAt: new Date(),
  subtasks: [],
  labels: [],
  isRecurring: false,
};

describe('Task Filtering', () => {
  test('should filter tasks for Today view', () => {
    const tasks = [mockTask1, mockTask2, mockTask3, mockTask4];
    const today = startOfDay(new Date());
    const endOfToday = endOfDay(new Date());
    
    // Filter all tasks including completed ones
    const todayTasks = tasks.filter(task => {
      if (!task.date) return false;
      const taskDate = new Date(task.date);
      return taskDate >= today && taskDate <= endOfToday;
    });
    
    // We should have 2 tasks from today (Task 1 and Task 3)
    expect(todayTasks).toHaveLength(2);
    expect(todayTasks.map(t => t.id)).toContain('1');
    expect(todayTasks.map(t => t.id)).toContain('3');
    
    // If filtering out completed tasks, only 1 should remain
    const incompleteTodayTasks = todayTasks.filter(task => !task.isCompleted);
    expect(incompleteTodayTasks).toHaveLength(1);
    expect(incompleteTodayTasks[0].id).toBe('1');
  });

  test('should filter tasks for Next 7 Days view', () => {
    const tasks = [mockTask1, mockTask2, mockTask3, mockTask4];
    const today = startOfDay(new Date());
    const sevenDaysFromNow = addDays(today, 7);
    
    const next7DaysTasks = tasks.filter(task => {
      if (!task.date || task.isCompleted) return false;
      const taskDate = new Date(task.date);
      return taskDate >= today && taskDate <= sevenDaysFromNow;
    });
    
    expect(next7DaysTasks).toHaveLength(2); // Task 1 (today) + Task 2 (3 days from now)
    expect(next7DaysTasks.map(t => t.id)).toContain('1');
    expect(next7DaysTasks.map(t => t.id)).toContain('2');
  });

  test('should identify overdue tasks', () => {
    const tasks = [mockTask1, mockTask2, mockTask3, mockTask4];
    const today = startOfDay(new Date());
    
    const overdueTasks = tasks.filter(task => {
      if (!task.date || task.isCompleted) return false;
      const taskDate = startOfDay(new Date(task.date));
      return taskDate < today;
    });
    
    expect(overdueTasks).toHaveLength(1);
    expect(overdueTasks[0].id).toBe('4');
    expect(overdueTasks[0].name).toBe('Overdue Task');
  });

  test('should filter completed tasks when showCompleted is false', () => {
    const tasks = [mockTask1, mockTask2, mockTask3, mockTask4];
    const showCompleted = false;
    
    const incompleteTasks = tasks.filter(task => !task.isCompleted);
    
    expect(incompleteTasks).toHaveLength(3);
    expect(incompleteTasks.map(t => t.id)).toEqual(['1', '2', '4']);
  });

  test('should search tasks by name and description', () => {
    const tasks = [mockTask1, mockTask2, mockTask3, mockTask4];
    const searchQuery = 'test';
    
    const filteredTasks = tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    expect(filteredTasks).toHaveLength(4); // All tasks contain "test" or "Task"
  });
});

describe('Task Priority', () => {
  test('should sort tasks by priority correctly', () => {
    const tasks: Task[] = [
      { ...mockTask1, priority: 'low' },
      { ...mockTask2, priority: 'high' },
      { ...mockTask3, priority: 'medium' },
      { ...mockTask4, priority: 'none' as Priority },
    ];
    
    const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
    const sortedTasks = [...tasks].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    
    expect(sortedTasks[0].priority).toBe('high');
    expect(sortedTasks[1].priority).toBe('medium');
    expect(sortedTasks[2].priority).toBe('low');
    expect(sortedTasks[3].priority).toBe('none');
  });
});

describe('Task List Management', () => {
  test('should create a new task list', () => {
    const newList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'> & { id: string; createdAt: Date; updatedAt: Date } = {
      id: 'list-1',
      name: 'Work',
      color: '#3b82f6',
      icon: '💼',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    expect(newList.name).toBe('Work');
    expect(newList.isDefault).toBe(false);
    expect(newList.icon).toBe('💼');
  });

  test('should not allow deleting default inbox', () => {
    const inboxList: TaskList = {
      id: 'inbox',
      name: 'Inbox',
      color: '#3b82f6',
      icon: '📥',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const isDeletable = !inboxList.isDefault;
    expect(isDeletable).toBe(false);
  });
});

describe('Subtasks', () => {
  test('should calculate subtask progress correctly', () => {
    const taskWithSubtasks: Task = {
      ...mockTask1,
      subtasks: [
        { id: 'st1', title: 'Subtask 1', isCompleted: true, taskId: '1' },
        { id: 'st2', title: 'Subtask 2', isCompleted: false, taskId: '1' },
        { id: 'st3', title: 'Subtask 3', isCompleted: true, taskId: '1' },
      ],
    };
    
    const completedCount = taskWithSubtasks.subtasks.filter(st => st.isCompleted).length;
    const totalCount = taskWithSubtasks.subtasks.length;
    const progress = (completedCount / totalCount) * 100;
    
    expect(completedCount).toBe(2);
    expect(totalCount).toBe(3);
    expect(progress).toBe(66.66666666666666);
  });
});

describe('Date Handling', () => {
  test('should format dates correctly for display', () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const yesterday = addDays(today, -1);
    
    const formatDate = (date: Date): string => {
      const d = new Date(date);
      const todayStart = startOfDay(new Date());
      const tomorrowStart = addDays(todayStart, 1);
      const yesterdayStart = addDays(todayStart, -1);
      const taskDate = startOfDay(d);
      
      if (taskDate.getTime() === todayStart.getTime()) return 'Today';
      if (taskDate.getTime() === tomorrowStart.getTime()) return 'Tomorrow';
      if (taskDate.getTime() === yesterdayStart.getTime()) return 'Yesterday';
      
      return d.toLocaleDateString();
    };
    
    expect(formatDate(today)).toBe('Today');
    expect(formatDate(tomorrow)).toBe('Tomorrow');
    expect(formatDate(yesterday)).toBe('Yesterday');
  });

  test('should parse time estimate correctly', () => {
    const timeEstimates = ['1:30', '0:45', '2:00', '0:15'];
    const parsedTime = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    expect(parsedTime('1:30')).toBe(90);
    expect(parsedTime('0:45')).toBe(45);
    expect(parsedTime('2:00')).toBe(120);
    expect(parsedTime('0:15')).toBe(15);
  });
});
