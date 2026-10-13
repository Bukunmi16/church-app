import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "./Container";
import ChurchMark from "./ChurchMark";
import { NAV_LINKS, NAV_SECTION_IDS, ROUTES } from "../landing.config";
import { useActiveSection } from "../landing.hooks";
import { FOCUS_RING, scrollToSection } from "../landing.utils";

const NavItems = ({ activeId, onNavigate, className = "", linkClassName = "" }) => (
    <ul className={className}>
        {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
                <li key={link.id}>
                    <a
                        href={`#${link.id}`}
                        onClick={(e) => onNavigate(e, link.id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`${linkClassName} ${FOCUS_RING} ${
                            isActive ? "text-white" : "text-[#A5A7AF] hover:text-white"
                        }`}
                    >
                        {link.label}
                    </a>
                </li>
            );
        })}
    </ul>
);

const LandingNavbar = ({ church }) => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const activeId = useActiveSection(NAV_SECTION_IDS);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    const handleNavigate = (e, id) => {
        e.preventDefault();
        setOpen(false);
        scrollToSection(id);
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled || open
                    ? "border-b border-[#1C1D22] bg-[#0A0A0C]/90 backdrop-blur-md"
                    : "border-b border-transparent bg-transparent"
            }`}
        >
            <Container className="flex h-16 items-center justify-between">
                <a
                    href="#home"
                    onClick={(e) => handleNavigate(e, "home")}
                    className={`flex items-center gap-2.5 rounded-md ${FOCUS_RING}`}
                    aria-label={`${church.name} — back to top`}
                >
                    <ChurchMark church={church} />
                    <span className="max-w-[11rem] truncate text-sm font-semibold tracking-tight text-white sm:max-w-none">
                        {church.name}
                    </span>
                </a>

                {/* Desktop */}
                <nav aria-label="Primary" className="hidden lg:block">
                    <NavItems
                        activeId={activeId}
                        onNavigate={handleNavigate}
                        className="flex items-center gap-8"
                        linkClassName="rounded-md text-sm font-medium transition-colors"
                    />
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-[#EDEDEF] hover:bg-white/10 hover:text-white"
                    >
                        <Link to={ROUTES.login}>Login</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-[#D62839] text-white hover:bg-[#B91F2E]">
                        <Link to={ROUTES.register}>Create Account</Link>
                    </Button>
                </div>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label={open ? "Close menu" : "Open menu"}
                    className={`flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden ${FOCUS_RING}`}
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </Container>

            {/* Mobile menu */}
            {open && (
                <div
                    id="mobile-menu"
                    className="animate-in fade-in slide-in-from-top-2 border-t border-[#1C1D22] bg-[#0A0A0C] duration-200 lg:hidden"
                >
                    <Container className="space-y-4 py-5">
                        <nav aria-label="Mobile">
                            <NavItems
                                activeId={activeId}
                                onNavigate={handleNavigate}
                                className="space-y-1"
                                linkClassName="block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-white/5"
                            />
                        </nav>
                        <div className="grid grid-cols-2 gap-3 border-t border-[#1C1D22] pt-4">
                            <Button
                                asChild
                                variant="outline"
                                className="border-[#2A2B31] bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link to={ROUTES.login} onClick={() => setOpen(false)}>Login</Link>
                            </Button>
                            <Button asChild className="bg-[#D62839] text-white hover:bg-[#B91F2E]">
                                <Link to={ROUTES.register} onClick={() => setOpen(false)}>Create Account</Link>
                            </Button>
                        </div>
                    </Container>
                </div>
            )}
        </header>
    );
};

export default LandingNavbar;