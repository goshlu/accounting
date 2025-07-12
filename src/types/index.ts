// 用户相关类型
export interface User {
  id: string;
  phone: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

// 账户类型
export interface Account {
  id: string;
  name: string;
  type: 'savings' | 'credit' | 'cash' | 'checking'; 
  balance: number;
  cardNumber?: string;
  bankName?: string;
  color: string;
  icon: string;
  // 新增信用卡相关字段
  creditLimit?: number; // 信用额度
  billDate?: string;    // 账单日
  repaymentDate?: string; // 还款日
}

// 交易记录类型
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string; // 修改为 categoryId
  description?: string;
  note?: string; // 添加 note 属性
  accountId: string;
  date: string; // 修改为 string 类型
  tags?: string[];
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  parentId?: string;
}

// 统计数据类型
export interface Statistics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

// 打卡记录类型
export interface CheckInRecord {
  id: string;
  date: string; // YYYY-MM-DD 格式
  timestamp: number;
  consecutiveDays: number; // 连续打卡天数
}

// 打卡统计类型
export interface CheckInStats {
  totalDays: number; // 总打卡天数
  consecutiveDays: number; // 当前连续天数
  maxConsecutiveDays: number; // 最大连续天数
  currentMonthDays: number; // 本月打卡天数
  lastCheckInDate: string | null; // 最后打卡日期
}