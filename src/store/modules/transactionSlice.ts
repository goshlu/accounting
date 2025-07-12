import { StateCreator } from 'zustand';
import { Transaction, Category, Statistics } from '../../types';

export interface TransactionSlice {
    // 状态
    transactions: Transaction[];
    categories: Category[];
    statistics: Statistics | null;

    // Actions
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    calculateStatistics: () => void;
}

export const createTransactionSlice: StateCreator<TransactionSlice> = (set, get) => ({
    // 初始状态
    transactions: [],
    categories: [
        { id: '1', name: '餐饮', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
        { id: '2', name: '交通', icon: '🚗', color: '#4ECDC4', type: 'expense' },
        { id: '3', name: '购物', icon: '🛍️', color: '#45B7D1', type: 'expense' },
        { id: '4', name: '娱乐', icon: '🎮', color: '#96CEB4', type: 'expense' },
        { id: '5', name: '医疗', icon: '🏥', color: '#FFEAA7', type: 'expense' },
        { id: '6', name: '工资', icon: '💰', color: '#00B894', type: 'income' },
        { id: '7', name: '投资', icon: '📈', color: '#6C5CE7', type: 'income' }
    ],
    statistics: null,

    // Actions
    addTransaction: (transaction: Omit<Transaction, 'id'>) => set((state) => ({
        transactions: [...state.transactions, {
            ...transaction,
            id: Date.now().toString()
        }]
    })),
    deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
    })),
    calculateStatistics: () => {
        const { transactions } = get() as TransactionSlice;
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        set({
            statistics: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                monthlyData: [],
                categoryData: []
            }
        });
    }
});