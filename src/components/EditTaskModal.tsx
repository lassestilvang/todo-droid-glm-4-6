'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { Task, Priority, Subtask } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { X, Calendar, Clock, Tag, Flag, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { updateTask, deleteTask, labels, lists } = useTask();
  
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    date: task?.date ? format(task.date, 'yyyy-MM-dd') : '',
    deadline: task?.deadline ? format(task.deadline, "yyyy-MM-dd'T'HH:mm") : '',
    estimate: task?.estimate || '',
    actualTime: task?.actualTime || '',
    priority: task?.priority || 'none' as Priority,
    listId: task?.listId || 'inbox',
  });

  const [subtasks, setSubtasks] = useState<Subtask[]>(
    task?.subtasks || []
  );

  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    task?.labels?.map(l => l.id) || []
  );

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  React.useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || '',
        date: task.date ? format(task.date, 'yyyy-MM-dd') : '',
        deadline: task.deadline ? format(task.deadline, "yyyy-MM-dd'T'HH:mm") : '',
        estimate: task.estimate || '',
        actualTime: task.actualTime || '',
        priority: task.priority,
        listId: task.listId,
      });
      setSubtasks(task.subtasks || []);
      setSelectedLabels(task.labels?.map(l => l.id) || []);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task || !formData.name.trim()) return;

    const updatedTask: Partial<Task> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      date: formData.date ? new Date(formData.date) : undefined,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      estimate: formData.estimate || undefined,
      actualTime: formData.actualTime || undefined,
      priority: formData.priority as Priority,
      listId: formData.listId,
      subtasks,
      labels: labels.filter(l => selectedLabels.includes(l.id)),
    };

    updateTask(task.id, updatedTask);
    onClose();
  };

  const handleDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    onClose();
  };

  const addSubtask = () => {
    if (!newSubtaskTitle.trim() || !task) return;
    
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtaskTitle.trim(),
      isCompleted: false,
      taskId: task.id,
    };
    
    setSubtasks(prev => [...prev, newSubtask]);
    setNewSubtaskTitle('');
  };

  const updateSubtask = (subtaskId: string, updates: Partial<Subtask>) => {
    setSubtasks(prev => prev.map(st => 
      st.id === subtaskId ? { ...st, ...updates } : st
    ));
  };

  const deleteSubtask = (subtaskId: string) => {
    setSubtasks(prev => prev.filter(st => st.id !== subtaskId));
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Edit Task</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription>
          Make changes to your task here. Click save when you're done.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Task Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter task name..."
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Deadline
              </label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          {/* Time Tracking */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time Estimate */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Time Estimate
              </label>
              <Input
                placeholder="1:30"
                value={formData.estimate}
                onChange={(e) => setFormData(prev => ({ ...prev, estimate: e.target.value }))}
              />
            </div>

            {/* Actual Time */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Actual Time
              </label>
              <Input
                placeholder="0:45"
                value={formData.actualTime}
                onChange={(e) => setFormData(prev => ({ ...prev, actualTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Priority and List */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* List */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                List
              </label>
              <select
                value={formData.listId}
                onChange={(e) => setFormData(prev => ({ ...prev, listId: e.target.value }))}
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.icon} {list.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Labels
            </label>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border-2 transition-colors ${
                    selectedLabels.includes(label.id)
                      ? 'border-primary'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  style={{ 
                    backgroundColor: selectedLabels.includes(label.id) ? label.color + '20' : 'transparent',
                    color: selectedLabels.includes(label.id) ? label.color : 'text-muted-foreground'
                  }}
                >
                  <span>{label.icon}</span>
                  <span>{label.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subtasks
            </label>
            
            {/* Add new subtask */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubtask();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={addSubtask}
                disabled={!newSubtaskTitle.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Subtask list */}
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Checkbox
                    checked={subtask.isCompleted}
                    onChange={(checked) => 
                      updateSubtask(subtask.id, { isCompleted: checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className={`flex-1 text-sm ${
                    subtask.isCompleted 
                      ? 'text-muted-foreground line-through' 
                      : 'text-foreground'
                  }`}>
                    {subtask.title}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSubtask(subtask.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                Last updated: {format(task.updatedAt, 'MMM d, yyyy h:mm a')}
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
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add missing Checkbox component for subtasks
const Checkbox = ({ 
  onChange, 
  className = "",
  checked = false
}: { 
  onChange: (checked: boolean) => void; 
  className?: string;
  checked?: boolean; 
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className={`w-4 h-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
  />
);
