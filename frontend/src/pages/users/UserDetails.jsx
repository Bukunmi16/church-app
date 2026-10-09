import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Cake,
    CalendarDays,
    BadgeCheck,
    BadgeX,
    Loader2,
    Crown,
    Shield,
    Users,
} from "lucide-react";
import { getOneUser, updateUserStatus, updateUserRole, deleteUser } from '@/api/users.api'
import { getDepartments } from '@/api/departments.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from '../errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

import useAuthStore from '@/stores/auth.store';
import { toast } from 'sonner';

// ---- Helpers ----

const ROLE_LABELS = { member: "Member", worker: "Worker", admin: "Admin" };

const formatDate = (dateString) =>
    dateString
        ? new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
          }).format(new Date(dateString))
        : "—";

const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "";

// Department members can arrive as plain ID strings or populated user objects
const idOf = (value) => (typeof value === "string" ? value : value?._id);

// Highest role wins if a user somehow appears in more than one list of the same department
const getMembership = (department, userId) => {
    if (idOf(department.leader) === userId) return "leader";
    if ((department.assistants ?? []).some((a) => idOf(a) === userId)) return "assistant";
    if ((department.workers ?? []).some((w) => idOf(w) === userId)) return "worker";
    return null;
};

const MEMBERSHIP_ORDER = { leader: 0, assistant: 1, worker: 2 };

// ---- Reusable confirmation dialog (no visible trigger — opened programmatically) ----

const ConfirmDialog = ({ open, onOpenChange, title, description, confirmLabel, onConfirm, isLoading }) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription className="text-[#8A8C94]">
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]">
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                >
                    {isLoading && <Loader2 size={14} className="animate-spin" />}
                    {confirmLabel}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

const InfoRow = ({ icon, children }) => (
    <div className="flex items-center gap-2.5 text-sm text-[#8A8C94]">
        {icon}
        <span>{children}</span>
    </div>
);

// Pill linking to a department the user belongs to; leaders get a distinct red-accented treatment
const DepartmentPill = ({ department, membership }) => {
    const isLeader = membership === "leader";
    const Icon = isLeader ? Crown : membership === "assistant" ? Shield : Users;

    return (
        <Link
            to={`/departments/${department._id}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isLeader
                    ? "border-[#D62839]/30 bg-[#D62839]/10 text-[#F2A0A8] hover:bg-[#D62839]/20"
                    : "border-transparent bg-[#12183A] text-[#C7CEEA] hover:bg-[#1A2250]"
            }`}
        >
            <Icon size={12} className="shrink-0" />
            <span>{department.name}</span>
            {membership !== "worker" && (
                <span className="opacity-70">· {isLeader ? "Leader" : "Assistant"}</span>
            )}
        </Link>
    );
};

