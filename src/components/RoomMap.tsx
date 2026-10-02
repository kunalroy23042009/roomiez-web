"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Room } from "@/lib/api";

function pin(rent: number) {
  return L.divIcon({
    className: "",
    html: `<div style="background:#1C2A4A;color:#fff;font-weight:700;font-size:11px;padding:4px 10px;border-radius:999px;border:2px solid #fff;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.35)">₹${rent.toLocaleString("en-IN")}</div>`,
  });
}

const DEFAULT_CENTER: [number, number] = [22.79, 86.16]; // Adityapur–Jamshedpur

export default function RoomMap({ rooms }: { rooms: Room[] }) {
  const pinned = rooms.filter(
    (r) => typeof r.latitude === "number" && typeof r.longitude === "number",
  );
  const center: [number, number] =
    pinned.length > 0
      ? [
          pinned.reduce((s, r) => s + (r.latitude ?? 0), 0) / pinned.length,
          pinned.reduce((s, r) => s + (r.longitude ?? 0), 0) / pinned.length,
        ]
      : DEFAULT_CENTER;

  if (pinned.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-muted">
        No map locations for these rooms yet.
      </p>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      style={{ height: "60vh", minHeight: 380, borderRadius: 16 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pinned.map((r) => (
        <Marker
          key={r.id}
          position={[r.latitude as number, r.longitude as number]}
          icon={pin(r.monthly_rent)}
        >
          <Popup>
            <strong>{r.title}</strong>
            <br />₹{r.monthly_rent.toLocaleString("en-IN")}/mo · {r.locality}
            <br />
            <a href={`/app/rooms/${r.id}`}>View room →</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
