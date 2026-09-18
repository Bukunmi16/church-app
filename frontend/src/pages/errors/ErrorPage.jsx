import { AlertTriangle, RotateCw } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const ErrorPage = ({
    error = "An unexpected error occurred. Please try again, or head back to the dashboard.",
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#0A0A0C] px-6 text-center">
            {/* Icon with a soft red glow behind it */}
            <div className="relative flex items-center justify-center">
                <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-[#D62839]/10 blur-2xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#1C1D22] bg-[#111214]">
                    <AlertTriangle size={28} className="text-[#D62839]" strokeWidth={1.75} />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-[#EDEDEF]">Something went wrong</h1>
                <p className="max-w-sm text-sm text-[#8A8C94]">{error}</p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={() => navigate(0)}
                    className="gap-2 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    <RotateCw size={16} />
                    Try again
                </Button>
                <Button asChild className="bg-[#D62839] text-white hover:bg-[#B91F2E]">
                    <Link to="/admin">Return to dashboard</Link>
                </Button>
            </div>
        </div>
    );
};

export default ErrorPage;