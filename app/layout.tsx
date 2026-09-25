import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";

// Outfit is the typeface globalhub.co.uk loads (next/font "__Outfit"); self-hosted here from @fontsource-variable (OFL).
const outfit = localFont({ src: "./fonts/Outfit-Variable.woff2", weight: "100 900", variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "GlobalHUB",
  description: "Advertise your parts, products and services, share capacity, collaborate on MOQs and network with businesses worldwide.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

// Runs before first paint: holds the page for the preloader unless reduced motion is on. A safety net hands
// the page over after 4.5 s whatever happens, so a stalled script can never leave it locked.
const intro = `(function(){var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="done";return}d.classList.add("is-loading");setTimeout(function(){if(d.dataset.intro!=="done"){d.classList.remove("is-loading");d.dataset.intro="done";document.dispatchEvent(new Event("intro:done"))}},4500)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB" className={outfit.variable} data-htone="light" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: intro }} />
      <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
      <noscript><style>{".loader{display:none!important}[data-rise],[data-words],[data-appear],[data-card],[data-image],.hero [data-hero-appear],.hero-controls{opacity:1!important;transform:none!important;clip-path:none!important}"}</style></noscript>
    </head>
    <body>{children}</body>
  </html>;
}
