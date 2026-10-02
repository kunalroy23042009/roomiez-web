"use client";

import { useEffect, useState } from "react";
import type { Room } from "@/lib/api";
import { loadRooms } from "@/lib/rooms";
import RoomCard from "./RoomCard";

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadRooms({})
      .then((res) => setRooms(res.rooms.slice(0, 3)))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="grid gap-5 sm:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-navy/10 bg-white"
          >
            <div className="aspect-[4/3] w-full bg-cream-dark" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/3 rounded bg-cream-dark" />
              <div className="h-5 w-5/6 rounded bg-cream-dark" />
              <div className="h-6 w-1/2 rounded bg-cream-dark" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {rooms.map((r) => (
        <RoomCard key={r.id} room={r} />
      ))}
    </div>
  );
}
