import { create } from 'zustand'

const useUIStore = create((set) => ({
    desktopSidebarOpen: false,

    toggleDesktopSidebar: () => 
        set((state) => ({
            desktopSidebarOpen: !state.desktopSidebarOpen,
        })),

    mobileSidebarOpen: false,

    toggleMobileSidebar: () => 
        set((state) => ({
            mobileSidebarOpen: !state.mobileSidebarOpen,
        })),
    
    closeMobileSidebar: () => 
        set({
            mobileSidebarOpen: false
        })
    
}))

export default useUIStore