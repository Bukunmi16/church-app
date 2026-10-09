import React, { useEffect, useState } from 'react'
import { Link } from "react-router";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    CheckCheck,
    BookOpen,
    CalendarDays,
    Calendar,
    Users,
    UserPlus,
    Layers,
    Bell,
    Trash2,
} from "lucide-react";
import { getNotifications, countNotifications, readAllNotifications, deleteManyNotifications } from '@/api/notification.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import LoadingOverlay from '@/components/layout.jsx/LoadingOverlay';
import { useNotificationStore } from '@/stores/notifications.store';
import { toast } from 'sonner';

// ---- Helpers ----

const TYPE_ICONS = {
    teaching: BookOpen,
    service: CalendarDays,
    event: Calendar,
    department: Users,
    user: UserPlus,
    teachingSeries: Layers,
};

const formatRelativeTime = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateString));
};

const Notifications = () => {
    const [filter, setFilter] = useState("all"); // "all" | "unread"
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    const [notifications, setNotifications] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(true);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [error, setError] = useState("");

    // Bulk selection — scoped to whatever's currently on screen, reset on page/filter change
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isDeletingSelected, setIsDeletingSelected] = useState(false);

    const fetchUnreadNotifications = useNotificationStore((state) => state.fetchUnreadCount);
    

    const fetchData = async () => {
        try {
            setIsFetching(true);
            const params = {
                 page,
                limit,
                ...(filter === "unread" ? { isRead: false } : {}),
            };

            const {data: listData} = await getNotifications(params);
            const {data: countData} = await countNotifications();
            
            fetchUnreadNotifications(); // Update global unread count in the store
            setNotifications(listData.notifications?.notifications ?? listData.notifications ?? []);
            setPagination(listData.notifications?.pagination);
            setUnreadCount(countData.count ?? countData.unreadCount ?? 0);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load notifications");
        } finally {
            setIsFetching(false);
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, page, limit]);

    // Selection is page-scoped — clear it whenever the visible set changes
    useEffect(() => {
        setSelectedIds(new Set());
    }, [filter, page]);

    const handleMarkAllRead = async () => {
        try {
            setIsMarkingAll(true);
            await readAllNotifications();
            await fetchData();
        toast.success('Marked All as Read', {
          description: 'All notifications have been marked as read.',
          position: 'top-center',
          style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #008000",
            }        
        });
        } catch (err) {
            console.error(err);
            setError("Failed to mark all as read.");
        toast.error('Failed to Mark All as Read', {
          description: 'Failed to mark all notifications as read.',
          position: 'top-center',
          style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #008000",
            }        
        });            
        } finally {
            setIsMarkingAll(false);
        }
    };

    const toggleOne = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const items = notifications;
    const allOnPageSelected = items?.length > 0 && items.every((item) => selectedIds.has(item._id));
    const someOnPageSelected = items?.some((item) => selectedIds.has(item._id)) && !allOnPageSelected;

    const toggleSelectAllOnPage = () => {
        if (allOnPageSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map((item) => item._id)));
        }
    };

    const handleDeleteSelected = async () => {
        try {
            setIsDeletingSelected(true);
            console.log(Array.from(selectedIds));
            
            await deleteManyNotifications(Array.from(selectedIds));
            setSelectedIds(new Set());
            await fetchData();
        toast.success(`Deleted ${selectedIds.size} Notification(s)`, {
          description: 'Selected notifications have been deleted.',
          position: 'top-center',
          style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #008000",
            }        
        });

        } catch (err) {
            console.error(err);
            setError("Failed to delete selected notifications.");
        toast.error('Failed to Delete Notifications', {
            description: `Failed to delete notifications. Please try again.`,
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }        
        });
          } finally {
            setIsDeletingSelected(false);
        }
    };

    if (isInitialLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    const totalPages = pagination?.totalPages;
    
    const isLoading = isFetching || isMarkingAll || isInitialLoading; ;

    return (
      <LoadingOverlay isLoading={isLoading} >
        <div className="space-y-4">
            {/* Filter + bulk actions + mark all as read */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Tabs value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
                    <TabsList className="bg-[#111214]">
                        <TabsTrigger className='text-white hover:text-grey' value="all">All</TabsTrigger>
                        <TabsTrigger className='text-white hover:text-grey' value="unread">
                            Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    {isFetching && <Loader2 size={16} className="animate-spin text-[#6E7079]" />}

                    {selectedIds.size > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isDeletingSelected}
                                    className="gap-1.5 border-[#1C1D22] bg-transparent text-[#D62839] hover:bg-[#D62839]/10 hover:text-[#D62839]"
                                >
                                    <Trash2 size={14} />
                                    Delete selected ({selectedIds.size})
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete {selectedIds.size} notification{selectedIds.size === 1 ? "" : "s"}?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-[#8A8C94]">
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteSelected}
                                        disabled={isDeletingSelected}
                                        className="gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                                    >
                                        {isDeletingSelected && <Loader2 size={14} className="animate-spin" />}
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllRead}
                        disabled={isMarkingAll || unreadCount === 0}
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF] disabled:opacity-40"
                    >
                        {isMarkingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
                        Mark all as read
                    </Button>
                </div>
            </div>

            {/* Select-all row + page-scope hint */}
            {items?.length > 0 && (
                <div className="flex items-center gap-2 px-1 text-xs text-[#6E7079]">
                    <Checkbox
                        checked={allOnPageSelected ? true : someOnPageSelected ? "indeterminate" : false}
                        onCheckedChange={toggleSelectAllOnPage}
                        className="border-[#1C1D22] data-[state=checked]:bg-[#D62839] data-[state=checked]:border-[#D62839]"
                    />
                    <span>
                        {selectedIds.size > 0
                            ? `${selectedIds.size} selected on this page`
                            : "Select all on this page"}
                        {" · "}
                        Selecting "all" only selects notifications currently shown, not your entire inbox.
                    </span>
                </div>
            )}

            {/* Table */}
            <div className="table-scroll overflow-hidden rounded-xl border border-[#1C1D22] bg-[#111214]">
                {items.length > 0 ? (
                    <Table className="table-fixed">
                        <TableBody>
                            {items.map((item) => {
                                const Icon = TYPE_ICONS[item.type] ?? Bell;
                                const unread = !item.isRead;
                                const isSelected = selectedIds.has(item._id);
                                return (
                                    <TableRow
                                        key={item._id}
                                        className={`border-[#1C1D22] hover:bg-[#141518] ${isSelected ? "bg-[#141518]" : ""}`}
                                    >
                                        <TableCell className="w-5 sm:10">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleOne(item._id)}
                                                className="border-[#1C1D22] data-[state=checked]:bg-[#D62839] data-[state=checked]:border-[#D62839]"
                                            />
                                        </TableCell>
                                        <TableCell className="w-5 sm:w-10">
                                            <span
                                                className={`block h-2 w-2 rounded-full ${
                                                    unread ? "bg-[#D62839]" : "bg-transparent"
                                                }`}
                                            />
                                        </TableCell>
                                        <TableCell className="w-10">
                                            <Icon size={16} className="text-[#8A8C94]" />
                                        </TableCell>
                                        <TableCell className="min-w-0">
                                            <Link className="block min-w-0" to={`/notifications/${item._id}`}>
                                                <p
                                                    className={`truncate text-sm ${
                                                        unread ? "font-semibold text-[#EDEDEF]" : "font-normal text-[#8A8C94]"
                                                    }`}
                                                >
                                                    {item.title}
                                                </p>
                                                <p
                                                    className={`truncate line-clamp-2 whitespace-normal leading-snug text-xs ${
                                                        unread ? "text-[#C7CEEA]" : "text-[#6E7079]"
                                                    }`}
                                                >
                                                    {item.message}
                                                </p>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="w-10 sm:w-24 whitespace-nowrap text-right text-xs text-[#6E7079]">
                                            {formatRelativeTime(item.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                        <p className="text-sm text-[#8A8C94]">
                            {filter === "unread" ? "No unread notifications." : "No notifications yet."}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {items.length > 0 && (
                <div className="flex items-center justify-between text-sm text-[#8A8C94]">
                    <p>Page {page} of {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF] disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF] disabled:opacity-40"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
        </LoadingOverlay>
    );
};

export default Notifications;