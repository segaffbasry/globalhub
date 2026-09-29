"use client";

import { useState } from "react";
import { companyUrl, data, featuredTitle } from "@/lib/home-content";

type Member = (typeof data.members)[number];

function Row({ items }: { items: Member[] }) {
  // The list runs twice so the loop is seamless; the copy is hidden from assistive tech and the tab order.
  return <div className="logo-row">
    <ul className="logo-track">
      {[...items, ...items].map((m, i) => {
        const copy = i >= items.length;
        return <li key={`${m.slug}-${i}`} aria-hidden={copy || undefined}>
          <a href={companyUrl(m.slug)} className="logo-tile" tabIndex={copy ? -1 : undefined} title={m.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.logo.src} alt={copy ? "" : m.name} width={m.logo.width} height={m.logo.height} loading="lazy" decoding="async" />
          </a>
        </li>;
      })}
    </ul>
  </div>;
}

/* Featured businesses as one scrolling line of member logos, pulled from the live site: the eight featured companies
   first, then every service provider. The logos sit straight on the section (no boxes) and the line pauses on hover,
   on focus or with the pause button. Reduced motion shows them as a still, wrapping group. */
export default function Featured() {
  const [paused, setPaused] = useState(false);
  return <section className={`featured ${paused ? "is-paused" : ""}`} data-tone="paper" aria-labelledby="featured-title">
    <div className="wrap featured-head">
      <h2 id="featured-title" className="section-title" data-rise>{featuredTitle}</h2>
      <button className="featured-pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused} data-appear>
        {paused ? "Play" : "Pause"} logos
      </button>
    </div>
    <div data-appear><Row items={data.members} /></div>
  </section>;
}
