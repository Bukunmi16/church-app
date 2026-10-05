import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router";
import { ArrowLeft, UploadCloud, X, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForInput, formatTimeForInput } from '@/utils';

// ---- Helper: image field can be {url, publicId} or, on older records, a bare string ----
const getImageUrl = (image) => (typeof image === "string" ? image : image?.url) || null;

const initialFormData = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    host: "",
};

/**
 * mode: "create" | "edit"
 * initialData: existing event object (edit only)
 * onSubmit: async (formDataPayload) => void — caller decides createEvent vs updateEvent
 * backTo: where "Back" / "Cancel" should navigate
 */
const EventForm = ({ mode = "create", initialData = null, onSubmit, backTo = "/admin/events" }) => {
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(initialFormData);
    const [guestMinisters, setGuestMinisters] = useState([]);
    const [newGuest, setNewGuest] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (mode === "edit" && initialData) {
            console.log(initialData.startTime);
            
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                startDate: formatDateForInput(initialData.startDate),
                endDate: formatDateForInput(initialData.endDate),
                startTime: formatTimeForInput(initialData.startTime),
                endTime: formatTimeForInput(initialData.endTime),
                location: initialData.location || "",
                host: initialData.host || "",
            });
            setGuestMinisters(initialData.guestMinisters || []);
            const existingImage = getImageUrl(initialData.image);
            if (existingImage) setPreviewUrl(existingImage);
        }
    }, [mode, initialData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const addGuestMinister = () => {
        const name = newGuest.trim();
        if (!name) return;
        setGuestMinisters((prev) => [...prev, name]);
        setNewGuest("");
    };

    const removeGuestMinister = (index) => {
        setGuestMinisters((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setIsSubmitting(true);

            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value);
            });
            guestMinisters.forEach((name) => payload.append("guestMinisters", name));
            if (imageFile) {
                payload.append("image", imageFile);
            }

            await onSubmit(payload);
        } catch (err) {
            console.error(err);
            setError(
                mode === "create"
                    ? "Failed to create event. Please check the form and try again."
                    : "Failed to save changes. Please check the form and try again."
            );
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
            >
                <Link to={-1}>
                   <div className='flex justify-between items-center gap-2'>
                    <ArrowLeft size={16} />
                    <p>Back</p>
                    </div>
                </Link>
            </Button>

            <div>
                <h1 className="text-xl font-semibold text-[#EDEDEF]">
                    {mode === "create" ? "Create Event" : "Edit Event"}
                </h1>
                <p className="mt-1 text-sm text-[#8A8C94]">
                    {mode === "create"
                        ? "Add a new event to the church calendar."
                        : "Update this event's details."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                    {/* Image — standalone upload panel */}
                    <div>
                        <Label className="mb-2 block text-[#EDEDEF]">Event image</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        {previewUrl ? (
                            <div className="relative w-full overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] ">
                                <img
                                    src={previewUrl}
                                    alt="Event preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                                    aria-label="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#1C1D22] bg-[#0A0A0C] text-[#6E7079] transition-colors hover:border-[#2A2B31] hover:text-[#8A8C94] lg:h-96"
                            >
                                <UploadCloud size={28} />
                                <span className="text-sm">Click to upload an image</span>
                                <span className="text-xs text-[#6E7079]">PNG or JPG</span>
                            </button>
                        )}
                    </div>

                    {/* Fields */}
                    <div className="space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-[#EDEDEF]">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="River of Joy 2026"
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-[#EDEDEF]">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What's this event about..."
                                rows={4}
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="startDate" className="text-[#EDEDEF]">Start date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="endDate" className="text-[#EDEDEF]">End date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="startTime" className="text-[#EDEDEF]">Start time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    lang="en-US"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="endTime" className="text-[#EDEDEF]">End time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    lang="en-US"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] focus-visible:ring-[#D62839]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-[#EDEDEF]">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Rhema Chapel, Behind College of Health Sciences..."
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="host" className="text-[#EDEDEF]">Host</Label>
                            <Input
                                id="host"
                                value={formData.host}
                                onChange={handleChange}
                                placeholder="Pastor Samuel Kosoko"
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        {/* Guest ministers — free-text array, add/remove chips */}
                        <div className="space-y-1.5">
                            <Label className="text-[#EDEDEF]">Guest ministers</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newGuest}
                                    onChange={(e) => setNewGuest(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addGuestMinister();
                                        }
                                    }}
                                    placeholder="Pastor Judah Olorunmaiye"
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addGuestMinister}
                                    className="shrink-0 gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                                >
                                    <Plus size={15} />
                                    Add
                                </Button>
                            </div>
                            {guestMinisters.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {guestMinisters.map((name, idx) => (
                                        <span
                                            key={`${name}-${idx}`}
                                            className="flex items-center gap-1.5 rounded-full bg-[#12183A] py-1 pl-3 pr-1.5 text-xs font-medium text-[#C7CEEA]"
                                        >
                                            {name}
                                            <button
                                                type="button"
                                                onClick={() => removeGuestMinister(idx)}
                                                className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                                                aria-label={`Remove ${name}`}
                                            >
                                                <X size={11} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-[#D62839]">{error}</p>}

                <div className="flex items-center justify-end gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={-1}>Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                    >
                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                        {mode === "create" ? "Create Event" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;