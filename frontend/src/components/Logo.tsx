export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer target ring */}
      <circle cx="50" cy="50" r="47" stroke="#F5C518" strokeWidth="5" fill="none" />
      {/* Cross hairs */}
      <line x1="50" y1="3" x2="50" y2="20" stroke="#F5C518" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="80" x2="50" y2="97" stroke="#F5C518" strokeWidth="4" strokeLinecap="round" />
      <line x1="3" y1="50" x2="20" y2="50" stroke="#F5C518" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="50" x2="97" y2="50" stroke="#F5C518" strokeWidth="4" strokeLinecap="round" />
      {/* Card back (left) */}
      <rect
        x="24" y="28" width="32" height="44" rx="4"
        fill="#1e3a8a"
        transform="rotate(-10 40 50)"
      />
      <rect
        x="26" y="30" width="28" height="40" rx="3"
        fill="#2563eb"
        transform="rotate(-10 40 50)"
      />
      {/* Card front (right) */}
      <rect
        x="38" y="28" width="32" height="44" rx="4"
        fill="#1e3a8a"
        transform="rotate(8 54 50)"
      />
      <rect
        x="40" y="30" width="28" height="40" rx="3"
        fill="#3b82f6"
        transform="rotate(8 54 50)"
      />
    </svg>
  )
}
