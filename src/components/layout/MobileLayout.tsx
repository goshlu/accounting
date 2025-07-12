import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="relative">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
