import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    ImageOff,
    Pencil as EditIcon,
    X,
    Search,
    Loader2,
    Crown,
    Shield,
    Users as UsersIcon,
} from "lucide-react";
import {
    getOneDepartment,
    deleteDepartment,
    assignLeader,
    assignWorker,
    removeWorker,
    assignAssistant,
    removeAssistant,
} from '@/api/departments.api'
import { getUsers } from '@/api/users.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
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
import { toast } from 'sonner';
import useAuthStore from '@/stores/auth.store';

// ---- Helpers ----

const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "";

// Tailwind can't resolve dynamically interpolated class names like `h-${size}`,
// since it scans source for complete literal strings at build time — so sizes
// are mapped to full, literal class strings instead.
const AVATAR_SIZES = {
    7: "h-7 w-7",
    8: "h-8 w-8",
    9: "h-9 w-9",
};

const UserAvatar = ({ user, size = 9 }) => (
    <div
        className={`flex ${AVATAR_SIZES[size] ?? AVATAR_SIZES[9]} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#12183A]`}
    >
        {user.profileImage?.url ? (
            <img src={user.profileImage.url} alt={user.name} className="h-full w-full object-cover" />
        ) : (
            <span className="text-xs font-semibold text-[#EDEDEF]">{getInitials(user.name)}</span>
        )}
    </div>
);

