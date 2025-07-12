import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../../store';

interface FilterModalProps {
  selectedCategory: string;
  selectedAccount: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  onCategoryChange: (categoryId: string) => void;
  onAccountChange: (accountId: string) => void;
  onDateRangeChange: (range: 'all' | 'today' | 'week' | 'month' | 'year') => void;
  onClose: () => void;
}

export function FilterModal({
  selectedCategory,
  selectedAccount,
  dateRange,
  onCategoryChange,
  onAccountChange,
  onDateRangeChange,
  onClose
}: FilterModalProps) {
  const { categories, accounts } = useAppStore();

  const dateOptions = [
    { value: 'all' as const, label: '全部时间' },
    { value: 'today' as const, label: '今天' },
    { value: 'week' as const, label: '最近一周' },
    { value: 'month' as const, label: '本月' },
    { value: 'year' as const, label: '本年' }
  ];

  const handleReset = () => {
    onCategoryChange('all');
    onAccountChange('all');
    onDateRangeChange('all');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">筛选条件</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 分类筛选 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">分类</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onCategoryChange('all')}
                className={`p-3 rounded-xl border-2 transition-colors ${
                  selectedCategory === 'all'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">📋</div>
                  <p className="text-sm font-medium text-gray-800">全部</p>
                </div>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    selectedCategory === category.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <p className="text-sm font-medium text-gray-800">{category.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 账户筛选 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">账户</h3>
            <div className="space-y-2">
              <button
                onClick={() => onAccountChange('all')}
                className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                  selectedAccount === 'all'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-800">全部账户</p>
              </button>
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => onAccountChange(account.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                    selectedAccount === account.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{account.icon}</div>
                    <div>
                      <p className="font-medium text-gray-800">{account.name}</p>
                      <p className="text-sm text-gray-500">{account.type}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 时间范围 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">时间范围</h3>
            <div className="space-y-2">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onDateRangeChange(option.value)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                    dateRange === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-800">{option.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              重置
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}