import { useState, useMemo, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useAppStore } from "../../store";
import { TransactionList } from "./components/TransactionList";
import { FilterModal } from "./components/FilterModal";
import { useLocation } from "react-router-dom";
import { CustomNavbar } from "../../components/common/CustomNavbar";
import { useNavigate } from "react-router-dom";


export function BillsPage() {
  const { transactions, categories, accounts } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [dateRange, setDateRange] = useState<
    "all" | "today" | "week" | "month" | "year"
  >("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const location = useLocation();
  const navigate = useNavigate();
  
  // 筛选和排序交易记录
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter((transaction) => {
        const category = categories.find(
          (c) => c.id === transaction.categoryId
        );
        const account = accounts.find((a) => a.id === transaction.accountId);
        return (
          category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
    }

    // 类型筛选
    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // 分类筛选
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.categoryId === selectedCategory);
    }

    // 账户筛选
    if (selectedAccount !== "all") {
      filtered = filtered.filter((t) => t.accountId === selectedAccount);
    }

    // 日期筛选
    if (dateRange !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter((t) => new Date(t.date) >= startDate);
    }

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    transactions,
    searchTerm,
    selectedType,
    selectedCategory,
    selectedAccount,
    dateRange,
    sortBy,
    sortOrder,
    categories,
    accounts,
  ]);

  // 统计信息
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      total: filteredTransactions.length,
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const typeOptions = [
    { value: "all", label: "全部" },
    { value: "income", label: "收入" },
    { value: "expense", label: "支出" },
  ];

  const navigationState = location.state as {
    type?: "expense" | "income";
    dateRange?: "all" | "today" | "week" | "month" | "year";
    year?: number;
    month?: number;
    bookType?: string;
  } | null;

  // 在组件加载时应用导航参数
  useEffect(() => {
    if (navigationState) {
      console.log(navigationState);
      // 设置类型筛选
      if (navigationState.type) {
        setSelectedType(navigationState.type);
      }

      // 设置日期范围
      if (navigationState.dateRange) {
        setDateRange(navigationState.dateRange);
      }

      // 如果有特定年月，可以进一步自定义筛选
      if (navigationState.year && navigationState.month) {
        // 这里可以添加自定义日期筛选逻辑
        // 例如：设置一个自定义日期范围状态
      }

      // 如果有账本类型，可以添加相应筛选
      if (navigationState.bookType) {
        // 假设有账本类型筛选功能
        // setSelectedBookType(navigationState.bookType);
      }
    }
  }, [navigationState]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 导航栏 */}
      <CustomNavbar title="账单明细" onBack={() => navigate(-1)} />
      {/* 头部 */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-4">账单明细</h1>

        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索交易记录..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* 快速筛选 */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedType(option.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === option.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 高级筛选和排序 */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">筛选</span>
          </button>

          <div className="flex items-center space-x-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split("-");
                setSortBy(by as "date" | "amount");
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="date-desc">最新优先</option>
              <option value="date-asc">最早优先</option>
              <option value="amount-desc">金额从高到低</option>
              <option value="amount-asc">金额从低到高</option>
            </select>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">总收入</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(stats.income)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">总支出</p>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(stats.expense)}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">净收支</span>
              <span
                className={`font-bold ${
                  stats.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.balance >= 0 ? "+" : ""}
                {formatCurrency(stats.balance)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">交易笔数</span>
              <span className="font-medium text-gray-800">
                {stats.total} 笔
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 交易列表 */}
      <div className="px-4">
        <TransactionList transactions={filteredTransactions} />
      </div>

      {/* 筛选弹窗 */}
      {showFilterModal && (
        <FilterModal
          selectedCategory={selectedCategory}
          selectedAccount={selectedAccount}
          dateRange={dateRange}
          onCategoryChange={setSelectedCategory}
          onAccountChange={setSelectedAccount}
          onDateRangeChange={setDateRange}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}
