"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Room, RoomFilters } from "@/lib/api";
import { loadRooms, type RoomsResult } from "@/lib/rooms";
import RoomCard, { ROOM_TYPES } from "@/components/RoomCard";

export default function BrowsePage() {
  const [filters, setFilters] = useState<RoomFilters>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const [page, setPage] = useState(1);

  function applyResult(res: RoomsResult) {
    setRooms(res.rooms);
    setTotal(res.total);
    setError(res.error);
    setLoading(false);
  }

  async function search(f: RoomFilters) {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    const result = await loadRooms(f);
    if (id !== requestId.current) return;
    setPage(f.page || 1);
    applyResult(result);
  }

  // Initial load: state is only touched from the promise callback, never
  // synchronously in the effect body (react-hooks/set-state-in-effect).
  useEffect(() => {
    const id = ++requestId.current;
    loadRooms({}).then(result => { if (id === requestId.current) applyResult(result); });
    return () => { requestId.current++; };
  }, []);

  function update<K extends keyof RoomFilters>(key: K, value: string) {
    setFilters((f) => ({ ...f, [key]: value || undefined }));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Browse rooms
      </h1>
      <p className="mt-1 text-muted">
        Verified student rooms near campus. Pilot: Adityapur–Jamshedpur.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm font-medium">
        {[
          ["/app/map", "Map"],
          ["/app/favorites", "Favorites"],
          ["/app/leads", "My leads"],
          ["/app/chats", "Chats"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-navy/15 bg-white px-4 py-1.5 hover:bg-navy hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-peach/30 bg-peach/15 px-4 py-3 text-sm">
          {error} <button onClick={() => search(filters)} className="underline">Try again</button>
        </p>
      )}

      <form
        className="mt-6 grid gap-3 rounded-2xl border border-navy/10 bg-white p-4 sm:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          search(filters);
        }}
      >
        <input
          placeholder="Locality (e.g. Adityapur)"
          className="field"
          value={filters.locality ?? ""}
          onChange={(e) => update("locality", e.target.value)}
        />
        <input
          placeholder="Min rent"
          inputMode="numeric"
          className="field"
          value={filters.min_rent ?? ""}
          onChange={(e) => update("min_rent", e.target.value)}
        />
        <input
          placeholder="Max rent"
          inputMode="numeric"
          className="field"
          value={filters.max_rent ?? ""}
          onChange={(e) => update("max_rent", e.target.value)}
        />
        <select
          className="field"
          value={filters.room_type ?? ""}
          onChange={(e) => update("room_type", e.target.value)}
        >
          <option value="">Any type</option>
          {ROOM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary w-full">
          Search
        </button>
      </form>

      {loading ? (
        <p className="mt-8 text-muted">Loading rooms…</p>
      ) : rooms.length === 0 ? (
        <p className="mt-8 text-muted">
          No rooms match. Try widening the budget or clearing filters.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">
            {total} room{total === 1 ? "" : "s"} found
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button disabled={page <= 1 || loading} className="rounded-full border border-navy/20 px-4 py-2 disabled:opacity-40" onClick={() => search({ ...filters, page: page - 1 })}>Previous</button>
            <span className="text-sm">Page {page} of {Math.max(1, Math.ceil(total / 24))}</span>
            <button disabled={page * 24 >= total || loading} className="rounded-full border border-navy/20 px-4 py-2 disabled:opacity-40" onClick={() => search({ ...filters, page: page + 1 })}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
