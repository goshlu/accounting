import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Plus, CreditCard, User } from 'lucide-react';
import { useAppStore } from '../../store';

const navItems = [
  { key: 'home', icon: Home, label: '首页', path: '/home' }, // 修改这里
  { key: 'analytics', icon: BarChart3, label: '分析', path: '/analytics' },
  { key: 'add', icon: Plus, label: '记账', path: '/add-record' },
  { key: 'assets', icon: CreditCard, label: '账户', path: '/assets' },
  { key: 'profile', icon: User, label: '我的', path: '/profile' }
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveTab } = useAppStore();

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveTab(item.key);
    navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isAddButton = item.key === 'add';
          
          if (isAddButton) {
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                className="flex flex-col items-center justify-center w-12 h-12 bg-orange-500 rounded-full text-white shadow-lg"
              >
                <Icon size={24} />
              </button>
            );
          }
          
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}