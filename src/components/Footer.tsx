import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">Roomiez</p>
          <p className="mt-2 font-mono text-xs tracking-widest text-white/50">
            SEC-A · ADITYAPUR–JAMSHEDPUR
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
            Verified student rooms near campus. Real photos, honest rent, no
            brokers.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="font-mono text-xs tracking-widest text-white/50">
            SITE
          </p>
          <Link href="/app" className="w-fit hover:text-peach">
            Browse rooms
          </Link>
          <Link href="/app/map" className="w-fit hover:text-peach">
            Map
          </Link>
          <Link href="/support" className="w-fit hover:text-peach">
            Support
          </Link>
          <Link href="/privacy" className="w-fit hover:text-peach">
            Privacy
          </Link>
          <Link href="/admin/rag" className="w-fit hover:text-peach">
            RAG Admin
          </Link>
        </nav>
        <div className="text-sm">
          <p className="font-mono text-xs tracking-widest text-white/50">
            OWNERS
          </p>
          <p className="mt-2 leading-6 text-white/70">
            Listing is free during the pilot. Our team verifies every room
            on-ground before it goes live.
          </p>
          <a
            href="mailto:itsroydob@gmail.com?subject=List%20my%20room%20on%20Roomiez"
            className="mt-3 inline-block rounded-full bg-peach px-5 py-2 font-semibold text-navy hover:bg-cream"
          >
            List your room
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 font-mono text-xs text-white/40">
          © 2026 ROOMIEZ · itsroydob@gmail.com
        </p>
      </div>
    </footer>
  );
}
