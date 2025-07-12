import React from 'react';
import { Account } from '../../../types';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';

interface AccountListProps {
  accounts: Account[];
  style?: 'card' | 'list';
}

export function AccountList({ accounts, style = 'list' }: AccountListProps) {
  const [hiddenAccounts, setHiddenAccounts] = React.useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleAccountVisibility = (accountId: string) => {
    const newHidden = new Set(hiddenAccounts);
    if (newHidden.has(accountId)) {
      newHidden.delete(accountId);
    } else {
      newHidden.add(accountId);
    }
    setHiddenAccounts(newHidden);
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'savings': return '储蓄账户';
      case 'checking': return '支票账户';
      case 'credit': return '信用账户';
      default: return '其他账户';
    }
  };

  if (style === 'card') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {accounts
          .filter(account => account.type === 'savings' || account.type === 'checking')
          .map(account => (
            <div 
              key={account.id} 
              className="bg-gradient-to-br rounded-xl p-4 shadow-sm aspect-square flex flex-col justify-between"
              style={{
                background: account.type === 'savings' 
                  ? 'linear-gradient(135deg, #4F7FFF 0%, #335CC5 100%)' 
                  : account.type === 'checking'
                    ? 'linear-gradient(135deg, #FF6B6B 0%, #CC5555 100%)'
                    : 'linear-gradient(135deg, #50C878 0%, #3CB371 100%)'
              }}
            >
              <div className="text-white text-xs">{account.name}</div>
              <div className="text-white">
                <p className="text-xs opacity-80">余额</p>
                <p className="text-lg font-bold">
                  {hiddenAccounts.has(account.id) ? '****' : `¥ ${(account.balance / 100).toFixed(2)}`}
                </p>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="bg-white mx-4 rounded-lg shadow-sm mb-4">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">账户列表</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {accounts.map((account) => {
          const isHidden = hiddenAccounts.has(account.id);
          return (
            <div key={account.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3"
                    style={{ backgroundColor: account.color }}
                  >
                    {account.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{account.name}</h4>
                      <button
                        onClick={() => toggleAccountVisibility(account.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <p className="text-xs text-gray-500">{getAccountTypeLabel(account.type)}</p>
                        {account.bankName && (
                          <p className="text-xs text-gray-400">{account.bankName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {isHidden ? '****' : formatCurrency(account.balance)}
                        </p>
                        {account.cardNumber && (
                          <p className="text-xs text-gray-400">
                            {isHidden ? '****' : `****${account.cardNumber.slice(-4)}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}