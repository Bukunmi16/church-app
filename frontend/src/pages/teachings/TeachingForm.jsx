import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router";
import {
    ArrowLeft,
    UploadCloud,
    X,
    Loader2,
    Check,
    ChevronsUpDown,
} from "lucide-react";
import { getServices } from '@/api/services.api'
import { getTeachingSeries } from '@/api/teachingSeries.api'
import { getDepartments } from '@/api/departments.api'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

// ---- Helpers ----
import { formatDate, formatDateForInput, formatSeries } from '@/utils';


const OptionLine = ({ title, subtitle }) => (
    <div className="flex flex-col py-0.5">
        <span className="text-sm text-[#EDEDEF]">{title}</span>
        {subtitle && <span className="text-xs text-[#8A8C94]">{subtitle}</span>}
    </div>
);

// ---- Server-side searchable combobox (Service, Series) ----

const ServerCombobox = ({
    label,
    placeholder,
    selected,
    onSelect,
    fetchOptions,
    renderOption,
    renderSelected,
    allowNone = true,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced server search — refetches whenever the popover is open and query changes
    useEffect(() => {
        if (!open) return;

        const timeout = setTimeout(async () => {
            try {
                setIsSearching(true);
                const items = await fetchOptions(query);
                setResults(items);
            } catch (err) {
                console.error("Combobox search failed", err);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 350);

        return () => clearTimeout(timeout);
    }, [query, open, fetchOptions]);

    return (
        <div className="space-y-1.5">
            <Label className="text-[#EDEDEF]">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] hover:bg-[#0A0A0C] hover:text-[#EDEDEF]"
                    >
                        <span className="truncate">
                            {selected ? renderSelected(selected) : placeholder}
                        </span>
                        <ChevronsUpDown size={14} className="ml-2 shrink-0 text-[#6E7079]" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] border-[#1C1D22] bg-[#111214] p-0 text-[#EDEDEF]">
                    <Command shouldFilter={false} className="bg-transparent">
                        <CommandInput
                            value={query}
                            onValueChange={setQuery}
                            placeholder={`Search ${label.toLowerCase()}...`}
                            className="text-[#EDEDEF]"
                        />
                        {isSearching && (
                            <div className="flex items-center justify-center py-2">
                                <Loader2 size={14} className="animate-spin text-[#6E7079]" />
                            </div>
                        )}
                        <CommandList className="max-h-64">
                            {allowNone && (
                                <CommandGroup>
                                    <CommandItem
                                        value="__none__"
                                        onSelect={() => {
                                            onSelect(null);
                                            setOpen(false);
                                        }}
                                        className="text-[#6E7079] aria-selected:bg-[#141518] aria-selected:text-[#EDEDEF]"
                                    >
                                        None
                                    </CommandItem>
                                </CommandGroup>
                            )}
                            <CommandGroup>
                                {results.map((option) => (
                                    <CommandItem
                                        key={option._id}
                                        value={option._id}
                                        onSelect={() => {
                                            onSelect(option);
                                            setOpen(false);
                                        }}
                                        className="aria-selected:bg-[#141518] aria-selected:text-[#EDEDEF]"
                                    >
                                        <Check
                                            size={14}
                                            color='white'
                                            className={`mr-2 shrink-0 ${
                                                selected?._id === option._id ? "opacity-100" : "opacity-0"
                                            }`}
                                        />
                                        {renderOption(option)}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {!isSearching && results.length === 0 && (
                                <p className="px-3 py-4 text-center text-sm text-[#6E7079]">
                                    No results found.
                                </p>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

// ---- Client-side filterable combobox (Department) ----

const ClientCombobox = ({ label, placeholder, options, value, onChange }) => {
    const [open, setOpen] = useState(false);

    const selected = useMemo(
        () => options.find((d) => d._id === value) || null,
        [options, value]
    );

    const filterFn = (itemValue, search) => {
        const dept = options.find((d) => d._id === itemValue);
        if (!dept) return 0;
        return dept.name.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
    };

    return (
        <div className="space-y-1.5">
            <Label className="text-[#EDEDEF]">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] hover:bg-[#0A0A0C] hover:text-[#EDEDEF]"
                    >
                        <span className="truncate">{selected ? selected.name : placeholder}</span>
                        <ChevronsUpDown size={14} className="ml-2 shrink-0 text-[#6E7079]" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] border-[#1C1D22] bg-[#111214] p-0 text-[#EDEDEF]">
                    <Command filter={filterFn} className="bg-transparent">
                        <CommandInput
                            placeholder="Search departments..."
                            className="text-[#EDEDEF]"
                        />
                        <CommandList className="max-h-64">
                            <CommandGroup>
                                {options.map((dept) => (
                                    <CommandItem
                                        key={dept._id}
                                        value={dept._id}
                                        onSelect={() => {
                                            onChange(dept._id);
                                            setOpen(false);
                                        }}
                                        className="aria-selected:bg-[#141518] aria-selected:text-[#EDEDEF]"
                                    >
                                        <Check
                                            size={14}
                                            color='white'
                                            className={`mr-2 shrink-0 ${
                                                value === dept._id ? "opacity-100" : "opacity-0"
                                            }`}
                                        />
                                        <p className='text-white'>{dept.name}</p>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

// ---- Shared form ----

const initialFormData = {
    title: "",
    description: "",
    preacher: "",
    duration: "",
    date: "",
    service: "",
    series: "",
    department: "",
    videoUrl: "",
    audioUrl: "",
};

/**
 * mode: "create" | "edit"
 * initialData: existing teaching object (edit only) — same shape returned by getOneTeaching
 * onSubmit: async (formDataPayload) => void  — caller decides createTeaching vs updateTeaching
 * backTo: where "Back" / "Cancel" should navigate
 */
const TeachingForm = ({ mode = "create", initialData = null, onSubmit, backTo = "/admin/teachings" }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Full objects for the currently selected service/series, so the combobox
    // trigger can show a rich label even when that option isn't in the latest
    // search results (e.g. right after loading an existing teaching to edit).
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState(null);

    const [departments, setDepartments] = useState([]);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

    // Pre-fill when editing
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                preacher: initialData.preacher || "",
                duration: initialData.duration || "",
                date: formatDateForInput(initialData.date),
                service: initialData.service?._id || "",
                series: initialData.series?._id || "",
                department: initialData.department?._id || "",
                videoUrl: initialData.videoUrl || "",
                audioUrl: initialData.audioUrl || "",
            });
            if (initialData.service) setSelectedService(initialData.service);
            if (initialData.series) setSelectedSeries(initialData.series);
            if (initialData.thumbnail?.url) {
                setPreviewUrl(initialData.thumbnail.url);
            }
        }
    }, [mode, initialData]);

    // Departments: small, fixed list — fetch once in full, filter client-side
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setIsLoadingDepartments(true);
                const departmentsRes = await getDepartments();
                setDepartments(departmentsRes.data?.departments ?? []);
            } catch (err) {
                console.error("Failed to load departments", err);
            } finally {
                setIsLoadingDepartments(false);
            }
        };
        fetchDepartments();
    }, []);

    // Server-side search functions passed into the comboboxes
    const searchServices = async (query) => {
        const res = await getServices({ search: query, limit: 8, sortBy: "date", sortOrder: "desc" });
        return res.data?.services.services ?? [];
    };

    const searchSeries = async (query) => {
        const res = await getTeachingSeries({ search: query, limit: 8 });
        return res.data?.series.teachingSeries ?? [];
    };

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
            if (value !== "" && value !== null && value !== undefined) {
                payload.append(key, value);
            }
        });

        if (imageFile) {
            payload.append("thumbnail", imageFile);
        }

        await onSubmit(payload);

    } catch (err) {
        console.error(err);
        setError(
            mode === "create"
                ? "Failed to create teaching. Please check the form and try again."
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
                    <p>Back to Teachings</p>
                        </div>
                </Link>
            </Button>

            <div>
                <h1 className="text-xl font-semibold text-[#EDEDEF]">
                    {mode === "create" ? "Create Teaching" : "Edit Teaching"}
                </h1>
                <p className="mt-1 text-sm text-[#8A8C94]">
                    {mode === "create"
                        ? "Add a new teaching and link it to a service, series, and department."
                        : "Update this teaching's details."}
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
                            <div className="relative  w-full overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] ">
                                <img
                                    src={previewUrl}
                                    alt="Thumbnail preview"
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
                                placeholder="Gifts, Administrations and Operations"
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="preacher" className="text-[#EDEDEF]">Preacher</Label>
                            <Input
                                id="preacher"
                                value={formData.preacher}
                                onChange={handleChange}
                                placeholder="Pastor Samuel Kosoko"
                                required
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="duration" className="text-[#EDEDEF]">Duration in Minutes</Label>
                            <Input
                                id="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                type='number'
                                placeholder="100"
                                required
                                className="border-[#1C1D22] w-fit bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] border-none focus-visible:ring-[#D62839]"
                            />
                        </div>

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
                        

                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-[#EDEDEF]">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="A short summary of this teaching..."
                                rows={3}
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                            />
                        </div>

                        {/* Relational selects */}
                        <ServerCombobox
                            label="Service"
                            placeholder="Search and select a service"
                            selected={selectedService}
                            onSelect={(option) => {
                                // option === 'None' ? console.log(option): console.log('Option has an Id');
                                console.log(option);
                                
                        
                                setSelectedService(option);
                                setFormData((prev) => ({ ...prev, service: option?._id || "" }));
                            }}
                            fetchOptions={searchServices}
                            renderOption={(s) => (
                                <OptionLine
                                    title={s.title}
                                    subtitle={s.day && s.date ? `${s.day} · ${formatDate(s.date)}` : undefined}
                                />
                            )}
                            renderSelected={(s) => s.title}
                        />

                        <ServerCombobox
                            label="Teaching series"
                            placeholder="Search and select a series"
                            selected={selectedSeries}
                            onSelect={(option) => {
                                setSelectedSeries(option);
                                setFormData((prev) => ({ ...prev, series: option?._id || "" }));
                            }}
                            fetchOptions={searchSeries}
                            renderOption={(s) => (
                                <OptionLine title={s.title} subtitle={formatSeries(s)} />
                            )}
                            renderSelected={(s) => s.title}
                        />

                        <ClientCombobox
                            label="Department"
                            placeholder={isLoadingDepartments ? "Loading..." : "Select a department"}
                            options={departments}
                            value={formData.department}
                            onChange={(id) => setFormData((prev) => ({ ...prev, department: id }))}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="videoUrl" className="text-[#EDEDEF]">Video URL</Label>
                                <Input
                                    id="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    placeholder="https://youtu.be/..."
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="audioUrl" className="text-[#EDEDEF]">Audio URL</Label>
                                <Input
                                    id="audioUrl"
                                    value={formData.audioUrl}
                                    onChange={handleChange}
                                    placeholder="https://t.me/..."
                                    className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
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
                        {mode === "create" ? "Create Teaching" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TeachingForm;