import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "./Container";
import Reveal from "./Reveal";
import LandingImage from "./LandingImage";
import { LANDING_IMAGES } from "../Landing.config";
import { FOCUS_RING, scrollToSection } from "../Landing.utils";

const Hero = ({ church }) => {
    const [mounted, setMounted] = useState(false);

    // Starts the slow zoom on the background photo
    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const goTo = (id) => (e) => {
        e.preventDefault();
        scrollToSection(id);
    };

    return (
        <section
            id="home"
            tabIndex={-1}
            aria-labelledby="hero-heading"
            className="relative flex min-h-[100svh] items-center overflow-hidden focus:outline-none"
        >
            {/* Background photo (or branded gradient) */}
            <div
                className={`absolute inset-0 transition-transform duration-[9000ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                    mounted ? "scale-100" : "scale-110"
                }`}
            >
                <LandingImage
                    src={LANDING_IMAGES.hero}
                    priority
                    showFallbackIcon={false}
                    className="h-full w-full"
                />
            </div>

            {/* Readability overlays + soft red glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,10,12,0.92)_0%,rgba(10,10,12,0.65)_55%,rgba(10,10,12,0.35)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,#0A0A0C,transparent)]" />
            <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#D62839]/15 blur-3xl" />

            <Container className="relative z-10 pb-24 pt-28">
                <div className="max-w-2xl">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D62839] sm:text-sm">
                            {church.name}
                        </p>
                    </Reveal>

                    <Reveal delay={100}>
                        <h1
                            id="hero-heading"
                            className="mt-4 text-5xl font-fancy  font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
                        >
                            Home of the{" "}
                            <span className="font- text-[1.15em] font-normal text-[#D62839]">Blessed People</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={200}>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                            You're welcome here. Come as you are, meet with God, and find a church family in
                            Ogbomoso.
                        </p>
                    </Reveal>

                    <Reveal delay={300} className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className={`gap-2 bg-[#D62839]  px-7 text-white hover:bg-[#B91F2E] ${FOCUS_RING}`}
                        >
                            <a href="#services" onClick={goTo("services")}>
                            <span className="flex items-center gap-2">
                                Plan Your Visit
                                <ArrowRight size={16} />
                            </span>
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className={`border-white/25 bg-white/5 px-7 text-white backdrop-blur hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
                        >
                            <a href="#welcome" onClick={goTo("welcome")}>
                                Explore Our Church
                            </a>
                        </Button>
                    </Reveal>
                </div>
            </Container>

            <a
                href="#welcome"
                onClick={goTo("welcome")}
                aria-label="Scroll to the welcome section"
                className={`absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 rounded-full p-2 text-white/60 transition-colors hover:text-white sm:block ${FOCUS_RING}`}
            >
                <ChevronDown size={26} className="animate-bounce motion-reduce:animate-none" />
            </a>
        </section>
    );
};

export default Hero;