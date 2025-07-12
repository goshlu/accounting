import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import { Transaction, Account, Category } from "../../types";
import { QuickStats } from "./components/QuickStats";
import { BudgetReminder } from "./components/BudgetReminder";
import { PullToRefresh } from "./components/PullToRefresh";
import { WelcomeMessage } from "./components/WelcomeMessage";
import { EmptyState } from "./components/EmptyState";
import { AssetOverview } from "./components/AssetOverview";
import { SmartReminders } from "./components/SmartReminders";
import { QuickActions } from "./components/QuickActions";
import { SyncStatus } from "./components/SyncStatus";
import { SearchBar } from "./components/SearchBar";
import { CustomNavbar } from "../../components/common/CustomNavbar";
// 格式化日期
const formatDate = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const weekday = weekdays[date.getDay()];
  return { month, day, weekday };
};

// 按日期分组交易
const groupTransactionsByDate = (transactions: Transaction[]) => {
  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);
};

// 获取本月数据
const getCurrentMonthData = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });
};

// 获取今日数据
const getTodayData = (transactions: Transaction[]) => {
  const today = new Date().toDateString();
  return transactions.filter((t) => new Date(t.date).toDateString() === today);
};

export function HomePage() {
  const navigate = useNavigate();
  const { transactions, accounts, categories } = useAppStore();
  const [currentBookType, setCurrentBookType] = useState("默认账本");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAmount, setQuickAmount] = useState("");
  const [quickType, setQuickType] = useState<"income" | "expense">("expense");
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);

  // 计算统计数据
  const {
    totalExpense,
    totalIncome,
    balance,
    monthlyExpense,
    monthlyIncome,
    todayExpense,
    todayIncome,
    recentTransactions,
  } = useMemo(() => {
    const currentMonthData = getCurrentMonthData(transactions);
    const todayData = getTodayData(transactions);

    const monthlyExpense = currentMonthData
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyIncome = currentMonthData
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const todayExpense = todayData
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const todayIncome = todayData
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      monthlyExpense,
      monthlyIncome,
      todayExpense,
      todayIncome,
      recentTransactions: transactions.slice(0, 5),
    };
  }, [transactions]);

  // 按日期分组的交易
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const bookTypes = [
    "日常结账",
    "旅行账本",
    "投资理财",
    "家庭开支",
    "工作报销",
  ];

  const handleBookTypeChange = (bookType: string) => {
    setCurrentBookType(bookType);
    setIsDropdownOpen(false);
  };

  const getAccountById = (id: string) => {
    return accounts.find((acc) => acc.id === id);
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  // 快速记账功能
  const handleQuickAdd = () => {
    if (!quickAmount || parseFloat(quickAmount) <= 0) return;

    const amount = parseFloat(quickAmount);
    const defaultCategory = categories.find((cat) => cat.type === quickType);
    const defaultAccount = accounts[0];

    if (defaultCategory && defaultAccount) {
      const newTransaction: Omit<Transaction, "id"> = {
        type: quickType,
        amount,
        categoryId: defaultCategory.id,
        accountId: defaultAccount.id,
        date: new Date().toISOString(),
        description: `快速${quickType === "income" ? "收入" : "支出"}`,
      };

      // 调用store的addTransaction方法
      useAppStore.getState().addTransaction(newTransaction);
      setQuickAmount("");
      setShowQuickAdd(false);
    }
  };

  // 获取常用分类
  const getFrequentCategories = () => {
    const expenseCategories = categories
      .filter((cat) => cat.type === "expense")
      .slice(0, 4);
    return expenseCategories;
  };

  // 刷新数据
  const handleRefresh = async () => {
    // 模拟刷新延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastRefreshTime(new Date());
    // 这里可以添加重新获取数据的逻辑
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部状态栏 */}
      <CustomNavbar title="首页" onBack={() => navigate(-1)} />

      {/* 主要内容区域 */}
      <div className="px-4 py-6 space-y-6">
        {/* 搜索栏 */}
        <SearchBar
          transactions={transactions}
          categories={categories}
          onSearch={setSearchResults}
        />

        {/* 欢迎消息 */}
        <WelcomeMessage
          hasTransactions={transactions.length > 0}
          monthlyBalance={monthlyIncome - monthlyExpense}
        />

        {/* 财务概览卡片 */}
        <QuickStats
          monthlyExpense={monthlyExpense}
          monthlyIncome={monthlyIncome}
          todayExpense={todayExpense}
          todayIncome={todayIncome}
          balance={balance}
        />

        {/* 快速操作区域 */}
        <QuickActions />

        {/* 快速记账 */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">快速记账</h2>
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              {showQuickAdd ? "取消" : "开始记账"}
            </button>
          </div>

          {/* 快速记账输入 */}
          {showQuickAdd && (
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => setQuickType("expense")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    quickType === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  支出
                </button>
                <button
                  onClick={() => setQuickType("income")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    quickType === "income"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  收入
                </button>
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  placeholder="输入金额"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleQuickAdd}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 预算提醒 */}
        <BudgetReminder
          monthlyExpense={monthlyExpense}
          monthlyIncome={monthlyIncome}
          todayExpense={todayExpense}
          recentTransactions={recentTransactions}
        />

        {/* 资产概览 */}
        <AssetOverview accounts={accounts} />

        {/* 智能提醒 */}
        <SmartReminders
          accounts={accounts}
          transactions={transactions}
          monthlyExpense={monthlyExpense}
          monthlyIncome={monthlyIncome}
        />

        {/* 同步状态 */}
        <SyncStatus lastRefreshTime={lastRefreshTime} />

        {/* 常用分类 */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">常用分类</h2>
          <div className="grid grid-cols-4 gap-3">
            {getFrequentCategories().map((category) => (
              <div
                key={category.id}
                onClick={() =>
                  navigate("/add-record", {
                    state: { categoryId: category.id },
                  })
                }
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs text-gray-600 text-center">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近交易记录 */}
        {transactions.length > 0 ? (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">最近交易</h2>
              <button
                onClick={() => navigate("/bills")}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                查看全部
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const account = getAccountById(transaction.accountId);
                const category = getCategoryById(transaction.categoryId);

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-lg">{category?.icon}</span>
                      </div>
                      <div>
                        <div className="text-gray-800 font-medium text-sm">
                          {category?.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(transaction.date).toLocaleDateString()}{" "}
                          {account?.name}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`font-semibold text-sm ${
                        transaction.type === "expense"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}¥
                      {transaction.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}

        {/* 交易记录时间线 */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">交易记录</h2>
            <div className="space-y-4">
              {sortedDates.slice(0, 3).map((dateString) => {
                const date = new Date(dateString);
                const { day, weekday, month } = formatDate(date);
                const dailyTransactions = groupedTransactions[dateString];
                const dailyIncome = dailyTransactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0);
                const dailyExpense = dailyTransactions
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0);

                return (
                  <div
                    key={dateString}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm font-bold">
                            {day}
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-800 font-medium text-sm">
                            {weekday}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {month}.{date.getFullYear()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3 text-xs">
                        <span className="text-green-500">
                          收入 ¥{dailyIncome.toLocaleString()}
                        </span>
                        <span className="text-red-500">
                          支出 ¥{dailyExpense.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {dailyTransactions.slice(0, 3).map((transaction) => {
                        const account = getAccountById(transaction.accountId);
                        const category = getCategoryById(
                          transaction.categoryId
                        );

                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-xl"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                                <span className="text-sm">
                                  {category?.icon}
                                </span>
                              </div>
                              <div>
                                <div className="text-gray-800 text-sm">
                                  {category?.name}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {account?.name}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`font-medium text-sm ${
                                transaction.type === "expense"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {transaction.type === "expense" ? "-" : "+"}¥
                              {transaction.amount.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
