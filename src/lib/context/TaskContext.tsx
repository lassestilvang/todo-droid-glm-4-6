'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskList, Label, ViewType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface TaskContextType {
  tasks: Task[];
  lists: TaskList[];
  labels: Label[];
  currentView: ViewType;
  currentListId: string | null;
  showCompleted: boolean;
  setCurrentView: (view: ViewType) => void;
  setCurrentListId: (listId: string | null) => void;
  setShowCompleted: (show: boolean) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addList: (list: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateList: (listId: string, updates: Partial<TaskList>) => void;
  deleteList: (listId: string) => void;
  addLabel: (label: Omit<Label, 'id'>) => void;
  updateLabel: (labelId: string, updates: Partial<Label>) => void;
  deleteLabel: (labelId: string) => void;
  searchTasks: (query: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // For now, we'll use mock data until we set up the API endpoints
        // In a real app, this would fetch from our Next.js API routes
        const mockLists: TaskList[] = [
          { id: 'inbox', name: 'Inbox', color: '#3b82f6', icon: '📥', isDefault: true, createdAt: new Date(), updatedAt: new Date() }
        ];
        
        const mockLabels: Label[] = [
          { id: 'work', name: 'Work', color: '#3b82f6', icon: '💼' },
          { id: 'personal', name: 'Personal', color: '#10b981', icon: '🏠' },
          { id: 'urgent', name: 'Urgent', color: '#ef4444', icon: '🚨' },
        ];

        setLists(mockLists);
        setLabels(mockLabels);
        setTasks([]); // Start with empty tasks
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadInitialData();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addList = async (listData: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newList: TaskList = {
      ...listData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLists(prev => [...prev, newList]);
  };

  const updateList = async (listId: string, updates: Partial<TaskList>) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, ...updates, updatedAt: new Date() }
        : list
    ));
  };

  const deleteList = async (listId: string) => {
    // Don't allow deleting the default inbox
    if (listId === 'inbox') return;
    
    setLists(prev => prev.filter(list => list.id !== listId));
    // Also delete tasks in this list or move them to inbox
    setTasks(prev => prev.map(task => 
      task.listId === listId 
        ? { ...task, listId: 'inbox', updatedAt: new Date() }
        : task
    ));
  };

  const addLabel = async (labelData: Omit<Label, 'id'>) => {
    const newLabel: Label = {
      ...labelData,
      id: uuidv4(),
    };

    setLabels(prev => [...prev, newLabel]);
  };

  const updateLabel = async (labelId: string, updates: Partial<Label>) => {
    setLabels(prev => prev.map(label => 
      label.id === labelId 
        ? { ...label, ...updates }
        : label
    ));
  };

  const deleteLabel = async (labelId: string) => {
    setLabels(prev => prev.filter(label => label.id !== labelId));
    // Remove label from all tasks
    setTasks(prev => prev.map(task => ({
      ...task,
      labels: task.labels?.filter(label => label.id !== labelId) || []
    })));
  };

  const searchTasks = (query: string): Task[] => {
    if (!query.trim()) return tasks;
    
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.name.toLowerCase().includes(lowercaseQuery) ||
      (task.description && task.description.toLowerCase().includes(lowercaseQuery))
    );
  };

  const value: TaskContextType = {
    tasks,
    lists,
    labels,
    currentView,
    currentListId,
    showCompleted,
    setCurrentView,
    setCurrentListId,
    setShowCompleted,
    addTask,
    updateTask,
    deleteTask,
    addList,
    updateList,
    deleteList,
    addLabel,
    updateLabel,
    deleteLabel,
    searchTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
