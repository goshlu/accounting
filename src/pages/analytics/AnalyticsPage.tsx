import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { CustomNavbar } from "../../components/common/CustomNavbar";

export function AnalyticsPage() {
  useAppStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 默认当前月份
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 添加支出/收入切换状态
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  // 可选年份列表
  // 获取近5年的年份列表
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

  // 获取当前月份之前的所有月份
  const currentMonth = new Date().getMonth() + 1; // 获取当前月份
  const months = Array.from({ length: currentMonth }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}月`,
  }));

  // 添加账本类型切换状态
  const [currentBookType, setCurrentBookType] = useState("日常结账");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 点击外部关闭年份下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const bookTypes = [
    "日常结账",
    "旅行账本",
    "投资理财",
    "家庭开支",
    "工作报销",
  ];

  // 模拟数据
  // 生成更真实的柱状图数据
  function generateRealisticData(baseAmount: number, variance: number) {
    return Array.from({ length: 30 }, (_, i) => {
      // 周末（第6、7、13、14、20、21、27、28天）消费更高
      const isWeekend = i % 7 === 5 || i % 7 === 6;
      const weekendMultiplier = isWeekend ? 1.5 : 1;

      // 月初和月末（1-3天和28-30天）消费略高
      const isMonthEndOrStart = i < 3 || i > 26;
      const monthPositionMultiplier = isMonthEndOrStart ? 1.3 : 1;

      // 加入一些随机波动
      const randomVariance = 1 + (Math.random() * variance * 2 - variance);

      // 计算最终金额
      const finalAmount = Math.floor(
        baseAmount *
          weekendMultiplier *
          monthPositionMultiplier *
          randomVariance
      );

      // 确保在合理范围内
      return {
        day: i + 1,
        amount: Math.min(4000, Math.max(100, finalAmount)),
      };
    });
  }

  const financialData = {
    expense: {
      total: 1123697,
      chartData: generateRealisticData(1500, 0.4), // 基础消费1500，波动40%
      categories: [
        {
          category: "吃喝",
          amount: 6463,
          percentage: 45,
          color: "bg-blue-500",
          icon: "🍽️",
        },
        {
          category: "零食",
          amount: 1287,
          percentage: 10,
          color: "bg-red-500",
          icon: "🍜",
        },
        {
          category: "聚会",
          amount: 3478,
          percentage: 25,
          color: "bg-purple-500",
          icon: "🎉",
        },
        {
          category: "聚会",
          amount: 869,
          percentage: 5,
          color: "bg-orange-500",
          icon: "🎉",
        },
      ],
    },
    income: {
      total: 3423864,
      chartData: generateRealisticData(2000, 0.3), // 基础收入2000，波动30%
      categories: [
        {
          category: "工资",
          amount: 25000,
          percentage: 70,
          color: "bg-green-500",
          icon: "💰",
        },
        {
          category: "奖金",
          amount: 8000,
          percentage: 20,
          color: "bg-blue-500",
          icon: "🎁",
        },
        {
          category: "副业",
          amount: 3500,
          percentage: 10,
          color: "bg-purple-500",
          icon: "💼",
        },
      ],
    },
  };


  const handleBookTypeChange = (bookType: string) => {
    setCurrentBookType(bookType);
    setIsDropdownOpen(false);
  };

  // 处理年份选择
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
  };

  // 处理月份导航
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // 获取当前选择的数据（支出或收入）
  const currentData =
    activeTab === "expense" ? financialData.expense : financialData.income;

  // 添加查看全部记录的导航函数
  const handleViewAllRecords = () => {
    console.log("/bills");
    // 导航到账单页面并传递筛选参数
    navigate("/bills", {
      state: {
        type: activeTab, // 'expense' 或 'income'
        dateRange: "month",
        year: selectedYear,
        month: selectedMonth,
        bookType: currentBookType,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar title="统计" onBack={() => navigate(-1)} />
      {/* 顶部橙色区域 */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 relative overflow-hidden">
        {/* 状态栏 */}
        <div className="flex justify-center items-center px-4 pt-4 pb-4">
          <div className="relative">
            <button
              className="flex items-center space-x-1 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="text-white text-base font-bold">
                {currentBookType}
              </div>
              <div
                className={`text-white text-sm transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </div>
            </button>

            {/* 下拉菜单 */}
            {isDropdownOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                {bookTypes.map((bookType) => (
                  <button
                    key={bookType}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentBookType === bookType
                        ? "text-orange-500 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => handleBookTypeChange(bookType)}
                  >
                    {bookType}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 年份和月份选择器 - 美化版 */}
        <div className="px-6 pb-6">
          {/* 年份选择器 */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative" ref={yearDropdownRef}>
              <button
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-all"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              >
                <span className="text-white text-base font-bold">
                  {selectedYear}
                </span>
                <span
                  className={`text-white text-xs transition-transform duration-200 ${
                    isYearDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg py-2 w-32 z-20">
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedYear === year
                          ? "text-orange-500 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => handleYearChange(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 月份导航控制器 */}
            <div className="flex items-center space-x-3">
              <button
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
                onClick={handlePrevMonth}
              >
                <span className="text-white">←</span>
              </button>
              <span className="text-white font-medium">{selectedMonth}月</span>
              <button
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
                onClick={handleNextMonth}
              >
                <span className="text-white">→</span>
              </button>
            </div>
          </div>

          {/* 月份选择器 - 滑动式 */}
          <div className="relative overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex space-x-2 w-max">
              {months.map((month) => (
                <button
                  key={month.value}
                  onClick={() => setSelectedMonth(month.value)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedMonth === month.value
                      ? "bg-white text-orange-500 font-medium shadow-sm"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {month.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 收支统计卡片 - 改为切换式 */}
        <div className="bg-white mx-4 rounded-t-3xl px-6 pt-6 pb-4">
          {/* 切换标签 */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 p-1 rounded-full">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "expense"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("expense")}
              >
                支出
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "income"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("income")}
              >
                收入
              </button>
            </div>
          </div>

          {/* 金额显示 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {currentData.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {selectedYear}年{selectedMonth}月
              {activeTab === "expense" ? "支出" : "收入"}
            </div>
          </div>
        </div>
      </div>

      {/* 柱状图表区域 */}
      <div className="bg-white mx-4 -mt-1 px-3 py-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentData.chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tickFormatter={(day) => {
                  // 只显示部分日期标签，避免拥挤
                  return day % 5 === 1
                    ? `${day < 10 ? "0" : ""}${day}/${ 
                        selectedMonth < 10 ? "0" : ""
                      }${selectedMonth}`
                    : "";
                }}
                tick={{ fontSize: 10 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                tickCount={5}
                domain={[0, 4000]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.toString()}
              />
              <Tooltip
                formatter={(value) => [
                  `${value} 元`,
                  activeTab === "expense" ? "支出" : "收入",
                ]}
                labelFormatter={(day) => `${selectedMonth}月${day}日`}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  border: "none",
                }}
              />
              <Bar
                dataKey="amount"
                fill={activeTab === "expense" ? "#FB923C" : "#60A5FA"}
                radius={[4, 4, 0, 0]}
                barSize={6}
                animationDuration={300}
                // 添加以下属性来自定义点击效果
                activeBar={{
                  stroke: "transparent", // 移除边框
                  fill: activeTab === "expense" ? "#EA580C" : "#3B82F6", // 点击时稍微深一点的颜色
                  // 可选：添加阴影效果代替边框
                  filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.2))",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 本月详情 */}
      <div className="bg-white mx-4 mt-6 rounded-2xl px-6 py-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">
            本月{activeTab === "expense" ? "支出" : "收入"}
          </h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-3">
              {selectedMonth < 10 ? "0" : ""}
              {selectedMonth}.{selectedYear}
            </span>
            <button
              className="text-sm text-blue-500 hover:text-blue-600 flex items-center transition-colors"
              onClick={handleViewAllRecords}
            >
              查看全部
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {currentData.categories.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div>
                  <div className="text-gray-800 font-medium">
                    {item.category}
                  </div>
                  <div className="text-gray-500 text-sm">现金</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-base font-semibold text-blue-600 mr-3">
                  {item.amount}
                </span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部查看更多按钮 - 移动端常见模式 */}
        <button
          className="w-full mt-6 py-3 text-center text-sm text-gray-500 hover:text-gray-700 border-t border-gray-100 transition-colors"
          onClick={() =>
            console.log(
              `查看更多${activeTab === "expense" ? "支出" : "收入"}记录`
            )
          }
        >
          查看更多记录
        </button>
      </div>

      {/* 底部间距 */}
      <div className="h-20"></div>
    </div>
  );
}
