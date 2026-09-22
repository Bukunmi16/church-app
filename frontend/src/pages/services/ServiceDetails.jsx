import { getOneService, deleteService } from '@/api/services.api'
import LoadingScreen from '@/components/ui/Loading'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import ErrorPage from '../errors/ErrorPage'
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Clock,
    Mic2,
    MapPin,
    ImageOff,
    PlusCircle,
    Video,
    Music,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// ---- Helpers ----

const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dateString));

// ---- Small building blocks ----

const TypeBadge = ({ type }) => (
    <span className="inline-flex w-fit items-center rounded-full bg-[#12183A] px-2.5 py-1 text-xs font-medium text-[#C7CEEA]">
        {type}
    </span>
);

const TeachingCard = ({ teaching }) => (
    <Link
        to={`/admin/teachings/${teaching._id}`}
        className="flex flex-col overflow-hidden w-40 rounded-xl border border-[#1C1D22] bg-[#111214] transition-colors hover:border-[#2A2B31]"
    >
        <div className="flex h-40 w-full items-center justify-center bg-[#0A0A0C]">
            {teaching.thumbnail?.url ? (
                <img
                    src={teaching.thumbnail.url}
                    alt={teaching.title}
                    className="h-full w-full object-fill"
                />
            ) : (
                <ImageOff size={20} className="text-[#6E7079]" />
            )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
            <p className="truncate text-sm font-medium text-[#EDEDEF]">{teaching.title}</p>
            <div className="flex items-center gap-1.5 text-xs text-[#8A8C94]">
                <Mic2 size={12} className="shrink-0" />
                <span className="truncate">{teaching.preacher}</span>
            </div>
            {(teaching.videoUrl || teaching.audioUrl) && (
                <div className="flex items-center gap-3 text-xs text-[#6E7079]">
                    {teaching.videoUrl && (
                        <span className="flex items-center gap-1">
                            <Video size={12} /> Video
                        </span>
                    )}
                    {teaching.audioUrl && (
                        <span className="flex items-center gap-1">
                            <Music size={12} /> Audio
                        </span>
                    )}
                </div>
            )}
        </div>
    </Link>
);

const ServiceDetails = () => {

    const { serviceId } = useParams()
    const navigate = useNavigate()

    const [service, setService] = useState(null)
    const [relatedTeaching, setRelatedTeaching] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getOneService(serviceId)

                setService(data.service.service)
                setRelatedTeaching(data.service.teachings)
            } catch (error) {
                console.error(error)
                setError('Failed to load this service')
            } finally {
                setIsLoading(false)
            }
        }
        fetchService()
    }, [serviceId])

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteService(serviceId)
            navigate("/admin/services")
        } catch (err) {
            console.error(err)
            setIsDeleting(false)
            setError("Failed to delete this service. Please try again.")
        }
    }

    if (isLoading) {
        return <LoadingScreen/>
    }

    if (error) {
        return <ErrorPage error={error} />
    }

    if (!service) {
        return <ErrorPage error="This service could not be found." />
    }

    const teachings = relatedTeaching ?? []

    return (
        <div className="space-y-6">
            {/* Top bar: back + actions */}
            <div className="flex items-center justify-between">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                >
                    <Link to={'/admin/services'}>
                          <div className='flex justify-between items-center gap-2'>
                        <ArrowLeft size={16} />
                        <p>Back to services</p>
                              </div>                    
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                <Link to='edit'>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                        // TODO: wire up the real edit flow
                        >
                        <Pencil size={14} />
                        Edit
                    </Button>
                        </Link>

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
                                <AlertDialogTitle>Delete this service?</AlertDialogTitle>
                                <AlertDialogDescription className="text-[#8A8C94]">
                                    This will permanently delete "{service.title}". This action
                                    cannot be undone, and any linked teachings will lose their
                                    reference to this service.
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
                                    Delete service
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Service overview: image and details as separate panels */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                {/* Image — standalone */}
                <div className="relative flex  w-full items-center justify-center overflow-hidden rounded-xl border border-[#1C1D22] bg-[#0A0A0C] lg:h-auto">
                    {service.serviceImage?.url ? (
                        <img
                            src={service.serviceImage.url}
                            alt={service.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageOff size={28} className="text-[#6E7079]" />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-[#12183A] px-3 py-1 text-xs font-medium text-white">
                        {service.day}
                    </span>
                    {new Date(service.date) > new Date() &&
                    <span className="absolute right-3 top-3 rounded-full bg-[#D62839] px-2.5 py-1 text-xs font-medium text-white">
                    Upcoming
                    </span>}
                    {new Date(service.date) === new Date() &&
                    <span className="absolute right-3 top-3 rounded-full bg-[#D62839] px-2.5 py-1 text-xs font-medium text-white">
                    Today
                    </span>}

                </div>

                {/* Details — standalone */}
                <div className="h-fit space-y-4 rounded-xl border border-[#1C1D22] bg-[#111214] p-6">
                    <div>
                        <h1 className="text-xl font-semibold text-[#EDEDEF]">{service.title}</h1>
                        <p className="mt-1 text-sm text-[#8A8C94]">{service.theme}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#8A8C94]">
                        <div className="flex items-center gap-1.5">
                            <Clock size={15} className="shrink-0" />
                            <span>
                                {formatDate(service.date)} &middot; {service.startTime} –{" "}
                                {service.endTime}
                            </span>
                        </div>
                        {service.preacher && (
                            <div className="flex items-center gap-1.5">
                                <Mic2 size={15} className="shrink-0" />
                                <span>{service.preacher}</span>
                            </div>
                        )}
                        {service.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={15} className="shrink-0" />
                                <span>{service.location}</span>
                            </div>
                        )}
                    </div>

                    <TypeBadge type={service.serviceType} />

                    {service.description && (
                        <p className="border-t  border-[#1C1D22] pt-4 text-sm leading-relaxed text-[#8A8C94]">
                            {service.description}
                        </p>
                    )}
            {/* Related teachings */}
            <div>
                <div className="border-t border-[#1C1D22] pt-3 mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#EDEDEF]">Related Teachings</h2>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-[#8A8C94] hover:bg-[#141518] hover:text-[#EDEDEF]"
                    >
                        <Link to={`/admin/teachings/new?service=${serviceId}`}>
                          <div className='flex justify-between items-center gap-2'>
                            <PlusCircle size={14} />
                            <p>Add teaching</p>
                              </div>
                        </Link>
                    </Button>
                </div>

                {teachings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {teachings.map((teaching) => (
                            <TeachingCard key={teaching._id} teaching={teaching} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#1C1D22] py-10 text-center">
                        <p className="text-sm text-[#8A8C94]">
                            No teachings linked to this service yet.
                        </p>
                        <Button
                            asChild
                            size="sm"
                            className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                        >
                            <Link to={`/admin/teachings/new?service=${serviceId}`}>
                          <div className='flex justify-between items-center gap-2'>
                                <PlusCircle size={16} />
                                  <p>Add a teaching</p>
                              </div>
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
                </div>
            </div>

        </div>
    )
}

export default ServiceDetails