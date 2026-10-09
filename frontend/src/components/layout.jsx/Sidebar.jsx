import {
    LayoutDashboard,
    CalendarDays,
    BookOpen,
    Calendar,
    Users,
    User2Icon,
    UserRoundGroup,
    Bell,
    Settings,
    LogOut,
    ChevronsLeft,
    ChevronsRight,
    UserRoundGroupIcon,
    CirclePileIcon,
    Rows4Icon,
    Loader2,
} from "lucide-react";
import { NavLink } from "react-router";
import useUIStore from "../../stores/ui.store";
import useAuthStore from "@/stores/auth.store";
import { useChurchInfoStore } from "@/stores/church-info.store";
import { useEffect, useState } from "react";
import { countNotifications } from "@/api/notification.api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNotificationStore } from "@/stores/notifications.store";

const navigation = [
    {
        title: "Main",
        items: [
            { label: "Dashboard", path: `/admin`, icon: LayoutDashboard, end:true },
            { label: "Services", path: "/services", icon: CalendarDays },
            { label: "Teachings", path: "/teachings", icon: BookOpen },
            { label: "Teaching Series", path: "/teaching-series", icon: Rows4Icon },
            { label: "Events", path: "/events", icon: Calendar },
            { label: "Users", path: "/users", icon: User2Icon },
            { label: "Departments", path: "/departments", icon: CirclePileIcon },
        ],
    },
    {
        title: "Communication",
        items: [
            { label: "Notifications", path: "/notifications", icon: Bell, showUnreadCount: true },
        ],
    },
    {
        title: "System",
        items: [
            { label: "Settings", path: "/settings", icon: Settings },
        ],
    },
];

const Sidebar = ({ forceExpanded = false }) => {

    const desktopCollapsed = useUIStore((state) => state.desktopSidebarOpen);
    const onToggle = useUIStore((state) => state.toggleDesktopSidebar);
    const closeMobileSidebar = useUIStore((state) => state.closeMobileSidebar);

    const fetchNotificationCount = useNotificationStore((state) => state.fetchUnreadCount)
    const unreadCount = useNotificationStore((state) => state.unreadCount)

    const user = useAuthStore((state) => state.user)

    // console.log(user);
    

    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        closeMobileSidebar()
    }

    // When rendered inside the mobile drawer, always show expanded
    // regardless of the desktop collapsed state in the store.
    const collapsed = forceExpanded ? false : desktopCollapsed;

    const churchData = useChurchInfoStore((state) => state.churchInfo)
    const fetchChurchData = useChurchInfoStore((state) => state.fetchChurchInfo)

    useEffect(() => {
        fetchChurchData()
    }, [])

    // Unread notifications count, shown as a badge next to the nav item

    useEffect(() => {
        fetchNotificationCount()
    }, []);

    return (
        <aside
            className={`fixed     flex h-screen flex-col bg-[#0A0A0C] text-[#EDEDEF] transition-all duration-300 ${
                collapsed ? "w-20" : "w-64"
            }`}
        >
            {/* Logo */}
            <div
                className={`flex h-16 items-center border-b border-[#1C1D22] ${
                    collapsed ? "justify-center px-0" : "gap-3 px-4"
                }`}
            >
                <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full">
                    {churchData?.logo?.url ? (
                        <img
                            src={churchData.logo.url}
                            alt={churchData?.name || "Church logo"}
                            className="h-9 w-9 shrink-0 object-contain rounded-full"
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12183A]">
                            <Loader2 size={14} className="animate-spin text-[#6E7079]" />
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-[#EDEDEF]">
                        {churchData?.name || "Loading..."}
                    </h1>
                )}
            </div>

            {/* Collapse toggle */}
            {!forceExpanded && (
            <div className="hidden lg:block">
            <button
                onClick={onToggle}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute -right-3 top-14 flex h-6 w-6 items-center justify-center rounded-full border border-[#1C1D22] bg-[#0A0A0C] text-[#6E7079] transition-colors hover:text-[#EDEDEF]"
                >
                {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
            </button>
            </div>
            )}

            {/* Navigation */}
            <nav className="sidebar-scroll flex-1 space-y-7 overflow-y-auto overflow-x-hidden px-3 py-6">
                {navigation.map((section) => (
                    <div key={section.title}>
                        {!collapsed && (
                            <div className="mb-2 flex items-center gap-2 px-3">
                                <p className="whitespace-nowrap text-xs font-medium text-[#6E7079]">
                                    {section.title}
                                </p>
                                <span className="h-px flex-1 bg-[#1C1D22]" />
                            </div>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const hasUnread = item.showUnreadCount && unreadCount > 0;
                                const path = item.label === "Dashboard" && user?.role
                                    ? `/${user.role}`
                                    : item.path;
                                
                                return (
                                    <NavLink
                                        key={path}
                                        to={path}
                                        end={item.end}
                                        onClick={closeMobileSidebar}
                                        title={collapsed ? item.label : undefined}
                                        className={({ isActive }) =>
                                            `group relative flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition-colors ${
                                                collapsed ? "justify-center px-0" : "pl-3 pr-3"
                                            } ${
                                                isActive
                                                    ? " "
                                                    : "text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span
                                                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#D62839] transition-opacity ${
                                                        isActive ? "opacity-100" : "opacity-0"
                                                    }`}
                                                />
                                                <span className="relative shrink-0">
                                                    <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                                                    {/* Collapsed rail: small dot instead of a full count pill */}
                                                    {collapsed && hasUnread && (
                                                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#D62839]" />
                                                    )}
                                                </span>
                                                {!collapsed && (
                                                    <>
                                                        <span className="whitespace-nowrap">{item.label}</span>
                                                        {hasUnread && (
                                                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D62839] px-1.5 text-[11px] font-semibold text-white">
                                                                {unreadCount > 99 ? "99+" : unreadCount}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div className="border-t border-[#1C1D22] p-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            title={collapsed ? "Logout" : undefined}
                            className={`flex w-full items-center gap-3 rounded-md py-2.5 text-sm font-medium text-[#8A8C94] transition-colors hover:bg-[#141518] hover:text-[#EDEDEF] ${
                                collapsed ? "justify-center p-3" : "px-3"
                            }`}
                        >
                            <LogOut size={20} strokeWidth={1.75} className="shrink-0" />
                            {!collapsed && <span className="whitespace-nowrap">Logout</span>}
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Log out?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#8A8C94]">
                                You'll need to sign in again to access the admin dashboard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-[#D62839] text-white hover:bg-[#B91F2E]"
                            >
                                Log out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </aside>
    );
};

export default Sidebar;