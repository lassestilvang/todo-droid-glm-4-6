'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EditTaskModal } from '@/components/EditTaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Calendar, MoreVertical,
  ChevronDown, ChevronRight, Edit2, Trash2, Copy,
  Play, Square, Circle
} from 'lucide-react';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  index: number;
}

export function TaskItem({ task, index }: TaskItemProps) {
  const { updateTask, deleteTask } = useTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = {
    high: 'text-red-500 bg-red-50 dark:bg-red-950 dark:text-red-400',
    medium: 'text-amber-500 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
    low: 'text-green-500 bg-green-50 dark:bg-green-950 dark:text-green-400',
    none: 'text-muted-foreground bg-muted'
  };

  const priorityIcons = {
    high: Circle,
    medium: Square,
    low: Play,
    none: undefined
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { isCompleted: !task.isCompleted });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowActions(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(d);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (taskDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }

    if (taskDate < today) {
      return format(d, 'MMM d') + ' (Overdue)';
    }

    return format(d, 'MMM d');
  };

  const isOverdue = () => {
    if (!task.date || task.isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const completedSubtasks = task.subtasks?.filter(st => st.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.05 }}
        className={`group border rounded-lg transition-all duration-200 hover:shadow-sm ${
          task.isCompleted 
            ? 'bg-surface/50 opacity-60' 
            : 'bg-surface hover:bg-surfaceHover'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div
              onClick={handleToggleComplete}
              className={`mt-0.5 flex-shrink-0 transition-colors cursor-pointer ${
                task.isCompleted 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:textPrimary'
              }`}
            >
              <Checkbox 
                checked={task.isCompleted}
                className="w-4 h-4"
              />
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${
                    task.isCompleted 
                      ? 'text-muted-foreground line-through' 
                      : 'textPrimary'
                  }`}>
                    {task.name}
                  </h3>
                  
                  {task.description && (
                    <p className={`text-sm mt-1 line-clamp-2 ${
                      task.isCompleted 
                        ? 'text-muted-foreground/60' 
                        : 'text-muted-foreground'
                    }`}>
                      {task.description}
                    </p>
                  )}

                  {/* Task Metadata */}
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-2">
                    {/* Priority */}
                    {task.priority !== 'none' && (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${priorityColors[task.priority]}`}>
                        {priorityIcons[task.priority] && React.createElement(priorityIcons[task.priority], { className: "w-3 h-3" })}
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    )}

                    {/* Date */}
                    {task.date && (
                      <div className={`flex items-center gap-1 text-xs ${
                        isOverdue() ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(task.date)}</span>
                      </div>
                    )}

                    {/* Deadline */}
                    {task.deadline && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Due {format(task.deadline, 'MMM d, h:mm a')}</span>
                      </div>
                    )}

                    {/* Time Estimate */}
                    {task.estimate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimate}</span>
                      </div>
                    )}

                    {/* Labels */}
                    {task.labels && task.labels.length > 0 && (
                      <div className="flex items-center gap-1">
                        {task.labels.slice(0, 3).map((label) => (
                          <span
                            key={label.id}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                            style={{ 
                              backgroundColor: label.color + '20',
                              color: label.color 
                            }}
                          >
                            <span>{label.icon}</span>
                            <span>{label.name}</span>
                          </span>
                        ))}
                        {task.labels.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{task.labels.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Subtasks Progress */}
                    {totalSubtasks > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{completedSubtasks}/{totalSubtasks}</span>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${subtaskProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setShowActions(!showActions)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    
                    <AnimatePresence>
                      {showActions && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 z-10 bg-gray-100 border border-border rounded-lg shadow-lg p-1 min-w-[160px]"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setIsEditing(true);
                              setShowActions(false);
                            }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={handleDelete}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-border"
              >
                {/* Subtasks */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium textPrimary mb-2">Subtasks</h4>
                    <div className="space-y-2">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={subtask.isCompleted}
                            className="w-3 h-3"
                          />
                          <span className={subtask.isCompleted ? 'text-muted-foreground line-through' : 'textPrimary'}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* Created At */}
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    <span className="textPrimary">
                      {format(task.createdAt, 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>

                  {/* Updated At */}
                  {task.updatedAt.getTime() !== task.createdAt.getTime() && (
                    <div>
                      <span className="text-muted-foreground">Updated: </span>
                      <span className="textPrimary">
                        {format(task.updatedAt, 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  )}

                  {/* Recurring Pattern */}
                  {task.isRecurring && task.recurringPattern && (
                    <div>
                      <span className="text-muted-foreground">Repeats: </span>
                      <span className="textPrimary capitalize">
                        {task.recurringPattern.type}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        task={task}
      />
    </>
  );
}
