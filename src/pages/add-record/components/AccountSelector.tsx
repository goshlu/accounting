import React from 'react';
import { Account } from '../../../types';

interface AccountSelectorProps {
  accounts: Account[];
  selectedId: string;
  onSelect: (accountId: string) => void;
}

export function AccountSelector({ accounts, selectedId, onSelect }: AccountSelectorProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">选择账户</h3>
      <div className="space-y-3">
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => onSelect(account.id)}
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
              selectedId === account.id
                ? 'bg-orange-100 border-2 border-orange-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{account.icon}</span>
              <div className="text-left">
                <div className={`font-medium ${
                  selectedId === account.id ? 'text-orange-700' : 'text-gray-900'
                }`}>
                  {account.name}
                </div>
                <div className="text-sm text-gray-500">{account.type}</div>
              </div>
            </div>
            <div className={`font-semibold ${
              selectedId === account.id ? 'text-orange-700' : 'text-gray-700'
            }`}>
              {formatCurrency(account.balance)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}