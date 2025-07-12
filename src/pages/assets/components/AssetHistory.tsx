import React from 'react';
import { Transaction } from '../../../types';
import { useAppStore } from '../../../store';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetHistoryProps {
  transactions: Transaction[];
  period: 'week' | 'month' | 'year';
}

export function AssetHistory({ transactions, period }: AssetHistoryProps) {
  const { categories } = useAppStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || '未知分类';
  };

  // 获取指定时间段的交易
  const getFilteredTransactions = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions
      .filter(transaction => new Date(transaction.date) >= startDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // 只显示最近10条
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="bg-white mx-4 rounded-lg shadow-sm mb-4">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">资产变化</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredTransactions.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <p>暂无资产变化记录</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getCategoryName(transaction.categoryId)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  {transaction.note && (
                    <p className="text-xs text-gray-400">{transaction.note}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}