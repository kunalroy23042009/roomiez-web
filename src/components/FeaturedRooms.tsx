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
      <div className="grid gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl border border-navy/10 bg-white"
          />
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
