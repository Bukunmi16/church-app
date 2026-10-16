import LandingNavbar from "./components/LandingNavbar";
import Hero from "./components/Hero";
import WelcomeSection from "./components/WelcomeSection";
import ServicesSection from "./components/ServicesSection";
import EventsSection from "./components/EventsSection";
import TeachingsSection from "./components/TeachingsSection";
import CallToAction from "./components/CallToAction";
import LandingFooter from "./components/LandingFooter";
import { useChurchProfile } from "./Landing.hooks.js";

// Public page: no auth, and deliberately outside the dashboard layout.
const LandingPage = () => {
    const church = useChurchProfile();
    console.log(church);
    
    return (
        <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDEF] antialiased">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#D62839] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
            >
                Skip to main content
            </a>

            <LandingNavbar church={church} />

            <main id="main-content">
                <Hero church={church} />
                <WelcomeSection church={church} />
                <ServicesSection church={church} />
                <TeachingsSection />
                <EventsSection />
                <CallToAction church={church} />
            </main>

            <LandingFooter church={church} />
        </div>
    );
};

export default LandingPage;