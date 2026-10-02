export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-1 text-sm text-muted">Last updated: October 2026</p>
      <div className="mt-6 space-y-5 leading-7">
        <p>
          Roomiez helps students find verified accommodation near campus. This
          policy explains what data the Roomiez website and web app collect and
          why.
        </p>
        <h2 className="text-xl font-bold">What we collect</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Account:</strong> name, email and phone number when you sign
            up or log in.
          </li>
          <li>
            <strong>Activity:</strong> rooms you view, favourites, contact
            reveals, visit requests and messages — needed to run the service.
          </li>
          <li>
            <strong>Owner listings:</strong> room details, photos and contact
            information you provide when listing a room.
          </li>
        </ul>
        <h2 className="text-xl font-bold">What we don&apos;t do</h2>
        <p>
          We don&apos;t sell your personal data. Owner phone numbers stay
          masked until you create a contact or visit lead for that room.
        </p>
        <h2 className="text-xl font-bold">Contact</h2>
        <p>
          Questions or deletion requests:{" "}
          <a
            href="mailto:itsroydob@gmail.com"
            className="font-medium underline"
          >
            itsroydob@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
