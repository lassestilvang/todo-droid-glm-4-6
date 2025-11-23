'use client';

import { TaskProvider } from '@/lib/context/TaskContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { Sidebar } from '@/components/Sidebar';
import { TaskList } from '@/components/TaskList';

export default function HomePage() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-background">
          <div className="flex h-screen">
            {/* Mobile sidebar - overlay */}
            <div className="lg:hidden">
              <Sidebar />
            </div>
            
            {/* Desktop sidebar - fixed */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            
            <TaskList />
          </div>
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
}
