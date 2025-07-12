import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  description: string;
}

export function QuickActions() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'add-record',
      title: '记一笔',
      icon: '➕',
      color: 'from-green-400 to-green-500',
      route: '/add-record',
      description: '快速记录收支'
    },
    {
      id: 'assets',
      title: '我的资产',
      icon: '💰',
      color: 'from-yellow-400 to-yellow-500',
      route: '/assets',
      description: '管理账户资产'
    },
    {
      id: 'analytics',
      title: '数据分析',
      icon: '📊',
      color: 'from-purple-400 to-purple-500',
      route: '/analytics',
      description: '查看财务报告'
    },
    {
      id: 'bills',
      title: '账单管理',
      icon: '📅',
      color: 'from-blue-400 to-blue-500',
      route: '/bills',
      description: '查看交易记录'
    },
    {
      id: 'budget',
      title: '预算设置',
      icon: '🎯',
      color: 'from-red-400 to-red-500',
      route: '/profile',
      description: '设置预算目标'
    },
    {
      id: 'export',
      title: '数据导出',
      icon: '📤',
      color: 'from-indigo-400 to-indigo-500',
      route: '/profile',
      description: '导出财务数据'
    },
    {
      id: 'backup',
      title: '数据备份',
      icon: '💾',
      color: 'from-teal-400 to-teal-500',
      route: '/profile',
      description: '备份重要数据'
    },
    {
      id: 'settings',
      title: '设置',
      icon: '⚙️',
      color: 'from-gray-400 to-gray-500',
      route: '/profile',
      description: '应用设置'
    }
  ];

  const visibleActions = showMore ? quickActions : quickActions.slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">快速操作</h2>
        <button 
          onClick={() => setShowMore(!showMore)}
          className="text-blue-600 text-sm font-medium hover:text-blue-700"
        >
          {showMore ? '收起' : '更多'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleActions.map((action) => (
          <div
            key={action.id}
            onClick={() => navigate(action.route)}
            className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-white text-center cursor-pointer hover:shadow-lg transition-all transform hover:scale-105`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="font-medium text-sm mb-1">{action.title}</div>
            <div className="text-xs opacity-80">{action.description}</div>
          </div>
        ))}
      </div>

      {/* 快捷提示 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
        <div className="flex items-center mb-2">
          <span className="text-blue-600 text-sm mr-2">💡</span>
          <span className="text-sm font-medium text-gray-700">快捷提示</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• 长按功能卡片可添加到收藏</p>
          <p>• 下拉刷新可更新最新数据</p>
          <p>• 点击右上角可切换账本类型</p>
        </div>
      </div>
    </div>
  );
}