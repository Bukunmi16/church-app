import { Link } from "react-router";
import { CalendarDays, Mic2, Play, Headphones, Lock, ArrowRight } from "lucide-react";
import { getTeachings } from "@/api/teachings.api";
import Container from "./Container";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LandingImage from "./LandingImage";
import AsyncState, { SkeletonGrid } from "./AsyncState";
import { DETAIL_PATHS, ROUTES } from "../landing.config";
import { useAsyncList } from "../landing.hooks";
import { FOCUS_RING, formatDate } from "../landing.utils";

const fetchLatestTeachings = async () => {
    const { data } = await getTeachings({ page: 1, limit: 6, sortBy: "createdAt", sortOrder: "desc" });
    return data.teachings?.teachings ?? data.teachings ?? [];
};

const TeachingCard = ({ teaching }) => {
    // Prefer the date of the service it was preached at; fall back to when it was uploaded
    const date = formatDate(teaching.service?.date ?? teaching.createdAt);

    return (
        <Link
            to={ROUTES.login}
            state={{ from: DETAIL_PATHS.teaching(teaching._id) }}
            className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1C1D22] bg-[#111214] transition-all duration-300 hover:-translate-y-1 hover:border-[#2A2B31] hover:shadow-[0_20px_40px_-20px_rgba(214,40,57,0.3)] motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
        >
            <div className="relative  overflow-hidden">
                <LandingImage
                    src={teaching.thumbnail?.url}
                    alt={`${teaching.title} thumbnail`}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,12,0.55),transparent_60%)]" />
                {teaching.videoUrl && (
                    <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#D62839] text-white shadow-lg transition-transform group-hover:scale-110 motion-reduce:transition-none">
                        <Play size={15} className="ml-0.5" aria-hidden="true" />
                        <span className="sr-only">Includes video</span>
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-base font-semibold text-[#EDEDEF]">{teaching.title}</h3>

                <div className="space-y-1.5 text-xs text-[#8A8C94]">
                    {teaching.preacher && (
                        <p className="flex items-center gap-1.5">
                            <Mic2 size={13} className="shrink-0" aria-hidden="true" />
                            <span className="truncate">{teaching.preacher}</span>
                        </p>
                    )}
                    {date && (
                        <p className="flex items-center gap-1.5">
                            <CalendarDays size={13} className="shrink-0" aria-hidden="true" />
                            {date}
                        </p>
                    )}
                    {teaching.audioUrl && (
                        <p className="flex items-center gap-1.5">
                            <Headphones size={13} className="shrink-0" aria-hidden="true" />
                            Audio available
                        </p>
                    )}
                </div>

                <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-medium text-[#6E7079] transition-colors group-hover:text-[#D62839]">
                    <Lock size={12} aria-hidden="true" />
                    Sign in to view details
                </p>
            </div>
        </Link>
    );
};

const GRID = "sm:grid-cols-2 lg:grid-cols-3";

const TeachingsSection = () => {
    const { status, data, retry } = useAsyncList(fetchLatestTeachings);

    return (
        <section
            id="teachings"
            tabIndex={-1}
            aria-labelledby="teachings-heading"
            className="scroll-mt-20 border-y border-[#1C1D22] bg-[#0D0E11] py-20 focus:outline-none sm:py-28"
        >
            <Container>
                <Reveal>
                    <SectionHeading
                        id="teachings-heading"
                        eyebrow="Grow in the Word"
                        title="Latest teachings"
                        description="Catch up on recent messages from our services."
                    />
                </Reveal>

                <div className="mt-12">
                    <AsyncState
                        status={status}
                        onRetry={retry}
                        skeleton={<SkeletonGrid count={3} aspect="aspect-video" gridClassName={GRID} />}
                        emptyMessage="No teachings have been uploaded yet. Please check back soon."
                        errorMessage="We couldn't load the latest teachings. Please try again."
                    >
                        <ul className={`grid grid-cols-1 gap-5 ${GRID}`}>
                            {data.map((teaching, i) => (
                                <Reveal as="li" key={teaching._id} delay={i * 80} className="h-full">
                                    <TeachingCard teaching={teaching} />
                                </Reveal>
                            ))}
                        </ul>
                    </AsyncState>
                </div>

                {status === "success" && (
                    <div className="mt-8 text-center">
                        <Link
                            to={ROUTES.login}
                            className={`inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#EDEDEF] transition-all hover:gap-3 hover:text-[#D62839] ${FOCUS_RING}`}
                        >
                            Sign in to see all teachings
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default TeachingsSection;