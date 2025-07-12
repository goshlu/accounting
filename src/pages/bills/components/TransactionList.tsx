import React from "react";
import { useAppStore } from "../../../store";
import { Transaction } from "../../../types";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { categories, accounts } = useAppStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const transactionDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (transactionDate.toDateString() === today.toDateString()) {
      return "今天";
    }
    if (transactionDate.toDateString() === yesterday.toDateString()) {
      return "昨天";
    }

    return transactionDate.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryInfo = (categoryId: string) => {
    return (
      categories.find((c) => c.id === categoryId) || {
        name: "其他",
        icon: "💰",
        color: "#gray-500",
      }
    );
  };

  const getAccountInfo = (accountId: string) => {
    return (
      accounts.find((a) => a.id === accountId) || {
        name: "未知账户",
        type: "cash",
      }
    );
  };

  // 按日期分组
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const dateKey = new Date(transaction.date).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDateKeys = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <p className="text-gray-500 text-lg mb-2">暂无交易记录</p>
        <p className="text-gray-400 text-sm">
          尝试调整筛选条件或添加新的交易记录
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDateKeys.map((dateKey) => {
        const dayTransactions = groupedTransactions[dateKey];
        const dayTotal = dayTransactions.reduce((sum, t) => {
          return sum + (t.type === "income" ? t.amount : -t.amount);
        }, 0);

        return (
          <div
            key={dateKey}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* 日期头部 */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {formatDate(new Date(dateKey))}
                </span>
                <span
                  className={`font-medium ${
                    dayTotal >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {dayTotal >= 0 ? "+" : ""}
                  {formatCurrency(dayTotal)}
                </span>
              </div>
            </div>

            {/* 交易列表 */}
            <div className="divide-y divide-gray-100">
              {dayTransactions.map((transaction) => {
                const category = getCategoryInfo(transaction.categoryId);
                const account = getAccountInfo(transaction.accountId);

                return (
                  <div
                    key={transaction.id}
                    className="px-4 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-800">
                              {category.name}
                            </p>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {account.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {transaction.description && (
                              <p className="text-sm text-gray-500">
                                {transaction.description}
                              </p>
                            )}
                            <span className="text-xs text-gray-400">
                              {formatTime(new Date(transaction.date))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
