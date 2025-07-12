import React, { useMemo } from 'react';
import { Account, Transaction } from '../../../types';

interface SmartRemindersProps {
  accounts: Account[];
  transactions: Transaction[];
  monthlyExpense: number;
  monthlyIncome: number;
}

export function SmartReminders({ 
  accounts, 
  transactions, 
  monthlyExpense, 
  monthlyIncome 
}: SmartRemindersProps) {
  const reminders = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const remindersList = [];

    // 信用卡还款提醒
    const creditCards = accounts.filter(acc => acc.type === 'credit');
    creditCards.forEach(card => {
      if (card.repaymentDate) {
        const repaymentDate = new Date(card.repaymentDate);
        const daysUntilRepayment = Math.ceil((repaymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilRepayment <= 7 && daysUntilRepayment > 0) {
          remindersList.push({
            type: 'credit',
            title: `${card.name}还款提醒`,
            message: `还有${daysUntilRepayment}天到期`,
            priority: daysUntilRepayment <= 3 ? 'high' : 'medium',
            icon: '💳'
          });
        }
      }
    });

    // 预算提醒
    const budget = monthlyIncome * 0.8;
    const budgetUsed = (monthlyExpense / budget) * 100;
    
    if (budgetUsed > 90) {
      remindersList.push({
        type: 'budget',
        title: '预算提醒',
        message: '本月预算即将用完',
        priority: 'high',
        icon: '⚠️'
      });
    } else if (budgetUsed > 80) {
      remindersList.push({
        type: 'budget',
        title: '预算提醒',
        message: '本月预算使用较多',
        priority: 'medium',
        icon: '💰'
      });
    }

    // 大额支出提醒
    const todayTransactions = transactions.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.date).toDateString() === today && t.type === 'expense';
    });
    
    const todayExpense = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
    if (todayExpense > 500) {
      remindersList.push({
        type: 'expense',
        title: '今日支出提醒',
        message: `今日已支出¥${(todayExpense / 100).toLocaleString()}`,
        priority: 'medium',
        icon: '📊'
      });
    }

    // 收入提醒
    const thisMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const currentMonthIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (currentMonthIncome === 0) {
      remindersList.push({
        type: 'income',
        title: '收入提醒',
        message: '本月还未记录收入',
        priority: 'low',
        icon: '💡'
      });
    }

    return remindersList;
  }, [accounts, transactions, monthlyExpense, monthlyIncome]);

  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">智能提醒</h2>
          <div className="text-2xl">✅</div>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-gray-600 text-sm">一切正常，继续保持！</div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">智能提醒</h2>
        <div className="text-sm text-gray-500">
          {reminders.length}个提醒
        </div>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <div 
            key={index}
            className={`p-4 rounded-2xl border ${getPriorityColor(reminder.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="text-2xl mr-3">{reminder.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {reminder.title}
                    </span>
                    <span className="ml-2 text-xs">{getPriorityIcon(reminder.priority)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {reminder.message}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {reminder.priority === 'high' ? '重要' : 
                 reminder.priority === 'medium' ? '一般' : '提醒'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-2xl">
        <div className="text-blue-600 text-xs">
          💡 智能提醒会根据您的财务状况自动生成，帮助您更好地管理财务
        </div>
      </div>
    </div>
  );
} 