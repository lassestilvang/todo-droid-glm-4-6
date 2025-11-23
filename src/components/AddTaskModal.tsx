'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { Task, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, List, Flag } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addTask, lists } = useTask();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    deadline: '',
    estimate: '',
    priority: 'none' as Priority,
    listId: 'inbox' as string,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      deadline: '',
      estimate: '',
      priority: 'none',
      listId: 'inbox',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      date: formData.date ? new Date(formData.date) : undefined,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      estimate: formData.estimate || undefined,
      actualTime: undefined,
      priority: formData.priority,
      listId: formData.listId,
      isCompleted: false,
      subtasks: [],
      labels: [],
      isRecurring: false,
      attachments: undefined,
    };

    addTask(newTask);
    resetForm();
    onClose();
  };

  const priorityOptions = [
    { value: 'none', label: 'None', color: 'text-muted-foreground' },
    { value: 'low', label: 'Low', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', color: 'text-amber-500' },
    { value: 'high', label: 'High', color: 'text-red-500' },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Add New Task</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Task Name */}
            <div>
              <label htmlFor="task-name" className="block text-sm font-medium text-foreground mb-1">
                Task Name *
              </label>
              <Input
                id="task-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter task name..."
                className="w-full"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <Textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description..."
                rows={3}
                className="w-full resize-none"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label htmlFor="task-date" className="block text-sm font-medium text-foreground mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <Input
                  id="task-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="task-deadline" className="block text-sm font-medium text-foreground mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Deadline
                </label>
                <Input
                  id="task-deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Time Estimate */}
              <div>
                <label htmlFor="task-estimate" className="block text-sm font-medium text-foreground mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time Estimate
                </label>
                <Input
                  id="task-estimate"
                  placeholder="1:30"
                  value={formData.estimate}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimate: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="task-priority" className="block text-sm font-medium text-foreground mb-1">
                  <Flag className="w-4 h-4 inline mr-1" />
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List Selection */}
            <div>
              <label htmlFor="task-list" className="block text-sm font-medium text-foreground mb-1">
                <List className="w-4 h-4 inline mr-1" />
                List
              </label>
              <select
                id="task-list"
                value={formData.listId}
                onChange={(e) => setFormData(prev => ({ ...prev, listId: e.target.value }))}
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {lists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.icon} {list.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {/* Character count or other info */}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.name.trim()}
                >
                  Add Task
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
