import React from 'react';
import { Transaction } from '../../../types';

interface BudgetReminderProps {
  monthlyExpense: number;
  monthlyIncome: number;
  todayExpense: number;
  recentTransactions: Transaction[];
}

export function BudgetReminder({ 
  monthlyExpense, 
  monthlyIncome, 
  todayExpense, 
  recentTransactions 
}: BudgetReminderProps) {
  // 简单的预算计算（假设预算为收入的80%）
  const budget = monthlyIncome * 0.8;
  const budgetUsed = (monthlyExpense / budget) * 100;
  const remainingBudget = budget - monthlyExpense;
  
  // 获取今日支出最多的分类
  const getTopCategory = () => {
    const todayTransactions = recentTransactions.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.date).toDateString() === today && t.type === 'expense';
    });
    
    if (todayTransactions.length === 0) return null;
    
    const categoryCounts = todayTransactions.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategoryId = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return topCategoryId;
  };

  const topCategoryId = getTopCategory();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">预算提醒</h2>
        <div className="text-sm text-gray-500">
          {budgetUsed > 100 ? '已超支' : `${budgetUsed.toFixed(1)}%`}
        </div>
      </div>

      {/* 预算进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>本月预算</span>
          <span>¥{budget.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              budgetUsed > 100 ? 'bg-red-500' : 
              budgetUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>已用 ¥{monthlyExpense.toLocaleString()}</span>
          <span className={remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}>
            {remainingBudget >= 0 ? `剩余 ¥${remainingBudget.toLocaleString()}` : `超支 ¥${Math.abs(remainingBudget).toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* 智能建议 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 text-sm">💡</span>
          </div>
          <h3 className="text-sm font-medium text-gray-800">智能建议</h3>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          {budgetUsed > 100 && (
            <p>⚠️ 本月已超支，建议控制支出节奏</p>
          )}
          {budgetUsed > 80 && budgetUsed <= 100 && (
            <p>⚠️ 预算使用较多，注意控制支出</p>
          )}
          {budgetUsed <= 80 && (
            <p>✅ 预算使用合理，继续保持</p>
          )}
          {todayExpense > 200 && (
            <p>💰 今日支出较多，建议记录详细分类</p>
          )}
          {topCategoryId && (
            <p>📊 今日在{topCategoryId}分类支出最多</p>
          )}
        </div>
      </div>
    </div>
  );
} 