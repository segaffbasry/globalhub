"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { registerMotion } from "@/components/motion";
import { Logo, reducedMotion } from "@/components/ui";
import { reveal } from "@/lib/ease";
import { logoParts } from "@/lib/logo-parts";

// Budget: the page must be usable within ~2 s of navigation even if hydration is slow.
const BUDGET = 2400;
// Centre of the G's bowl in logo units, the point the orbit arc turns around. Each path sits inside a
// translate() group, so the origin is given in the arc's own coordinates.
const arc = logoParts.find((part) => part.id === "arc")!;
const ORBIT = `${231 - arc.x} ${231 - arc.y}`;

/* The company signing its name. Built from the traced logo on one GSAP timeline:
   build  (0.10–0.95 s) the arc sweeps round the G like an orbit, the G settles, "lobal" rises letter by letter,
                        then "HUB" wipes in from the left
   hold   (0.95–1.25 s)
   exit   (1.25–1.85 s) the handover fires, the logo lifts away and the ink curtain rises off the hero. */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    const finish = () => { handover(); el.style.display = "none"; };
    el.style.animation = "none"; // JS is running, so the CSS fallback exit is not needed.

    const late = performance.now() > BUDGET - 1300;
    if (reducedMotion() || late || !root.classList.contains("is-loading")) { finish(); return; }

    registerMotion();
    const q = (ids: string[]) => ids.map((id) => el.querySelector(`[data-part="${id}"]`));
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(q(["arc"]), { opacity: 0, rotation: -80, svgOrigin: ORBIT }, { opacity: 1, rotation: 0, svgOrigin: ORBIT, duration: .75, ease: reveal.ease }, .1)
      .fromTo(q(["G"]), { opacity: 0, scale: .55, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: reveal.duration, ease: reveal.ease }, .15)
      .fromTo(q(["l1", "o", "b", "a", "l2"]), { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: .5, ease: reveal.ease, stagger: .05 }, .32)
      .fromTo(q(["H", "U", "B"]), { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .42, ease: "power2.inOut", stagger: .07 }, .55)
      .call(handover, [], 1.25)
      .to(el.querySelector(".loader-logo"), { y: -36, opacity: 0, duration: .45, ease: "power2.in" }, 1.25)
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: .6, ease: "power3.inOut" }, 1.25);

    // Dev only: lets the verification step seek the timeline and capture each stage.
    if (process.env.NODE_ENV !== "production") (window as unknown as { __intro?: gsap.core.Timeline }).__intro = tl;

    return () => { tl.kill(); if (!handed) finish(); };
  }, []);

  return <div className="loader" ref={ref} aria-hidden="true">
    <Logo className="loader-logo" />
  </div>;
}
