import { ChevronRight } from "lucide-react";

export function ThreatCard({ threat, isActive, onClick }) {
  const Icon = threat.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full rounded-2xl p-4 text-left
        transition-all duration-200 ease-smooth
        hover:scale-[1.01]
        bg-secondary-light
      `}
      style={{
        background: isActive ? threat.bg : undefined,
        borderColor: isActive ? threat.color : "border-none",
        boxShadow: isActive
          ? `0 0 0 1px ${threat.color}40, 0 8px 32px ${threat.color}15`
          : "none",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: threat.bg }}
        >
          <Icon size={18} style={{ color: threat.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-neutral-default text-sm">
            {threat.label}
          </p>

          <p
            className="mt-0.5 text-[11px] leading-snug"
            style={{ color: isActive ? threat.color : "#8C9096" }}
          >
            {threat.tagline}
          </p>
        </div>

        <ChevronRight
          size={16}
          className={`mt-1 transition-transform duration-200`}
          style={{
            transform: isActive ? "rotate(90deg)" : "none",
            color: threat.color,
          }}
        />
      </div>
    </button>
  );
}
