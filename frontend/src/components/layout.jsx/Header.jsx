import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUIStore from "../../stores/ui.store";

// TODO: replace with real auth/user data once wired up
const currentUser = {
    name: "Adebayo Johnson",
    role: "Administrator",
    profilePicture: null, // e.g. "https://res.cloudinary.com/.../avatar.jpg"
};

const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "";

const Header = () => {

    const toggleSidebar = useUIStore((state) => state.toggleMobileSidebar)
    const expand = useUIStore((state) => !state.desktopSidebarOpen)

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
                    <h1 className=" whitespace-nowrap lg:block hidden  text-[15px] font-bold tracking-tight text-[#EDEDEF]">
                        Rhema Chapel Ogbomoso
                    </h1>
                    </h2>
                </div>
                        <p className="font-thin font-damion text-[12px] lg:block hidden text-[#D62839]">Home of the blessed people</p>
            </div>

            <div className="md:hidden flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-[#D62839]">
                <img
                    src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1788384142/rhema-logo.jpg"
                    alt="Rhema Chapel logo"
                    className="h-9 w-9 shrink-0 object-contain rounded-full"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    <Bell size={20} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D62839]" />
                </Button>

                {/* Divider between actions and profile */}
                <span className="mx-1 h-6 w-px bg-[#1C1D22]" />

                {/* User profile */}
                <button className="flex items-center gap-2.5 rounded-md py-1.5 pl-1.5 pr-2 transition-colors hover:bg-[#141518]">
                    {currentUser.profilePicture ? (
                        <img
                            src={currentUser.profilePicture}
                            alt={currentUser.name}
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12183A] text-xs font-semibold text-[#EDEDEF]">
                            {getInitials(currentUser.name)}
                        </div>
                    )}

                    <div className="hidden flex-col items-start sm:flex">
                        <span className="text-sm font-medium leading-tight text-[#EDEDEF]">
                            {currentUser.name}
                        </span>
                        <span className="text-xs leading-tight text-[#8A8C94]">
                            {currentUser.role}
                        </span>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;