import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Roomiez logo" width={36} height={36} />
          <span className="font-display text-xl font-bold tracking-tight">
            Roomiez
          </span>
        </Link>
        <nav className="flex items-center gap-4 font-mono text-[13px] font-medium tracking-wide sm:gap-5">
          <Link href="/app" className="hidden hover:text-peach-dark sm:inline">
            BROWSE
          </Link>
          <Link
            href="/app/map"
            className="hidden hover:text-peach-dark sm:inline"
          >
            MAP
          </Link>
          <Link
            href="/support"
            className="hidden hover:text-peach-dark sm:inline"
          >
            SUPPORT
          </Link>
          <Link href="/login" className="hover:text-peach-dark">
            LOG IN
          </Link>
          <Link
            href="/app"
            className="rounded-full bg-navy px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-navy-light"
          >
            Find a room
          </Link>
        </nav>
      </div>
    </header>
  );
}
