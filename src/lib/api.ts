import { getAccessToken } from "./supabase";

export interface Room {
  id: string;
  title: string;
  description?: string | null;
  locality: string;
  area?: string | null;
  address_text?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  monthly_rent: number;
  deposit_amount: number;
  room_type: string;
  occupancy: number;
  gender_preference: string;
  furnishing: string;
  amenities: string[];
  owner_name?: string | null;
  owner_phone?: string | null;
  status: string;
  photos: string[];
  videos: string[];
  created_at: string;
  updated_at: string;
}

export interface PagedRooms {
  items: Room[];
  page: number;
  limit: number;
  total: number;
}

export interface RoomFilters {
  locality?: string;
  min_rent?: string;
  max_rent?: string;
  room_type?: string;
  page?: number;
}

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail =
      typeof body?.detail === "string" ? body.detail : `Request failed (${res.status}).`;
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function listRooms(filters: RoomFilters): Promise<PagedRooms> {
  const params = new URLSearchParams({ limit: "24" });
  if (filters.locality) params.set("locality", filters.locality);
  if (filters.min_rent) params.set("min_rent", filters.min_rent);
  if (filters.max_rent) params.set("max_rent", filters.max_rent);
  if (filters.room_type) params.set("room_type", filters.room_type);
  if (filters.page) params.set("page", String(filters.page));
  return apiFetch<PagedRooms>(`/rooms?${params.toString()}`);
}

export async function getRoom(id: string): Promise<Room> {
  return apiFetch<Room>(`/rooms/${id}`);
}

/** Create/refresh the Roomiez profile for the signed-in user (defaults to STUDENT). */
export async function syncProfile(): Promise<unknown> {
  return apiFetch("/auth/sync", { method: "POST", body: JSON.stringify({}) });
}

export interface ContactLeadResult {
  owner_phone?: string | null;
  lead?: unknown;
}

export async function createContactLead(
  room_id: string,
): Promise<ContactLeadResult> {
  return apiFetch<ContactLeadResult>("/leads/contact", {
    method: "POST",
    body: JSON.stringify({ room_id }),
  });
}

export async function createVisitLead(
  room_id: string,
  visit_slot: string,
): Promise<{ lead?: unknown }> {
  return apiFetch("/leads/visit", {
    method: "POST",
    body: JSON.stringify({ room_id, visit_slot }),
  });
}
