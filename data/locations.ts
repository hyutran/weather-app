export interface Location {
  name: string;
  slug: string;
  lat: number;
  lon: number;
}

export const locations: Location[] = [
  { name: "New York", slug: "new-york", lat: 40.7128, lon: -74.006 },
  { name: "Los Angeles", slug: "los-angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Toronto", slug: "toronto", lat: 43.6532, lon: -79.3832 },
  { name: "Mexico City", slug: "mexico-city", lat: 19.4326, lon: -99.1332 },
  { name: "Bogotá", slug: "bogota", lat: 4.711, lon: -74.0721 },
  { name: "Lima", slug: "lima", lat: -12.0464, lon: -77.0428 },
  { name: "São Paulo", slug: "sao-paulo", lat: -23.5505, lon: -46.6333 },
  { name: "Buenos Aires", slug: "buenos-aires", lat: -34.6037, lon: -58.3816 },
  { name: "Santiago", slug: "santiago", lat: -33.4489, lon: -70.6693 },
  { name: "London", slug: "london", lat: 51.5072, lon: -0.1276 },
  { name: "Paris", slug: "paris", lat: 48.8566, lon: 2.3522 },
  { name: "Berlin", slug: "berlin", lat: 52.52, lon: 13.405 },
  { name: "Madrid", slug: "madrid", lat: 40.4168, lon: -3.7038 },
  { name: "Rome", slug: "rome", lat: 41.9028, lon: 12.4964 },
  { name: "Amsterdam", slug: "amsterdam", lat: 52.3676, lon: 4.9041 },
  { name: "Stockholm", slug: "stockholm", lat: 59.3293, lon: 18.0686 },
  { name: "Moscow", slug: "moscow", lat: 55.7558, lon: 37.6173 },
  { name: "Istanbul", slug: "istanbul", lat: 41.0082, lon: 28.9784 },
  { name: "Cairo", slug: "cairo", lat: 30.0444, lon: 31.2357 },
  { name: "Lagos", slug: "lagos", lat: 6.5244, lon: 3.3792 },
  { name: "Nairobi", slug: "nairobi", lat: -1.2921, lon: 36.8219 },
  { name: "Cape Town", slug: "cape-town", lat: -33.9249, lon: 18.4241 },
  { name: "Casablanca", slug: "casablanca", lat: 33.5731, lon: -7.5898 },
  { name: "Dubai", slug: "dubai", lat: 25.2048, lon: 55.2708 },
  { name: "Riyadh", slug: "riyadh", lat: 24.7136, lon: 46.6753 },
  { name: "Mumbai", slug: "mumbai", lat: 19.076, lon: 72.8777 },
  { name: "New Delhi", slug: "new-delhi", lat: 28.6139, lon: 77.209 },
  { name: "Bangkok", slug: "bangkok", lat: 13.7563, lon: 100.5018 },
  { name: "Singapore", slug: "singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Jakarta", slug: "jakarta", lat: -6.2088, lon: 106.8456 },
  { name: "Hanoi", slug: "hanoi", lat: 21.0285, lon: 105.8542 },
  { name: "Ho Chi Minh City", slug: "ho-chi-minh-city", lat: 10.8231, lon: 106.6297 },
  { name: "Da Lat", slug: "da-lat", lat: 11.9404, lon: 108.4583 },
  { name: "Hoi An", slug: "hoi-an", lat: 15.8801, lon: 108.338 },
  { name: "Phu Quoc", slug: "phu-quoc", lat: 10.2899, lon: 103.984 },
  { name: "Con Dao", slug: "con-dao", lat: 8.6833, lon: 106.6167 },
  { name: "Beijing", slug: "beijing", lat: 39.9042, lon: 116.4074 },
  { name: "Shanghai", slug: "shanghai", lat: 31.2304, lon: 121.4737 },
  { name: "Hong Kong", slug: "hong-kong", lat: 22.3193, lon: 114.1694 },
  { name: "Seoul", slug: "seoul", lat: 37.5665, lon: 126.978 },
  { name: "Tokyo", slug: "tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", slug: "sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", slug: "melbourne", lat: -37.8136, lon: 144.9631 },
  { name: "Auckland", slug: "auckland", lat: -36.8485, lon: 174.7633 },
  { name: "Reykjavik", slug: "reykjavik", lat: 64.1466, lon: -21.9426 },
  { name: "Anchorage", slug: "anchorage", lat: 61.2181, lon: -149.9003 },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((location) => location.slug === slug);
}
