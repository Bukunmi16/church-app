import { ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/auth.store";

const Unauthorized = () => {
    
    const user = useAuthStore((state) => state.user) 
    const navigate = useNavigate();


    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#0A0A0C] px-6 text-center">
            {/* Icon with a soft red glow behind it */}
            <div className="relative flex items-center justify-center">
                <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-[#D62839]/10 blur-2xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#1C1D22] bg-[#111214]">
                    <ShieldAlert size={28} className="text-[#D62839]" strokeWidth={1.75} />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-[#EDEDEF]">
                    Access Restricted
                </h1>
                <p className="max-w-sm text-sm text-[#8A8C94]">
                    You don't have permission to view this page. If you think this is a mistake, reach out to an administrator.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    Go back
                </Button>
                <Button asChild className="bg-[#D62839] text-white hover:bg-[#B91F2E]">
                    <Link to={`/${user.role}`}>Return to dashboard</Link>
                </Button>
            </div>
        </div>
    );
};

export default Unauthorized;