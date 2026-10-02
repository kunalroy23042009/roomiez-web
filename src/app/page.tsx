import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Verified rooms",
    body: "Every listing is collected on-ground and verified by our team: real photos, honest rent, amenities, map location.",
  },
  {
    title: "Contact & visit in one tap",
    body: "Reveal owner contact or request a visit slot right from the room page. Track every lead to move-in.",
  },
  {
    title: "Chat that stays on track",
    body: "Message about any room instantly, with visit reminders and approval alerts.",
  },
  {
    title: "Maps that make sense",
    body: "See rooms as pins around your college, filter by budget, get walking directions to any door.",
  },
];

const STEPS = [
  {
    title: "Search near your college",
    body: "Filter verified rooms by locality, budget and room type.",
  },
  {
    title: "Visit the shortlist",
    body: "Request visit slots and meet only genuine owners — no brokers.",
  },
  {
    title: "Move in",
    body: "Confirm the room, track your lead, and settle in before classes start.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center sm:py-24">
        <Image
          src="/logo.png"
          alt="Roomiez logo"
          width={120}
          height={120}
          priority
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Verified student rooms
            <br />
            near campus.
          </h1>
          <div className="mx-auto mt-4 h-2 w-40 rounded-full bg-peach" />
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Search, chat, visit. No brokers. Currently live in
            Adityapur–Jamshedpur — more cities coming soon.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app"
            className="rounded-full bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-light"
          >
            Browse rooms on web
          </Link>
          <a
            href="#download"
            className="rounded-full border-2 border-navy px-8 py-3 font-semibold hover:bg-navy hover:text-white"
          >
            Get the app
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-navy/10 bg-cream p-6"
            >
              <h2 className="text-lg font-bold">{f.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-navy p-6 text-white">
              <p className="text-4xl font-bold text-peach">{i + 1}</p>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download / pilot */}
      <section id="download" className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Live in Adityapur–Jamshedpur</h2>
          <p className="max-w-xl text-white/70">
            Students near NIT Jamshedpur and local colleges can already browse
            verified rooms. Owners: list your room free during the pilot.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="rounded-full bg-peach px-8 py-3 font-semibold text-navy hover:bg-peach-dark"
            >
              Try the web app
            </Link>
            <a
              href="mailto:itsroydob@gmail.com?subject=List%20my%20room%20on%20Roomiez"
              className="rounded-full border-2 border-white/40 px-8 py-3 font-semibold hover:border-white"
            >
              List your room
            </a>
          </div>
          <p className="text-sm text-white/50">
            Android app on Google Play — link coming soon.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Questions</h2>
        <dl className="mt-8 space-y-6">
          <div>
            <dt className="font-bold">Is Roomiez free for students?</dt>
            <dd className="mt-1 text-muted">
              Yes — searching, contacting owners and requesting visits are free.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Are the listings genuine?</dt>
            <dd className="mt-1 text-muted">
              Every room is visited and verified by our on-ground team before it
              goes live, with real photos and confirmed rent.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Which cities are supported?</dt>
            <dd className="mt-1 text-muted">
              The pilot covers Adityapur–Jamshedpur. More cities launch soon —
              write to us to request yours.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
