import Link from "next/link";
import type { Room } from "@/lib/api";

export const ROOM_TYPES = ["SINGLE", "SHARING", "1RK", "1BHK", "2BHK", "PG"];

export function formatRent(n: number): string {
  return `₹${n.toLocaleString("en-IN")}/mo`;
}

export default function RoomCard({ room }: { room: Room }) {
  const photo = room.photos[0];
  return (
    <Link
      href={`/app/rooms/${room.id}`}
      className="overflow-hidden rounded-2xl border border-navy/10 bg-white transition-shadow hover:shadow-lg"
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={room.title} className="h-48 w-full object-cover" />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-cream-dark text-muted">
          No photo
        </div>
      )}
      <div className="p-4">
        <p className="text-lg font-bold text-navy">
          {formatRent(room.monthly_rent)}
        </p>
        <h3 className="mt-1 font-semibold leading-snug">{room.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {room.locality}
          {room.area ? ` · ${room.area}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {[room.room_type, room.furnishing, room.gender_preference].map((t) => (
            <span
              key={t}
              className="rounded-full bg-cream px-2.5 py-1 font-medium text-navy"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
