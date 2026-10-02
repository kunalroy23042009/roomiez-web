/**
 * Signature: a 1RK floor plan drawn like a site survey — ink walls,
 * dimension lines, door swing, and surveyor hotspot dots.
 */
const HOTSPOTS = [
  { x: 125, y: 98, label: "SLEEPS 1–2" },
  { x: 345, y: 78, label: "STUDY DESK" },
  { x: 355, y: 258, label: "ATT. WASHROOM" },
  { x: 135, y: 263, label: "STORAGE" },
];

export default function FloorPlan() {
  return (
    <svg
      viewBox="0 0 480 380"
      role="img"
      aria-label="Floor plan of a verified single student room"
      className="h-auto w-full"
    >
      {/* dimension lines */}
      <g stroke="#57627a" strokeWidth="1">
        <line x1="40" y1="14" x2="440" y2="14" />
        <line x1="40" y1="9" x2="40" y2="19" />
        <line x1="440" y1="9" x2="440" y2="19" />
        <line x1="22" y1="30" x2="22" y2="330" />
        <line x1="17" y1="30" x2="27" y2="30" />
        <line x1="17" y1="330" x2="27" y2="330" />
      </g>
      <text
        x="240"
        y="10"
        textAnchor="middle"
        fontSize="11"
        fill="#57627a"
        fontFamily="monospace"
      >
        24 FT
      </text>
      <text
        x="12"
        y="180"
        textAnchor="middle"
        fontSize="11"
        fill="#57627a"
        fontFamily="monospace"
        transform="rotate(-90 12 180)"
      >
        18 FT
      </text>

      {/* walls */}
      <g stroke="#101c34" strokeWidth="7" fill="none" strokeLinecap="square">
        <line x1="40" y1="30" x2="440" y2="30" />
        <line x1="40" y1="30" x2="40" y2="330" />
        <line x1="440" y1="30" x2="440" y2="330" />
        <line x1="40" y1="330" x2="200" y2="330" />
        <line x1="270" y1="330" x2="440" y2="330" />
      </g>
      {/* door swing */}
      <path
        d="M 200 330 A 70 70 0 0 1 270 260"
        stroke="#1f4bff"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5 4"
      />
      <line x1="200" y1="330" x2="200" y2="262" stroke="#1f4bff" strokeWidth="3" />
      {/* window */}
      <g stroke="#1f4bff" strokeWidth="3">
        <line x1="150" y1="26" x2="250" y2="26" />
        <line x1="150" y1="34" x2="250" y2="34" />
      </g>

      {/* bed */}
      <g stroke="#101c34" strokeWidth="2.5" fill="#fbfaf5">
        <rect x="60" y="55" width="130" height="85" />
        <rect x="70" y="65" width="30" height="65" fill="#eeeadc" />
        <line x1="115" y1="65" x2="115" y2="130" strokeDasharray="4 3" />
        <line x1="150" y1="65" x2="150" y2="130" strokeDasharray="4 3" />
      </g>
      {/* desk + chair */}
      <g stroke="#101c34" strokeWidth="2.5" fill="#fbfaf5">
        <rect x="290" y="55" width="110" height="45" />
        <circle cx="345" cy="128" r="17" />
      </g>
      {/* wardrobe */}
      <g stroke="#101c34" strokeWidth="2.5" fill="#fbfaf5">
        <rect x="60" y="225" width="150" height="75" />
        <line x1="135" y1="225" x2="135" y2="300" />
      </g>
      {/* washroom */}
      <g stroke="#101c34" strokeWidth="2.5" fill="#eeeadc">
        <rect x="290" y="210" width="130" height="90" />
        <circle cx="320" cy="255" r="14" fill="#fbfaf5" />
        <rect x="365" y="240" width="30" height="30" fill="#fbfaf5" />
      </g>

      {/* surveyor hotspots */}
      {HOTSPOTS.map((h) => (
        <g key={h.label}>
          <circle cx={h.x} cy={h.y} r="9" fill="#e4572e" opacity="0.25" />
          <circle
            cx={h.x}
            cy={h.y}
            r="4.5"
            fill="#e4572e"
            stroke="#fbfaf5"
            strokeWidth="1.5"
          />
          <text
            x={h.x + 13}
            y={h.y + 4}
            fontSize="10.5"
            fontWeight="600"
            fill="#101c34"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            {h.label}
          </text>
        </g>
      ))}

      {/* north arrow + scale note */}
      <g fontFamily="monospace" fontSize="10" fill="#57627a">
        <text x="440" y="360" textAnchor="end">
          SURVEY 04 · SCALE 1:50
        </text>
      </g>
    </svg>
  );
}
