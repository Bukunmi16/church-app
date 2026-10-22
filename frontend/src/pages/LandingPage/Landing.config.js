import { Sparkles, BookOpen, Flame } from "lucide-react";

// ---------------------------------------------------------------------------
// Everything below is content/config you may want to edit. Nothing here is
// fetched from the API (per requirements, the service schedule is fixed).
// ---------------------------------------------------------------------------

// Where "Login" and "Create Account" go. Change if your routes differ.
export const ROUTES = {
    login: "/login",
    register: "/register",
    teachings: "/view-teachings",
    events: "/view-events"
};

// Where a visitor should land AFTER logging in, when they clicked an event or
// teaching. Passed to the Login page via router state (`location.state.from`).
// Adjust to your real member/worker detail routes.
export const DETAIL_PATHS = {
    event: (id) => `/app/events/${id}`,
    teaching: (id) => `/app/teachings/${id}`,
};

// Paste your image URLs here. An empty string falls back to a branded
// navy gradient, so the page still looks intentional without photos.
export const LANDING_IMAGES = {
    hero: "https://res.cloudinary.com/jkjwwa8p/image/upload/v1791862184/follow_up.jpg",
    welcome: "https://res.cloudinary.com/jkjwwa8p/image/upload/v1791860007/ushering.jpg",
    services: "https://res.cloudinary.com/jkjwwa8p/image/upload/v1791862185/worship2.jpg",
};

export const NAV_LINKS = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Teachings", id: "teachings" },
    { label: "Events", id: "events" },
];

export const NAV_SECTION_IDS = NAV_LINKS.map((link) => link.id);

// Fixed weekly schedule (intentionally NOT fetched from the API).
export const WEEKLY_SERVICES = [
    { id: "sunday", day: "Sundays", time: "8:00 AM", name: "Celebration Service", icon: Sparkles },
    { id: "wednesday", day: "Wednesdays", time: "5:30 PM – 7:00 PM", name: "Teaching Service", icon: BookOpen },
    { id: "friday", day: "Fridays", time: "5:30 PM – 7:00 PM", name: "Prayer Service", icon: Flame },
];

// Revealed by the "Show More" toggle.
export const SUNDAY_BREAKDOWN = [
    { label: "First Sunday", detail: "Spirit Service or Communion Service" },
    { label: "Second and third Sundays", detail: "Celebration Service (our regular Sunday service)" },
    { label: "Last Sunday", detail: "Thanksgiving Service" },
];

// Social links are only rendered when listed here. Left empty on purpose so
// nothing is invented. platform: "youtube" | "telegram" | anything else (uses a generic icon)
export const SOCIAL_LINKS = [
    // { platform: "youtube", label: "YouTube", url: "https://youtube.com/..." },
    // { platform: "telegram", label: "Telegram", url: "https://t.me/..." },
];

// Used ONLY while church info hasn't loaded (or if that endpoint isn't public).
// Values come from the church info you shared in Settings.
export const CHURCH_FALLBACK = {
    name: "Rhema Chapel Ogbomoso",
    motto: "Home of the Blessed People",
    address: "Behind Lautech College of Health Sciences, Ogbomoso-Ilorin Expressway, Ogbomoso",
    phone: "08081650894",
    email: "rhemachapelogbomoso@gmail.com",
    website: "rhemachapelogbomoso.com",
    x: "https://x.com/RhemaOgbomoso",
    facebook: "https://web.facebook.com/RhemaOgbomoso",
    instagram: "https://www.instagram.com/rhemaogbomoso/",
    youtube: "https://www.youtube.com/@RhemaOgbomoso"
};