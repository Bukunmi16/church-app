import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    ImageOff,
    Mic2,
    Loader2,
    PlusCircle,
    Clock10Icon,
    Clock,
} from "lucide-react";
import { getOneTeachingSeries, deleteTeachingSeries } from '@/api/teachingSeries.api'
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
import { formatDuration } from '@/utils';
import { toast } from 'sonner';
import { useNotificationStore } from '@/stores/notifications.store';
import useAuthStore from '@/stores/auth.store';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// ---- Small building blocks ----

const TeachingCard = ({ teaching }) => (
    <Link
        to={`/admin/teachings/${teaching._id}`}
        className="flex flex-col overflow-hidden rounded-xl border border-[#1C1D22] bg-[#111214] transition-colors hover:border-[#2A2B31]"
    >
        <div className="flex  w-full items-center justify-center bg-[#0A0A0C]">
            {teaching.thumbnail?.url ? (
                <img
                    src={teaching.thumbnail.url}
                    alt={teaching.title}
                    className="h-full w-full object-cover"
                />
            ) : (
                <ImageOff size={20} className="text-[#6E7079]" />
            )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
            <p className="truncate text-sm font-medium text-[#EDEDEF]">{teaching.title}</p>
            {teaching.duration && (
                <div className="flex items-center gap-1.5 text-xs text-[#8A8C94]">
                    <Clock size={12} className="shrink-0" />
                    <span className="truncate">{formatDuration(teaching.duration)}</span>
                </div>
            )}
        </div>
    </Link>
);

const TeachingSeriesDetails = () => {
    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);
    const user = useAuthStore((state) => state.user)
    const { seriesId } = useParams();
    const navigate = useNavigate();

    const [series, setSeries] = useState(null);
    const [teachings, setTeachings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUnreadNotifications();
        const fetchSeries = async () => {
            try {
                const {data} = await getOneTeachingSeries(seriesId);
                // console.log(data.series);
                setSeries(data.series.series);
                setTeachings(data.series.teachings ?? []);
            } catch (err) {
                // console.error(err);
                toast.error('Failed to Load Teaching Series', {
                    description: `Failed to load teaching series. Please try again.`,
                    position: 'top-center',
                    style: {
                        background: "#202124",
                        color: "#f5f5f5",
                        border: "1px solid #FF0000",
                    }
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSeries();
    }, [seriesId, fetchUnreadNotifications]);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteTeachingSeries(seriesId);
            toast.success('Teaching Series Deleted', {
                description: `${series.title} has been deleted successfully.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                }
            });
            navigate("/teaching-series");
        } catch (err) {
            // console.error(err);
            setIsDeleting(false);
            toast.error('Failed to Delete Teaching Series', {
                description: `Failed to delete teaching series. Please try again.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                }
            });
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!series) {
        return <ErrorPage error="This series could not be found." />;
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
                          <div className='flex justify-between items-center gap-2'>
                                <ArrowLeft size={16} />
                              </div>                    
                    </Link>
                </Button>
{ user.role === 'admin' &&
                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={`/admin/teaching-series/${seriesId}/edit`}>
                          <div className='flex justify-between items-center gap-2'>
                                <Pencil size={14} />
                        <span className='hidden sm:block'>Edit</span>
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
                        <span className='hidden sm:block'>Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this series?</AlertDialogTitle>
                                <AlertDialogDescription className="text-[#8A8C94]">
                                    This will permanently delete "{series.title}". This action
                                    cannot be undone, and any linked teachings will lose their
                                    reference to this series.
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
                                    Delete series
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>}
            </div>

            {/* Overview: thumbnail and details as separate panels */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                <div className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] lg:h-auto">
                    {series.thumbnail?.url ? (
                        <img
                            src={series.thumbnail.url}
                            alt={series.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageOff size={28} className="text-[#6E7079]" />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-[#12183A] px-3 py-1 text-xs font-medium text-[#C7CEEA]">
                        {MONTH_NAMES[series.month - 1]} {series.year}
                    </span>
                </div>

                <div className="space-y-4 rounded-xl border h-fit border-[#1C1D22] bg-[#111214] p-6">
                    <h1 className="text-xl font-semibold text-[#EDEDEF]">{series.title}</h1>

                    {series.description && (
                        <p className="text-sm leading-relaxed text-[#8A8C94]">
                            {series.description}
                        </p>
                    )}

                    <p className="border-t border-[#1C1D22] pt-4 text-xs text-[#6E7079]">
                        {teachings.length} {teachings.length === 1 ? "teaching" : "teachings"} in this series
                    </p>


            {/* Teachings in this series */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#EDEDEF]">Teachings</h2>
                    {user.role === 'admin' && <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={`/admin/teachings/new?series=${seriesId}`}>
                          <div className='flex justify-between items-center gap-2'>
                            <PlusCircle size={14} />
                                  <p>Add teaching</p>
                              </div>
                        </Link>
                    </Button>}
                </div>

                {teachings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {teachings.map((teaching) => (
                            <TeachingCard key={teaching._id} teaching={teaching} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1C1D22] py-10 text-center">
                        <p className="text-sm text-[#8A8C94]">
                            No teachings in this series yet.
                        </p>
                        { user.role === 'admin' && <Button
                            asChild
                            size="sm"
                            className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                        >
                            <Link to={`/admin/teachings/new?series=${seriesId}`}>
                          <div className='flex justify-between items-center gap-2'>
                                <PlusCircle size={16} />
                                  <p>Add a Teaching</p>
                              </div>
                            </Link>
                        </Button>}
                    </div>
                )}
            </div>
                            </div>
            </div>
        </div>
    );
};

export default TeachingSeriesDetails;