const UserDetails = () => {
    const currentUser = useAuthStore((state) => state.user)
 console.log(currentUser._id);
 
 const { userId } = useParams();
 console.log(userId);


    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Departments this user belongs to — loaded separately so it never blocks the page
    const [userDepartments, setUserDepartments] = useState([]);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
    const [departmentsFailed, setDepartmentsFailed] = useState(false);

    // Pending actions — nothing is applied to `user` until confirmed
    const [pendingRole, setPendingRole] = useState(null); // string | null
    const [pendingStatusChange, setPendingStatusChange] = useState(false); // bool: dialog open
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingRole, setIsSavingRole] = useState(false);
    const [isSavingStatus, setIsSavingStatus] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {data} = await getOneUser(userId);
                // console.log(data);
                
                setUser(data.user);
            } catch (err) {
                console.error(err);
                setError("Failed to load this user");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchUserDepartments = async () => {
            try {
                setIsLoadingDepartments(true);
                setDepartmentsFailed(false);
                const { data } = await getDepartments({ limit: 100 });
                const departments = data.departments?.departments ?? data.departments ?? [];

                const memberships = departments
                    .map((department) => ({ department, membership: getMembership(department, userId) }))
                    .filter((entry) => entry.membership !== null)
                    .sort((a, b) => MEMBERSHIP_ORDER[a.membership] - MEMBERSHIP_ORDER[b.membership]);

                setUserDepartments(memberships);
            } catch (err) {
                console.error("Failed to load departments", err);
                setDepartmentsFailed(true);
            } finally {
                setIsLoadingDepartments(false);
            }
        };
        fetchUserDepartments();
    }, [userId]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!user) {
        return <ErrorPage error="This user could not be found." />;
    }

    const confirmRoleChange = async () => {
        try {
            setIsSavingRole(true);
            console.log(pendingRole);
            
            await updateUserRole(userId, {role: pendingRole} );
            setUser((prev) => ({ ...prev, role: pendingRole }));
            toast.success(`${user.name} is now ${pendingRole === 'admin' ? 'an' : 'a'} ${pendingRole}`, {
                position: 'top-center',
                style: {
                    background: "#202124",
                    color: "#f5f5f5",
                    border: "1px solid #008000",
                  }        
                });            

            setPendingRole(null);
        } catch (err) {
            console.error(err);
        toast.error('Failed to Update User Role', {
            description: err.response?.data?.message || 'Failed to update role. Please try again.',
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }});   
        } finally {
            setIsSavingRole(false);
        }
    };

    const confirmStatusChange = async () => {
        // Declared outside the try block so the catch block can read it too
        const nextStatus = !user.isActive;
        try {
            setIsSavingStatus(true);
            await updateUserStatus(userId, nextStatus);
            setUser((prev) => ({ ...prev, isActive: nextStatus }));
            toast.success(`${user.name}'s account has been ${nextStatus ? 'Activated' : 'Deactivated'} Successfully`, {
                  position: 'top-center',
                  style: {
                      background: "#202124",
                      color: "#f5f5f5",
                      border: "1px solid #008000",
                    }        
                });        

            setPendingStatusChange(false);
        } catch (err) {
            console.error(err);
        toast.error(`Failed to ${nextStatus ? 'Activate' : 'Deactivate'} ${user.name}'s account`, {
            description: err.response?.data?.message || 'Failed to update status. Please try again.',
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }})
        } finally {
            setIsSavingStatus(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteUser(userId);
            toast.success(`${user.name}'s account has been deleted Successfully`, {
                      position: 'top-center',
                      style: {
                          background: "#202124",
                          color: "#f5f5f5",
                          border: "1px solid #008000",
                        }        
                    });
            navigate("/admin/users");
        } catch (err) {
            console.error(err);
            console.log({err});
            
            setIsDeleting(false);
        toast.error(`Failed to delete ${user.name}'s account`, {
            description: err.response?.data?.message || 'Failed to delete this user. Please try again.',
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }})
        }
    };

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
                    <Link to="/users">
                      <div className='flex justify-between items-center gap-2'>
                        <ArrowLeft size={16} />
                        <p>Back to Users</p>
                      </div>
                    </Link>
                </Button>

              {currentUser._id !== userId || user.role === 'admin' &&  <AlertDialog>
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
                            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#8A8C94]">
                                This will permanently delete "{user.name}"'s account. This
                                action cannot be undone.
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
                                Delete user
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}
            </div>

            {/* Overview: avatar and details as separate panels */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                {/* Avatar — standalone, circular since this is a person, not content */}
                <div className="flex items-center justify-center  border-[#1C1D22] bg-[#0A0A0C] ">
                    <div className={`flex ${!user.profileImage?.url && 'h-50 w-50 rounded-full'}  items-center justify-center overflow-hidden bg-[#12183A]`}>
                        {user.profileImage?.url ? (
                            <img
                                src={user.profileImage.url}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-semibold text-[#EDEDEF]">
                                {getInitials(user.name)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6 h-fit">
                    <div>
                        <h1 className="text-xl font-semibold text-[#EDEDEF]">{user.name}</h1>
                        <div className="mt-1.5 flex items-center gap-2">
                            <span className="inline-flex w-fit items-center rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-[#C7CEEA]">
                                {ROLE_LABELS[user.role] ?? user.role}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-[#8A8C94]">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        user.isActive ? "bg-[#34D399]" : "bg-[#D62839]"
                                    }`}
                                />
                                {user.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-[#1C1D22] pt-4">
                        <InfoRow icon={<Mail size={15} className="shrink-0" />}>{user.email}</InfoRow>
                        <InfoRow icon={<Phone size={15} className="shrink-0" />}>{user.phone || "—"}</InfoRow>
                        <InfoRow icon={<Cake size={15} className="shrink-0" />}>
                            {formatDate(user.dateOfBirth)}
                        </InfoRow>
                        <InfoRow icon={<MapPin size={15} className="shrink-0" />}>
                            {user.address || "—"}
                        </InfoRow>
                        <InfoRow icon={<CalendarDays size={15} className="shrink-0" />}>
                            Joined {formatDate(user.createdAt)}
                        </InfoRow>
                        {/* {user._id !== userId && <InfoRow
                            icon={
                                user.emailVerified ? (
                                    <BadgeCheck size={15} className="shrink-0 text-[#34D399]" />
                                ) : (
                                    <BadgeX size={15} className="shrink-0 text-[#6E7079]" />
                                )
                            }
                        >
                            {user.emailVerified ? "Email verified" : "Email not verified"}
                        </InfoRow>} */}
                        {user.gender && (
                            <p className="text-xs capitalize text-[#6E7079]">{user.gender}</p>
                        )}
                    </div>

                    {/* Departments this user belongs to */}
                    <div className="border-t border-[#1C1D22] pt-4">
                        <p className="mb-2 text-xs font-medium text-[#6E7079]">Departments</p>
                        {isLoadingDepartments ? (
                            <Loader2 size={14} className="animate-spin text-[#6E7079]" />
                        ) : departmentsFailed ? (
                            <p className="text-sm text-[#6E7079]">Couldn't load departments.</p>
                        ) : userDepartments.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {userDepartments.map(({ department, membership }) => (
                                    <DepartmentPill
                                        key={department._id}
                                        department={department}
                                        membership={membership}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[#6E7079]">Not part of any department.</p>
                        )}
                    </div>

                    {/* Account management — proposing a change here doesn't apply it until confirmed */}
                   { currentUser.role === 'admin' && <div className="space-y-4 border-t border-[#1C1D22] pt-4">
                        {currentUser._id !== userId &&
                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#EDEDEF]">Account status</p>
                                <p className="text-xs text-[#8A8C94]">
                                    {user.isActive ? "This user can currently log in." : "This user is deactivated."}
                                </p>
                            </div>
                            <Switch
                                checked={user.isActive}
                                onCheckedChange={() => setPendingStatusChange(true)}
                            />
                        </div>}

                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[#EDEDEF]">Role</p>
                            <Select
                                value={user.role}
                                onValueChange={(value) => {
                                    if (value !== user.role) setPendingRole(value);
                                }}
                            >
                                <SelectTrigger className="w-36 border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="worker">Worker</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>}
                </div>
            </div>

            {/* Confirm: activate/deactivate */}
            <ConfirmDialog
                open={pendingStatusChange}
                onOpenChange={(open) => !open && setPendingStatusChange(false)}
                title={user.isActive ? "Deactivate this user?" : "Activate this user?"}
                description={
                    user.isActive
                        ? `${user.name} will no longer be able to log in until reactivated.`
                        : `${user.name} will regain access and be able to log in again.`
                }
                confirmLabel={user.isActive ? "Deactivate" : "Activate"}
                onConfirm={confirmStatusChange}
                isLoading={isSavingStatus}
            />

            {/* Confirm: role change */}
            <ConfirmDialog
                open={pendingRole !== null}
                onOpenChange={(open) => !open && setPendingRole(null)}
                title="Change this user's role?"
                description={
                    pendingRole
                        ? `${user.name}'s role will change from "${ROLE_LABELS[user.role]}" to "${ROLE_LABELS[pendingRole]}".`
                        : ""
                }
                confirmLabel="Change role"
                onConfirm={confirmRoleChange}
                isLoading={isSavingRole}
            />
        </div>
    );
};

export default UserDetails;