const UserRow = ({ user, onRemove, isRemoving }) => (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#1C1D22] bg-[#0A0A0C] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
<Link to={`/admin/users/${user._id}`}>
            <UserAvatar user={user} size={8} />
</Link>
            <div className="min-w-0">
                <p className="truncate text-sm text-[#EDEDEF]">{user.name}</p>
                <p className="truncate text-xs text-[#6E7079]">{user.email}</p>
            </div>
        </div>
        {onRemove && (
            <button
                type="button"
                onClick={() => onRemove(user._id)}
                disabled={isRemoving}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#6E7079] transition-colors hover:bg-[#D62839]/10 hover:text-[#D62839] disabled:opacity-50"
                aria-label={`Remove ${user.name}`}
            >
                {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            </button>
        )}
    </div>
);

// Debounced typeahead search for adding a user to a role.
// Excludes anyone already in `excludeIds` from the results.
const UserSearchAdd = ({ excludeIds, onAdd, isAdding }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                setIsSearching(true);
                const { data } = await getUsers({ search: query, limit: 8 });
                const users = data.users?.users ?? data.users ?? [];
                setResults(users.filter((u) => !excludeIds.includes(u._id)));
            } catch (err) {
                console.error("User search failed", err);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 350);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7079]" />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users to add..."
                    className="h-9 w-full rounded-md border border-[#1C1D22] bg-[#0A0A0C] pl-8 pr-3 text-sm text-[#EDEDEF] placeholder:text-[#6E7079] focus:outline-none focus:ring-1 focus:ring-[#D62839]"
                />
                {isSearching && (
                    <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#6E7079]" />
                )}
            </div>

            {results.length > 0 && (
                <div className="max-h-48 space-y-1 overflow-y-auto">
                    {results.map((user) => (
                        <button
                            key={user._id}
                            type="button"
                            onClick={() => onAdd(user)}
                            disabled={isAdding === user._id}
                            className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[#141518] disabled:opacity-50"
                        >
                            <div className="flex min-w-0 items-center gap-2.5">
                                <UserAvatar user={user} size={7} />
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-[#EDEDEF]">{user.name}</p>
                                    <p className="truncate text-xs text-[#6E7079]">{user.email}</p>
                                </div>
                            </div>
                            {isAdding === user._id ? (
                                <Loader2 size={14} className="shrink-0 animate-spin text-[#6E7079]" />
                            ) : (
                                <span className="shrink-0 text-xs text-[#6E7079]">Add</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ---- Members dialog: shared shape for Assistants and Workers (add + remove, applied immediately) ----

const MembersDialog = ({ open, onOpenChange, title, description, members, onAdd, onRemove }) => {
    const [removingId, setRemovingId] = useState(null);
    const [addingId, setAddingId] = useState(null);

    const handleRemove = async (userId) => {
        setRemovingId(userId);
        try {
            await onRemove(userId);
        } finally {
            setRemovingId(null);
        }
    };

    const handleAdd = async (user) => {
        setAddingId(user._id);
        try {
            await onAdd(user);
        } finally {
            setAddingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-[#8A8C94]">{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {members.length > 0 ? (
                        <div className="max-h-56 space-y-2 overflow-y-auto">
                            {members.map((user) => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    onRemove={handleRemove}
                                    isRemoving={removingId === user._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[#6E7079]">No one assigned yet.</p>
                    )}

                    <div className="border-t border-[#1C1D22] pt-4">
                        <UserSearchAdd
                            excludeIds={members.map((m) => m._id)}
                            onAdd={handleAdd}
                            isAdding={addingId}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ---- Leader dialog: single value, select-then-confirm ----

const LeaderDialog = ({ open, onOpenChange, currentLeader, onAssign, isSaving }) => {
    const [pendingUser, setPendingUser] = useState(null);

    useEffect(() => {
        if (!open) setPendingUser(null);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                <DialogHeader>
                    <DialogTitle>Department leader</DialogTitle>
                    <DialogDescription className="text-[#8A8C94]">
                        Search for a user to assign as leader.
                    </DialogDescription>
                </DialogHeader>

                {!pendingUser ? (
                    <div className="space-y-4">
                        {currentLeader && (
                            <div>
                                <p className="mb-2 text-xs font-medium text-[#6E7079]">Current leader</p>
                                <UserRow user={currentLeader} />
                            </div>
                        )}
                        <UserSearchAdd
                            excludeIds={currentLeader ? [currentLeader._id] : []}
                            onAdd={(user) => setPendingUser(user)}
                            isAdding={null}
                        />
                        {currentLeader && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPendingUser({ _id: null, name: "no one" })}
                                className="w-full border-[#1C1D22] bg-transparent text-[#D62839] hover:bg-[#D62839]/10 hover:text-[#D62839]"
                            >
                                Remove current leader
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-[#8A8C94]">
                            {pendingUser._id
                                ? <>Assign <span className="text-[#EDEDEF]">{pendingUser.name}</span> as the new department leader?</>
                                : "Remove the current leader? This department will have no leader until someone new is assigned."}
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPendingUser(null)}
                                className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                            >
                                Back
                            </Button>
                            <Button
                                size="sm"
                                disabled={isSaving}
                                onClick={() => onAssign(pendingUser._id)}
                                className="gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                            >
                                {isSaving && <Loader2 size={14} className="animate-spin" />}
                                Confirm
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

const SectionHeader = ({ icon, title, onEdit, role }) => (
    <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#EDEDEF]">
            {icon}
            {title}
        </div>
    {role === 'admin' &&
        <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
        >
            <EditIcon size={13} />
            Edit
        </Button>}
    </div>
);

const DepartmentDetails = () => {
    const user = useAuthStore((state) => state.user)

    const { departmentId } = useParams();
    const navigate = useNavigate();

    const [department, setDepartment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const [leaderDialogOpen, setLeaderDialogOpen] = useState(false);
    const [assistantsDialogOpen, setAssistantsDialogOpen] = useState(false);
    const [workersDialogOpen, setWorkersDialogOpen] = useState(false);
    const [isSavingLeader, setIsSavingLeader] = useState(false);

    const fetchDepartment = async () => {
        try {
            const {data} = await getOneDepartment(departmentId);
            setDepartment(data.department?.department ?? data.department);
        } catch (err) {
            console.error(err);
            setError("Failed to load this department");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentId]);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteDepartment(departmentId);
            navigate("/admin/departments");
            toast.success('Department Deleted', {
                description: 'The department has been deleted successfully.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                },
            });
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            setError("Failed to delete this department. Please try again.");
            toast.error('Failed to Delete Department', {
                description: 'Failed to delete this department. Please try again.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                },
            });
        }
    };

    const handleAssignLeader = async (userId) => {
        try {
            setIsSavingLeader(true);
            if(userId === null) {
                await assignLeader(departmentId, null);
                await fetchDepartment();
                setLeaderDialogOpen(false);
                toast.success('Leader Removed', {
                    description: 'The department leader has been removed.',
                    position: 'top-center',
                    style: {
                        background: "#202124",
                        color: "#f5f5f5",
                        border: "1px solid #008000",
                    },
                });
            } else {
                const {data} = await assignLeader(departmentId, userId);
                const newLeaderName = data.department.leader?.name;

            await fetchDepartment();
            setLeaderDialogOpen(false);
            toast.success('New Leader Assigned', {
                description: `${newLeaderName} is now the ${department.name} department leader.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                },
            });
        }
        } catch (err) {
            console.error(err);
            toast.error('Failed to Update Leader', {
                description: 'Failed to update the department leader. Please try again.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                },
            });
        } finally {
            setIsSavingLeader(false);
        }
    };

    const handleAddAssistant = async (user) => {
        try {
            await assignAssistant(departmentId, user._id);
            setDepartment((prev) => ({ ...prev, assistants: [...(prev.assistants ?? []), user] }));
            toast.success('Assistant Added', {
                description: `${user.name} has been added as an assistant to the ${department.name} department leadership.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                },
            });
        } catch (error) {
            console.error(error);
            console.log('ERROR', error.response.data.message);
            
            // Likely a 403 if the current admin isn't this department's leader
            toast.error('Failed to Add Assistant', {
                description: `${error.response?.data?.message}` || 'Failed to add assistant. You may need to be this department\'s leader to do that.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                },
            });
        }
    };

    const handleRemoveAssistant = async (userId) => {
        try {
            await removeAssistant(departmentId, userId);
            setDepartment((prev) => ({
                ...prev,
                assistants: (prev.assistants ?? []).filter((u) => u._id !== userId),
            }));
            toast.success('Assistant Removed', {
                description: 'The assistant has been removed successfully.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                },
            });
        } catch (error) {
            console.log('ERROR MESSAGE', error.response?.data?.message);
            toast.error('Failed to Remove Assistant', {
                description: error.response?.data?.message || 'Failed to remove assistant. You may need to be this department\'s leader to do that.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                },
            });
        }
    };

    const handleAddWorker = async (user) => {
        try {
            await assignWorker(departmentId, user._id);
            setDepartment((prev) => ({ ...prev, workers: [...(prev.workers ?? []), user] }));
            toast.success('Worker Added', {
                description: `${user.name} has been added as a worker in the ${department.name} department.`,
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                },
            });
        } catch (err) {
            console.error(err);
            toast.error('Failed to Add Worker', {
                description: err.response?.data?.message || 'Failed to add worker. Please try again.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                },
            });
        }
    };

    const handleRemoveWorker = async (userId) => {
        try {
            await removeWorker(departmentId, userId);
            setDepartment((prev) => ({
                ...prev,
                workers: (prev.workers ?? []).filter((u) => u._id !== userId),
            }));
        } catch (err) {
            console.error(err);
            toast.error('Failed to Remove Worker', {
                description: 'Failed to remove worker. Please try again.',
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #FF0000",
                },
            });
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error && !department) {
        return <ErrorPage error={error} />;
    }

    if (!department) {
        return <ErrorPage error="This department could not be found." />;
    }

    const assistants = department.assistants ?? [];
    const workers = department.workers ?? [];

    return (
        <div className="space-y-6">
            {/* Top bar: back + edit + delete */}
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
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={`/admin/departments/${departmentId}/edit`}>
                            <div className="flex items-center gap-1.5">
                            <Pencil size={14} />
                            <span className='hidden sm:block' >Edit</span>
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
                                <AlertDialogTitle>Delete this department?</AlertDialogTitle>
                                <AlertDialogDescription className="text-[#8A8C94]">
                                    This will permanently delete "{department.name}". This action
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
                                    Delete department
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>}
            </div>

            {error && <p className="text-sm text-[#D62839]">{error}</p>}

            {/* Overview: image and details as separate panels */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                <div className="flex h-fit w-full items-center justify-center overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] ">
                    {department.image?.url ? (
                        <img src={department.image.url} alt={department.name} className="h-full w-full object-cover" />
                    ) : (
                        <ImageOff size={28} className="text-[#6E7079]" />
                    )}
                </div>

                <div className="space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                    <h1 className="text-xl font-semibold text-[#EDEDEF]">{department.name}</h1>
                    <p className="text-sm leading-relaxed text-[#8A8C94]">{department.description}</p>
            {/* Leader */}
            <div className="rounded-xl border border-[#1C1D22] bg-[#111214] p-5">
                <SectionHeader
                    icon={<Crown size={15} />}
                    role={user.role}
                    title="Leader"
                    onEdit={() => setLeaderDialogOpen(true)}
                />
                {department.leader ? (
                    <UserRow user={department.leader} />
                ) : (
                    <p className="text-sm text-[#6E7079]">No leader assigned yet.</p>
                )}
            </div>

            {/* Assistants */}
            <div className="rounded-xl border border-[#1C1D22] bg-[#111214] p-5">
                <SectionHeader
                    icon={<Shield size={15} />}
                    role={user.role}
                    title={`Assistants (${assistants.length})`}
                    onEdit={() => setAssistantsDialogOpen(true)}
                />
                {assistants.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {assistants.map((user) => (
                            <UserRow key={user._id} user={user} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-[#6E7079]">No assistants assigned yet.</p>
                )}
            </div>
            {/* Workers */}
            <div className="rounded-xl border border-[#1C1D22] bg-[#111214] p-5">
                <SectionHeader
                    role={user.role}
                    icon={<UsersIcon size={15} />}
                    title={`Workers (${workers.length})`}
                    onEdit={() => setWorkersDialogOpen(true)}
                />
                {workers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {workers.map((user) => (
                            <UserRow key={user._id} user={user} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-[#6E7079]">No workers assigned yet.</p>
                )}
            </div>

                </div>
                
            </div>




            {/* Dialogs */}
            <LeaderDialog
                open={leaderDialogOpen}
                onOpenChange={setLeaderDialogOpen}
                currentLeader={department.leader}
                onAssign={handleAssignLeader}
                isSaving={isSavingLeader}
                />

            <MembersDialog
                open={assistantsDialogOpen}
                onOpenChange={setAssistantsDialogOpen}
                title="Manage assistants"
                description="Add or remove assistant leaders for this department."
                members={assistants}
                onAdd={handleAddAssistant}
                onRemove={handleRemoveAssistant}
                />

            <MembersDialog
                open={workersDialogOpen}
                onOpenChange={setWorkersDialogOpen}
                title="Manage workers"
                description="Add or remove workers for this department."
                members={workers}
                onAdd={handleAddWorker}
                onRemove={handleRemoveWorker}
            />
        </div>
    );
};

export default DepartmentDetails;