import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Loading placeholder grid; pass the aspect/columns that match the real cards
export const SkeletonGrid = ({ count = 4, aspect = "aspect-[4/5]", gridClassName }) => (
    <ul className={`grid gap-5 ${gridClassName}`} aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
            <li key={i} className="overflow-hidden rounded-2xl border border-[#1C1D22] bg-[#111214]">
                <div className={`${aspect} animate-pulse bg-[#16171B]`} />
                <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-[#16171B]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#16171B]" />
                </div>
            </li>
        ))}
    </ul>
);

// Renders the right state for dynamic content: loading, error, empty, or the content itself
const AsyncState = ({ status, onRetry, skeleton, emptyMessage, errorMessage, children }) => {
    if (status === "loading") {
        return (
            <div aria-busy="true" aria-live="polite">
                <span className="sr-only">Loading…</span>
                {skeleton}
            </div>
        );
    }

    if (status === "error") {
        return (
            <div
                role="alert"
                className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#1C1D22] px-6 py-14 text-center"
            >
                <TriangleAlert size={22} className="text-[#D62839]" aria-hidden="true" />
                <p className="max-w-sm text-sm text-[#8A8C94]">{errorMessage}</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    Try again
                </Button>
            </div>
        );
    }

    if (status === "empty") {
        return (
            <div
                role="status"
                className="rounded-2xl border border-dashed border-[#1C1D22] px-6 py-14 text-center"
            >
                <p className="text-sm text-[#8A8C94]">{emptyMessage}</p>
            </div>
        );
    }

    return children;
};

export default AsyncState;