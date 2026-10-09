import React, { useEffect, useState } from 'react'
import { Link } from "react-router";
import {
    Search,
    ImageOff,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Users as UsersIcon,
} from "lucide-react";
import { getDepartments } from '@/api/departments.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from '@/stores/auth.store';

// ---- Helpers ----

const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "";

// ---- Small building blocks ----

const EmptyState = ({ label, to }) => (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1C1D22] py-14 text-center">
        <p className="text-sm text-[#8A8C94]">{label}</p>
        <Button asChild size="sm" className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]">
            <Link to={to}>
                <PlusCircle size={16} />
                Create a department
            </Link>
        </Button>
    </div>
);

const DepartmentCard = ({ item }) => {
    const workerCount = (item.workers?.length ?? 0);

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#1C1D22] bg-[#111214] transition-colors hover:border-[#2A2B31]">
            <div className="relative flex h-[200px]  w-full items-center justify-center bg-[#0A0A0C]">
                {item.image?.url ? (
                    <img src={item.image.url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                    <ImageOff size={22} className="text-[#6E7079]" />
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <p className="truncate text-lg   font-bold text-[#EDEDEF]">{item.name}</p>
                    {/* <p className="line-clamp-2 text-xs text-[#8A8C94]">{item.description}</p> */}
                </div>

                <div className="flex items-center justify-between text-xs text-[#8A8C94]">
                    {item.leader ? (
                        <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 p-3 items-center justify-center rounded-full bg-[#12183A] text-[10px] font-semibold text-[#EDEDEF]">
                                {getInitials(item.leader.name)}
                            </div>
                            <span className="truncate">HOD {item.leader.name}</span>
                        </div>
                    ) : (
                        <span className="text-[#6E7079]">No leader assigned</span>
                    )}
                    <div className="flex items-center gap-1 text-white  shrink-0">
                        <UsersIcon size={12} />
                        <div className='text-white'>
                        {workerCount}

                        </div>
                    </div>
                </div>

                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    <Link to={`/admin/departments/${item._id}`}>Manage</Link>
                </Button>
            </div>
        </div>
    );
};

const Departments = () => {
    const user = useAuthStore((state) => state.user)


    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(12)

    const [pagination, setPagination] = useState(null)
    const [departments, setDepartments] = useState(null)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => clearTimeout(timeout)
    }, [search])

    const params = { search: debouncedSearch, page, limit }

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setIsFetching(true)
                const { data } = await getDepartments(params)
                console.log(data.departments);
                
                setDepartments(data.departments)
                setPagination(data.departments?.pagination ?? data.pagination ?? null)
                setError("")
            } catch (err) {
                console.error(err)
                setError("Failed to load departments")
            } finally {
                setIsFetching(false)
                setIsInitialLoading(false)
            }
        }
        fetchDepartments()
    }, [debouncedSearch, page, limit])

    if (isInitialLoading) {
        return <LoadingScreen />
    }

    if (error) {
        return <ErrorPage error={error} />
    }

    const items = departments ?? []
    const totalPages = pagination?.totalPages ?? 1

    return (
        <div className="space-y-4">
            <div className="relative w-full">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7079]"
                />
                <Input
                    placeholder="Search departments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-[#1C1D22] bg-[#111214] pl-9 text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                />
            </div>

            <div className="flex items-center justify-end gap-3">
                {isFetching && <Loader2 size={16} className="animate-spin text-[#6E7079]" />}
                {user.role === 'admin' &&
                    <Button asChild size="sm" className="w-auto gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]">
                    <Link to="/admin/departments/new">
                      <div className='flex justify-between items-center gap-2'>
                        <PlusCircle size={15} />
                        New Department
                        </div>
                    </Link>
                </Button>}
            </div>

            <div
                className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
                    isFetching ? "opacity-60" : "opacity-100"
                }`}
            >
                {items.length > 0 ? (
                    items.map((item) => (
                  <Link to={item._id}>
                  <DepartmentCard item={item} />
                   </Link>
                  ))
                ) : (
                    <EmptyState label="No departments match your search." to="/admin/departments/new" />
                )}
            </div>

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

export default Departments