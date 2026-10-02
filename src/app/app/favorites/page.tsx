"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRoom, listMyFavorites, type Room } from "@/lib/api";
import RoomCard from "@/components/RoomCard";

export default function FavoritesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const favs = await listMyFavorites();
        const details = await Promise.all(
          favs.map((f) => getRoom(f.room_id).catch(() => null)),
        );
        setRooms(details.filter((r): r is Room => r !== null));
      } catch (e) {
        setMessage(
          e instanceof Error ? e.message : "Could not load favorites.",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Favorites
      </h1>
      {loading ? (
        <p className="mt-4 text-muted">Loading…</p>
      ) : message ? (
        <div className="mt-4 rounded-2xl border border-navy/10 bg-white p-6">
          <p className="text-muted">{message}</p>
          <Link href="/login" className="mt-2 inline-block underline">
            Log in to see favorites
          </Link>
        </div>
      ) : rooms.length === 0 ? (
        <p className="mt-4 text-muted">
          No favorites yet. Tap “Save” on any room to keep it here.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      )}
    </div>
  );
}
