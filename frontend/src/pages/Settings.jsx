import React, { useEffect, useRef, useState } from 'react'
import { toast } from "sonner";
import { Pencil, KeyRound, UploadCloud, X, Loader2, ImageOff } from "lucide-react";
import { getProfile, updateProfile, updatePassword } from '@/api/settings.api'
import { getChurchInfo, updateChurchInfo } from '@/api/settings.api'
import LoadingScreen from '@/components/ui/Loading'
import ErrorPage from './errors/ErrorPage'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import useAuthStore from '@/stores/auth.store';

// ---- Helpers ----

const ROLE_LABELS = { user: "Member", worker: "Worker", admin: "Admin" };

const getInitials = (name) => name?.slice(0, 2).toUpperCase() ?? "";

const formatDate = (dateString) =>
    dateString
        ? new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
          }).format(new Date(dateString))
        : "—";

const formatDateForInput = (dateString) => (dateString ? new Date(dateString).toISOString().split("T")[0] : "");

const formatUpdatedAt = (dateString) =>
    dateString
        ? new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
          }).format(new Date(dateString))
        : "—";

// ---- Small building blocks ----

const SectionCard = ({ title, lastUpdated, action, children }) => (
    <div className="rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
            <div>
                <h2 className="text-base font-semibold text-[#EDEDEF]">{title}</h2>
                <p className="mt-0.5 text-xs text-[#6E7079]">Last updated {formatUpdatedAt(lastUpdated)}</p>
            </div>
            {action}
        </div>
        {children}
    </div>
);

const InfoField = ({ label, value }) => (
    <div>
        <p className="text-xs text-[#6E7079]">{label}</p>
        <p className="mt-0.5 text-sm text-[#EDEDEF]">{value || "—"}</p>
    </div>
);

