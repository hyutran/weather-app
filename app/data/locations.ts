export interface Location {
  name: string;
  slug: string;
  lat: number;
  lon: number;
}
export const locations: Location[] = [
  { name: "Hanoi", slug: "hanoi", lat: 21.0285, lon: 105.8542 },
  { name: "Ho Chi Minh City", slug: "ho-chi-minh-city", lat: 10.8231, lon: 106.6297 },
  { name: "Da Lat", slug: "da-lat", lat: 11.9404, lon: 108.4583 },
  { name: "Hoi An", slug: "hoi-an", lat: 15.8801, lon: 108.338 },
  { name: "Phu Quoc", slug: "phu-quoc", lat: 10.2899, lon: 103.984 },
  { name: "Con Dao", slug: "con-dao", lat: 8.6833, lon: 106.6167 },
];
export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((location) => location.slug === slug);
}