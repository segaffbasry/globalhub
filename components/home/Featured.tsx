"use client";

import { useState } from "react";
import { companyUrl, data, featuredTitle } from "@/lib/home-content";

type Member = (typeof data.members)[number];

function Row({ items, reverse }: { items: Member[]; reverse?: boolean }) {
  // The list runs twice so the loop is seamless; the copy is hidden from assistive tech and the tab order.
  return <div className={`logo-row ${reverse ? "is-reverse" : ""}`}>
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

/* Featured businesses as a moving wall of member logos, pulled from the live site: the eight featured companies
   first, then every service provider. Two rows drift in opposite directions and pause on hover, on focus or with
   the pause button. Reduced motion shows the logos as a still, wrapping grid. */
export default function Featured() {
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(data.members.length / 2);
  return <section className={`featured ${paused ? "is-paused" : ""}`} data-tone="paper" aria-labelledby="featured-title">
    <div className="wrap featured-head">
      <h2 id="featured-title" className="section-title" data-rise>{featuredTitle}</h2>
      <button className="featured-pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused} data-appear>
        {paused ? "Play" : "Pause"} logos
      </button>
    </div>
    <div className="logo-wall" data-appear>
      <Row items={data.members.slice(0, half)} />
      <Row items={data.members.slice(half)} reverse />
    </div>
  </section>;
}
