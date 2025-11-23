'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { TaskList } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { X, Folder, Plus, Edit2, Trash2, Type, Palette } from 'lucide-react';

interface ListManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ListFormData {
  name: string;
  color: string;
  icon: string;
}

const predefinedColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#6b7280', '#000000',
];

const predefinedIcons = [
  '📝', '📋', '📚', '💼', '🏠', '🎯', '⭐', '🔥',
  '✨', '💡', '🎨', '🎬', '🎵', '⚡', '🌟', '💎',
  '🏃', '🚗', '💰', '🌱', '📊', '🔧', '🎁', '🌈',
];

export function ListManager({ isOpen, onClose }: ListManagerProps) {
  const { lists, updateList, deleteList } = useTask();
  
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [formData, setFormData] = useState<ListFormData>({
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
    setEditingList(null);
  };

  const handleUpdate = () => {
    if (!editingList || !formData.name.trim()) return;

    updateList(editingList.id, {
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon,
    });

    resetForm();
  };

  const handleEdit = (list: TaskList) => {
    setEditingList(list);
    setFormData({
      name: list.name,
      color: list.color,
      icon: list.icon || '📋',
    });
  };

  const handleDelete = (listId: string) => {
    if (listId === 'inbox') {
      // Can't delete the inbox
      return;
    }
    deleteList(listId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingList) {
      handleUpdate();
    }
  };

  const canEditList = (list: TaskList) => {
    return !list.isDefault && list.id !== 'inbox';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Manage Lists
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <DialogDescription>
          Create and manage lists to organize your tasks.
        </DialogDescription>

        <div className="space-y-6">
          {/* List Form - only for editing existing lists */}
          {editingList && (
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <h3 className="text-sm font-medium text-foreground mb-4">
                Edit List: {editingList.name}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    <Type className="w-4 h-4 inline mr-1" />
                    Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter list name..."
                    autoFocus
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {predefinedIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                          formData.icon === icon
                            ? 'border-primary bg-primary/10'
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
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                          formData.color === color
                            ? 'border-primary ring-2 ring-primary/50'
                            : 'border-border hover:border-muted-foreground'
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

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      disabled={!formData.name.trim()}
                    >
                      Update List
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Existing Lists */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">
                Existing Lists ({lists.length})
              </h3>
            </div>

            {lists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No lists created yet</p>
                <p className="text-sm">Create your first list using the sidebar</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {lists.map((list) => (
                  <div
                    key={list.id}
                    className={`flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/20 transition-colors ${
                      !canEditList(list) ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium"
                        style={{ backgroundColor: list.color + '20', color: list.color }}
                      >
                        {list.icon || '📋'}
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {list.name}
                          {list.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: list.color }}
                          />
                          <span className="text-xs text-muted-foreground">{list.color}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {canEditList(list) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(list)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(list.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {!canEditList(list) && (
                        <span className="text-xs text-muted-foreground italic">
                          Protected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
