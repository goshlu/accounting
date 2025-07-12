import { StateCreator } from 'zustand';
import { Account } from '../../types';

export interface AccountSlice {
    // 状态
    accounts: Account[];

    // Actions
    addAccount: (account: Account) => void;
    updateAccount: (id: string, updates: Partial<Account>) => void;
}

export const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
    // 初始状态
    accounts: [
        {
            id: '1',
            name: '微信',
            type: 'savings',
            balance: 987546, // 9875.46元
            cardNumber: '****6245',
            bankName: '微信',
            color: '#4F7FFF',
            icon: '🏦'
        },
        {
            id: '2',
            name: '支付宝',
            type: 'credit',
            balance: 53600, // 536元
            cardNumber: '****6245',
            bankName: '支付宝',
            color: '#FF8C00',
            icon: '💳',
            creditLimit: 5000000, // 50000元额度
            billDate: '2023-05-20', // 账单日
            repaymentDate: '2023-06-10' // 还款日
        },
    ],

    // Actions
    addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, account]
    })),
    updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(account =>
            account.id === id ? { ...account, ...updates } : account
        )
    }))
});