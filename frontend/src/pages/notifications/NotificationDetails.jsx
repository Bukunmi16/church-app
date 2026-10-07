import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Trash2, ImageOff, ExternalLink, Loader2 } from "lucide-react";
import { viewNotification, readOneNotification, deleteNotification } from '@/api/notification.api'
import { getOneTeaching } from '@/api/teachings.api'
import { getOneService } from '@/api/services.api'
import { getOneEvent } from '@/api/events.api'
import { getOneTeachingSeries } from '@/api/teachingSeries.api'
import { getOneDepartment } from '@/api/departments.api'
import { getOneUser } from '@/api/users.api'
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
import { formatDateTime, formatDate } from '@/utils'
import { useNotificationStore } from '@/stores/notifications.store';

const getImageUrl = (image) => (typeof image === "string" ? image : image?.url) || null;

// ---- Related-content config: one entry per possible `relatedModel` value.
// Each resource only needs to say how to fetch, unwrap, and normalize itself —
// the actual preview card is one shared component below. ----

const RELATED_CONFIG = {
    Teaching: {
        fetch: getOneTeaching,
        unwrap: (data) => data.teaching,
        normalize: (t) => ({
            title: t.title,
            subtitle: t.preacher,
            image: t.thumbnail?.url,
            path: `/admin/teachings/${t._id}`,
        }),
    },
    Service: {
        fetch: getOneService,
        unwrap: (data) => data.service.service,
        normalize: (s) => ({
            title: s.title,
            subtitle: s.day && s.date ? `${s.day} · ${formatDate(s.date)}` : undefined,
            image: s.serviceImage?.url,
            path: `/admin/services/${s._id}`,
        }),
    },
    Event: {
        fetch: getOneEvent,
        unwrap: (data) => data.event?.event ?? data.event,
        normalize: (e) => ({
            title: e.title,
            subtitle: formatDate(e.startDate),
            image: getImageUrl(e.image),
            path: `/admin/events/${e._id}`,
        }),
    },
    TeachingSeries: {
        fetch: getOneTeachingSeries,
        unwrap: (data) => data.series?.series ?? data.series,
        normalize: (s) => ({
            title: s.title,
            subtitle: `${s.month}/${s.year}`,
            image: s.thumbnail?.url,
            path: `/admin/teaching-series/${s._id}`,
        }),
    },
    Department: {
        fetch: getOneDepartment,
        unwrap: (data) => data.department?.department ?? data.department,
        normalize: (d) => ({
            title: d.name,
            subtitle: d.description,
            image: d.image?.url,
            path: `/admin/departments/${d._id}`,
        }),
    },
    User: {
        fetch: getOneUser,
        unwrap: (data) => data.user?.user ?? data.user,
        normalize: (u) => ({
            title: u.name,
            subtitle: u.email,
            image: u.profileImage?.url,
            path: `/admin/members/${u._id}`,
        }),
    },
};

const RelatedPreview = ({ preview, isLoading, notFound }) => {
  console.log(preview);
    if (isLoading) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-[#1C1D22] bg-[#111214] p-4">
                <Loader2 size={16} className="animate-spin text-[#6E7079]" />
                <span className="text-sm text-[#8A8C94]">Loading related item...</span>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="rounded-xl border border-[#1C1D22] bg-[#111214] p-4">
                <p className="text-sm text-[#6E7079]">
                    This item may have been deleted or is no longer available.
                </p>
            </div>
        );
    }

    if (!preview) return null;

    return (
        <Link
            to={preview.path}
            className="flex items-center gap-3 rounded-xl border border-[#1C1D22] bg-[#111214] p-4 transition-colors hover:border-[#2A2B31]"
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#0A0A0C]">
                {preview.image ? (
                    <img src={preview.image} alt={preview.title} className="h-full w-full object-cover" />
                ) : (
                    <ImageOff size={18} className="text-[#6E7079]" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#EDEDEF]">{preview.title}</p>
                {preview.subtitle && (
                    <p className="truncate text-xs text-[#8A8C94]">{preview.subtitle}</p>
                )}
            </div>
            <ExternalLink size={14} className="shrink-0 text-[#6E7079]" />
        </Link>
    );
};

const NotificationDetails = () => {
    const { notificationId } = useParams();
    const navigate = useNavigate();

    const [notification, setNotification] = useState(null);
    // console.log(notification);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const [relatedPreview, setRelatedPreview] = useState(null);
    const [isLoadingRelated, setIsLoadingRelated] = useState(false);
    const [relatedNotFound, setRelatedNotFound] = useState(false);

    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);
    

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const {data} = await viewNotification(notificationId);
                // console.log(data);
                
                const notif = data.notification;
                setNotification(notif);
                console.log(notif.relatedModel);
                
                // Mark as read right after it's been fetched for viewing —
                // not awaited for the UI, but errors are still logged.
                readOneNotification(notificationId).catch((err) =>
                    console.error("Failed to mark notification as read", err)
                );

                fetchUnreadNotifications(); // Update global unread count in the store

                // Dynamic related-content fetch, keyed off relatedModel
                const config = RELATED_CONFIG[notif.relatedModel];
                // console.log('config:', config);
                if (config && notif.relatedId) {
                    setIsLoadingRelated(true);
                    try {
                        const {data: relatedData} = await config.fetch(notif.relatedId);
                        console.log(relatedData);
                        
                        const unwrapped = config.unwrap(relatedData);
                        if (!unwrapped) throw new Error("Related item not found");
                        setRelatedPreview(config.normalize(unwrapped));
                    } catch (err) {
                        console.error("Failed to load related item", err);
                        setRelatedNotFound(true);
                    } finally {
                        setIsLoadingRelated(false);
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load this notification");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotification();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationId]);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteNotification(notificationId);
            navigate("/admin/notifications");
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            setError("Failed to delete this notification. Please try again.");
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!notification) {
        return <ErrorPage error="This notification could not be found." />;
    }

    return (
        <div className="space-y-6">
            {/* Top bar: back + delete */}
            <div className="flex items-center justify-between">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    <Link to="/admin/notifications">
                        <ArrowLeft size={16} />
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
                            <AlertDialogTitle>Delete this notification?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#8A8C94]">
                                This action cannot be undone.
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
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Notification content */}
            <div className="space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                <div>
                    <h1 className="text-xl font-semibold text-[#EDEDEF]">{notification.title}</h1>
                    <p className="mt-1 text-xs text-[#6E7079]">{formatDateTime(notification.createdAt)}</p>
                </div>

                <p className="border-t border-[#1C1D22] pt-4 text-sm leading-relaxed text-[#8A8C94]">
                    {notification.message}
                </p>
            </div>

            {/* Related content */}
            {(RELATED_CONFIG[notification.relatedModel] && notification.relatedId) && (
                <div>
                    <p className="mb-2 text-md font-medium text-[#6E7079]">Check {notification.relatedModel}</p>
                    <RelatedPreview
                        preview={relatedPreview}
                        isLoading={isLoadingRelated}
                        notFound={relatedNotFound}
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationDetails;