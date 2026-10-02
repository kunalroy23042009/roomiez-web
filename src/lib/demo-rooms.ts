import type { Room } from "./api";

/**
 * Shown when the FastAPI backend is unreachable or no token is present.
 * Lets the whole site (landing + browse + details) work as a demo.
 */
export const DEMO_ROOMS: Room[] = [
  {
    id: "demo-1",
    title: "Sunny single room near NIT Jamshedpur",
    description:
      "Well-ventilated single room, 10 min walk from the NIT gate. Attached washroom, power backup, and home-cooked mess next door.",
    locality: "Adityapur",
    area: "Mango Chowk",
    address_text: "Plot 12, Mango Chowk, Adityapur",
    latitude: 22.79,
    longitude: 86.14,
    monthly_rent: 4500,
    deposit_amount: 9000,
    room_type: "SINGLE",
    occupancy: 1,
    gender_preference: "ANY",
    furnishing: "SEMI",
    amenities: ["WiFi", "Attached washroom", "Power backup", "Mess nearby"],
    owner_name: "Demo Owner",
    owner_phone: null,
    status: "ACTIVE",
    photos: [
      "https://picsum.photos/seed/roomiez1/800/600",
      "https://picsum.photos/seed/roomiez1b/800/600",
    ],
    videos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Twin-sharing PG for girls, Bistupur",
    description:
      "Safe girls PG with warden, CCTV and 3-time meals. Market, bus stop and coaching hub within 500 m.",
    locality: "Bistupur",
    area: "Main Road",
    address_text: "Main Road, Bistupur, Jamshedpur",
    latitude: 22.8,
    longitude: 86.18,
    monthly_rent: 6000,
    deposit_amount: 6000,
    room_type: "PG",
    occupancy: 2,
    gender_preference: "FEMALE",
    furnishing: "FULLY",
    amenities: ["WiFi", "Meals", "CCTV", "Warden", "Laundry"],
    owner_name: "Demo Owner",
    owner_phone: null,
    status: "ACTIVE",
    photos: ["https://picsum.photos/seed/roomiez2/800/600"],
    videos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Budget 1RK for students, Sakchi",
    description:
      "Compact 1RK with kitchenette — ideal for two friends sharing. Independent entry, water 24x7.",
    locality: "Sakchi",
    area: "Aam Bagan",
    address_text: "Aam Bagan, Sakchi, Jamshedpur",
    latitude: 22.79,
    longitude: 86.2,
    monthly_rent: 5500,
    deposit_amount: 11000,
    room_type: "1RK",
    occupancy: 2,
    gender_preference: "MALE",
    furnishing: "UNFURNISHED",
    amenities: ["Independent entry", "Kitchenette", "24x7 water"],
    owner_name: "Demo Owner",
    owner_phone: null,
    status: "ACTIVE",
    photos: ["https://picsum.photos/seed/roomiez3/800/600"],
    videos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function filterDemoRooms(filters: {
  locality?: string;
  min_rent?: string;
  max_rent?: string;
  room_type?: string;
}): Room[] {
  return DEMO_ROOMS.filter((r) => {
    if (
      filters.locality &&
      !`${r.locality} ${r.area ?? ""}`
        .toLowerCase()
        .includes(filters.locality.toLowerCase())
    )
      return false;
    if (filters.min_rent && r.monthly_rent < Number(filters.min_rent))
      return false;
    if (filters.max_rent && r.monthly_rent > Number(filters.max_rent))
      return false;
    if (filters.room_type && r.room_type !== filters.room_type) return false;
    return true;
  });
}
