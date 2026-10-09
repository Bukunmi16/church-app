import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    ImageOff,
    Mic2,
    Loader2,
    CalendarDays,
    Layers,
    Users,
    User,
    Clock,
} from "lucide-react";
import { getOneTeaching, deleteTeaching } from '@/api/teachings.api'
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
import { useNotificationStore } from '@/stores/notifications.store';
import { toast } from 'sonner';
import { formatDuration } from '@/utils';
import useAuthStore from '@/stores/auth.store';

// ---- Inline brand icons (lucide dropped brand/logo icons in v1) ----

const YoutubeIcon = ({ size = 16, className = "" }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="currentColor"
    >
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12l-6.2 3.5Z" />
    </svg>
);

const TelegramIcon = ({ size = 16, className = "" }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="currentColor"
    >
        <path d="M21.5 3.5 2.8 10.9c-1.2.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.2-.4-1.7-1.4-1.3ZM7.9 13.4l10.6-6.7c.5-.3 1-.1.6.2L9.9 15c-.3.3-.5.5-.6 1l-.2 3-.9-3.4c-.1-.5-.3-1-.3-1.2Z" />
    </svg>
);

// ---- Helpers ----

const formatSeries = (series) => {
    if (!series) return "";
    const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(series.year, series.month - 1)
    );
    return `${monthName} ${series.year}`;
};

const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dateString));

// ---- Small building blocks ----

const LinkPill = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full border border-[#1C1D22] bg-[#0A0A0C] px-3.5 py-2 text-xs font-medium text-[#EDEDEF] transition-colors hover:border-[#2A2B31] hover:bg-[#141518]"
    >
        {icon}
        {label}
    </a>
);

const RelatedCard = ({ to, icon, label, title, subtitle }) => (
    <Link
        to={to}
        className="flex items-start gap-3 rounded-xl border border-[#1C1D22] bg-[#111214] p-4 transition-colors hover:border-[#2A2B31]"
    >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#12183A]">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#EDEDEF]">{title}</p>
            <p className="text-xs text-[#6E7079]">{label}</p>
            {subtitle && <p className="truncate text-xs text-[#8A8C94]">{subtitle}</p>}
        </div>
    </Link>
);

