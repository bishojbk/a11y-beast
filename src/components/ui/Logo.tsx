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
      {/* Background rounded square */}
      <rect width="48" height="48" rx="14" fill="url(#logo-grad)" />

      {/* Shield shape */}
      <path
        d="M24 9L13 14.5V23.5C13 30.4 17.8 36.8 24 39C30.2 36.8 35 30.4 35 23.5V14.5L24 9Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.08)"
      />

      {/* Checkmark inside shield */}
      <path
        d="M18 24.5L22 28.5L30 19.5"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoFull({ iconSize = 32, className = "" }: { iconSize?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      <span className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
        A11y Beast
      </span>
    </div>
  );
}
