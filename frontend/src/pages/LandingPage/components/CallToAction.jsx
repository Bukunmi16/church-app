import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "./Container";
import Reveal from "./Reveal";
import { ROUTES } from "../Landing.config";
import { FOCUS_RING, scrollToSection } from "../Landing.utils";

const CallToAction = ({ church }) => (
    <section aria-labelledby="cta-heading" className="py-20 sm:py-28">
        <Container>
            <Reveal className="relative overflow-hidden rounded-3xl border border-[#1C1D22] bg-[linear-gradient(135deg,#12183A_0%,#0D0E11_70%)] px-6 py-14 text-center sm:px-12 sm:py-20">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D62839]/20 blur-3xl"
                />
                <div className="relative mx-auto max-w-2xl">
                    <h2
                        id="cta-heading"
                        className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                    >
                        There's a place for you at {church.name}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
                        Join us for a service this week, or create an account to stay connected with teachings
                        and events.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className={`gap-2 bg-[#D62839] px-7 text-white hover:bg-[#B91F2E] ${FOCUS_RING}`}
                        >
                            <a
                                href="#services"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection("services");
                                }}
                            >
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
                            className={`border-white/25 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
                        >
                            <Link to={ROUTES.register}>Create an Account</Link>
                        </Button>
                    </div>

                    <p className="mt-5 text-sm text-white/60">
                        Already have an account?{" "}
                        <Link
                            to={ROUTES.login}
                            className={`rounded font-medium text-white underline-offset-4 hover:underline ${FOCUS_RING}`}
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </Reveal>
        </Container>
    </section>
);

export default CallToAction;