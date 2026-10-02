import Link from "next/link";

export default function NotFound() {
  return (
    <div className="blueprint-grid mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm tracking-widest text-muted">
        PLAN — 404 · NO SUCH ROOM
      </p>
      <h1 className="mt-4 font-display text-6xl font-bold tracking-tight">
        Off the plan.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        This address isn&apos;t on our floor plan. The rooms you&apos;re
        looking for are one click back.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/app"
          className="rounded-full bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-light"
        >
          Browse rooms
        </Link>
        <Link
          href="/"
          className="rounded-full border-2 border-navy px-8 py-3 font-semibold hover:bg-navy hover:text-white"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
