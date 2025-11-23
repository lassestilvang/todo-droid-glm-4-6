'use client';

import React from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddTaskModal } from '@/components/AddTaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

export function TaskList() {
  const {
    tasks,
    currentView,
    currentListId,
    showCompleted,
    setShowCompleted,
  } = useTask();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddingTask, setIsAddingTask] = React.useState(false);

  // Filter tasks based on current view and list
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // Filter by list if specified
    if (currentListId) {
      filtered = filtered.filter(task => task.listId === currentListId);
    }

    // Filter by view
    if (!currentListId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (currentView) {
        case 'today': {
          filtered = filtered.filter(task => {
            if (!task.date) return false;
            const taskDate = new Date(task.date);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
          });
          break;
        }
        case 'next7days': {
          const sevenDaysFromNow = new Date(today);
          sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
          filtered = filtered.filter(task => {
            if (!task.date) return false;
            const taskDate = new Date(task.date);
            return taskDate >= today && taskDate <= sevenDaysFromNow;
          });
          break;
        }
        case 'upcoming': {
          filtered = filtered.filter(task => {
            if (!task.date) return true; // Include unscheduled tasks
            const taskDate = new Date(task.date);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate >= today;
          });
          break;
        }
        case 'all':
          // Show all tasks
          break;
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Filter completed tasks
    if (!showCompleted) {
      filtered = filtered.filter(task => !task.isCompleted);
    }

    // Sort tasks
    return filtered.sort((a, b) => {
      // First sort by completion status
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }

      // Then sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Finally sort by date
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [tasks, currentView, currentListId, showCompleted, searchQuery]);

  const overdueTasks = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.date || task.isCompleted) return false;
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today;
    }).length;
  }, [tasks]);

  const getViewTitle = () => {
    if (currentListId) {
      return `List: ${currentListId}`;
    }

    switch (currentView) {
      case 'today': return 'Today';
      case 'next7days': return 'Next 7 Days';
      case 'upcoming': return 'Upcoming';
      case 'all': return 'All Tasks';
      default: return 'Tasks';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {getViewTitle()}
              </h2>
              {overdueTasks > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded-full">
                    {overdueTasks} overdue
                  </div>
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                {!showCompleted && ` • ${tasks.filter(t => t.isCompleted).length} completed`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? 'Hide' : 'Show'} Completed
              </Button>
              <Button
                size="sm"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="text-muted-foreground mb-4">
                {searchQuery ? 'No tasks found matching your search.' : 'No tasks yet.'}
              </div>
              {!searchQuery && (
                <Button
                  onClick={() => setIsAddingTask(true)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first task
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task, index) => (
                <TaskItem key={task.id} task={task} index={index} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
      />
    </div>
  );
}
