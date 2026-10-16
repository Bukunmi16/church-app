import { ArrowRight } from "lucide-react";
import Container from "./Container";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LandingImage from "./LandingImage";
import { LANDING_IMAGES } from "../Landing.config";
import { FOCUS_RING, scrollToSection } from "../Landing.utils";

const WelcomeSection = ({ church }) => (
    <section
        id="welcome"
        tabIndex={-1}
        aria-labelledby="welcome-heading"
        className="scroll-mt-20 py-20 focus:outline-none sm:py-28"
    >
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
                {/* Offset frame behind the photo */}
                <div
                    aria-hidden="true"
                    className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl border border-[#D62839]/40"
                />
                <LandingImage
                    src={LANDING_IMAGES.welcome}
                    alt=""
                    className="relative aspect-[4/5] w-full rounded-2xl border border-[#1C1D22]"
                />
            </Reveal>

            <div>
                <Reveal>
                    <SectionHeading
                        id="welcome-heading"
                        align="left"
                        eyebrow="Welcome"
                        title={`Welcome to ${church.name}`}
                    />
                </Reveal>

                <Reveal delay={100} className="mt-6 space-y-4 text-base leading-relaxed text-[#8A8C94]">
                    <p>
                        Rhema Chapel is a place to meet with God, grow in His Word, and belong to a family.
                        Whether you're visiting for the first time or looking for a church home, we're glad
                        you're here.
                    </p>
                    <p>
                        Join us for celebration, teaching, and prayer through the week, and come as you are.
                    </p>
                </Reveal>

                {church.motto && (
                    <Reveal delay={200}>
                        <p className="mt-8 border-l-2 border-[#D62839] pl-4 font-fancy text-3xl text-[#EDEDEF]">
                            {church.motto}
                        </p>
                    </Reveal>
                )}

                <Reveal delay={300}>
                    <a
                        href="#services"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection("services");
                        }}
                        className={`mt-8 inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#EDEDEF] transition-all hover:gap-3 hover:text-[#D62839] ${FOCUS_RING}`}
                    >
                        See when we meet
                        <ArrowRight size={16} />
                    </a>
                </Reveal>
            </div>
        </Container>
    </section>
);

export default WelcomeSection;