import React from 'react'
import { getAdminDashboard } from "@/api/dashboard.api";
import { useEffect, useState } from "react";
import { NavLink } from 'react-router';
import LoginPage from '../auth/LoginPage';
import ErrorPage from '../errors/ErrorPage';
import LoadingScreen from '@/components/ui/Loading';
import {
    Users,
    HandHeart,
    Layers,
    CalendarDays,
    MapPin,
    ImageOff,
    PlusCircle,
    Bell,
    BookOpen,
    CalendarPlus,
    UserPlus,
    UserRoundGroupIcon,
    User2Icon,
    CirclePileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// ---- Helpers ----

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dateString));
};

const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateString);
};

const activityIconMap = {
    teachingSeries: BookOpen,
    event: CalendarPlus,
    member: UserPlus,
    department: Layers,
};

// ---- Small building blocks ----

const StatCard = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#12183A]">
            <Icon size={20} className="text-[#EDEDEF]" strokeWidth={1.75} />
        </div>
        <div>
            <p className="text-2xl font-semibold text-[#EDEDEF]">{value}</p>
            <p className="text-sm text-[#8A8C94]">{label}</p>
        </div>
    </div>
);

const SectionCard = ({ title, action, children, className = "" }) => (
    <div className={`rounded-xl border border-[#1C1D22] bg-[#111214] p-5 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#EDEDEF]">{title}</h3>
            {action}
        </div>
        {children}
    </div>
);

// Shown whenever a module (upcoming service, events, etc.) has no data yet
const EmptyState = ({ label, to }) => (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#1C1D22] py-10 text-center">
        <p className="text-sm text-[#8A8C94]">{label}</p>
        <Button asChild size="sm" className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]">
            <Link to={to}>
                <PlusCircle size={16} />
                Create one
            </Link>
        </Button>
    </div>
);

const EventCard = ({ event }) => (
    <div className="overflow-hidden rounded-lg border border-[#1C1D22] bg-[#0A0A0C]">
        <div className="relative h-[80%] w-full bg-[#111214]">
            {event.image?.url ? (
                <img
                    src={event.image.url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <ImageOff size={22} className="text-[#6E7079]" />
                </div>
            )}
        </div>
        <div className="p-3">
            <p className="truncate text-sm font-medium text-[#EDEDEF]">{event.title}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A8C94]">
                <CalendarDays size={13} />
                <span>{formatDate(event.startDate)}</span>
            </div>
        </div>
    </div>
);

// ---- Main dashboard ----

const Dashboard = () => {

    const [ dashboard, setDashboard ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState("")

    useEffect(() => {
      const fetchDashboard = async () => {
        try {
          const data = await getAdminDashboard()
          // console.log(data);

          setDashboard(data.dashboard)

        } catch (error) {
          console.error(error)

          setError('Failed to load Dashboard')
        } finally{
          setIsLoading(false)
        }
      }

      fetchDashboard()
    }, [])

    if (isLoading) {
      return <LoadingScreen/>
    }

    if(error){
      return <ErrorPage error={error}/>
    }

    const { stats, upcomingEvents = [], upcomingService, recentActivity = [] } = dashboard ?? {};
    
    return (
        <div className="space-y-6">
            {/* Overview stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Members" value={stats?.members ?? 0} icon={User2Icon} />
                <StatCard label="Active Workers" value={stats?.workers ?? 0} icon={UserRoundGroupIcon} />
                <StatCard label="Departments" value={stats?.departments ?? 0} icon={CirclePileIcon} />
            </div>

            <div className="grid grid-cols-1  gap-4 lg:grid-cols-3">
                {/* Upcoming service */}
                <SectionCard title="Upcoming Service" className="lg:col-span-1">
                    {upcomingService ? (
                        <div className="flex flex-col gap-3">
                            {upcomingService.serviceImage?.url && (
                                <img
                                    src={upcomingService.serviceImage.url}
                                    alt={upcomingService.title}
                                    className=" w-full rounded-lg object-cover"
                                />
                            )}
                            <h4 className="text-lg font-semibold text-[#EDEDEF]">
                                {upcomingService.title}
                            </h4>
                            <div className="space-y-2 text-sm text-[#8A8C94]">
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={16} className="shrink-0" />
                                    <span>{formatDate(upcomingService.date)}</span>
                                </div>
                                {upcomingService.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="shrink-0" />
                                        <span className='text-[10px]'>{upcomingService.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            label="No upcoming service scheduled yet."
                            to="/admin/services/new"
                        />
                    )}
                </SectionCard>

                {/* Upcoming events */}
                
                <SectionCard title="Upcoming Events" className="lg:col-span-2 h-fit">
                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            label="No upcoming events scheduled yet."
                            to="/admin/events/new"
                        />
                    )}
                </SectionCard>
            </div>

            {/* Recent activity / in-app notifications */}
            <SectionCard
                title="Recent Activity"
                action={<Bell size={16} className="text-[#8A8C94]" />}
            >
                {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivity.map((activity) => {
                            const Icon = activityIconMap[activity.type] ?? Bell;
                            console.log(Icon);
                            
                            return (
                                <div key={activity._id} className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0C]">
                                        <Icon size={15} className="text-[#8A8C94]" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <p className="text-sm leading-snug text-[#EDEDEF]">
                                            {activity.message}
                                        </p>
                                        {activity.createdAt && (
                                            <p className="text-xs text-[#6E7079]">
                                                {formatRelativeTime(activity.createdAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="py-6 text-center text-sm text-[#8A8C94]">
                        No recent activity yet.
                    </p>
                )}
            </SectionCard>
        </div>
    );
};

export default Dashboard;