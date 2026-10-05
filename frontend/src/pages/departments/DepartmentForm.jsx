import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router";
import { ArrowLeft, UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialFormData = { name: "", description: "" };

/**
 * mode: "create" | "edit"
 * initialData: existing department object (edit only)
 * onSubmit: async (formDataPayload) => void — caller decides createDepartment vs updateDepartment
 * backTo: where "Back" / "Cancel" should navigate
 */
const DepartmentForm = ({ mode = "create", initialData = null, onSubmit, backTo =-1 }) => {
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    // console.log(formData);
    
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
            });
            if (initialData.image?.url) {
                setPreviewUrl(initialData.image.url);
            }
        }
    }, [mode, initialData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        console.log(formData);
        
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
            payload.append("name", formData.name);
            payload.append("description", formData.description);
            if (imageFile) {
                payload.append("image", imageFile);
            }
            console.log(payload);
            

            await onSubmit(payload);
        } catch (err) {
            console.error(err);
            setError(
                mode === "create"
                    ? "Failed to create department. Please check the form and try again."
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
                    </div>
                </Link>
            </Button>

            <div>
                <h1 className="text-xl font-semibold text-[#EDEDEF]">
                    {mode === "create" ? "Create Department" : "Edit Department"}
                </h1>
                <p className="mt-1 text-sm text-[#8A8C94]">
                    {mode === "create"
                        ? "Leader, assistants, and workers are managed from the department's page after it's created."
                        : "Update this department's name, description, and image."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                    <div>
                        <Label className="mb-2 block text-[#EDEDEF]">Department image</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        {previewUrl ? (
                            <div className="relative h-64 w-full overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] lg:h-96">
                                <img
                                    src={previewUrl}
                                    alt="Department preview"
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

                    <div className="space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-[#EDEDEF]">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Media"
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
                                placeholder="What this department is responsible for..."
                                rows={4}
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
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
                        {mode === "create" ? "Create Department" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DepartmentForm;