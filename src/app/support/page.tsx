import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Support</h1>
      <p className="mt-1 text-muted">
        Stuck somewhere? Start here, or write to us directly.
      </p>
      <div className="mt-6 space-y-5">
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <h2 className="font-bold">I can&apos;t see live rooms</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            The web app shows demo rooms until the FastAPI backend is running
            and you&apos;re logged in. Open{" "}
            <Link href="/login" className="underline">
              login
            </Link>
            , then browse again.
          </p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <h2 className="font-bold">I want to list my room</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Listing is free during the Adityapur–Jamshedpur pilot. Email your
            room details and photos and our team will verify and publish them.
          </p>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-5">
          <h2 className="font-bold">Report a wrong listing</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Send the room link plus what&apos;s wrong and we&apos;ll re-verify
            within 48 hours.
          </p>
        </div>
        <a
          href="mailto:itsroydob@gmail.com?subject=Roomiez%20support"
          className="inline-block rounded-full bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-light"
        >
          Email support
        </a>
      </div>
    </div>
  );
}
