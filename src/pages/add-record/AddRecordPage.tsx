import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../../store";
import { CategorySelector } from "./components/CategorySelector";
import { AccountSelector } from "./components/AccountSelector";
import { AmountInput } from "./components/AmountInput";
import { CustomNavbar } from "../../components/common/CustomNavbar";

export function AddRecordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTransaction, categories, accounts } = useAppStore();

  const type = (searchParams.get("type") as "income" | "expense") || "expense";

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    accountId: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = () => {
    if (!formData.amount || !formData.categoryId || !formData.accountId) {
      alert("请填写完整信息");
      return;
    }

    const transaction = {
      type: type as "income" | "expense", // 使用从URL参数获取的type变量
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      accountId: formData.accountId,
      description: formData.description,
      date: formData.date, // 直接使用字符串，不需要转换为Date对象
    };

    addTransaction(transaction);
    navigate("/home");
  };

  // 切换交易类型（收入/支出）
  const switchType = (newType: "income" | "expense") => {
    navigate(`/add-record?type=${newType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar
        title={type === "income" ? "添加收入" : "添加支出"}
        onBack={() => navigate(-1)}
        right={
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
          >
            保存
          </button>
        }
      >
        {/* 标签页切换 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => switchType("expense")}
            className={`flex-1 py-3 text-center font-medium ${
              type === "expense"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
          >
            支出
          </button>
          <button
            onClick={() => switchType("income")}
            className={`flex-1 py-3 text-center font-medium ${
              type === "income"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
          >
            收入
          </button>
        </div>
      </CustomNavbar>

      <div className="p-4 space-y-6 pt-28">
        {/* 金额输入 */}
        <AmountInput
          value={formData.amount}
          onChange={(amount: any) =>
            setFormData((prev) => ({ ...prev, amount }))
          }
          type={type}
        />

        {/* 分类选择 */}
        <CategorySelector
          categories={filteredCategories}
          selectedId={formData.categoryId}
          onSelect={(categoryId: any) =>
            setFormData((prev) => ({ ...prev, categoryId }))
          }
        />

        {/* 账户选择 */}
        <AccountSelector
          accounts={accounts}
          selectedId={formData.accountId}
          onSelect={(accountId: any) =>
            setFormData((prev) => ({ ...prev, accountId }))
          }
        />

        {/* 备注 */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            备注
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="添加备注信息..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* 日期 */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            日期
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
