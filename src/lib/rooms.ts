import { listRooms, type Room, type RoomFilters } from "./api";
import { filterDemoRooms } from "./demo-rooms";

export interface RoomsResult {
  rooms: Room[];
  total: number;
  demo: boolean;
  error: string | null;
}

/** Live rooms from the API, demo rooms when unreachable/unauthenticated. */
export async function loadRooms(filters: RoomFilters): Promise<RoomsResult> {
  try {
    const res = await listRooms(filters);
    return { rooms: res.items, total: res.total, demo: false, error: null };
  } catch (e) {
    const items = filterDemoRooms(filters);
    return {
      rooms: items,
      total: items.length,
      demo: true,
      error:
        e instanceof Error ? e.message : "Could not reach the Roomiez API.",
    };
  }
}
