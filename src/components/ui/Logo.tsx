export function LogoIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background rounded square with gradient */}
      <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />

      {/* Eye shape — representing "watching" for accessibility issues */}
      <path
        d="M24 16C17 16 12 24 12 24C12 24 17 32 24 32C31 32 36 24 36 24C36 24 31 16 24 16Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Pupil with checkmark inside */}
      <circle cx="24" cy="24" r="5" fill="white" />

      {/* Checkmark inside the pupil */}
      <path
        d="M21.5 24L23 25.5L26.5 22"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Scan lines radiating from eye */}
      <path d="M8 24H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M38 24H40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M24 10V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M24 36V38" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoFull({ iconSize = 32, className = "" }: { iconSize?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
        A11y Beast
      </span>
    </div>
  );
}
