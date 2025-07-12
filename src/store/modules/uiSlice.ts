import { StateCreator } from 'zustand';

export interface UISlice {
    // 状态
    isLoading: boolean;
    activeTab: string;
    isDarkMode: boolean;

    // Actions
    setActiveTab: (tab: string) => void;
    setLoading: (loading: boolean) => void;
    setDarkMode: (isDark: boolean) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
    // 初始状态
    isLoading: false,
    activeTab: 'home',
    isDarkMode: false,

    // Actions
    setActiveTab: (tab) => set({ activeTab: tab }),
    setLoading: (loading) => set({ isLoading: loading }),
    setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
        localStorage.setItem('darkMode', JSON.stringify(isDark));
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
});