export const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62839] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C]";

// Event images are usually { url, publicId } but some older records store a bare string
export const getImageUrl = (image) => (typeof image === "string" ? image : image?.url) || "";

// Dates are stored as midnight UTC, so format in UTC to show the intended day for any visitor
const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

export const formatDate = (value) => (value ? dateFormatter.format(new Date(value)) : "");

const utcDay = (value) => {
    const d = new Date(value);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

const localToday = () => {
    const n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
};

export const formatDateRange = (start, end) => {
    if (!start) return "";
    if (!end || utcDay(start) === utcDay(end)) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
};

export const eventDateParts = (value) => {
    const d = new Date(value);
    return {
        month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(d),
        day: d.getUTCDate(),
    };
};

// "today" also covers multi-day events that are currently running
export const getEventStatus = (event) => {
    const today = localToday();
    const start = utcDay(event.startDate);
    const end = utcDay(event.endDate ?? event.startDate);
    if (start <= today && today <= end) return "today";
    if (start > today) return "upcoming";
    return "past";
};

export const isUpcomingEvent = (event) => getEventStatus(event) !== "past";

export const mapsUrl = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
};