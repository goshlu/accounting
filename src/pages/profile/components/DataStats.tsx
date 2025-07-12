import React from 'react';
import { Account, Transaction, Category } from '../../../types';

interface DataStatsProps {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
}

export function DataStats({ accounts, transactions, categories }: DataStatsProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });

  const stats = [
    {
      label: '账户数量',
      value: accounts.length,
      icon: '💳',
      color: 'bg-blue-500'
    },
    {
      label: '交易记录',
      value: transactions.length,
      icon: '📊',
      color: 'bg-green-500'
    },
    {
      label: '分类数量',
      value: categories.length,
      icon: '🏷️',
      color: 'bg-purple-500'
    },
    {
      label: '本月交易',
      value: thisMonthTransactions.length,
      icon: '📅',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">数据概览</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">财务概览</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">总收入</span>
            <span className="text-green-600 font-semibold">+¥{totalIncome.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">总支出</span>
            <span className="text-red-600 font-semibold">-¥{totalExpense.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">净资产</span>
              <span className={`font-bold ${
                totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ¥{(totalIncome - totalExpense).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}