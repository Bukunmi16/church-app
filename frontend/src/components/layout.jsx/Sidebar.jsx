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
} from "lucide-react";
import { NavLink } from "react-router";
import useUIStore from "../../stores/ui.store";
import useAuthStore from "@/stores/auth.store";

const navigation = [
    {
        title: "Main",
        items: [
            { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end:true },
            { label: "Services", path: "/admin/services", icon: CalendarDays },
            { label: "Teachings", path: "/admin/teachings", icon: BookOpen },
            { label: "Events", path: "/admin/events", icon: Calendar },
            { label: "Members", path: "/admin/members", icon: User2Icon },
            { label: "Workers", path: "/admin/workers", icon: UserRoundGroupIcon},
            { label: "Departments", path: "/admin/departments", icon: CirclePileIcon },
        ],
    },
    {
        title: "Communication",
        items: [
            { label: "Notifications", path: "/admin/notifications", icon: Bell },
        ],
    },
    {
        title: "System",
        items: [
            { label: "Settings", path: "/admin/settings", icon: Settings },
        ],
    },
];

const Sidebar = ({ forceExpanded = false }) => {

    const desktopCollapsed = useUIStore((state) => state.desktopSidebarOpen);
    const onToggle = useUIStore((state) => state.toggleDesktopSidebar);
    const closeMobileSidebar = useUIStore((state) => state.closeMobileSidebar);

    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        closeMobileSidebar()
    }

    // When rendered inside the mobile drawer, always show expanded
    // regardless of the desktop collapsed state in the store.
    const collapsed = forceExpanded ? false : desktopCollapsed;

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
                <div className="md:flex hidden h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-[#D62839]">
                <img
                    src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1788384142/rhema-logo.jpg"
                    alt="Rhema Chapel logo"
                    className="h-9 w-9 shrink-0 object-contain rounded-full"
                />
                </div>
                {!collapsed && (
                    <h1 className=" md:hidden block whitespace-nowrap  text-sm font-bold tracking-tight text-[#EDEDEF]">
                        Rhema Chapel Ogbomoso
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
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
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
                                                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} className="shrink-0" />
                                                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
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
                <button
                    title={collapsed ? "Logout" : undefined}
                    className={`flex w-full items-center gap-3 rounded-md py-2.5 text-sm font-medium text-[#8A8C94] transition-colors hover:bg-[#141518] hover:text-[#EDEDEF] ${
                        collapsed ? "justify-center px-0" : "px-3"
                    }`}
                    onClick={handleLogout}
                >
                    <LogOut size={20} strokeWidth={1.75} className="shrink-0" />
                    {!collapsed && <span className="whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;