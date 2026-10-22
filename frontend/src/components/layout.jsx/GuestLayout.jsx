import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ArrowRight, Globe, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChurchInfoStore } from "@/stores/church-info.store";
import useAuthStore from "@/stores/auth.store";

// Pages guests are allowed to browse. Each `to` must be registered as a child route of this layout.
const GUEST_NAV = [
    { label: "Home", to: "/", end: true },
    { label: "Teachings", to: "/view-teachings" },
    { label: "Events", to: "/view-events" },
];

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62839] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C]";

// ---- Helpers ----

const dashboardPathFor = (role) =>
    role === "admin" ? "/admin" : role === "worker" ? "/worker" : "/member";

const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;
const mapsUrl = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

// Church details come from the shared church-info store (same one the sidebar uses)
const useChurch = () => {
    const info = useChurchInfoStore((state) => state.churchInfo);
    const fetchChurchInfo = useChurchInfoStore((state) => state.fetchChurchInfo);

    useEffect(() => {
        try {
            Promise.resolve(fetchChurchInfo?.()).catch(() => {});
        } catch {
            /* the layout still renders with the name fallback */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        name: info?.name || "Rhema Chapel Ogbomoso",
        motto: info?.motto,
        logoUrl: info?.logo?.url,
        address: info?.address,
        phone: info?.phone,
        email: info?.email,
        website: info?.website,
    };
};

// ---- Small building blocks ----

const Container = ({ className = "", children }) => (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

// Logo, or the first letter of the name on navy if there's no logo yet
const ChurchMark = ({ church, className = "h-9 w-9" }) =>
    church.logoUrl ? (
        <img src={church.logoUrl} alt="" className={`shrink-0 rounded-full object-contain ${className}`} />
    ) : (
        <span
            aria-hidden="true"
            className={`flex shrink-0 items-center justify-center rounded-full bg-[#12183A] text-sm font-bold text-[#EDEDEF] ${className}`}
        >
            {church.name?.[0] ?? "R"}
        </span>
    );

// Login + Register for guests, or a dashboard shortcut if someone signed-in lands here
const AuthActions = ({ user, onNavigate, stacked = false }) => {
    if (user) {
        return (
            <Button asChild size="sm" className="bg-[#D62839] text-white hover:bg-[#B91F2E]">
                <Link to={dashboardPathFor(user.role)} onClick={onNavigate}>
                    Go to dashboard
                </Link>
            </Button>
        );
    }

    return (
        <div className={stacked ? "grid grid-cols-2 gap-3" : "flex items-center gap-2"}>
            <Button
                asChild
                variant={stacked ? "outline" : "ghost"}
                size={stacked ? "default" : "sm"}
                className={
                    stacked
                        ? "border-[#2A2B31] bg-transparent text-white hover:bg-white/10 hover:text-white"
                        : "text-[#EDEDEF] hover:bg-white/10 hover:text-white"
                }
            >
                <Link to="/login" onClick={onNavigate}>Login</Link>
            </Button>
            <Button
                asChild
                size={stacked ? "default" : "sm"}
                className="bg-[#D62839] text-white hover:bg-[#B91F2E]"
            >
                <Link to="/register" onClick={onNavigate}>Register</Link>
            </Button>
        </div>
    );
};

const GuestHeader = ({ church, user }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    return (
        <header className="sticky top-0 z-40 border-b border-[#1C1D22] bg-[#0A0A0C]/90 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between">
                <Link
                    to="/"
                    aria-label={`${church.name} home`}
                    className={`flex items-center gap-2.5 rounded-md ${FOCUS_RING}`}
                >
                    <ChurchMark church={church} />
                    <span className="max-w-[11rem] truncate text-sm font-semibold tracking-tight text-white sm:max-w-none">
                        {church.name}
                    </span>
                </Link>

                {/* Desktop */}
                <nav aria-label="Primary" className="hidden lg:block">
                    <ul className="flex items-center gap-8">
                        {GUEST_NAV.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `relative flex h-16 items-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D62839] ${
                                            isActive ? "text-white" : "text-[#A5A7AF] hover:text-white"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {item.label}
                                            <span
                                                aria-hidden="true"
                                                className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#D62839] transition-opacity ${
                                                    isActive ? "opacity-100" : "opacity-0"
                                                }`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="hidden lg:block">
                    <AuthActions user={user} />
                </div>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-controls="guest-mobile-menu"
                    aria-label={open ? "Close menu" : "Open menu"}
                    className={`flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden ${FOCUS_RING}`}
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </Container>

            {open && (
                <div
                    id="guest-mobile-menu"
                    className="animate-in fade-in slide-in-from-top-2 border-t border-[#1C1D22] bg-[#0A0A0C] duration-200 lg:hidden"
                >
                    <Container className="space-y-4 py-5">
                        <nav aria-label="Mobile">
                            <ul className="space-y-1">
                                {GUEST_NAV.map((item) => (
                                    <li key={item.to}>
                                        <NavLink
                                            to={item.to}
                                            end={item.end}
                                            onClick={() => setOpen(false)}
                                            className={({ isActive }) =>
                                                `block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-white/5 ${FOCUS_RING} ${
                                                    isActive ? "bg-white/5 text-white" : "text-[#A5A7AF]"
                                                }`
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="border-t border-[#1C1D22] pt-4">
                            <AuthActions user={user} stacked onNavigate={() => setOpen(false)} />
                        </div>
                    </Container>
                </div>
            )}
        </header>
    );
};

// Call to action shown above the footer for guests
const GuestCta = ({ church }) => (
    <section aria-labelledby="guest-cta-heading" className="py-14 sm:py-20">
        <Container>
            <div className="relative overflow-hidden rounded-3xl border border-[#1C1D22] bg-[linear-gradient(135deg,#12183A_0%,#0D0E11_70%)] px-6 py-12 text-center sm:px-12 sm:py-16">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D62839]/20 blur-3xl"
                />
                <div className="relative mx-auto max-w-2xl">
                    <h2 id="guest-cta-heading" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Be part of the {church.name} family
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-white/75">
                        Create a free account to unlock more of what's happening — or log in if you already have
                        one.
                    </p>

                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className={`gap-2 bg-[#D62839] px-7 text-white hover:bg-[#B91F2E] ${FOCUS_RING}`}
                        >
                            <Link to="/register">
                            <span className="flex items-center gap-2">
                                Create an account
                                <ArrowRight size={16} />
                            </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className={`border-white/25 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
                        >
                            <Link to="/login">Log in</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    </section>
);

const ColumnTitle = ({ children }) => (
    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6E7079]">{children}</h3>
);

const footerLink = `rounded text-sm text-[#8A8C94] transition-colors hover:text-white ${FOCUS_RING}`;

const GuestFooter = ({ church, user }) => (
    <footer className="border-t border-[#1C1D22] bg-[#0A0A0C]">
        <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Brand */}
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2.5">
                    <ChurchMark church={church} className="h-10 w-10" />
                    <span className="text-base font-semibold text-white">{church.name}</span>
                </div>
                {church.motto && <p className="font-fancy text-2xl text-[#8A8C94]">{church.motto}</p>}
            </div>

            {/* Quick links */}
            <nav aria-label="Footer" className="space-y-4">
                <ColumnTitle>Explore</ColumnTitle>
                <ul className="space-y-2.5">
                    {GUEST_NAV.map((item) => (
                        <li key={item.to}>
                            <Link to={item.to} className={footerLink}>{item.label}</Link>
                        </li>
                    ))}
                    {!user && (
                        <>
                            <li><Link to="/login" className={footerLink}>Login</Link></li>
                            <li><Link to="/register" className={footerLink}>Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Contact — each line only appears if the church has set it */}
            <div className="space-y-4">
                <ColumnTitle>Contact</ColumnTitle>
                <ul className="space-y-3 text-sm text-[#8A8C94]">
                    {/* {church.address && (
                        <li className="flex items-start gap-2.5">
                            <MapPin size={15} className="mt-0.5 shrink-0 text-[#D62839]" aria-hidden="true" />
                            <a
                                href={mapsUrl(church.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${footerLink} leading-relaxed`}
                            >
                                {church.address}
                                <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                        </li>
                    )} */}
                    {church.phone && (
                        <li className="flex items-center gap-2.5">
                            <Phone size={15} className="shrink-0 text-[#D62839]" aria-hidden="true" />
                            <a href={telHref(church.phone)} className={footerLink}>{church.phone}</a>
                        </li>
                    )}
                    {church.email && (
                        <li className="flex items-center gap-2.5">
                            <Mail size={15} className="shrink-0 text-[#D62839]" aria-hidden="true" />
                            <a href={`mailto:${church.email}`} className={`${footerLink} break-all`}>
                                {church.email}
                            </a>
                        </li>
                    )}
                    {church.website && (
                        <li className="flex items-center gap-2.5">
                            <Globe size={15} className="shrink-0 text-[#D62839]" aria-hidden="true" />
                            <a
                                href={normalizeUrl(church.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${footerLink} break-all`}
                            >
                                {church.website}
                                <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </Container>

        <div className="border-t border-[#1C1D22]">
            <Container className="py-5 text-center text-xs text-[#6E7079]">
                © {new Date().getFullYear()} {church.name}. All rights reserved.
            </Container>
        </div>
    </footer>
);

const GuestLayout = () => {
    const church = useChurch();
    const user = useAuthStore((state) => state.user);
    const { pathname } = useLocation();

    // Each guest page starts at the top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex min-h-screen flex-col bg-[#0A0A0C] text-[#EDEDEF] antialiased">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#D62839] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
            >
                Skip to main content
            </a>

            <GuestHeader church={church} user={user} />

            <main id="main-content" className="flex-1">
                <Container className="py-8">
                    <Outlet />
                </Container>
            </main>

            {!user && <GuestCta church={church} />}

            <GuestFooter church={church} user={user} />
        </div>
    );
};

export default GuestLayout;