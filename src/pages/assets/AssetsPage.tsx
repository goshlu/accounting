import { useState, useEffect } from "react";
import { useAppStore } from "../../store";
import { Plus } from "lucide-react";
import { CustomNavbar } from "../../components/common/CustomNavbar";
import { useNavigate } from "react-router-dom";

export function AssetsPage() {
  const navigate = useNavigate();
  
  const { accounts, transactions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");
  const [, setShowAddAccount] = useState(false);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // 计算总资产
  const totalAssets = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  // 计算本月收入和支出
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const expense = thisMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const income = thisMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    setMonthlyExpense(expense);
    setMonthlyIncome(income);
  }, [transactions]);

  // 过滤账户

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CustomNavbar title="账户" onBack={() => navigate(-1)} />
      {/* 头部 - 新设计 */}
      <div className="bg-gradient-to-b from-orange-400 to-orange-300 rounded-b-3xl shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-white">账户</h1>
            <button
              onClick={() => setShowAddAccount(true)}
              className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* 本月支出、总资产、本月收入显示 */}
          <div className="text-white mb-2">
            <p className="text-sm opacity-80 mb-1">本月支出 (元)</p>
            <p className="text-xl font-bold">
              ¥ {(monthlyExpense / 100).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-between text-white text-xs mt-4">
            <div>总资产 ¥ {(totalAssets / 100).toFixed(2)}</div>
            <div>
              本月 ¥ {((monthlyIncome - monthlyExpense) / 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 信用卡部分 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3">信用卡</h2>
        <div className="space-y-4">
          {accounts
            .filter((account) => account.type === "credit")
            .map((account) => {
              // 计算还款剩余天数
              const today = new Date();
              const repaymentDate = account.repaymentDate
                ? new Date(account.repaymentDate)
                : null;
              const daysLeft = repaymentDate
                ? Math.ceil(
                    (repaymentDate.getTime() - today.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;

              return (
                <div
                  key={account.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                        style={{ backgroundColor: account.color }}
                      >
                        {account.icon}
                      </div>
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {daysLeft > 0 ? `${daysLeft} 天后还款` : "今日还款"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">账单金额</p>
                      <p className="text-lg font-semibold">
                        ¥ {(account.balance / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">可用额度</p>
                      <p className="text-lg font-semibold text-green-500">
                        ¥{" "}
                        {account.creditLimit
                          ? (
                              (account.creditLimit - account.balance) /
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 其余部分保持不变 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3">储蓄卡</h2>
        <div className="grid grid-cols-3 gap-3">
          {accounts
            .filter(
              (account) =>
                account.type === "savings" || account.type === "checking"
            )
            .map((account) => (
              <div
                key={account.id}
                className="bg-gradient-to-br rounded-xl p-4 shadow-sm aspect-square flex flex-col justify-between"
                style={{
                  background:
                    account.type === "savings"
                      ? "linear-gradient(135deg, #4F7FFF 0%, #335CC5 100%)"
                      : account.type === "checking"
                      ? "linear-gradient(135deg, #FF6B6B 0%, #CC5555 100%)"
                      : "linear-gradient(135deg, #50C878 0%, #3CB371 100%)",
                }}
              >
                <div className="text-white text-xs">{account.name}</div>
                <div className="text-white">
                  <p className="text-xs opacity-80">余额</p>
                  <p className="text-lg font-bold">
                    ¥ {(account.balance / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 底部导航占位 */}
      <div className="h-16"></div>
    </div>
  );
}
