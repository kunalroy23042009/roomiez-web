import Image from "next/image";
import Link from "next/link";
import FloorPlan from "@/components/FloorPlan";
import FeaturedRooms from "@/components/FeaturedRooms";

const PROOF = ["Real photos", "Confirmed rent", "Map pin", "Owner verified"];

const VERIFY_STEPS = [
  {
    n: "01",
    title: "We visit",
    body: "Our on-ground team walks into every room before it exists on Roomiez. No walk-in, no listing.",
  },
  {
    n: "02",
    title: "We check",
    body: "Photos, rent, deposit, amenities and the map pin are confirmed with the owner on the spot.",
  },
  {
    n: "03",
    title: "We publish",
    body: "Only verified rooms go live — stamped, pinned, and tracked from enquiry to move-in.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero — the thesis: the room itself, surveyed */}
      <section className="blueprint-grid border-b border-navy/10">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-peach-dark">
              SEC-A · ADITYAPUR–JAMSHEDPUR · PILOT 001
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
              A room near campus.
              <br />
              Minus the broker.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              Every Roomiez listing is visited and verified on-ground: real
              photos, honest rent, map location. Search, visit, move in.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="rounded-full bg-navy px-8 py-3 text-center font-semibold text-white hover:bg-navy-light"
              >
                Browse rooms
              </Link>
              <Link
                href="#verify"
                className="rounded-full border-2 border-navy px-8 py-3 text-center font-semibold hover:bg-navy hover:text-white"
              >
                How verification works
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {PROOF.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-navy/15 bg-white px-3 py-1 font-mono text-[11px] tracking-wide"
                >
                  ✓ {p.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl border border-navy/15 bg-white p-4 shadow-[8px_8px_0_0_#101c34]">
            <p className="mb-2 flex justify-between font-mono text-[11px] tracking-widest text-muted">
              <span>SURVEY 04 · 1RK · SINGLE</span>
              <span>DWG-RZ-001</span>
            </p>
            <FloorPlan />
            <span className="absolute -right-3 top-8 rotate-6 rounded border-2 border-peach bg-cream px-3 py-1 font-mono text-sm font-bold tracking-widest text-peach-dark shadow">
              ✓ VERIFIED
            </span>
          </div>
        </div>
      </section>

      {/* Fresh on the plan */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-peach-dark">
              FRESH ON THE PLAN
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Rooms open right now
            </h2>
          </div>
          <Link
            href="/app"
            className="hidden font-mono text-sm underline hover:text-peach-dark sm:inline"
          >
            BROWSE ALL →
          </Link>
        </div>
        <div className="mt-8">
          <FeaturedRooms />
        </div>
      </section>

      {/* Verification — a real sequence, so numbered */}
      <section
        id="verify"
        className="scroll-mt-20 border-y border-navy/10 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-mono text-xs tracking-[0.2em] text-peach-dark">
            PROTOCOL V-3 · APPLIES TO EVERY LISTING
          </p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            No walk-in, no listing
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {VERIFY_STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-navy/10 bg-cream p-6"
              >
                <p className="font-mono text-sm font-semibold text-blueprint">
                  {s.n}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map band */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-peach">
              FIELD MAP · LIVE PINS
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Pins, not promises.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-white/70">
              See verified rooms as price pins around your college. Filter by
              budget, tap a pin, walk to the door.
            </p>
            <Link
              href="/app/map"
              className="mt-6 inline-block rounded-full bg-peach px-8 py-3 font-semibold text-navy hover:bg-cream"
            >
              Open the map
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Roomiez logo"
              width={180}
              height={180}
              className="rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Owners + FAQ */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-dashed border-navy/25 p-8">
          <p className="font-mono text-xs tracking-[0.2em] text-peach-dark">
            FOR OWNERS · PLOT YOUR ROOM
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Listing is free during the pilot.
          </h2>
          <p className="mt-3 leading-7 text-muted">
            Send your room details and photos. Our team visits, verifies, and
            publishes — you only talk to genuine students.
          </p>
          <a
            href="mailto:itsroydob@gmail.com?subject=List%20my%20room%20on%20Roomiez"
            className="mt-6 inline-block rounded-full bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-light"
          >
            List your room
          </a>
          <p className="mt-4 font-mono text-xs text-muted">
            ANDROID APP ON GOOGLE PLAY — LINK COMING SOON.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Questions
          </h2>
          <div className="mt-4 space-y-3">
            {[
              [
                "Is Roomiez free for students?",
                "Yes. Searching, contacting owners and requesting visits cost nothing.",
              ],
              [
                "Are the listings genuine?",
                "Every room is visited and verified by our on-ground team before it goes live, with real photos and confirmed rent.",
              ],
              [
                "Which cities are supported?",
                "The pilot covers Adityapur–Jamshedpur. More cities launch soon — write to us to request yours.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="rounded-2xl border border-navy/10 bg-white p-4"
              >
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-sm leading-6 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
