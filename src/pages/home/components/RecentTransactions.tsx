import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';

export function RecentTransactions() {
  const navigate = useNavigate();
  const { transactions, categories } = useAppStore();
  
  // 获取最近的5条交易记录
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: '其他',
      icon: '💰',
      color: '#gray-500'
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const today = new Date();
    const transactionDate = new Date(dateString);
    const diffTime = today.getTime() - transactionDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    
    return transactionDate.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="mx-4 mb-6">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">最近交易</h3>
          <button
            onClick={() => navigate('/bills')}
            className="flex items-center text-orange-500 text-sm font-medium"
          >
            查看全部
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无交易记录</p>
            <button
              onClick={() => navigate('/add-record')}
              className="mt-2 text-orange-500 text-sm font-medium"
            >
              添加第一笔记录
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = getCategoryInfo(transaction.categoryId);
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.description || formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}