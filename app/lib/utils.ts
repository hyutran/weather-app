export function getCurrentTimeInTimezone(timezone: string): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
}

export function getDayName(dateString: string, index: number): string {
  if (index === 0) return "Today";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { weekday: "long" });
}