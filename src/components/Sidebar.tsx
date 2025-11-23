'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/context/TaskContext';
import { Button } from '@/components/ui/button';
import { AddTaskModal } from '@/components/AddTaskModal';
import { AddListModal } from '@/components/AddListModal';
import { ListManager } from '@/components/ListManager';
import { LabelManager } from '@/components/LabelManager';
import { ViewType } from '@/types';
import { motion } from 'framer-motion';
import { 
  Inbox, Calendar, CalendarDays, Clock, ListTodo, 
  Plus, Search, ChevronDown, ChevronRight, Tag, Folder
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Sidebar() {
  const {
    lists,
    labels,
    currentView,
    currentListId,
    setCurrentView,
    setCurrentListId,
    searchTasks,
  } = useTask();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [isManagingLabels, setIsManagingLabels] = useState(false);
  const [isManagingLists, setIsManagingLists] = useState(false);

  const views = [
    { id: 'today', name: 'Today', icon: Calendar },
    { id: 'next7days', name: 'Next 7 Days', icon: CalendarDays },
    { id: 'upcoming', name: 'Upcoming', icon: Clock },
    { id: 'all', name: 'All Tasks', icon: ListTodo },
  ];

  const [showLabels, setShowLabels] = React.useState(true);
  const [showLists, setShowLists] = React.useState(true);

  return (
    <div className="w-64 lg:w-72 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            Daily Planner
          </h1>
          <ThemeToggle />
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            onChange={(e) => searchTasks(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Views */}
        <div className="mb-6">
          <div className="px-4 mb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Views
            </h3>
          </div>
          <nav className="space-y-1">
            {views.map((view) => {
              const Icon = view.icon;
              const isActive = currentView === view.id && !currentListId;
              
              return (
                <motion.button
                  key={view.id}
                  onClick={() => {
                    setCurrentView(view.id as ViewType);
                    setCurrentListId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{view.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Lists */}
        <div className="mb-6">
          <div className="px-4 mb-2">
            <button
              onClick={() => setShowLists(!showLists)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
            >
              {showLists ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Lists
            </button>
          </div>
          {showLists && (
            <nav className="space-y-1">
              {lists.map((list) => {
                const isActive = currentListId === list.id;
                
                return (
                  <motion.button
                    key={list.id}
                    onClick={() => {
                      setCurrentListId(list.id);
                      setCurrentView('all'); // Reset to all view when selecting a list
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <span className="text-lg">{list.icon}</span>
                    <span>{list.name}</span>
                    {!list.isDefault && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: list.color }}
                      />
                    )}
                  </motion.button>
                );
              })}
              <div className="px-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => setIsAddingList(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New List
                </Button>
                {lists.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={() => setIsManagingLists(true)}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    Manage Lists
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>

        {/* Labels */}
        {labels.length > 0 && (
          <div className="mb-6">
            <div className="px-4 mb-2">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
              >
                {showLabels ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                Labels
              </button>
            </div>
            {showLabels && (
              <nav className="space-y-1">
                {labels.map((label) => (
                  <motion.div
                    key={label.id}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    whileHover={{ x: 2 }}
                  >
                    <span className="text-sm">{label.icon}</span>
                    <span>{label.name}</span>
                    <div 
                      className="w-2 h-2 rounded-full ml-auto"
                      style={{ backgroundColor: label.color }}
                    />
                  </motion.div>
                ))}
                <div className="px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={() => setIsManagingLabels(true)}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Manage Labels
                  </Button>
                </div>
              </nav>
            )}
          </div>
        )}

        {/* Labels section for when no labels exist */}
        {labels.length === 0 && (
          <div className="mb-6">
            <div className="px-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setIsManagingLabels(true)}
              >
                <Tag className="w-4 h-4 mr-2" />
                Create Labels
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsAddingTask(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isAddingTask}
          onClose={() => setIsAddingTask(false)}
        />

        {/* Add List Modal */}
        <AddListModal
          isOpen={isAddingList}
          onClose={() => setIsAddingList(false)}
        />

        {/* List Manager Modal */}
        <ListManager
          isOpen={isManagingLists}
          onClose={() => setIsManagingLists(false)}
        />

        {/* Label Manager Modal */}
        <LabelManager
          isOpen={isManagingLabels}
          onClose={() => setIsManagingLabels(false)}
        />
      </div>
    </div>
  );
}
