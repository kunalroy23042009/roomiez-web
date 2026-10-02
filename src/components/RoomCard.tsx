import Link from "next/link";
import type { Room } from "@/lib/api";

export const ROOM_TYPES = ["SINGLE", "SHARING", "1RK", "1BHK", "2BHK", "PG"];

export function formatRent(n: number): string {
  return `₹${n.toLocaleString("en-IN")}/mo`;
}

/** Door-plate card: mono wayfinding eyebrow, plan-style tags, stamp price. */
export default function RoomCard({ room }: { room: Room }) {
  const photo = room.photos[0];
  return (
    <Link
      href={`/app/rooms/${room.id}`}
      className="group overflow-hidden rounded-2xl border border-navy/10 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={room.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="blueprint-grid flex h-48 w-full items-center justify-center font-mono text-xs tracking-widest text-muted">
            PLAN — PHOTO PENDING
          </div>
        )}
        <span className="absolute left-3 top-3 -rotate-3 rounded border-2 border-peach bg-cream px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest text-peach-dark">
          ✓ VERIFIED
        </span>
      </div>
      <div className="p-4">
        <p className="font-mono text-[11px] tracking-widest text-muted">
          {room.locality.toUpperCase()}
          {room.area ? ` · ${room.area.toUpperCase()}` : ""}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug group-hover:underline">
          {room.title}
        </h3>
        <p className="mt-2 font-display text-xl font-bold">
          {formatRent(room.monthly_rent)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px]">
          {[room.room_type, room.furnishing, room.gender_preference].map((t) => (
            <span key={t} className="rounded border border-navy/15 px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
