import React, { useMemo } from 'react';
import { Account } from '../../../types';

interface AssetOverviewProps {
  accounts: Account[];
}

export function AssetOverview({ accounts }: AssetOverviewProps) {
  const {
    totalBalance,
    creditCards,
    savingsAccounts,
    totalCreditLimit,
    totalCreditUsed,
    creditUtilization
  } = useMemo(() => {
    const savings = accounts.filter(acc => acc.type === 'savings' || acc.type === 'checking');
    const credit = accounts.filter(acc => acc.type === 'credit');
    
    const totalBalance = savings.reduce((sum, acc) => sum + acc.balance, 0);
    const totalCreditLimit = credit.reduce((sum, acc) => sum + (acc.creditLimit || 0), 0);
    const totalCreditUsed = credit.reduce((sum, acc) => sum + acc.balance, 0);
    const creditUtilization = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0;
    
    return {
      totalBalance,
      creditCards: credit,
      savingsAccounts: savings,
      totalCreditLimit,
      totalCreditUsed,
      creditUtilization
    };
  }, [accounts]);

  const getCreditStatus = () => {
    if (creditUtilization >= 80) return { text: '高风险', color: 'text-red-500', bg: 'bg-red-100' };
    if (creditUtilization >= 60) return { text: '中等风险', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { text: '良好', color: 'text-green-500', bg: 'bg-green-100' };
  };

  const creditStatus = getCreditStatus();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">资产概览</h2>
        <div className="text-sm text-gray-500">
          {savingsAccounts.length}个账户
        </div>
      </div>

      {/* 总资产 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">总资产</div>
            <div className="text-2xl font-bold text-gray-800">
              ¥{(totalBalance / 100).toLocaleString()}
            </div>
          </div>
          <div className="text-3xl">💰</div>
        </div>
      </div>

      {/* 信用卡信息 */}
      {creditCards.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">信用卡</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${creditStatus.bg} ${creditStatus.color}`}>
              {creditStatus.text}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">信用额度</span>
              <span className="font-medium">¥{(totalCreditLimit / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">已使用</span>
              <span className="font-medium">¥{(totalCreditUsed / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">使用率</span>
              <span className={`font-medium ${creditStatus.color}`}>
                {creditUtilization.toFixed(1)}%
              </span>
            </div>
            
            {/* 进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  creditUtilization >= 80 ? 'bg-red-500' : 
                  creditUtilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(creditUtilization, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 账户列表 */}
      <div className="space-y-2">
        {accounts.slice(0, 3).map((account) => (
          <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: account.color + '20' }}
              >
                <span className="text-lg">{account.icon}</span>
              </div>
              <div>
                <div className="text-gray-800 font-medium text-sm">{account.name}</div>
                <div className="text-gray-500 text-xs">{account.cardNumber}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-800 font-medium text-sm">
                ¥{(account.balance / 100).toLocaleString()}
              </div>
              <div className="text-gray-500 text-xs">
                {account.type === 'credit' ? '信用卡' : '储蓄卡'}
              </div>
            </div>
          </div>
        ))}
        
        {accounts.length > 3 && (
          <div className="text-center py-2">
            <span className="text-blue-600 text-sm font-medium">
              还有 {accounts.length - 3} 个账户
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 