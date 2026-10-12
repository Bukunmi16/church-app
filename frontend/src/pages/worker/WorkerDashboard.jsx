import React, { useEffect, useState } from 'react'
import { Link } from "react-router";
import {
    CalendarDays,
    Clock,
    MapPin,
    Mic2,
    ImageOff,
    Bell,
    BookOpen,
    CalendarPlus,
    UserPlus,
    Layers,
    Play,
    Headphones,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { getWorkerDashboard } from '@/api/dashboard.api'
import { getTeachings } from '@/api/teachings.api'
import useAuthStore from '@/stores/auth.store'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

// Single place to change if the member/worker routes live somewhere other than /app

// ---- Helpers ----
import { formatDate, formatRelativeTime } from '@/utils'; 

const getImageUrl = (image) => (typeof image === "string" ? image : image?.url) || null;


const activityIconMap = {
    teaching: BookOpen,
    teachingSeries: Layers,
    event: CalendarPlus,
    member: UserPlus,
    department: Layers,
};

// ---- Small building blocks ----

const SectionCard = ({ title, href, hrefLabel = "View all", children, className = "" }) => (
    <div className={`rounded-xl border border-[#1C1D22] bg-[#111214] p-5 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#EDEDEF]">{title}</h3>
            {href && (
                <Link
                    to={href}
                    className="flex items-center gap-1 text-xs text-[#8A8C94] transition-colors hover:text-[#D62839]"
                >
                    {hrefLabel}
                    <ArrowRight size={13} />
                </Link>
            )}
        </div>
        {children}
    </div>
);

// Read-only empty state: no "create" action for members and workers
const EmptyState = ({ label }) => (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-[#1C1D22] py-10 text-center">
        <p className="text-sm text-[#8A8C94]">{label}</p>
    </div>
);

// ---- Teachings carousel ----

const TeachingSlide = ({ teaching }) => {
    const image = teaching.thumbnail?.url;

    return (
        <Link
            to={`/teachings/${teaching._id}`}
            className="group relative block h-90 w-full overflow-hidden rounded-2xl bg-[#12183A] sm:h-80 lg:h-96"
        >
            {image ? (
                <img
                    src={image}
                    alt={teaching.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={48} className="text-[#2A3470]" />
                </div>
            )}

            {/* Gradient so text stays readable on any image */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,12,0.95),rgba(10,10,12,0.4)_55%,transparent)]" />

            <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 sm:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D62839] px-3 py-1 text-xs font-medium text-white">
                    <Sparkles size={12} />
                    Latest teaching
                </span>

                <h2 className="line-clamp-2 text-xl font-semibold leading-tight text-white sm:text-3xl">
                    {teaching.title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
                    {teaching.preacher && (
                        <span className="flex items-center gap-1.5">
                            <Mic2 size={14} />
                            {teaching.preacher}
                        </span>
                    )}
                    {teaching.videoUrl && (
                        <span className="flex items-center gap-1.5">
                            <Play size={13} />
                            Video
                        </span>
                    )}
                    {teaching.audioUrl && (
                        <span className="flex items-center gap-1.5">
                            <Headphones size={13} />
                            Audio
                        </span>
                    )}
                </div>

                <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-white transition-all group-hover:gap-2.5">
                    View teaching
                    <ArrowRight size={15} />
                </span>
            </div>
        </Link>
    );
};

const TeachingsCarousel = ({ teachings, isLoading }) => {
    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    
    console.log(api);
    
    // Track which slide is active for the dot indicators
    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => api.off("select", onSelect);
    }, [api]);

    // Gentle autoplay — pauses on hover, and is skipped for people who prefer reduced motion
    useEffect(() => {
        if (!api || paused || teachings.length < 2) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(() => api.scrollNext(), 5000);
        return () => clearInterval(id);
    }, [api, paused, teachings.length]);

    if (isLoading) {
        return <div className="h-64 w-full animate-pulse rounded-2xl bg-[#111214] sm:h-80 lg:h-96" />;
    }

    if (teachings.length === 0) {
        return <EmptyState label="No teachings have been uploaded yet. Check back soon." />;
    }

    const hasMany = teachings.length > 1;

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="space-y-3"
        >
            <Carousel setApi={setApi} opts={{ loop: hasMany }} className="w-full">
                <CarouselContent>
                    {teachings.map((teaching) => (
                        <CarouselItem key={teaching._id}>
                            <TeachingSlide teaching={teaching} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {hasMany && (
                    <>
                        <CarouselPrevious className="left-3 hidden border-white/10 bg-black/50 text-white hover:bg-black/70 hover:text-white sm:inline-flex" />
                        <CarouselNext className="right-3 hidden border-white/10 bg-black/50 text-white hover:bg-black/70 hover:text-white sm:inline-flex" />
                    </>
                )}
            </Carousel>

            {hasMany && (
                <div className="flex items-center justify-center gap-1.5">
                    {teachings.map((teaching, idx) => (
                        <button
                            key={teaching._id}
                            type="button"
                            onClick={() => api?.scrollTo(idx)}
                            aria-label={`Go to teaching ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                                idx === current ? "w-6 bg-[#D62839]" : "w-1.5 bg-[#2A2B31] hover:bg-[#3A3B42]"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ---- Service + events ----

const ServiceCard = ({ service }) => {
    const image = service.serviceImage?.url;

    return (
        <Link
            to={`/services/${service._id}`}
            className="group block overflow-hidden rounded-lg border border-[#1C1D22] bg-[#0A0A0C] transition-colors hover:border-[#2A2B31]"
        >
            {image && (
                <div className="relative  w-full overflow-hidden">
                    <img
                        src={image}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {service.day && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#D62839] px-2.5 py-1 text-xs font-medium text-white">
                            {service.day}
                        </span>
                    )}
                </div>
            )}

            <div className="space-y-2 p-4">
                <div>
                    <h4 className="text-base font-semibold text-[#EDEDEF]">{service.title}</h4>
                    {service.theme && <p className="text-xs text-[#8A8C94]">{service.theme}</p>}
                </div>

                <div className="space-y-1.5 text-xs text-[#8A8C94]">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={13} className="shrink-0" />
                        <span>{formatDate(service.date)}</span>
                    </div>
                    {service.startTime && (
                        <div className="flex items-center gap-2">
                            <Clock size={13} className="shrink-0" />
                            <span>
                                {service.startTime}
                                {service.endTime ? ` – ${service.endTime}` : ""}
                            </span>
                        </div>
                    )}
                    {service.location && (
                        <div className="flex items-start gap-2">
                            <MapPin size={13} className="mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{service.location}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

const EventCard = ({ event }) => {
    const image = getImageUrl(event.image);
    const start = event.startDate ? new Date(event.startDate) : null;

    return (
        <Link
            to={`/events/${event._id}`}
            className="group block overflow-hidden rounded-lg border border-[#1C1D22] bg-[#0A0A0C] transition-colors hover:border-[#2A2B31]"
        >
            <div className="relative  aspect-[4/5] w-full overflow-hidden bg-[#111214]">
                {image ? (
                    <img
                        src={image}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageOff size={22} className="text-[#6E7079]" />
                    </div>
                )}

                {start && (
                    <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-2.5 py-1.5 text-center backdrop-blur-sm">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#D62839]">
                            {new Intl.DateTimeFormat("en-US", { month: "short" }).format(start)}
                        </p>
                        <p className="text-base font-semibold leading-none text-white">{start.getDate()}</p>
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-4">
                <p className="truncate text-sm font-medium text-[#EDEDEF]">{event.title}</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A8C94]">
                    <CalendarDays size={13} />
                    <span>{formatDate(event.startDate)}</span>
                </div>
            </div>
        </Link>
    );
};

// ---- Main dashboard ----

const UserDashboard = () => {
    const currentUser = useAuthStore((state) => state.user);

    const [dashboard, setDashboard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Teachings load separately so a slow carousel never blocks the rest of the page
    const [teachings, setTeachings] = useState([]);
    const [isLoadingTeachings, setIsLoadingTeachings] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const {data} = await getWorkerDashboard();
                
                setDashboard(data.dashboard);
            } catch (err) {
                console.error(err);
                setError("Failed to load your dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    useEffect(() => {
        const fetchTeachings = async () => {
            try {
                const { data } = await getTeachings({
                    page: 1,
                    limit: 6,
                    sortBy: "date",
                    sortOrder: "desc",
                });
                setTeachings(data.teachings?.teachings ?? data.teachings ?? []);
            } catch (err) {
                console.error("Failed to load recent teachings", err);
                setTeachings([]);
            } finally {
                setIsLoadingTeachings(false);
            }
        };
        fetchTeachings();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    const { upcomingEvents = [], upcomingService, recentActivity = [] } = dashboard ?? {};
    const firstName = currentUser?.name?.split(" ")[0];
    const unreadActivity = recentActivity.filter((activity) => activity.isRead === false);


    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="font-fancy text-2xl text-[#EDEDEF] sm:text-5xl">
                    Welcome back{firstName ? `, ${firstName}` : ""}
                </h1>
                <p className="mt-1 text-sm text-[#8A8C94]">
                    Here's what's happening at church this week.
                </p>
            </div>

            {/* Latest teachings */}
            <TeachingsCarousel teachings={teachings} isLoading={isLoadingTeachings} />

            {/* Upcoming service + events */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <SectionCard title="Upcoming Service" href={`/services`} className="lg:col-span-1">
                    {upcomingService ? (
                        <ServiceCard service={upcomingService} />
                    ) : (
                        <EmptyState label="No upcoming service scheduled yet." />
                    )}
                </SectionCard>

                <SectionCard
                    title="Upcoming Events"
                    href={`/events`}
                    className="h-fit lg:col-span-2"
                >
                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState label="No upcoming events scheduled yet." />
                    )}
                </SectionCard>
            </div>

            {/* Recent notifications */}
            <SectionCard title="Recent Activity" href={`/notifications`}>
                {unreadActivity.length > 0 ? (
                    <div className="space-y-1">
                        {unreadActivity.map((activity) => {
                            const Icon = activityIconMap[activity.type] ?? Bell;
                            const unread = activity.isRead === false;
                            return (
                                <Link
                                    key={activity._id}
                                    to={`/notifications/${activity._id}`}
                                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-[#1C1D22]"
                                >
                                    <span
                                        className={`h-2 w-2 shrink-0 rounded-full ${
                                            unread ? "bg-[#D62839]" : "bg-transparent"
                                        }`}
                                    />
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0C]">
                                        <Icon size={15} className="text-[#8A8C94]" strokeWidth={1.75} />
                                    </div>
                                    <div className="min-w-0">
                                        <p
                                            className={`line-clamp-2 text-sm leading-snug ${
                                                unread ? "font-medium text-[#EDEDEF]" : "text-[#8A8C94]"
                                            }`}
                                        >
                                            {activity.message}
                                        </p>
                                        {activity.createdAt && (
                                            <p className="text-xs text-[#6E7079]">
                                                {formatRelativeTime(activity.createdAt)}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <p className="py-6 text-center text-sm text-[#8A8C94]">You're all caught up</p>
                )}
            </SectionCard>
        </div>
    );
};

export default UserDashboard;