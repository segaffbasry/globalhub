"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { registerMotion } from "@/components/motion";
import { reducedMotion } from "@/components/ui";
import { why } from "@/lib/home-content";

/* Why GlobalHUB? as a sideways story (client feedback: the stacked list felt long and had no images).
   On desktop the section pins while the six photo cards slide past horizontally, scrubbed to the scroll, with a
   progress line under the title. Phones and reduced motion get the same cards as a swipeable row. */
export default function Why() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    registerMotion();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", () => {
      const track = el.querySelector<HTMLElement>(".why-track")!;
      const bar = el.querySelector<HTMLElement>(".why-progress span")!;
      const travel = () => Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
      el.classList.add("is-pinned");
      gsap.timeline({ scrollTrigger: { trigger: el.querySelector(".why-pin"), pin: true, start: "top top", end: () => `+=${travel()}`, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } })
        .fromTo(track, { x: 0 }, { x: () => -travel(), ease: "none" }, 0)
        .fromTo(bar, { scaleX: 1 / why.items.length }, { scaleX: 1, ease: "none" }, 0);
      return () => el.classList.remove("is-pinned");
    });
    return () => mm.revert();
  }, []);

  return <section className="why" ref={root} data-tone="light" aria-labelledby="why-title">
    <div className="why-pin">
      <div className="wrap why-head">
        <h2 id="why-title" className="section-title" data-rise>Why Global<span>HUB</span>?</h2>
        <div className="why-progress" aria-hidden="true"><span /></div>
      </div>
      <div className="why-viewport">
        <ol className="why-track">
          {why.items.map((item, i) => <li key={item.title} className="why-card" data-card>
            <span className="why-photo photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" width={1200} height={800} loading="lazy" decoding="async" />
              <span className="why-index">0{i + 1}</span>
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>)}
        </ol>
      </div>
    </div>
  </section>;
}