const TeachingDetails = () => {
    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);
    const user = useAuthStore((state) => state.user)

    const { teachingId } = useParams();
    const navigate = useNavigate();

    const [teaching, setTeaching] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    
    useEffect(() => {
        const fetchTeaching = async () => {
            try {
                const {data} = await getOneTeaching(teachingId);
                // console.log(data)
                setTeaching(data.teaching);
            } catch (err) {
                console.error(err);
                setError("Failed to load this teaching");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeaching();
        fetchUnreadNotifications();
    }, [teachingId, fetchUnreadNotifications]);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteTeaching(teachingId);
        toast.success(`You Deleted a Teaching`, {
          description: `${teaching.title} has been deleted.`,
          position: 'top-center',
          style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #008000",
            }        
        });
            navigate("/teachings");
        } catch (err) {
            console.error(err);
        toast.error('Failed to Delete Teaching', {
            description: `Failed to delete teaching. Please try again.`,
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }        
        });
            setIsDeleting(false);
            setError("Failed to delete this teaching. Please try again.");
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!teaching) {
        return <ErrorPage error="This teaching could not be found." />;
    }

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
                    <Link to={-1}>
                      <ArrowLeft size={16} />
                    </Link>
                </Button>

               {user.role === 'admin' &&
                <div className="flex items-center gap-2">
                  <Link to={`/admin/teachings/${teachingId}/edit`}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                        >
                        <Pencil size={14} />
                        <span className='hidden sm:block'>Edit</span>
                    </Button>
                      </Link>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 border-[#1C1D22] bg-transparent text-[#D62839] hover:bg-[#D62839]/10 hover:text-[#D62839]"
                            >
                                <Trash2 size={14} />
                        <span className='hidden sm:block'>Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this teaching?</AlertDialogTitle>
                                <AlertDialogDescription className="text-[#8A8C94]">
                                    This will permanently delete "{teaching.title}" This action
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
                                    Delete teaching
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>}
            </div>

            {/* Overview: thumbnail and details as separate panels */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                {/* Thumbnail — standalone */}
                <div className="relative flex  w-full items-center justify-center overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] lg:h-auto">
                    {teaching.thumbnail?.url ? (
                        <img
                            src={teaching.thumbnail.url}
                            alt={teaching.title}
                            className=" w-full object-cover"
                        />
                    ) : (
                        <ImageOff size={28} className="text-[#6E7079]" />
                    )}
                </div>

                {/* Details — standalone */}
                <div className="space-y-4 h-fit rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                    <div className='flex justify-between'>
                        <span>
                        <h1 className="text-xl font-bold text-[#EDEDEF]">{teaching.title}</h1>
                        {teaching.preacher && (
                            <div className="mt-2 flex items-center gap-1.5 text-sm text-[#8A8C94]">
                                <Mic2 size={15} className="shrink-0" />
                                <span>{teaching.preacher}</span>
                            </div>
                        )}
                        </span>
                        <div className='flex items-center gap-2 cursor-pointer hover:text-white text-sm text-[#8A8C94]'>
                            <Clock size={13}/>
                             {formatDuration(teaching.duration)}
                        </div>
                    </div>

                    {teaching.description && (
                        <p className="border-t border-[#1C1D22] pt-4 text-sm leading-relaxed text-[#8A8C94]">
                            {teaching.description}
                        </p>
                    )}

                    {(teaching.videoUrl || teaching.audioUrl) && (
                        <div className="flex flex-wrap gap-2 border-t border-[#1C1D22] pt-4">
                            {teaching.videoUrl && (
                                <LinkPill
                                    href={teaching.videoUrl}
                                    icon={<YoutubeIcon size={15} className="text-[#D62839]" />}
                                    label="Watch on YouTube"
                                />
                            )}
                            {teaching.audioUrl && (
                                <LinkPill
                                    href={teaching.audioUrl}
                                    icon={<TelegramIcon size={15} className="text-[#4FA6E8]" />}
                                    label="Listen on Telegram"
                                />
                            )}
                        </div>
                    )}

            {/* Related: service, series, department */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-">
                {teaching.service && (
                <div className='flex flex-col gap-2'>
                    <span className='text-[12px] font-bold'>Related Service</span>
                    <RelatedCard
                    to={`/admin/services/${teaching.service._id}`}
                    icon={<CalendarDays size={16} className="text-[#EDEDEF]" />}
                    title={teaching.service.title}
                    label={`${teaching.service.day} Service`}
                    subtitle={
                        teaching.service.day && teaching.service.date
                        ? `${teaching.service.serviceType} · ${formatDate(teaching.service.date)}`
                        : undefined
                    }
                    />
                </div>
                )}
                {teaching.series && (
                <div className='flex flex-col gap-2'>
                <span className='text-[12px] font-bold'>Related Teaching Series</span>
                    <RelatedCard
                    to={`/admin/teaching-series/${teaching.series._id}`}
                    icon={<Layers size={16} className="text-[#EDEDEF]" />}
                    label="Series"
                    title={teaching.series.title}
                    subtitle={formatSeries(teaching.series)}
                    />
                    </div>
                )}

                {teaching.department && user.role === 'admin' && (
                  <RelatedCard
                  to={`/admin/departments/${teaching.department._id}`}
                  icon={<Users size={16} className="text-[#EDEDEF]" />}
                  label="Department"
                  title={teaching.department.name}
                  />
                )}

                
            {/* Created by */}
            {teaching.createdBy && user.role === 'admin' && (
              <div className="flex items-center   gap-3 rounded-xl border border-[#1C1D22] bg-[#111214] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A0A0C]">
                        <User size={16} className="text-[#8A8C94]" />
                    </div>
                    <div>
                        <p className="text-sm text-[#EDEDEF]">
                            Added by <span className="font-medium">{teaching.createdBy.name}</span>
                        </p>
                        {teaching.createdBy.role && (
                          <p className="text-xs capitalize text-[#8A8C94]">
                                {teaching.createdBy.role}
                            </p>
                        )}
                    </div>
                </div>
            )}
            </div>

                </div>


        </div>
            </div>
    );
};

export default TeachingDetails;