import React, { useEffect, useState } from 'react'
import { Link } from "react-router";
import {
    Search,
    PlusCircle,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ImageOff,
    ListVideo,
} from "lucide-react";
import { getTeachingSeries } from '@/api/teachingSeries.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---- Helpers ----

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// ---- Small building blocks ----

const EmptyState = ({ label, to }) => (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1C1D22] py-14 text-center">
        <p className="text-sm text-[#8A8C94]">{label}</p>
        <Button asChild size="sm" className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]">
            <Link to={to}>
                <PlusCircle size={16} />
                Create a series
            </Link>
        </Button>
    </div>
);

const SeriesCard = ({ item }) => {
    const teachingsCount = item.teachingsCount ?? 0;

    return (
        <div className="relative">
            {/* Subtle stacked edge behind the card — signals "this is a collection" */}
            <div className="absolute inset-x-2 -bottom-1.5 h-full rounded-xl border border-[#1C1D22] bg-[#0D0E11]" />

            <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#1C1D22] bg-[#111214] transition-colors hover:border-[#2A2B31]">
                {/* Image */}
                <div className="relative flex w-full items-center justify-center bg-[#0A0A0C]">
                    {item.thumbnail?.url ? (
                        <img
                            src={item.thumbnail.url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src='https://res.cloudinary.com/jkjwwa8p/image/upload/v1788384142/rhema-logo.jpg'
                            alt=''
                            className="h-[300px] w-full object-cover"
                        />
                    )}

                    {/* Month/year badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-[#C7CEEA]">
                        {MONTH_NAMES[item.month - 1]} {item.year}
                    </span>

                    {/* Teaching count — playlist style */}
                    <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                        <ListVideo size={13} />
                        {item.teachingCount} Teachings
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="truncate text-sm font-semibold text-[#EDEDEF]">{item.title}</p>
                    {item.description && (
                        <p className="line-clamp-2 text-xs text-[#8A8C94]">{item.description}</p>
                    )}

                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mt-auto w-full border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={`/admin/teaching-series/${item._id}`}>View</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const TeachingSeries = () => {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(12)
    const [sortOrder, setSortOrder] = useState("asc")

    const [pagination, setPagination] = useState(null)
    const [series, setSeries] = useState(null)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState("")

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => clearTimeout(timeout)
    }, [search])

    const params = { search: debouncedSearch, page, limit, sortOrder }

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                setIsFetching(true)
                const { data } = await getTeachingSeries(params)

                setSeries(data.series?.teachingSeries ?? data.teachingSeries ?? [])
                setPagination(data.series?.pagination ?? data.pagination ?? null)
                setError("")
            } catch (err) {
                console.error(err)
                setError("Failed to load teaching series")
            } finally {
                setIsFetching(false)
                setIsInitialLoading(false)
            }
        }
        fetchSeries()
    }, [debouncedSearch, page, limit, sortOrder])

    if (isInitialLoading) {
        return <LoadingScreen />
    }

    if (error) {
        return <ErrorPage error={error} />
    }

    const items = series ?? []
    const totalPages = pagination?.totalPages ?? 1

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        setPage(1)
    }

    return (
        <div className="space-y-4">
            {/* Search — own row, full width */}
            <div className="relative w-full">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7079]"
                />
                <Input
                    placeholder="Search series..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-[#1C1D22] bg-[#111214] pl-9 text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                />
            </div>

            {/* Sort + create — grouped, auto-sized */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={toggleSort}
                    className="flex items-center gap-1.5 text-sm text-[#8A8C94] transition-colors hover:text-[#EDEDEF]"
                >
                    <ArrowUpDown size={14} />
                    {sortOrder === "desc" ? "Newest first" : "Oldest first"}
                </button>

                <div className="flex items-center gap-2">
                    {isFetching && (
                        <Loader2 size={16} className="animate-spin text-[#6E7079]" />
                    )}
                    <Button asChild size="sm" className="w-auto gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]">
                        <Link to="/admin/teaching-series/new">
                                <div className='flex justify-between items-center gap-2'>
                                  <PlusCircle size={15} />
                                    <p>
                                        New Series
                                    </p>
                                </div>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Cards */}
            <div
                className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${
                    isFetching ? "opacity-60" : "opacity-100"
                }`}
            >
                {series.length > 0 ? (
                series.map((item) => (
                <Link
                    key={item._id}
                    to={item._id}>
                    <SeriesCard item={item} />
                </Link>
                ))) : (
                    <EmptyState
                        label="No teaching series match your search."
                        to="/admin/teaching-series/new"
                    />
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
    )
}

export default TeachingSeries