const AvatarUpload = ({ previewUrl, name, onSelect, onRemove }) => {
    const fileInputRef = useRef(null);
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#12183A]">
                    {previewUrl ? (
                        <img src={previewUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-xl font-semibold text-[#EDEDEF]">{getInitials(name)}</span>
                    )}
                </div>
                {previewUrl && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90"
                        aria-label="Remove photo"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelect} className="hidden" />
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
            >
                <UploadCloud size={14} />
                Change photo
            </Button>
        </div>
    );
};

const LogoUpload = ({ previewUrl, onSelect, onRemove }) => {
    const fileInputRef = useRef(null);
    return (
        <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelect} className="hidden" />
            {previewUrl ? (
                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-[#1C1D22] bg-[#0A0A0C]">
                    <img src={previewUrl} alt="Church logo" className="h-full w-full object-cover" />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90"
                        aria-label="Remove logo"
                    >
                        <X size={13} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#1C1D22] bg-[#0A0A0C] text-[#6E7079] transition-colors hover:border-[#2A2B31] hover:text-[#8A8C94]"
                >
                    <UploadCloud size={22} />
                    <span className="text-xs">Click to upload logo</span>
                </button>
            )}
        </div>
    );
};

const Settings = () => {
    const user = useAuthStore((state) => state.user)

    const [profile, setProfile] = useState(null);
    const [churchInfo, setChurchInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [churchDialogOpen, setChurchDialogOpen] = useState(false);

    // Profile edit form
    const [profileForm, setProfileForm] = useState(null);
    // console.log(profileForm);
    
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Password form
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // Church info edit form
    const [churchForm, setChurchForm] = useState(null);
    const [churchLogoFile, setChurchLogoFile] = useState(null);
    const [churchPreviewUrl, setChurchPreviewUrl] = useState(null);
    const [isSavingChurch, setIsSavingChurch] = useState(false);

    const fetchAll = async () => {
        try {
            // const [profileRes, churchRes] = await Promise.all([getProfile(), getChurchInfo()]);
            
            const {data: profileRes} = await getProfile()
            const {data: churchRes} = await getChurchInfo()
            
            setProfile(profileRes.data?.user ?? profileRes.user);
            setChurchInfo(churchRes.data?.churchInfo ?? churchRes.churchInfo);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load settings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage error={error} />;
    }

    // ---- Profile edit ----

    const openProfileEdit = () => {
        setProfileForm({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            dateOfBirth: formatDateForInput(profile.dateOfBirth),
            gender: profile.gender || "",
            address: profile.address || "",
        });
        setProfileImageFile(null);
        setProfilePreviewUrl(profile.profileImage?.url || null);
        setProfileDialogOpen(true);
    };

    const handleProfileImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileImageFile(file);
        setProfilePreviewUrl(URL.createObjectURL(file));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setIsSavingProfile(true);
            const payload = new FormData();
            Object.entries(profileForm).forEach(([key, value]) => payload.append(key, value));
            if (profileImageFile) payload.append("profileImage", profileImageFile);

            await updateProfile(payload);
          toast.success("Profile updated successfully.", {
              position: 'top-center',
              style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #008000",
            }});

            setProfileDialogOpen(false);
            await fetchAll();
        } catch (err) {
            console.error(err);            
            toast.error(err.response?.data?.message || "Failed to update profile.", {
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }});
        } finally {
            setIsSavingProfile(false);
        }
    };

    // ---- Password change ----

    const openPasswordDialog = () => {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordDialogOpen(true);
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New password and confirmation don't match.");
            return;
        }
        try {
            setIsSavingPassword(true);
            const { data } = await updatePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success(data?.message || "Password updated successfully.",{
              position: 'top-center',
              style: {
                background: "#202124",
                color: "#f5f5f5",
                border: "1px solid #008000",
            }});
            setPasswordDialogOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update password.",{
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }});
        } finally {
            setIsSavingPassword(false);
        }
    };

    // ---- Church info edit ----

    const openChurchEdit = () => {
        setChurchForm({
            name: churchInfo.name || "",
            address: churchInfo.address || "",
            phone: churchInfo.phone || "",
            email: churchInfo.email || "",
            website: churchInfo.website || "",
            motto: churchInfo.motto || "",
        });
        setChurchLogoFile(null);
        setChurchPreviewUrl(churchInfo.logo?.url || null);
        setChurchDialogOpen(true);
    };

    const handleChurchLogoSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setChurchLogoFile(file);
        setChurchPreviewUrl(URL.createObjectURL(file));
    };

    const handleSaveChurch = async (e) => {
        e.preventDefault();
        try {
            setIsSavingChurch(true);
            const payload = new FormData();
            Object.entries(churchForm).forEach(([key, value]) => payload.append(key, value));
            if (churchLogoFile) payload.append("logo", churchLogoFile);

            await updateChurchInfo(payload);

            toast.success("Church Details updated successfully.",{
              position: 'top-center',
              style: {
                background: "#202124",
                color: "#f5f5f5",
                border: "1px solid #008000",
              }});

            setChurchDialogOpen(false);
            await fetchAll();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update church info.", {
            description: `Failed to delete teaching. Please try again.`,
            position: 'top-center',
            style: {
              background: "#202124",
              color: "#f5f5f5",
              border: "1px solid #FF0000",
              }});

        } finally {
            setIsSavingChurch(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-[#EDEDEF]">Settings</h1>
                <p className="mt-1 text-sm text-[#8A8C94]">Manage your account and church information.</p>
            </div>

            {/* Your Profile */}
            <SectionCard
                title="Your Profile"
                lastUpdated={profile.updatedAt}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openProfileEdit}
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Pencil size={14} />
                        Edit
                    </Button>
                }
            >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#12183A]">
                            {profile.profileImage?.url ? (
                                <img src={profile.profileImage.url} alt={profile.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-lg font-semibold text-[#EDEDEF]">{getInitials(profile.name)}</span>
                            )}
                        </div>
                        <span className="rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-[#C7CEEA]">
                            {ROLE_LABELS[profile.role] ?? profile.role}
                        </span>
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoField label="Name" value={profile.name} />
                        <InfoField label="Email" value={profile.email} />
                        <InfoField label="Phone" value={profile.phone} />
                        <InfoField label="Date of birth" value={formatDate(profile.dateOfBirth)} />
                        <InfoField label="Gender" value={profile.gender ? profile.gender[0].toUpperCase() + profile.gender.slice(1) : null} />
                        <InfoField label="Address" value={profile.address} />
                    </div>
                </div>

                <div className="mt-6 border-t border-[#1C1D22] pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openPasswordDialog}
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <KeyRound size={14} />
                        Change password
                    </Button>
                </div>
            </SectionCard>

            {/* Church Info */}
            {user.role === 'admin' &&
                <SectionCard
                title="Church Info"
                lastUpdated={churchInfo.updatedAt}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openChurchEdit}
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Pencil size={14} />
                        Edit
                    </Button>
                }
            >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#1C1D22] bg-[#0A0A0C]">
                        {churchInfo.logo?.url ? (
                            <img src={churchInfo.logo.url} alt={churchInfo.name} className="h-full w-full object-cover" />
                        ) : (
                            <ImageOff size={20} className="text-[#6E7079]" />
                        )}
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoField label="Name" value={churchInfo.name} />
                        <InfoField label="Motto" value={churchInfo.motto} />
                        <InfoField label="Email" value={churchInfo.email} />
                        <InfoField label="Phone" value={churchInfo.phone} />
                        <InfoField label="Website" value={churchInfo.website} />
                        <InfoField label="Address" value={churchInfo.address} />
                    </div>
                </div>
            </SectionCard>}

            {/* Profile edit dialog */}
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                <DialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription className="text-[#8A8C94]">
                            Update your personal information.
                        </DialogDescription>
                    </DialogHeader>

                    {profileForm && (
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <AvatarUpload
                                previewUrl={profilePreviewUrl}
                                name={profileForm.name}
                                onSelect={handleProfileImageSelect}
                                onRemove={() => { setProfileImageFile(null); setProfilePreviewUrl(null); }}
                            />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-[#EDEDEF]">Name</Label>
                                    <Input
                                        id="name"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                                        required
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-[#EDEDEF]">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                                        required
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-[#EDEDEF]">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="dateOfBirth" className="text-[#EDEDEF]">Date of birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={profileForm.dateOfBirth}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[#EDEDEF]">Gender</Label>
                                    <Select
                                        value={profileForm.gender}
                                        onValueChange={(v) => setProfileForm((p) => ({ ...p, gender: v }))}
                                    >
                                        <SelectTrigger className="w-full border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF]">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="address" className="text-[#EDEDEF]">Address</Label>
                                    <Input
                                        id="address"
                                        value={profileForm.address}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setProfileDialogOpen(false)}
                                    className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                                >
                                    {isSavingProfile && <Loader2 size={14} className="animate-spin" />}
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Password change dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                    <DialogHeader>
                        <DialogTitle>Change password</DialogTitle>
                        <DialogDescription className="text-[#8A8C94]">
                            Enter your current password and choose a new one.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSavePassword} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="currentPassword" className="text-[#EDEDEF]">Current password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword" className="text-[#EDEDEF]">New password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                                required
                                minLength={8}
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword" className="text-[#EDEDEF]">Confirm new password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                                required
                                minLength={8}
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPasswordDialogOpen(false)}
                                className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSavingPassword}
                                className="gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                            >
                                {isSavingPassword && <Loader2 size={14} className="animate-spin" />}
                                Update password
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Church info edit dialog */}
            <Dialog open={churchDialogOpen} onOpenChange={setChurchDialogOpen}>
                <DialogContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                    <DialogHeader>
                        <DialogTitle>Edit church info</DialogTitle>
                        <DialogDescription className="text-[#8A8C94]">
                            Update your church's public information.
                        </DialogDescription>
                    </DialogHeader>

                    {churchForm && (
                        <form onSubmit={handleSaveChurch} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[#EDEDEF]">Logo</Label>
                                <LogoUpload
                                    previewUrl={churchPreviewUrl}
                                    onSelect={handleChurchLogoSelect}
                                    onRemove={() => { setChurchLogoFile(null); setChurchPreviewUrl(null); }}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="churchName" className="text-[#EDEDEF]">Name</Label>
                                    <Input
                                        id="churchName"
                                        value={churchForm.name}
                                        onChange={(e) => setChurchForm((p) => ({ ...p, name: e.target.value }))}
                                        required
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="motto" className="text-[#EDEDEF]">Motto</Label>
                                    <Input
                                        id="motto"
                                        value={churchForm.motto}
                                        onChange={(e) => setChurchForm((p) => ({ ...p, motto: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="churchEmail" className="text-[#EDEDEF]">Email</Label>
                                    <Input
                                        id="churchEmail"
                                        type="email"
                                        value={churchForm.email}
                                        onChange={(e) => setChurchForm((p) => ({ ...p, email: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="churchPhone" className="text-[#EDEDEF]">Phone</Label>
                                    <Input
                                        id="churchPhone"
                                        value={churchForm.phone}
                                        onChange={(e) => setChurchForm((p) => ({ ...p, phone: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="website" className="text-[#EDEDEF]">Website</Label>
                                    <Input
                                        id="website"
                                        value={churchForm.website}
                                        onChange={(e) => setChurchForm((p) => ({ ...p, website: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label htmlFor="churchAddress" className="text-[#EDEDEF]">Address</Label>
                                    <Input
                                        id="churchAddress"
                                        value={churchForm.address}
                                        onChange={(e) => setChurchForm((p) => ({ ...p, address: e.target.value }))}
                                        className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setChurchDialogOpen(false)}
                                    className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSavingChurch}
                                    className="gap-1.5 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                                >
                                    {isSavingChurch && <Loader2 size={14} className="animate-spin" />}
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Settings;