import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router";
import { ArrowLeft, UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatDateForInput } from '@/utils';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const initialFormData = {
    title: "",
    description: "",
    date: "",
};

/**
 * mode: "create" | "edit"
 * initialData: existing series object (edit only) — matches data.series.series shape
 * onSubmit: async (formDataPayload) => void — caller decides createTeachingSeries vs updateTeachingSeries
 * backTo: where "Back" / "Cancel" should navigate
 */
const SeriesForm = ({ mode = "create", initialData = null, onSubmit, backTo = "/admin/teaching-series" }) => {
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
 

    useEffect(() => {
        if (mode === "edit" && initialData) {
            // const date = new Date(.date)
            // const month = date.getMonth() + 1
            // const year = date.getFullYear()
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "", 
                date: formatDateForInput(initialData.date),
                });
            if (initialData.thumbnail?.url) {
                setPreviewUrl(initialData.thumbnail.url);
            }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setIsSubmitting(true);

            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value);
            });
            if (formData.date) {
                const date = new Date(formData.date)
                const month = date.getMonth() + 1
                const year = date.getFullYear()

                payload.append("month", month);
                payload.append("year", year);
            }
            if (imageFile) {
                payload.append("thumbnail", imageFile);
            }

            await onSubmit(payload);
        } catch (err) {
            console.error(err);
            setError(
                mode === "create"
                    ? "Failed to create series. Please check the form and try again."
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
                <Link to={backTo}>
                    <div className='flex justify-between items-center gap-2'>
                        <ArrowLeft size={16} />
                        <p> Back to Series</p>
                        </div>                
                </Link>
            </Button>

            <div>
                <h1 className="text-xl font-semibold text-[#EDEDEF]">
                    {mode === "create" ? "Create Teaching Series" : "Edit Teaching Series"}
                </h1>
                <p className="mt-1 text-sm text-[#8A8C94]">
                    {mode === "create"
                        ? "Group teachings under a themed monthly series."
                        : "Update this series' details."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                    {/* Thumbnail — standalone upload panel */}
                    <div>
                        <Label className="mb-2 block text-[#EDEDEF]">Thumbnail</Label>
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
                                    alt="Series thumbnail preview"
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
                                <span className="text-sm">Click to upload a thumbnail</span>
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
                                placeholder="The Call, The Minister, The Ministry"
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
                                placeholder="A short summary of what this series covers..."
                                rows={3}
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        

                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-[#EDEDEF]">Date</Label>
                            <Input
                                id="date"
                                value={formData.date}
                                onChange={handleChange}
                                type='date'
                                required
                                className="border-[#1C1D22] w-fit bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] border-none focus-visible:ring-[#D62839]"
                            />
                        </div>
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
                        <Link to={backTo}>Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                    >
                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                        {mode === "create" ? "Create Series" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SeriesForm;