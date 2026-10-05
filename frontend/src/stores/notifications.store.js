import {create} from 'zustand';

import { countNotifications } from '@/api/notification.api';

export const useNotificationStore = create((set) => ({
    unreadCount: 0, 
    isLoading: false,
    
    fetchUnreadCount: async () => {
        set({ isLoading: true });

        try {
            const {data: count}= await countNotifications();
            console.log(count);
            
            set({ unreadCount: count.count });
        } catch (error) {
            set({ unreadCount: 0 });
        } finally {
            set({ isLoading: false });
        }
        
    }}));