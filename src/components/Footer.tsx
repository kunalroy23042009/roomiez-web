import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-cream-dark/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-bold text-navy">Roomiez</span> — verified
          student rooms near campus. Pilot: Adityapur–Jamshedpur.
        </p>
        <div className="flex gap-4">
          <Link href="/app" className="hover:text-navy">
            Browse rooms
          </Link>
          <Link href="/privacy" className="hover:text-navy">
            Privacy
          </Link>
          <Link href="/support" className="hover:text-navy">
            Support
          </Link>
          <a href="mailto:itsroydob@gmail.com" className="hover:text-navy">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
