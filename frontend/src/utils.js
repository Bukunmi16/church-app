export const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export const formatSeries = (series) => {
    const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(series.year, series.month - 1)
    );
    return `${monthName} ${series.year}`;
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

export const formatTimeForInput = (time) => {
  if(!time) return ""
  return time.slice(0, 50) 
} 

export const formatTime = (time) => {
  if (!time) return "—";

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "—";

  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${String(minutes).padStart(2, "0")}${period}`;
};

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const getEventStatus = (event) => {
    const now = startOfDay(new Date());
    const start = startOfDay(event.startDate);
    const end = startOfDay(event.endDate);
    if (start <= now && now <= end) return "today";
    if (start > now) return "upcoming";
    return "past";
};

const startOfServiceDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const getServiceStatus = (service) => {
  const now = startOfServiceDay(new Date());
  const start = startOfServiceDay(service.date);

  if (start.getTime() === now.getTime()) {
    return "today";
  }

  if (start > now) {
    return "upcoming";
  }

  return service.day;
};