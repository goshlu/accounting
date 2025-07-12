import { create } from 'zustand';
import { UserSlice, createUserSlice } from './modules/userSlice';
import { AccountSlice, createAccountSlice } from './modules/accountSlice';
import { TransactionSlice, createTransactionSlice } from './modules/transactionSlice';
import { UISlice, createUISlice } from './modules/uiSlice';
import { CheckInSlice, createCheckInSlice } from './modules/checkInSlice';

// 组合所有slice的类型
type AppState = UserSlice & AccountSlice & TransactionSlice & UISlice & CheckInSlice;

// 创建组合store
export const useAppStore = create<AppState>()((...a) => ({
  ...createUserSlice(...a),
  ...createAccountSlice(...a),
  ...createTransactionSlice(...a),
  ...createUISlice(...a),
  ...createCheckInSlice(...a)
}));

// 初始化深色模式
const initializeDarkMode = () => {
  const savedDarkMode = localStorage.getItem('darkMode');
  const isDark = savedDarkMode ? JSON.parse(savedDarkMode) : false;

  if (isDark) {
    document.documentElement.classList.add('dark');
    useAppStore.getState().setDarkMode(true);
  }
};

// 初始化打卡数据
const initializeCheckInData = () => {
  const savedRecords = localStorage.getItem('checkInRecords');
  if (savedRecords) {
    const records = JSON.parse(savedRecords);
    const today = new Date().toISOString().split('T')[0];
    const hasCheckedToday = records.some((record: any) => record.date === today);
    const stats = useAppStore.getState().getCheckInStats();

    useAppStore.setState({
      checkInRecords: records,
      checkInStats: stats,
      hasCheckedInToday: hasCheckedToday
    });
  }
};

// 初始化
initializeDarkMode();
initializeCheckInData();