import React, { useEffect, useState } from 'react'
import { Link } from "react-router";
import {
    Search,
    ImageOff,
    PlusCircle,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Mic2,
    Loader2,
} from "lucide-react";
import { getTeachings } from '@/api/teachings.api';
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



// ---- Helpers ----

const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dateString));

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

// ---- Small building blocks ----

const EmptyState = ({ label, to }) => (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1C1D22] py-14 text-center">
        <p className="text-sm text-[#8A8C94]">{label}</p> 
        <Button asChild size="sm" className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]">
            <Link to={to}>
                <div className='flex justify-between items-center gap-2'>
                <PlusCircle size={16} />
                <p>Create a Teaching</p>
                </div>
                
            </Link>
        </Button>
    </div>
);

const TypeBadge = ({ type }) => (
    <span className="inline-flex w-fit items-center rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-[#C7CEEA]">
        {type}
    </span>
);

const TeachingCard = ({ item }) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#1C1D22] bg-[#111214] transition-colors hover:border-[#2A2B31]">
        {/* Image */}
        <div className="relative flex h-[90%] w-full items-center justify-center bg-[#0A0A0C]">
            {item.thumbnail?.url ? (
                <img
                    src={item.thumbnail.url}
                    alt={item.title}
                    className="h-full sm:h-[300px] w-full object-cover"
                />
            ) : (
                <ImageOff size={24} className="text-[#6E7079]" />
            )}
            <span className="absolute left-3 top-3 rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-white">
                {formatDate(item.createdAt)}
            </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
            <div>
                <p className="truncate text-sm font-semibold text-[#EDEDEF]">{item.title}</p>
            </div>

            <div className="space-y-1.5 text-xs text-[#8A8C94]">
                <div className="flex items-center gap-1.5">
                    <Clock size={13} className="shrink-0" />
                    <span>
                        {formatDuration(item.duration)}
                    </span>
                </div>
                {item.preacher && (
                    <div className="flex items-center gap-1.5">
                        <Mic2 size={13} className="shrink-0" />
                        <span className="truncate">{item.preacher}</span>
                    </div>
                )}
            </div>

            <TypeBadge type={item.serviceType} />

            <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-auto w-full border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
            >
                <Link to={`/admin/services/${item._id}`}>Manage</Link>
            </Button>
        </div>
    </div>
);

const Services = () => {

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [serviceType, setServiceType] = useState("")
    const [sortBy, setSortBy] = useState("date")
    const [sortOrder, setSortOrder] = useState("desc")

    const [pagination, setPagination] = useState(null)

    const [ service, setService ] = useState(null)
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

    const params = { search: debouncedSearch, page, limit, serviceType, sortBy, sortOrder }

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsFetching(true)
                const {data} = await getServices(params)

                const {services} = data
                console.log(services.services);
                
                setService(services.services)
                setPagination(services.pagination)
                setError("")

            } catch (error) {
                console.error(error)

                setError('Failed to load Services')
            } finally{
                setIsFetching(false)
                setIsInitialLoading(false)
            }
        }

        fetchServices()
    }, [debouncedSearch, page, limit, serviceType, sortBy, sortOrder])

    // Only block the whole page on the very first load — every filter/page
    // change after that just refetches quietly while existing cards stay visible.
    if (isInitialLoading) {
        return <LoadingScreen/>
    }

    if(error){
        return <ErrorPage error={error}/>
    }

    const handleTypeChange = (value) => {
        setServiceType(value === "all" ? "" : value)
        setPage(1)
    }

    const services = service ?? []
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
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-[#1C1D22] bg-[#111214] pl-9 text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                />
            </div>

            {/* Filter + create — grouped, auto-sized, never stretched */}
            <div className="flex items-center justify-between gap-3">
                <Select value={serviceType || "all"} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-auto min-w-[11rem]  gap-2 border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                        <SelectItem value="all">All types</SelectItem>
                        {SERVICE_TYPES.map((type) => (
                            <SelectItem key={type} value={type} className=''>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    {isFetching && (
                        <Loader2 size={16} className="animate-spin text-[#6E7079]" />
                    )}
                    <Button asChild size="sm" className="w-auto gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]">
                        <Link to="/admin/services/new">
                          <div className='flex justify-between items-center gap-2'>
                                <PlusCircle size={15} />
                                  <p>New Service</p>
                              </div>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Cards */}
            <div
                className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
                    isFetching ? "opacity-60" : "opacity-100"
                }`}
            >
                {services.length > 0 ? (
                    services.map((item) => (
                      <Link
                      key={item._id}
                      to={item._id}
                      >
                      <TeachingCard key={item._id} item={item} />
                      </Link>
                    ))
                ) : (
                    <EmptyState
                        label="No services match your filters."
                        to="/admin/services/new"
                    />
                )}
            </div>

            {/* Pagination */}
            {services.length > 0 && (
                <div className="flex items-center justify-between text-sm text-[#8A8C94]">
                    <p>
                        Page {page} of {totalPages}
                    </p>
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

export default Services