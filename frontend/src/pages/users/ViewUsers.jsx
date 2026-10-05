import React, { useEffect, useState } from 'react'
import { Link } from "react-router";
import {
    Search,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { getUsers } from '@/api/users.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// ---- Helpers ----

const ROLE_LABELS = { member: "Member", worker: "Worker", admin: "Admin" };

const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dateString));

const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "";

// ---- Small building blocks ----

const RoleBadge = ({ role }) => (
    <span className="inline-flex w-fit items-center rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-[#C7CEEA]">
        {ROLE_LABELS[role] ?? role}
    </span>
);

const StatusDot = ({ isActive }) => (
    <span className="flex items-center gap-1.5 text-sm text-[#8A8C94]">
        <span
            className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#34D399]" : "bg-[#D62839]"}`}
        />
        {isActive ? "Active" : "Inactive"}
    </span>
);

const Avatar = ({ user }) => (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#12183A]">
        {user.profileImage?.url ? (
            <img src={user.profileImage.url} alt={user.name} className="h-full w-full object-cover" />
        ) : (
            <span className="text-xs font-semibold text-[#EDEDEF]">{getInitials(user.name)}</span>
        )}
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <p className="text-sm text-[#8A8C94]">No users match your filters.</p>
    </div>
);

const ViewUsers = () => {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [role, setRole] = useState("")
    const [sortOrder, setSortOrder] = useState("desc")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const [pagination, setPagination] = useState(null)
    const [users, setUsers] = useState(null)
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

    const params = { search: debouncedSearch, role, sortBy: "createdAt", sortOrder, page, limit }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsFetching(true)
                const { data } = await getUsers(params)
                console.log(data.users);
                
                setUsers(data.users?.users)
                setPagination(data.users?.pagination)
                setError("")
            } catch (err) {
                console.error(err)
                setError("Failed to load users")
            } finally {
                setIsFetching(false)
                setIsInitialLoading(false)
            }
        }
        fetchUsers()
    }, [debouncedSearch, role, sortOrder, page, limit])

    if (isInitialLoading) {
        return <LoadingScreen />
    }

    if (error) {
        return <ErrorPage error={error} />
    }

    const items = users ?? []
    const totalPages = pagination?.totalPages ?? 1

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        setPage(1)
    }

    const handleRoleChange = (value) => {
        setRole(value === "all" ? "" : value)
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
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-[#1C1D22] bg-[#111214] pl-9 text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                />
            </div>

            {/* Role filter */}
            <Tabs value={role || "all"} onValueChange={handleRoleChange}>
                <TabsList className="bg-[#111214] ">
                    <TabsTrigger className='text-white hover:text-grey' value="all">All</TabsTrigger>
                    <TabsTrigger className='text-white hover:text-grey' value="member">Members</TabsTrigger>
                    <TabsTrigger className='text-white hover:text-grey' value="worker">Workers</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-[#1C1D22] bg-[#111214]">
                {items.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-[#1C1D22] hover:bg-transparent">
                                <TableHead className="text-[#8A8C94]">User</TableHead>
                                <TableHead className="text-[#8A8C94]">Email</TableHead>
                                <TableHead className="text-[#8A8C94]">Phone</TableHead>
                                <TableHead className="text-[#8A8C94]">Role</TableHead>
                                <TableHead className="text-[#8A8C94]">Status</TableHead>
                                <TableHead className="text-[#8A8C94]">
                                    <button
                                        onClick={toggleSort}
                                        className="flex items-center gap-1.5 transition-colors hover:text-[#EDEDEF]"
                                    >
                                        Joined
                                        <ArrowUpDown size={13} />
                                    </button>
                                </TableHead>
                                <TableHead className="text-right text-[#8A8C94]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((user) => (
                                <TableRow key={user._id} className="border-[#1C1D22] hover:bg-[#141518]">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar user={user} />
                                            <span className="truncate text-sm font-medium text-[#EDEDEF]">
                                                {user.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-[#8A8C94]">{user.email}</TableCell>
                                    <TableCell className="text-sm text-[#8A8C94]">{user.phone || "—"}</TableCell>
                                    <TableCell><RoleBadge role={user.role} /></TableCell>
                                    <TableCell><StatusDot isActive={user.isActive} /></TableCell>
                                    <TableCell className="text-sm text-[#8A8C94]">
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                                        >
                                            <Link to={user._id}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* Fetching indicator + pagination */}
            <div className="flex items-center justify-between text-sm text-[#8A8C94]">
                <div className="flex items-center gap-2">
                    <p>Page {page} of {totalPages}</p>
                    {isFetching && <Loader2 size={14} className="animate-spin text-[#6E7079]" />}
                </div>
                {items.length > 0 && (
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
                )}
            </div>
        </div>
    )
}

export default ViewUsers