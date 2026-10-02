import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Roomiez logo" width={36} height={36} />
          <span className="text-xl font-bold tracking-tight">Roomiez</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/app" className="hidden sm:inline hover:text-peach-dark">
            Browse rooms
          </Link>
          <Link
            href="/support"
            className="hidden sm:inline hover:text-peach-dark"
          >
            Support
          </Link>
          <Link href="/login" className="hover:text-peach-dark">
            Log in
          </Link>
          <Link
            href="/app"
            className="rounded-full bg-navy px-4 py-2 text-white hover:bg-navy-light"
          >
            Find a room
          </Link>
        </nav>
      </div>
    </header>
  );
}
