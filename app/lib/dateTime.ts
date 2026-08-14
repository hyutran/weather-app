// Returns the current time (e.g. "3:45 PM") formatted for the given IANA timezone.
export function getCurrentTimeInTimezone(timezone: string): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
}

// Formats a date string as "day month" (e.g. "14 August").
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
}

// Returns "Today" for index 0, otherwise the full weekday name for the given date.
export function getDayName(dateString: string, index: number): string {
  if (index === 0) return "Today";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { weekday: "long" });
}

// Determines whether it's currently night (before sunrise or after sunset) in the given timezone.
export function isNightTime(
  timezone: string,
  sunrise: string,
  sunset: string
): boolean {
  const current = new Date();
  const currentTime = new Date(current.toLocaleString("en-US", { timeZone: timezone }));

  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  
  return currentTime < sunriseTime || currentTime > sunsetTime;
}