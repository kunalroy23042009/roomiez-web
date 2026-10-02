"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Room } from "@/lib/api";
import { loadRooms } from "@/lib/rooms";

const RoomMap = dynamic(() => import("@/components/RoomMap"), { ssr: false });

export default function MapPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms({}).then((res) => {
      setRooms(res.rooms);
      setDemo(res.demo);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Rooms near you
      </h1>
      <p className="mt-1 text-muted">
        Pins around Adityapur–Jamshedpur. Tap a price to preview the room.
      </p>
      {demo && !loading && (
        <p className="mt-4 rounded-xl border border-peach/30 bg-peach/15 px-4 py-3 text-sm">
          Demo pins — log in with the backend running for live locations.
        </p>
      )}
      <div className="mt-6">
        {loading ? (
          <p className="text-muted">Loading map…</p>
        ) : (
          <RoomMap rooms={rooms} />
        )}
      </div>
    </div>
  );
}
