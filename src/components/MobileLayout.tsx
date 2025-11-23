'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuToggleProps {
  isMobileMenuOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function MobileLayout({ isMobileMenuOpen, onToggle, children }: MobileMenuToggleProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="bg-card/60 backdrop-blur-sm border border-border"
        >
          {isMobileMenuOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* Main content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {children}
        </div>

        {/* Main content area - shifts on mobile when sidebar is open */}
        <div className="flex-1 lg:ml-0 transition-all duration-300 ease-in-out">
          {/* Mobile spacer when menu is open */}
          <div className={isMobileMenuOpen ? 'block lg:hidden w-64' : 'hidden lg:block'} />
        </div>
      </div>
    </div>
  );
}
