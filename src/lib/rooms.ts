import { listRooms, type Room, type RoomFilters } from "./api";

export interface RoomsResult {
  rooms: Room[];
  total: number;
  demo: boolean;
  error: string | null;
}

/** Inventory comes exclusively from the shared mobile backend. */
export async function loadRooms(filters: RoomFilters): Promise<RoomsResult> {
  try {
    const res = await listRooms(filters);
    return { rooms: res.items, total: res.total, demo: false, error: null };
  } catch (e) {
    return {
      rooms: [],
      total: 0,
      demo: false,
      error:
        e instanceof Error ? e.message : "Could not reach the Roomiez API.",
    };
  }
}
