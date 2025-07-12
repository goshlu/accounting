import React from 'react';

interface WelcomeMessageProps {
  userName?: string;
  hasTransactions: boolean;
  monthlyBalance: number;
}

export function WelcomeMessage({ userName, hasTransactions, monthlyBalance }: WelcomeMessageProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const getMessage = () => {
    if (!hasTransactions) {
      return '开始记录您的第一笔交易吧！';
    }

    if (monthlyBalance > 0) {
      return '本月收支平衡，继续保持！';
    } else if (monthlyBalance < 0) {
      return '注意控制支出，合理规划预算';
    } else {
      return '收支平衡，理财有道！';
    }
  };

  const getEmoji = () => {
    if (!hasTransactions) return '🎉';
    if (monthlyBalance > 0) return '💰';
    if (monthlyBalance < 0) return '💡';
    return '✅';
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-4 border border-green-100">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{getEmoji()}</div>
        <div>
          <div className="text-sm text-gray-600">
            {getGreeting()}{userName ? `，${userName}` : ''}
          </div>
          <div className="text-sm font-medium text-gray-800">
            {getMessage()}
          </div>
        </div>
      </div>
    </div>
  );
} 