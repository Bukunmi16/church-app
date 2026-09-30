import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    ImageOff,
    Clock,
    MapPin,
    Mic2,
    Users,
    Loader2,
} from "lucide-react";
import { getOneEvent, deleteEvent } from '@/api/events.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ---- Helpers ----

import { formatDate, formatTime } from '@/utils';

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const getEventStatus = (event) => {
    const now = startOfDay(new Date());
    const start = startOfDay(event.startDate);
    const end = startOfDay(event.endDate);
    if (start <= now && now <= end) return "today";
    if (start > now) return "upcoming";
    return "past";
};

const StatusCapsule = ({ status }) => {
    if (status === "past") return null;
    return (
        <span className="absolute right-4 top-4 rounded-full bg-[#D62839] px-3 py-1 text-xs font-medium text-white">
            {status === "today" ? "Today" : "Upcoming"}
        </span>
    );
};

const EventDetails = () => {
    const { eventId } = useParams();
    console.log(eventId);
    
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    console.log(event);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const {data} = await getOneEvent(eventId);
                console.log(data.event);
                
                setEvent(data.event);
            } catch (err) {
                console.error(err);
                setError("Failed to load this event");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteEvent(eventId);
            navigate("/admin/events");
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            setError("Failed to delete this event. Please try again.");
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!event) {
        return <ErrorPage error="This event could not be found." />;
    }

    const status = getEventStatus(event);
    const sameDayEvent = new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString();

    return (
        <div className="space-y-6">
            {/* Top bar: back + actions */}
            <div className="flex items-center justify-between">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    <Link to="/admin/events">
                          <div className='flex justify-between items-center gap-2'>
                            <ArrowLeft size={16} />
                                  <p>Back to Events</p>
                            </div>                    
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={`/admin/events/${eventId}/edit`}>
                          <div className='flex justify-between items-center gap-2'>
                            <Pencil size={14} />
                                  <p>Edit</p>
                              </div>
                        </Link>
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 border-[#1C1D22] bg-transparent text-[#D62839] hover:bg-[#D62839]/10 hover:text-[#D62839]"
                            >
                              
                                <Trash2 size={14} />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                                <AlertDialogDescription className="text-[#8A8C94]">
                                    This will permanently delete "{event.title}". This action
                                    cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                                >
                                    {isDeleting && <Loader2 size={14} className="animate-spin" />}
                                    Delete event
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Overview: image and details as separate panels */}
            <div className="grid  grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                <div className="relative flex  w-full items-center justify-center overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] lg:h-auto">
                    {event.image?.url ? (
                        <img src={event.image.url} alt={event.title} className="h-full w-full object-cover" />
                    ) : (
                        <ImageOff size={28} className="text-[#6E7079]" />
                    )}
                    <StatusCapsule status={status} />
                </div>

                <div className="space-y-4 h-fit  rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                    <h1 className="text-xl font-semibold text-[#EDEDEF]">{event.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#8A8C94]">
                        <div className="flex items-center gap-1.5">
                            <Clock size={15} className="shrink-0" />
                            <span>
                                {sameDayEvent
                                    ? formatDate(event.startDate)
                                    : `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`}
                                {" · "}
                                {formatTime(event.startTime)} – {formatTime(event.endTime)}
                            </span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={15} className="shrink-0" />
                                <span>{event.location}</span>
                            </div>
                        )}
                        {event.host && (
                            <div className="flex items-center gap-1.5">
                                <Mic2 size={15} className="shrink-0" />
                                <span>{event.host}</span>
                            </div>
                        )}
                    </div>

                    {event.description && (
                        <p className="whitespace-pre-line border-t border-[#1C1D22] pt-4 text-sm leading-relaxed text-[#8A8C94]">
                            {event.description}
                        </p>
                    )}

                    {event.guestMinisters?.length > 0 && (
                        <div className="border-t border-[#1C1D22] pt-4">
                            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#6E7079]">
                                <Users size={13} />
                                Guest ministers
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {event.guestMinisters.map((name, idx) => (
                                    <span
                                        key={`${name}-${idx}`}
                                        className="rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-[#C7CEEA]"
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;