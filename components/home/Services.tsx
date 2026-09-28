"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { registerMotion } from "@/components/motion";
import { Arrow, Pill, reducedMotion } from "@/components/ui";
import type { Service } from "@/lib/home-content";
import { data, serviceUrl, services } from "@/lib/home-content";

function Row({ title, items, id, reverse }: { title: string; items: Service[]; id: string; reverse?: boolean }) {
  return <div className="svc-row">
    <h3 id={id} className="wrap svc-label" data-appear>{title}</h3>
    <div className="svc-viewport">
      <ul className={`svc-track ${reverse ? "is-reverse" : ""}`} aria-labelledby={id}>
        {items.map((s) => <li key={s.id}>
          <a href={serviceUrl(s.id)} className="svc-card">
            <span className={`svc-photo photo ${s.image?.src.endsWith(".svg") ? "is-vector" : ""}`}>
              {s.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.image.src} alt="" width={s.image.width} height={s.image.height} loading="lazy" decoding="async" />}
            </span>
            <span className="svc-body">
              <strong>{s.title}</strong>
              <span className="svc-company">
                {s.company.logo && /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.company.logo.src} alt="" width={28} height={28} loading="lazy" />}
                {s.company.name}
              </span>
            </span>
            <span className="svc-go" aria-hidden="true"><Arrow /></span>
          </a>
        </li>)}
      </ul>
    </div>
  </div>;
}

/* Popular Services and Recently added as two rows of cards that glide in opposite directions while the section
   scrolls past (scrubbed to the scroll, so nothing moves on its own). Every card passes through the viewport, and
   each row can also be swiped or scrolled sideways. Phones and reduced motion get the plain sideways-scroll rows. */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    registerMotion();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", () => {
      el.classList.add("is-drifting");
      el.querySelectorAll<HTMLElement>(".svc-track").forEach((track) => {
        const travel = () => Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
        const reverse = track.classList.contains("is-reverse");
        gsap.fromTo(track, { x: () => (reverse ? -travel() : 0) }, {
          x: () => (reverse ? 0 : -travel()), ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: .6, invalidateOnRefresh: true },
        });
      });
      return () => el.classList.remove("is-drifting");
    });
    return () => mm.revert();
  }, []);

  return <section className="services" ref={root} data-tone="paper" aria-labelledby="services-title">
    <div className="wrap services-head">
      <h2 id="services-title" className="section-title" data-rise>{services.title}</h2>
      <div data-appear><Pill href={services.browse.href}>{services.browse.label}</Pill></div>
    </div>
    <Row id="svc-popular" title={services.popularTitle} items={data.popular} />
    <Row id="svc-recent" title={services.recentTitle} items={data.recent} reverse />
  </section>;
}
