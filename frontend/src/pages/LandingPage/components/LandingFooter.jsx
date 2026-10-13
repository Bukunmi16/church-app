import { Link } from "react-router";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import Container from "./Container";
import ChurchMark from "./ChurchMark";
import { YoutubeIcon, TelegramIcon, FacebookIcon, XIcon, InstagramIcon } from "./BrandIcons";
import { NAV_LINKS, ROUTES, SOCIAL_LINKS, WEEKLY_SERVICES } from "../landing.config";
import { FOCUS_RING, mapsUrl, normalizeUrl, scrollToSection, telHref } from "../landing.utils";

const SOCIAL_ICONS = { youtube: YoutubeIcon, telegram: TelegramIcon };

const ColumnTitle = ({ children }) => (
    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6E7079]">{children}</h3>
);

const linkClass = `rounded text-sm text-[#8A8C94] transition-colors hover:text-white ${FOCUS_RING}`;

const LandingFooter = ({ church }) => {
    const socials = SOCIAL_LINKS.filter((social) => social.url);

    return (
        <footer className="border-t border-[#1C1D22] bg-[#0A0A0C]">
            <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
                {/* Brand */}
                <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2.5">
                        <ChurchMark church={church} className="h-10 w-10" />
                        <span className="text-base font-semibold text-white">{church.name}</span>
                    </div>
                    {church.motto && <p className="font-fancy text-2xl text-[#8A8C94]">{church.motto}</p>}

                        <ul className="flex gap-2 pt-1">
                    {church.facebook && (
                                    <li key={'facebook'}>
                                        <a
                                            href={church.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Facebook (opens in a new tab)`}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#1C1D22] text-[#8A8C94] transition-colors hover:border-[#D62839] hover:text-white ${FOCUS_RING}`}
                                        >
                                            <FacebookIcon/>
                                        </a>
                                    </li>
                    )}
                    {church.telegram && (
                                    <li key={'telegram'}>
                                        <a
                                            href={church.telegram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Telegram (opens in a new tab)`}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#1C1D22] text-[#8A8C94] transition-colors hover:border-[#D62839] hover:text-white ${FOCUS_RING}`}
                                        >
                                            <TelegramIcon/>
                                        </a>
                                    </li>
                    )}
                    {church.youtube && (
                                     <li key={'youtube'}>
                                        <a
                                            href={church.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Youtube (opens in a new tab)`}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#1C1D22] text-[#8A8C94] transition-colors hover:border-[#D62839] hover:text-white ${FOCUS_RING}`}
                                        >
                                        {<YoutubeIcon/>}
                                        </a>
                                    </li>
                    )}
                    {church.x && (
                                     <li key={'x'}>
                                        <a
                                            href={church.x}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`X (opens in a new tab)`}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#1C1D22] text-[#8A8C94] transition-colors hover:border-[#D62839] hover:text-white ${FOCUS_RING}`}
                                        >
                                        {<XIcon/>}
                                        </a>
                                    </li>
                    )}
                    {church.instagram && (
                                     <li key={'instagram'}>
                                        <a
                                            href={church.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Instagram (opens in a new tab)`}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#1C1D22] text-[#8A8C94] transition-colors hover:border-[#D62839] hover:text-white ${FOCUS_RING}`}
                                        >
                                        {<InstagramIcon/>}
                                        </a>
                                    </li>
                    )}
                        </ul>
                </div>

                {/* Navigation */}
                <nav aria-label="Footer" className="space-y-4">
                    <ColumnTitle>Explore</ColumnTitle>
                    <ul className="space-y-2.5">
                        {NAV_LINKS.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(link.id);
                                    }}
                                    className={linkClass}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <Link to={ROUTES.login} className={linkClass}>Login</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.register} className={linkClass}>Create Account</Link>
                        </li>
                    </ul>
                </nav>

                {/* Service times */}
                <div className="space-y-4">
                    <ColumnTitle>Service times</ColumnTitle>
                    <ul className="space-y-2.5 text-sm text-[#8A8C94]">
                        {WEEKLY_SERVICES.map((service) => (
                            <li key={service.id}>
                                <span className="text-[#EDEDEF]">{service.day}</span>
                                <br />
                                {service.time} · {service.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <ColumnTitle>Contact</ColumnTitle>
                    <ul className="space-y-3 text-sm text-[#8A8C94]">
                      
                        {church.phone && (
                            <li className="flex items-center gap-2.5">
                                <Phone size={15} className="shrink-0 text-[#D62839]" aria-hidden="true" />
                                <a href={telHref(church.phone)} className={linkClass}>{church.phone}</a>
                            </li>
                        )}
                        {church.email && (
                            <li className="flex items-center gap-2.5">
                                <Mail size={15} className="shrink-0 text-[#D62839]" aria-hidden="true" />
                                <a href={`mailto:${church.email}`} className={`${linkClass} break-all`}>
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
                                    className={`${linkClass} break-all`}
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
                <Container className="py-6 text-center text-xs text-[#6E7079]">
                    © {new Date().getFullYear()} {church.name}. All rights reserved.
                </Container>
            </div>
        </footer>
    );
};

export default LandingFooter;