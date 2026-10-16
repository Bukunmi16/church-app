import { useState } from "react";
import { ChevronDown, MapPin, ExternalLink } from "lucide-react";
import Container from "./Container";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LandingImage from "./LandingImage";
import { LANDING_IMAGES, SUNDAY_BREAKDOWN, WEEKLY_SERVICES } from "../Landing.config";
import { FOCUS_RING, mapsUrl } from "../Landing.utils";

const ServiceCard = ({ service }) => {
    const Icon = service.icon;
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-[#1C1D22] bg-[#111214] p-5 transition-colors hover:border-[#2A2B31]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#12183A]">
                <Icon size={22} className="text-[#C7CEEA]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-[#D62839]">{service.day}</p>
                <p className="text-lg font-semibold text-[#EDEDEF]">{service.name}</p>
                <p className="text-sm text-[#8A8C94]">{service.time}</p>
            </div>
        </div>
    );
};

const ServicesSection = ({ church }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <section
            id="services"
            tabIndex={-1}
            aria-labelledby="services-heading"
            className="scroll-mt-20 border-y border-[#1C1D22] bg-[#0D0E11] py-20 focus:outline-none sm:py-28"
        >
            <Container>
                <Reveal>
                    <SectionHeading
                        id="services-heading"
                        eyebrow="Plan your visit"
                        title="Join us for worship"
                        description="Here's when we gather each week. Everyone is welcome."
                    />
                </Reveal>

                <div className="mt-12 grid gap-8 lg:grid-cols-5">
                    <Reveal className="lg:col-span-2">
                        <LandingImage
                            src={LANDING_IMAGES.services}
                            alt=""
                            className="h-72 w-full rounded-2xl border border-[#1C1D22] lg:h-full lg:min-h-[28rem]"
                        />
                    </Reveal>

                    <div className="flex flex-col gap-4 lg:col-span-3">
                        {WEEKLY_SERVICES.map((service, i) => (
                            <Reveal key={service.id} delay={i * 100}>
                                <ServiceCard service={service} />
                            </Reveal>
                        ))}

                        {/* Show more / less */}
                        <Reveal delay={300}>
                            <button
                                type="button"
                                onClick={() => setExpanded((prev) => !prev)}
                                aria-expanded={expanded}
                                aria-controls="sunday-breakdown"
                                className={`flex items-center gap-1.5 rounded-md text-sm font-medium text-[#EDEDEF] transition-colors hover:text-[#D62839] ${FOCUS_RING}`}
                            >
                                {expanded ? "Show Less" : "Show More"}
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 motion-reduce:transition-none ${
                                        expanded ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <div
                                id="sunday-breakdown"
                                aria-hidden={!expanded}
                                className={`grid transition-all duration-300 motion-reduce:transition-none ${
                                    expanded ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="rounded-2xl border border-[#1C1D22] bg-[#111214] p-5">
                                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6E7079]">
                                            Sunday services through the month
                                        </p>
                                        <ul className="space-y-3">
                                            {SUNDAY_BREAKDOWN.map((item) => (
                                                <li key={item.label} className="flex flex-col sm:flex-row sm:gap-3">
                                                    <span className="shrink-0 text-sm font-semibold text-[#EDEDEF] sm:w-48">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-sm text-[#8A8C94]">{item.detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {church.address && (
                            <Reveal delay={400}>
                                <div className="flex items-start gap-3 rounded-2xl border border-[#1C1D22] bg-[#111214] p-5">
                                    <MapPin size={18} className="mt-0.5 shrink-0 text-[#D62839]" aria-hidden="true" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#EDEDEF]">Where to find us</p>
                                        <p className="mt-1 text-sm text-[#8A8C94]">{church.address}</p>
                                        <a
                                            href={mapsUrl('Rhema Chapel, Ogbomoso')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mt-2 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-[#EDEDEF] transition-colors hover:text-[#D62839] ${FOCUS_RING}`}
                                        >
                                            Get directions
                                            <ExternalLink size={13} aria-hidden="true" />
                                            <span className="sr-only">(opens in a new tab)</span>
                                        </a>
                                    </div>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ServicesSection;