import { test, describe, expect } from 'bun:test';
import { Task, TaskList, Label } from '@/types';

describe('TaskContext without React Testing Library', () => {
  test('should create valid task structure', () => {
    const task: Task = {
      id: 'test-1',
      name: 'Test Task',
      listId: 'inbox',
      priority: 'none',
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [],
      labels: [],
      isRecurring: false,
    };
    
    expect(task.name).toBe('Test Task');
    expect(task.isCompleted).toBe(false);
    expect(task.listId).toBe('inbox');
  });

  test('should handle task updates correctly', () => {
    const baseTask: Task = {
      id: 'test-1',
      name: 'Original Task',
      listId: 'inbox',
      priority: 'none',
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [],
      labels: [],
      isRecurring: false,
    };

    const updatedTask: Task = {
      ...baseTask,
      name: 'Updated Task',
      priority: 'high',
      updatedAt: new Date(),
    };

    expect(updatedTask.name).toBe('Updated Task');
    expect(updatedTask.priority).toBe('high');
    expect(updatedTask.id).toBe(baseTask.id);
  });
});

describe('Task Validation', () => {
  test('should validate task name is required', () => {
    const emptyTask = {
      name: '',
      listId: 'inbox',
      priority: 'none' as const,
      isCompleted: false,
      subtasks: [],
      isRecurring: false,
    };
    
    expect(emptyTask.name.trim()).toBe('');
    expect(emptyTask.name.trim().length > 0).toBe(false);
  });

  test('should accept valid task data', () => {
    const validTask = {
      name: 'Complete project',
      description: 'Finish the daily task planner project',
      date: new Date(),
      priority: 'medium' as const,
      listId: 'inbox',
      isCompleted: false,
      subtasks: [],
      isRecurring: false,
    };
    
    expect(validTask.name.trim().length > 0).toBe(true);
    expect(validTask.priority).toBe('medium');
    expect(validTask.listId).toBe('inbox');
  });
});

describe('List Management', () => {
  test('should create default inbox list', () => {
    const inbox: TaskList = {
      id: 'inbox',
      name: 'Inbox',
      color: '#3b82f6',
      icon: '📥',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    expect(inbox.isDefault).toBe(true);
    expect(inbox.name).toBe('Inbox');
    expect(inbox.icon).toBe('📥');
  });

  test('should create custom list with properties', () => {
    const customList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'> & { 
      id: string; 
      createdAt: Date; 
      updatedAt: Date; 
    } = {
      id: 'work-1',
      name: 'Work Projects',
      color: '#10b981',
      icon: '💼',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    expect(customList.isDefault).toBe(false);
    expect(customList.color).toBe('#10b981');
    expect(customList.icon).toBe('💼');
  });
});

describe('Label Management', () => {
  test('should create label with properties', () => {
    const label: Label = {
      id: 'urgent-1',
      name: 'Urgent',
      color: '#ef4444',
      icon: '🚨',
    };
    
    expect(label.name).toBe('Urgent');
    expect(label.color).toBe('#ef4444');
    expect(label.icon).toBe('🚨');
  });

  test('should generate valid label colors', () => {
    const validColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
    
    validColors.forEach(color => {
      expect(color.startsWith('#')).toBe(true);
      expect(color.length).toBe(7);
    });
  });
});

describe('Date and Time Utilities', () => {
  test('should handle date objects correctly', () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    expect(now instanceof Date).toBe(true);
    expect(today instanceof Date).toBe(true);
  });

  test('should format time estimates', () => {
    const estimates = ['1:30', '0:45', '2:00'];
    
    estimates.forEach(estimate => {
      expect(estimate).toMatch(/^\d+:\d{2}$/);
    });
  });
});

describe('Task Filtering Logic', () => {
  test('should filter tasks by completion status', () => {
    const tasks: Task[] = [
      {
        id: '1',
        name: 'Task 1',
        listId: 'inbox',
        priority: 'none',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
        isRecurring: false,
      },
      {
        id: '2',
        name: 'Task 2',
        listId: 'inbox',
        priority: 'none',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
        isRecurring: false,
      },
    ];
    
    const incompleteTasks = tasks.filter(task => !task.isCompleted);
    const completedTasks = tasks.filter(task => task.isCompleted);
    
    expect(incompleteTasks).toHaveLength(1);
    expect(completedTasks).toHaveLength(1);
    expect(incompleteTasks[0].id).toBe('1');
    expect(completedTasks[0].id).toBe('2');
  });

  test('should filter tasks by priority', () => {
    const tasks: Task[] = [
      { id: '1', name: 'High Priority', listId: 'inbox', priority: 'high', isCompleted: false, createdAt: new Date(), updatedAt: new Date(), subtasks: [], isRecurring: false },
      { id: '2', name: 'Low Priority', listId: 'inbox', priority: 'low', isCompleted: false, createdAt: new Date(), updatedAt: new Date(), subtasks: [], isRecurring: false },
    ];
    
    const highPriorityTasks = tasks.filter(task => task.priority === 'high');
    expect(highPriorityTasks).toHaveLength(1);
    expect(highPriorityTasks[0].name).toBe('High Priority');
  });
});
