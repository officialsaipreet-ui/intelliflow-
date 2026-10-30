import { cn } from "@/lib/cn";

/** The Intelliflow logo: a warm flowing path joining three nodes. */
export function BrandLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="flex-shrink-0 drop-shadow-[0_2px_8px_rgba(236,102,34,0.35)]"
    >
      <defs>
        <linearGradient id="if-logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC6622" />
          <stop offset="100%" stopColor="#F9C04A" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#241B16" />
      <path
        d="M14 46 C 26 46, 22 18, 34 18 S 44 32, 50 18"
        fill="none"
        stroke="url(#if-logo-g)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="46" r="5.5" fill="#EC6622" />
      <circle cx="34" cy="18" r="4.5" fill="#F7823F" />
      <circle cx="50" cy="18" r="5.5" fill="#F9C04A" />
      <path
        d="M28 46 H 50"
        stroke="#86705C"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 6"
      />
    </svg>
  );
}

interface BrandMarkProps {
  /** Small caption under the wordmark, e.g. "Credential Vault". */
  subtitle?: string;
  size?: "sm" | "md" | "lg";
}

/** Logo plus the "Intelliflow" wordmark, used in page headers. */
export function BrandMark({ subtitle, size = "md" }: BrandMarkProps) {
  const logo = { sm: 20, md: 34, lg: 44 }[size];
  return (
    <div className="flex items-center gap-3">
      <BrandLogo size={logo} />
      {size !== "sm" && (
        <div className="leading-tight">
          <h1
            className={cn(
              "font-display font-bold tracking-tight text-slate-50",
              size === "lg" ? "text-2xl" : "text-lg",
            )}
          >
            Intelli
            <span className="bg-ember-gradient bg-clip-text text-transparent">
              flow
            </span>
          </h1>
          {subtitle && (
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
