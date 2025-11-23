'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { Label } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { X, Tag, Plus, Edit2, Trash2, Type, Palette } from 'lucide-react';

interface LabelManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LabelFormData {
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
  '🏷️', '📌', '🚨', '⭐', '🔥', '💡', '🎯', '📋', '📝', '📊',
  '💼', '🏠', '🚗', '💰', '🎨', '📚', '🏃', '❤️', '🌟', '✅',
];

export function LabelManager({ isOpen, onClose }: LabelManagerProps) {
  const { labels, addLabel, updateLabel, deleteLabel } = useTask();
  
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [formData, setFormData] = useState<LabelFormData>({
    name: '',
    color: '#3b82f6',
    icon: '🏷️',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3b82f6',
      icon: '🏷️',
    });
    setEditingLabel(null);
  };

  const handleCreate = () => {
    if (!formData.name.trim()) return;

    addLabel({
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon,
    });

    resetForm();
  };

  const handleUpdate = () => {
    if (!editingLabel || !formData.name.trim()) return;

    updateLabel(editingLabel.id, {
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon,
    });

    resetForm();
  };

  const handleEdit = (label: Label) => {
    setEditingLabel(label);
    setFormData({
      name: label.name,
      color: label.color,
      icon: label.icon || '🏷️',
    });
  };

  const handleDelete = (labelId: string) => {
    deleteLabel(labelId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLabel) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const startNewLabel = () => {
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Manage Labels
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
          Create and manage labels to organize your tasks.
        </DialogDescription>

        <div className="space-y-6">
          {/* Label Form */}
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <h3 className="text-sm font-medium text-foreground mb-4">
              {editingLabel ? 'Edit Label' : 'Create New Label'}
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
                  placeholder="Enter label name..."
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

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-2">
                {editingLabel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startNewLabel}
                  >
                    Cancel Edit
                  </Button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.name.trim()}
                  >
                    {editingLabel ? 'Update Label' : 'Create Label'}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Existing Labels */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">
                Existing Labels ({labels.length})
              </h3>
              {editingLabel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewLabel}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Label
                </Button>
              )}
            </div>

            {labels.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No labels created yet</p>
                <p className="text-sm">Create your first label using the form above</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {labels.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: label.color + '20', color: label.color }}
                      >
                        {label.icon || '🏷️'}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{label.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: label.color }}
                          />
                          <span className="text-xs text-muted-foreground">{label.color}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(label)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(label.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
