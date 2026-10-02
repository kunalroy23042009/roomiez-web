"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  addFavorite,
  createContactLead,
  createVisitLead,
  getRoom,
  listMyLeads,
  listReviews,
  openConversation,
  postReview,
  removeFavorite,
  reviewSummary,
  type Review,
  type ReviewSummary,
  type Room,
} from "@/lib/api";
import { DEMO_ROOMS } from "@/lib/demo-rooms";
import { formatRent } from "@/components/RoomCard";

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [phone, setPhone] = useState<string | null>(null);
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [rating, setRating] = useState("5");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setRoom(await getRoom(id));
      } catch {
        setRoom(DEMO_ROOMS.find((r) => r.id === id) ?? null);
        setDemo(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!room || demo) return;
    reviewSummary(room.id)
      .then(setSummary)
      .catch(() => {});
    listReviews(room.id)
      .then(setReviews)
      .catch(() => {});
  }, [room, demo]);

  async function toggleFav() {
    if (!room) return;
    setBusy(true);
    try {
      if (fav) {
        await removeFavorite(room.id);
        setFav(false);
      } else {
        await addFavorite(room.id);
        setFav(true);
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save favorite.");
    } finally {
      setBusy(false);
    }
  }

  async function startChat() {
    if (!room) return;
    setBusy(true);
    setMessage(null);
    try {
      const leads = await listMyLeads().catch(() => []);
      const existing = leads.find((l) => l.room_id === room.id);
      const leadId =
        existing?.id ?? (await createContactLead(room.id)).lead?.id;
      if (!leadId) throw new Error("Could not start a chat for this room.");
      const conv = await openConversation(leadId);
      router.push(`/app/chats/${conv.id}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not open chat.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!room) return;
    setReviewMsg(null);
    try {
      const created = await postReview(
        room.id,
        Number(rating),
        reviewBody || undefined,
      );
      setReviews((rs) => [created, ...rs]);
      setReviewBody("");
      reviewSummary(room.id)
        .then(setSummary)
        .catch(() => {});
      setReviewMsg("Review posted. Thanks!");
    } catch (err) {
      setReviewMsg(
        err instanceof Error ? err.message : "Could not post review.",
      );
    }
  }

  async function revealContact() {
    if (!room) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await createContactLead(room.id);
      setPhone(res.owner_phone ?? room.owner_phone ?? "Shared in the app");
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Could not reveal contact.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function requestVisit() {
    if (!room || !slot) {
      setMessage("Pick a visit date and time first.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await createVisitLead(room.id, new Date(slot).toISOString());
      setMessage("Visit requested. The owner will confirm the slot.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not request visit.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="mx-auto max-w-4xl px-4 py-8">Loading…</p>;
  if (!room)
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p>Room not found.</p>
        <Link href="/app" className="text-navy underline">
          Back to browse
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/app" className="text-sm text-muted hover:text-navy">
        ← All rooms
      </Link>
      {demo && (
        <p className="mt-3 rounded-xl bg-peach/40 px-4 py-3 text-sm">
          Demo room — connect the FastAPI backend and log in for live data and
          contact reveal.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-bold">{room.title}</h1>
        {!demo && (
          <button
            onClick={toggleFav}
            disabled={busy}
            className="rounded-full border-2 border-navy px-5 py-1.5 text-sm font-semibold hover:bg-navy hover:text-white disabled:opacity-60"
          >
            {fav ? "♥ Saved" : "♡ Save"}
          </button>
        )}
      </div>
      <p className="mt-1 text-muted">
        {room.locality}
        {room.area ? ` · ${room.area}` : ""}
      </p>

      {room.photos.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {room.photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p}
              src={p}
              alt={room.title}
              className="h-64 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 flex h-48 items-center justify-center rounded-2xl bg-cream-dark text-muted">
          Photos coming soon
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <p className="text-2xl font-bold">{formatRent(room.monthly_rent)}</p>
          <p className="text-sm text-muted">
            Deposit ₹{(room.deposit_amount ?? 0).toLocaleString("en-IN")}
          </p>
          {room.description && (
            <p className="mt-4 leading-7">{room.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
            {[
              room.room_type,
              `${room.occupancy} sharing`,
              room.furnishing,
              room.gender_preference,
              ...room.amenities,
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-2.5 py-1 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
          {room.address_text && (
            <p className="mt-4 text-sm text-muted">{room.address_text}</p>
          )}
        </div>

        <div className="rounded-2xl border border-navy/10 bg-white p-4">
          <h2 className="font-bold">Interested?</h2>
          {phone ? (
            <p className="mt-3 rounded-xl bg-cream px-3 py-2 font-mono">
              {phone}
            </p>
          ) : (
            <button
              onClick={revealContact}
              disabled={busy}
              className="mt-3 w-full rounded-xl bg-navy px-4 py-2 font-semibold text-white hover:bg-navy-light disabled:opacity-60"
            >
              Reveal owner contact
            </button>
          )}
          <label className="mt-4 block text-sm font-medium">
            Visit slot
            <input
              type="datetime-local"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2"
            />
          </label>
          <button
            onClick={requestVisit}
            disabled={busy}
            className="mt-2 w-full rounded-xl border-2 border-navy px-4 py-2 font-semibold hover:bg-navy hover:text-white disabled:opacity-60"
          >
            Request visit
          </button>
          {!demo && (
            <button
              onClick={startChat}
              disabled={busy}
              className="mt-2 w-full rounded-xl bg-cream px-4 py-2 font-semibold hover:bg-cream-dark disabled:opacity-60"
            >
              Chat about this room
            </button>
          )}
          {message && <p className="mt-3 text-sm text-muted">{message}</p>}
          <p className="mt-3 text-xs text-muted">
            Contact & visits need a student login.{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {!demo && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Reviews
            {summary && summary.count > 0 && (
              <span className="ml-2 text-base font-medium text-muted">
                ★ {summary.avg_rating?.toFixed(1)} ({summary.count})
              </span>
            )}
          </h2>
          <form
            onSubmit={submitReview}
            className="mt-4 flex flex-col gap-2 rounded-2xl border border-navy/10 bg-white p-4 sm:flex-row sm:items-center"
          >
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="rounded-xl border border-navy/15 bg-white px-3 py-2"
              aria-label="Rating"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
            <input
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="What did you think of this room? (needs login)"
              maxLength={2000}
              className="flex-1 rounded-xl border border-navy/15 px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-xl bg-navy px-5 py-2 font-semibold text-white hover:bg-navy-light"
            >
              Post
            </button>
          </form>
          {reviewMsg && <p className="mt-2 text-sm text-muted">{reviewMsg}</p>}
          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-navy/10 bg-white p-4"
              >
                <p className="text-sm font-bold">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                  {r.student_name && (
                    <span className="ml-2 font-medium text-muted">
                      {r.student_name}
                    </span>
                  )}
                </p>
                {r.body && <p className="mt-1 text-sm">{r.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
