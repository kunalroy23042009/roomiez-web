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

export interface Lead {
  id: string;
  room_id: string;
  room_title?: string | null;
  locality?: string | null;
  lead_type: string;
  lead_status: string;
  visit_slot?: string | null;
  created_at: string;
}

export interface ContactLeadResult {
  owner_phone?: string | null;
  lead?: Lead | null;
}

export interface Favorite {
  id: string;
  room_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  room_id: string;
  student_name?: string | null;
  rating: number;
  body?: string | null;
  created_at: string;
}

export interface ReviewSummary {
  room_id: string;
  count: number;
  avg_rating: number | null;
}

export interface Conversation {
  id: string;
  lead_id: string;
  room_id?: string | null;
  room_title?: string | null;
  other_name?: string | null;
  last_body?: string | null;
  last_at?: string | null;
  unread_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_name?: string | null;
  mine: boolean;
  body: string;
  is_read: boolean;
  created_at: string;
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
): Promise<Lead> {
  return apiFetch<Lead>("/leads/visit", {
    method: "POST",
    body: JSON.stringify({ room_id, visit_slot }),
  });
}

export async function listMyLeads(): Promise<Lead[]> {
  return apiFetch<Lead[]>("/leads/mine");
}

export async function cancelLead(lead_id: string): Promise<Lead> {
  return apiFetch<Lead>(`/leads/${lead_id}`, {
    method: "PATCH",
    body: JSON.stringify({ lead_status: "CLOSED_LOST" }),
  });
}

export async function listMyFavorites(): Promise<Favorite[]> {
  return apiFetch<Favorite[]>("/favorites/mine");
}

export async function addFavorite(room_id: string): Promise<Favorite> {
  return apiFetch<Favorite>(`/favorites/${room_id}`, { method: "POST" });
}

export async function removeFavorite(room_id: string): Promise<void> {
  await apiFetch(`/favorites/${room_id}`, { method: "DELETE" });
}

export async function listReviews(room_id: string): Promise<Review[]> {
  return apiFetch<Review[]>(`/rooms/${room_id}/reviews`);
}

export async function reviewSummary(room_id: string): Promise<ReviewSummary> {
  return apiFetch<ReviewSummary>(`/rooms/${room_id}/reviews/summary`);
}

export async function postReview(
  room_id: string,
  rating: number,
  body?: string,
): Promise<Review> {
  return apiFetch<Review>("/reviews", {
    method: "POST",
    body: JSON.stringify({ room_id, rating, body: body || undefined }),
  });
}

export async function listConversations(): Promise<Conversation[]> {
  return apiFetch<Conversation[]>("/conversations/mine");
}

export async function openConversation(lead_id: string): Promise<Conversation> {
  return apiFetch<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify({ lead_id }),
  });
}

export async function listMessages(conv_id: string): Promise<ChatMessage[]> {
  return apiFetch<ChatMessage[]>(`/conversations/${conv_id}/messages`);
}

export async function sendMessage(
  conv_id: string,
  body: string,
): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(`/conversations/${conv_id}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function markConversationRead(conv_id: string): Promise<void> {
  await apiFetch(`/conversations/${conv_id}/read`, { method: "PATCH" });
}
