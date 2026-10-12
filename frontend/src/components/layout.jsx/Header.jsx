import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUIStore from "../../stores/ui.store";
import useAuthStore from "@/stores/auth.store";
import { Link, useLocation } from "react-router";
import { useNotificationStore } from "@/stores/notifications.store";
import { useChurchInfoStore } from "@/stores/church-info.store";
import { useEffect, useState } from "react";


// TODO: replace with real auth/user data once wired up
// console.log(currentUser);


const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "";

const Header = () => {
    const [userView, setUserView] = useState(false)

    const currentUser = useAuthStore((state) => state.user)
    const unreadCount = useNotificationStore((state) => state.unreadCount) 
    const toggleSidebar = useUIStore((state) => state.toggleMobileSidebar)
    const expand = useUIStore((state) => !state.desktopSidebarOpen)
    const churchData = useChurchInfoStore((state) => state.churchInfo)
    const fetchChurchData = useChurchInfoStore((state) => state.fetchChurchInfo)

    useEffect(() => {
        fetchChurchData()
    }, [])

    const location = useLocation()
    const isAdminPage =  location.pathname.startsWith('/admin')
    const isWorkerPage =  location.pathname.startsWith('/worker')

    const eitherPage = isAdminPage || isWorkerPage

    return (
        <header className="flex h-16 items-center justify-between border-[#1C1D22] bg-[#0A0A0C] px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF] lg:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu size={20} />
                </Button>
                <div>
                    <h2 className="text-lg font-semibold text-[#EDEDEF]">
                    <h1 className="whitespace-nowrap lg:block hidden  text-[15px] font-bold tracking-tight text-[#EDEDEF]">
                    {churchData?.motto}
                    </h1>
                    </h2>
                </div>
                        {/* <p className="font-thin font-fancy text lg:block hidden text-[#D62839]">Home of the blessed people</p> */}
            </div>

            <div className="md:hidden flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full ">
                <img
                    src={churchData?.logo?.url}
                    alt="Rhema Chapel logo"
                    className="h-9 w-9 shrink-0 object-contain rounded-full"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
            
            {currentUser.role === 'admin'  && eitherPage &&
                <Button 
                onClick={() => setUserView(!userView)}
                asChild  className="gap-2 bg-ghost h-8 text-white border border-grey hover:border-none hover:bg-[#B91F2E] transition-all duration-500">
                    <Link to={isWorkerPage ? '/admin' : '/worker'}>
                          <div className='text-sm p-2 gap-2'>
                            {isWorkerPage ? 'Back to Admin View' : 'Check User View'}
                              </div>            
                    </Link>
            </Button>}
                <Link to="/notifications">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                    <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute right-2.5 top-2 flex h-1.5 w-1.5   items-center justify-center rounded-full bg-red-500 text-white"/>                        
                      )}                    
                </Button>
                </Link>

                {/* Divider between actions and profile */}
                <span className="mx-1 h-6 w-px bg-[#1C1D22]" />

                {/* User profile */}
                <button className="flex items-center gap-2.5 rounded-md py-1.5 pl-1.5 pr-2 transition-colors hover:bg-[#141518]">
                    {currentUser.profileImage ? (
                        <img
                            src={currentUser?.profileImage.url}
                            alt={currentUser.name}
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12183A] text-xs font-semibold text-[#EDEDEF]">
                            {getInitials(currentUser.name)}
                        </div>
                    )}

                    <Link to='/settings'>
                    <div className="hidden flex-col items-start sm:flex">
                        <span className="text-sm font-medium leading-tight text-[#EDEDEF]">
                            {currentUser.name}
                        </span>
                        <span className="text-xs leading-tight text-[#8A8C94]">
                            {currentUser.role}
                        </span>
                    </div>
                    </Link>
                </button>
            </div>
        </header>
    );
};

export default Header;