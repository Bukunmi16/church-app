import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    UploadCloud,
    X,
    Loader2,
} from "lucide-react";
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
import { getOneService, updateService } from '@/api/services.api';

const SERVICE_TYPES = [
    "Teaching",
    "Celebration",
    "Interactive Study",
    "Holy Ghost",
    "Thanksgiving",
    "Prayer",
    "Pulpit Exchange",
    "Healing and Communion",
    "Other",
];

const DAYS = ["Sunday", "Wednesday", "Friday", "Saturday"];

const DEFAULT_LOCATION =
    "Behind Lautech College of Health Sciences, Ogbomoso-Ilorin Expressway, Ogbomoso";

    
    const initialFormData = {
    title: "",
    theme: "",
    preacher: "",
    serviceType: "",
    day: "",
    date: "",
    startTime: "",
    endTime: "",
    location: DEFAULT_LOCATION,
    description: "",
};

const EditService = () => {
    const { serviceId } = useParams()
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    
        useEffect(() => {
            const fetchService = async () => {
                try {
                    const data = await getOneService(serviceId)
                    const service = data.service.service

                    console.log(service);
                    

                    initialFormData.title = service.title
                    initialFormData.theme = service.theme
                    initialFormData.preacher = service.preacher
                    initialFormData.serviceType = service.serviceType
                    initialFormData.day = service.day
                    initialFormData.date = service.date
                    initialFormData.startTime = service.startTime
                    initialFormData.endTime = service.endTime
                    initialFormData.location = service.location
                    initialFormData.description = service.description
                    setPreviewUrl(service.serviceImage.url)
                } catch (error) {
                    console.error(error)
                    setError('Failed to load this service')
                } 
            }
            fetchService()
        }, [serviceId])


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field) => (value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
            if (imageFile) {
                payload.append("serviceImage", imageFile);
            }

            const data = await updateService(serviceId, payload);
            console.log(data);
            
            navigate(-1);
        } catch (err) {
            console.error(err);
            setError("Failed to create service. Please check the form and try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top bar */}
            <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
            >
                <Link to="/admin/services">
                    <div className='flex justify-between items-center gap-2'>
                <ArrowLeft size={16} />
                <p>Back to services</p>
                </div>
                </Link>
            </Button>

            <div>
                <h1 className="text-xl font-semibold text-[#EDEDEF]">Update Service</h1>
                <p className="mt-1 text-sm text-[#8A8C94]">
                    {/* Update service to the schedule. */}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                    {/* Image — standalone upload panel */}
                    <div>
                        <Label className="mb-2 block text-[#EDEDEF]">Service image</Label>
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
                                    alt="Service preview"
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

                    {/* Form fields */}
                    <div className="space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-[#EDEDEF]">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="The Business of Living"
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="theme" className="text-[#EDEDEF]">Theme</Label>
                            <Input
                                id="theme"
                                value={formData.theme}
                                onChange={handleChange}
                                placeholder="No More Limits"
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="preacher" className="text-[#EDEDEF]">Preacher</Label>
                                <Input
                                    id="preacher"
                                    value={formData.preacher}
                                    onChange={handleChange}
                                    placeholder="Pastor Samuel Kosoko"
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[#EDEDEF]">Service type</Label>
                                <Select
                                    value={formData.serviceType}
                                    onValueChange={handleSelectChange("serviceType")}
                                    required
                                >
                                    <SelectTrigger className="w-full border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF]">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                                        {SERVICE_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="text-[#EDEDEF]">Day</Label>
                                <Select
                                    value={formData.day}
                                    onValueChange={handleSelectChange("day")}
                                    required
                                >
                                    <SelectTrigger className="w-full border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF]">
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#1C1D22] bg-[#111214] text-[#EDEDEF]">
                                        {DAYS.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="date" className="text-[#EDEDEF]">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
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
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-[#EDEDEF]">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="A short summary of what to expect in this service..."
                                rows={4}
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-[#D62839]">{error}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={`/admin/services/${serviceId}`}>Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                    >
                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                        Update Service
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditService;