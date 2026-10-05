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
} from "lucide-react";
import { getOneUser, updateUserStatus, updateUserRole, deleteUser } from '@/api/users.api'
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

const UserDetails = () => {
    const currentUser = useAuthStore((state) => state.user)
//  console.log(currentUser);
 
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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
            setPendingRole(null);
        } catch (err) {
            console.error(err);
            setError("Failed to update role. Please try again.");
        } finally {
            setIsSavingRole(false);
        }
    };

    const confirmStatusChange = async () => {
        try {
            setIsSavingStatus(true);
            const nextStatus = !user.isActive;
            await updateUserStatus(userId, nextStatus);
            setUser((prev) => ({ ...prev, isActive: nextStatus }));
            setPendingStatusChange(false);
        } catch (err) {
            console.error(err);
            setError("Failed to update status. Please try again.");
        } finally {
            setIsSavingStatus(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteUser(userId);
            navigate("/admin/members");
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            setError("Failed to delete this user. Please try again.");
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
                    <Link to="/admin/users">
                      <div className='flex justify-between items-center gap-2'>
                        <ArrowLeft size={16} />
                        <p>Back to Users</p>
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
                </AlertDialog>
            </div>

            {/* Overview: avatar and details as separate panels */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                {/* Avatar — standalone, circular since this is a person, not content */}
                <div className="flex items-center justify-center  border-[#1C1D22] bg-[#0A0A0C] ">
                    <div className="flex h-100 w-100 items-center justify-center overflow-hidden rounded-full bg-[#12183A]">
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
                <div className="space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
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
                        <InfoRow
                            icon={
                                user.emailVerified ? (
                                    <BadgeCheck size={15} className="shrink-0 text-[#34D399]" />
                                ) : (
                                    <BadgeX size={15} className="shrink-0 text-[#6E7079]" />
                                )
                            }
                        >
                            {user.emailVerified ? "Email verified" : "Email not verified"}
                        </InfoRow>
                        {user.gender && (
                            <p className="text-xs capitalize text-[#6E7079]">{user.gender}</p>
                        )}
                    </div>

                    {/* Account management — proposing a change here doesn't apply it until confirmed */}
                    <div className="space-y-4 border-t border-[#1C1D22] pt-4">
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
                        </div>

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
                    </div>
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