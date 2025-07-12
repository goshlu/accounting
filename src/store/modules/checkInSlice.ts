import { StateCreator } from 'zustand';
import { CheckInRecord, CheckInStats } from '../../types';

export interface CheckInSlice {
    // 状态
    checkInRecords: CheckInRecord[];
    checkInStats: CheckInStats;
    hasCheckedInToday: boolean;

    // Actions
    checkIn: () => void;
    getCheckInStats: () => CheckInStats;
    hasCheckedInOnDate: (date: string) => boolean;
}

// 计算打卡统计的辅助函数
function calculateCheckInStats(records: CheckInRecord[]): CheckInStats {
    if (records.length === 0) {
        return {
            totalDays: 0,
            consecutiveDays: 0,
            maxConsecutiveDays: 0,
            currentMonthDays: 0,
            lastCheckInDate: null
        };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // 总打卡天数
    const totalDays = records.length;

    // 最后打卡日期
    const lastCheckInDate = records[records.length - 1]?.date || null;

    // 当前连续天数
    let consecutiveDays = 0;
    const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (let i = 0; i < sortedRecords.length; i++) {
        const recordDate = new Date(sortedRecords[i].date);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);

        if (recordDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
            consecutiveDays++;
        } else {
            break;
        }
    }

    // 最大连续天数
    const maxConsecutiveDays = Math.max(...records.map(r => r.consecutiveDays));

    // 本月打卡天数
    const currentMonthDays = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length;

    return {
        totalDays,
        consecutiveDays,
        maxConsecutiveDays,
        currentMonthDays,
        lastCheckInDate
    };
}

export const createCheckInSlice: StateCreator<CheckInSlice> = (set, get) => ({
    // 初始状态
    checkInRecords: [],
    checkInStats: {
        totalDays: 0,
        consecutiveDays: 0,
        maxConsecutiveDays: 0,
        currentMonthDays: 0,
        lastCheckInDate: null
    },
    hasCheckedInToday: false,

    // Actions
    checkIn: () => {
        const today = new Date().toISOString().split('T')[0];
        const { checkInRecords } = get() as CheckInSlice;

        // 检查今天是否已经打卡
        const hasCheckedToday = checkInRecords.some(record => record.date === today);
        if (hasCheckedToday) {
            return;
        }

        // 计算连续天数
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const lastRecord = checkInRecords[checkInRecords.length - 1];
        let consecutiveDays = 1;

        if (lastRecord && lastRecord.date === yesterdayStr) {
            consecutiveDays = lastRecord.consecutiveDays + 1;
        }

        // 创建新的打卡记录
        const newRecord: CheckInRecord = {
            id: Date.now().toString(),
            date: today,
            timestamp: Date.now(),
            consecutiveDays
        };

        const updatedRecords = [...checkInRecords, newRecord];

        // 计算统计数据
        const stats = calculateCheckInStats(updatedRecords);

        set({
            checkInRecords: updatedRecords,
            checkInStats: stats,
            hasCheckedInToday: true
        });

        // 保存到localStorage
        localStorage.setItem('checkInRecords', JSON.stringify(updatedRecords));
    },

    getCheckInStats: () => {
        const { checkInRecords } = get() as CheckInSlice;
        return calculateCheckInStats(checkInRecords);
    },

    hasCheckedInOnDate: (date: string) => {
        const { checkInRecords } = get() as CheckInSlice;
        return checkInRecords.some(record => record.date === date);
    }
});