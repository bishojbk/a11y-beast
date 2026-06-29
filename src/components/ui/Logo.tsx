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
      {/* Evidence-green seal — flat, no gradient (calm + credible) */}
      <rect width="48" height="48" rx="11" fill="#1C5D52" />
      {/* Lens/eye shape */}
      <path
        d="M10 24C10 24 16 15 24 15C32 15 38 24 38 24C38 24 32 33 24 33C16 33 10 24 10 24Z"
        stroke="#F3F6F2"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Iris */}
      <circle cx="24" cy="24" r="5" fill="#F3F6F2" />
      {/* Pupil */}
      <circle cx="24" cy="24" r="2" fill="#1C5D52" />
    </svg>
  );
}

export function LogoFull({ iconSize = 32, className = "" }: { iconSize?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      <span className="mono text-foreground" style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        A11y Beast
      </span>
    </div>
  );
}
