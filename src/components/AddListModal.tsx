'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { TaskList } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette } from 'lucide-react';

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorOptions = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

const iconOptions = [
  '📝', '📋', '📚', '💼', '🏠', '🎯', '⭐', '🔥',
  '✨', '💡', '🎨', '🎬', '🎵', '⚡', '🌟', '💎',
];

export function AddListModal({ isOpen, onClose }: AddListModalProps) {
  const { addList } = useTask();
  
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    icon: '📋',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3b82f6',
      icon: '📋',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const newList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'> & { isDefault: boolean } = {
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon,
      isDefault: false,
    };

    addList(newList);
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Create New List</h2>
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
            {/* List Name */}
            <div>
              <label htmlFor="list-name" className="block text-sm font-medium text-foreground mb-1">
                List Name *
              </label>
              <Input
                id="list-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter list name..."
                className="w-full"
                autoFocus
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`aspect-square flex items-center justify-center rounded-lg border text-lg transition-colors ${
                      formData.icon === icon
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                Color
              </label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? 'scale-110 border-border'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preview
              </label>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <span className="text-lg">{formData.icon}</span>
                <span className="font-medium text-foreground">{formData.name || 'List Name'}</span>
                <div 
                  className="w-2 h-2 rounded-full ml-auto"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Lists help organize your tasks
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
                  Create List
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
