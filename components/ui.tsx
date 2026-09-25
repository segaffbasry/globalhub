import type { CSSProperties, ReactNode } from "react";
import { brandIcons } from "@/lib/brand-icons";
import { LOGO_VIEWBOX, logoParts } from "@/lib/logo-parts";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The official logo as live vector parts. Green letters keep the brand green; the arc and "HUB" take
   currentColor, so the same logo reads on ink, white and green backgrounds. */
export function Logo({ className = "", title, only }: { className?: string; title?: string; only?: string[] }) {
  const parts = only ? logoParts.filter((part) => only.includes(part.id)) : logoParts;
  const box = only ? "0 0 395 447" : LOGO_VIEWBOX;
  return <svg className={`logo ${className}`} viewBox={box} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
    {/* Each part sits in its own positioned group so the path itself can be animated from an untransformed state. */}
    {parts.map((part) => <g key={part.id} transform={`translate(${part.x} ${part.y})`}><path className={`lp lp-${part.id} tone-${part.tone}`} data-part={part.id} d={part.d} /></g>)}
  </svg>;
}

/** The mark alone: the orbit arc around the G, as on the official app icon. */
export const Mark = ({ className = "" }: { className?: string }) => <Logo className={`mark ${className}`} only={["arc", "G"]} />;

export function Arrow({ className = "" }: { className?: string }) {
  return <svg className={`arrow ${className}`} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function External() {
  return <svg className="ext" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.3" /></svg>;
}

/* The copied interaction: ankar.ai's "Book a demo" pill. Measured on the live Framer component:
   flex, gap 16px, padding 10px 16px, radius 500px, 38px tall, label 14px/500 (18.2px line).
   On hover only the fill changes, alpha 1 → .6, on the {stiffness 600, damping 40} spring (≈ .33 s, 1.2% overshoot),
   and the same spring runs back on leave. See .pill in globals.css for the curve as a CSS variable. */
export function Pill({ href, children, variant = "solid", className = "", external = false, onClick, data }: { href: string; children: ReactNode; variant?: "solid" | "outline"; className?: string; external?: boolean; onClick?: () => void; data?: Record<string, string> }) {
  return <a href={href} onClick={onClick} className={`pill pill-${variant} ${className}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...data}>
    <span className="pill-label">{children}</span>
    {external && <span className="sr-only"> (opens in a new tab)</span>}
  </a>;
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label ${className}`} data-appear><span className="label-dot" aria-hidden="true" />{children}</p>;
}

export function Social({ icon, size = 18 }: { icon: keyof typeof brandIcons; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={brandIcons[icon]} /></svg>;
}

/** Local photography, always greyscale with a palette tint so it stays inside the brand colours. */
export function Photo({ src, alt = "", className = "", style, sizes, priority = false }: { src: string; alt?: string; className?: string; style?: CSSProperties; sizes?: string; priority?: boolean }) {
  return <span className={`photo ${className}`} style={style}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} sizes={sizes} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} />
  </span>;
}
