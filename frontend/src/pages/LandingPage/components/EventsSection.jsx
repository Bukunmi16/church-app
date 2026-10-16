import { Link } from "react-router";
import { CalendarDays, Clock, MapPin, Mic2, Lock, ArrowRight } from "lucide-react";
import { getEvents } from "@/api/events.api";
import Container from "./Container";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LandingImage from "./LandingImage";
import AsyncState, { SkeletonGrid } from "./AsyncState";
import { DETAIL_PATHS, ROUTES } from "../Landing.config";
import { useAsyncList } from "../Landing.hooks";
import {
    FOCUS_RING,
    eventDateParts,
    formatDateRange,
    getEventStatus,
    getImageUrl,
    isUpcomingEvent,
} from "../Landing.utils";

// Newest start dates come first, so upcoming events are always inside this window.
// We then keep only events that haven't ended and show the soonest ones.
const fetchUpcomingEvents = async () => {
    const { data } = await getEvents({ page: 1, limit: 24, sortBy: "startDate", sortOrder: "desc" });
    const events = data.events?.events ?? data.events ?? [];
    return events
        .filter(isUpcomingEvent)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 4);
};

const EventCard = ({ event }) => {
    const image = getImageUrl(event.image);
    const { month, day } = eventDateParts(event.startDate);
    const isToday = getEventStatus(event) === "today";
    const time = [event.startTime, event.endTime].filter(Boolean).join(" – ");

    return (
        <Link
            to={ROUTES.login}
            state={{ from: DETAIL_PATHS.event(event._id) }}
            className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1C1D22] bg-[#111214] transition-all duration-300 hover:-translate-y-1 hover:border-[#2A2B31] hover:shadow-[0_20px_40px_-20px_rgba(214,40,57,0.3)] motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <LandingImage
                    src={image}
                    alt={`${event.title} poster`}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-2.5 py-1.5 text-center backdrop-blur-sm">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#D62839]">{month}</p>
                    <p className="text-base font-semibold leading-none text-white">{day}</p>
                </div>
                {isToday && (
                    <span className="absolute right-3 top-3 rounded-full bg-[#D62839] px-2.5 py-1 text-xs font-medium text-white">
                        Happening today
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-base font-semibold text-[#EDEDEF]">{event.title}</h3>

                <div className="space-y-1.5 text-xs text-[#8A8C94]">
                    <p className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="shrink-0" aria-hidden="true" />
                        {formatDateRange(event.startDate, event.endDate)}
                    </p>
                    {time && (
                        <p className="flex items-center gap-1.5">
                            <Clock size={13} className="shrink-0" aria-hidden="true" />
                            {time}
                        </p>
                    )}
                    {event.location && (
                        <p className="flex items-start gap-1.5">
                            <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                            <span className="line-clamp-2">{event.location}</span>
                        </p>
                    )}
                    {event.host && (
                        <p className="flex items-center gap-1.5">
                            <Mic2 size={13} className="shrink-0" aria-hidden="true" />
                            <span className="truncate">Hosted by {event.host}</span>
                        </p>
                    )}
                </div>

                <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-medium text-[#6E7079] transition-colors group-hover:text-[#D62839]">
                    <Lock size={12} aria-hidden="true" />
                    Sign in to view details
                </p>
            </div>
        </Link>
    );
};

const GRID = "sm:grid-cols-2 lg:grid-cols-4";

const EventsSection = () => {
    const { status, data, retry } = useAsyncList(fetchUpcomingEvents);

    return (
        <section
            id="events"
            tabIndex={-1}
            aria-labelledby="events-heading"
            className="scroll-mt-20 py-20 focus:outline-none sm:py-28"
        >
            <Container>
                <Reveal>
                    <SectionHeading
                        id="events-heading"
                        eyebrow="What's coming up"
                        title="Upcoming events"
                        description="Gatherings, conferences and special programs — there's always something happening."
                    />
                </Reveal>

                <div className="mt-12">
                    <AsyncState
                        status={status}
                        onRetry={retry}
                        skeleton={<SkeletonGrid count={4} gridClassName={GRID} />}
                        emptyMessage="No upcoming events right now. Please check back soon."
                        errorMessage="We couldn't load upcoming events. Please try again."
                    >
                        <ul className={`grid grid-cols-1 gap-5 ${GRID}`}>
                            {data.map((event, i) => (
                                <Reveal as="li" key={event._id} delay={i * 80} className="h-full">
                                    <EventCard event={event} />
                                </Reveal>
                            ))}
                        </ul>
                    </AsyncState>
                </div>

                {status === "success" && (
                    <div className="mt-8 text-center">
                        <Link
                            to={ROUTES.login}
                            className={`inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#EDEDEF] transition-all hover:gap-3 hover:text-[#D62839] ${FOCUS_RING}`}
                        >
                            Sign in to see all events
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default EventsSection;