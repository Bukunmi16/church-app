import React, { useEffect, useState } from 'react'
import { Link } from "react-router";
import {
    Search,
    ImageOff,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Loader2,
} from "lucide-react";
import { getEvents } from '@/api/events.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTime, formatDate, getEventStatus } from '@/utils';
import useAuthStore from '@/stores/auth.store';

// ---- Helpers ----



// Correctly compares calendar days, not Date object references
// (the original `new Date(x) === new Date(y)` check was always false)


// ---- Small building blocks ----

const EmptyState = ({ label, to }) => (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1C1D22] py-14 text-center">
        <p className="text-sm text-[#8A8C94]">{label}</p>
        <Button asChild size="sm" className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]">
            <Link to={to}>
                <div className='flex justify-between items-center gap-2'>
                  <PlusCircle size={16} />
                      <p>Create an event</p>
                      </div>
            </Link>
        </Button>
    </div>
);

const StatusCapsule = ({ status }) => {
    if (status === "past") return null;
    return (
        <span className="absolute right-3 top-3 rounded-full bg-[#D62839] px-2.5 py-1 text-xs font-medium text-white">
            {status === "today" ? "Today" : "Upcoming"}
        </span>
    );
};

const EventCard = ({ item }) => {
    const status = getEventStatus(item);

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#1C1D22] bg-[#111214] transition-colors hover:border-[#2A2B31]">
            {/* Image */}
            <div className="relative flex h-[350px] w-full items-center justify-center bg-[#0A0A0C]">
            
                  <img src={item.image.url ? item.image.url : 'https://res.cloudinary.com/jkjwwa8p/image/upload/v1789514114/rhema-logo-transparent.png'} alt={item.title} className="h-full w-full object-cover" />
                
                <StatusCapsule status={status} />
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <p className="truncate text-sm font-semibold text-[#EDEDEF]">{item.title}</p>
                    {item.host && (
                        <p className="truncate text-xs text-[#8A8C94]">{item.host}</p>
                    )}
                </div>

                <div className="space-y-1.5 text-xs text-[#8A8C94]">
                    <div className="flex items-center gap-1.5">
                        <Clock size={13} className="shrink-0" />
                        <span>
                            {formatDate(item.startDate)} &middot; {formatTime(item.startTime)} – {formatTime(item.endTime)}
                        </span>
                    </div>
                    {item.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="shrink-0" />
                            <span className="truncate">{item.location}</span>
                        </div>
                    )}
                </div>

                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    <Link to={`/admin/events/${item._id}`}>View</Link>
                </Button>
            </div>
        </div>
    );
};

const Event = () => {
    const user = useAuthStore((state) => state.user)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [sortBy, setSortBy] = useState("startDate")
    const [sortOrder, setSortOrder] = useState("desc")

    const [pagination, setPagination] = useState(null)

    const [ events, setEvents ] = useState(null)
    const [ isInitialLoading, setIsInitialLoading ] = useState(true)
    const [ isFetching, setIsFetching ] = useState(true)
    const [ error, setError ] = useState("")

    // Debounce search input so we don't fire a request on every keystroke
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => clearTimeout(timeout)
    }, [search])

    const params = { search: debouncedSearch, page, limit, sortBy, sortOrder }

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsFetching(true)
                const {data} = await getEvents(params)
              console.log(data) 
                setEvents(data.events.events)
                setPagination(data.events.pagination)
                setError("")

            } catch (error) {
                console.error(error)
                setError('Failed to load Events')
            } finally{
                setIsFetching(false)
                setIsInitialLoading(false)
            }
        }

        fetchEvents()
    }, [debouncedSearch, page, limit, sortBy, sortOrder])

    if (isInitialLoading) {
        return <LoadingScreen/>
    }

    if(error){
        return <ErrorPage error={error}/>
    }

    const items = events ?? []
    const totalPages = pagination?.totalPages ?? 1

    return (
        <div className="space-y-4">
            {/* Search — own row, full width */}
            <div className="relative w-full">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7079]"
                />
                <Input
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-[#1C1D22] bg-[#111214] pl-9 text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                />
            </div>

            {/* Create — auto-sized, never stretched */}
            <div className="flex items-center justify-end gap-3">
                {isFetching && (
                    <Loader2 size={16} className="animate-spin text-[#6E7079]" />
                )}
                {user.role === 'admin' && 
                    <Button asChild size="sm" className="w-auto gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]">
                    <Link to="/admin/events/new">
                      <div className='flex justify-between items-center gap-2'>
                        <PlusCircle size={15} />
                        <span className='hidden sm:block'>New Event</span>
                            
                          </div>
                    </Link>
                </Button>}
            </div>

            {/* Cards */}
            <div
                className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-4 ${
                    isFetching ? "opacity-60" : "opacity-100"
                }`}
            >
                {items.length > 0 ? (
                    items.map((item) =>(
                      <Link to={item._id}>
                      <EventCard key={item._id} item={item} />
                      </Link>
                    )) 
                ) : (
                    <EmptyState
                        label="No events match your search."
                        to="/admin/events/new"
                    />
                )}
            </div>

            {/* Pagination */}
            {items.length > 0 && search.length === 0 && (
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
    )
}

export default Event