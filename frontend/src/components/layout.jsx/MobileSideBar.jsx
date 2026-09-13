import React from 'react'
import { X } from 'lucide-react'
import Sidebar from './Sidebar'

import useUIStore from '../store/ui.store'

const MobileSideBar = () => {

    const mobileSidebarOpen = useUIStore((state) => state.mobileSidebarOpen)
    const closeSideBar = useUIStore((state) => state.closeMobileSidebar)

    if (!mobileSidebarOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/7"
                onClick={closeSideBar}
            />

            {/* Sidebar + close button, siblings so the button sits clear of the panel */}
            <div className="relative flex h-full w-fit">
                <Sidebar forceExpanded />

                <button
                    onClick={closeSideBar}
                    className="mt-4 ml-3 h-fit rounded-md p-2 text-white hover:bg-white/10"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    )
}

export default MobileSideBar