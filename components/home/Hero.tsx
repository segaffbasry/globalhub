"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { registerMotion } from "@/components/motion";
import { Pill, reducedMotion } from "@/components/ui";
import { appear, reveal } from "@/lib/ease";
import { data } from "@/lib/home-content";
import { splitMask } from "@/lib/split";

const SLIDE_MS = 7000;
const pad = (n: number) => String(n).padStart(2, "0");

/* The four live hero slides as one full-bleed ink stage (Heart's hero). The photograph crossfades and settles,
   the headline words rise out of their masks, and the counter, progress line and pause control sit bottom right.
   Its entrance waits for the preloader's intro:done event. */
export default function Hero() {
  const stage = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const previous = useRef(0);
  const slides = data.hero;

  // Entrance, once the preloader hands over.
  useEffect(() => {
    const el = stage.current; if (!el) return;
    registerMotion();
    const words = splitMask(el.querySelector<HTMLElement>(".hero-slide.is-active h2")!);
    const ctx = gsap.context(() => {
      const play = () => {
        setReady(true);
        if (reducedMotion()) { words.revert(); return; }
        gsap.timeline({ onComplete: () => words.revert() })
          .fromTo(".hero-photo.is-active img", { scale: 1.14 }, { scale: 1.04, duration: 2.2, ease: "power2.out" }, 0)
          .fromTo(".hero-veil", { opacity: 1 }, { opacity: 0, duration: 1, ease: "power2.out" }, 0)
          .fromTo(words.inner, { yPercent: 110 }, { yPercent: 0, duration: reveal.duration * 1.3, ease: reveal.ease, stagger: .05 }, .15)
          .fromTo(".hero-slide.is-active [data-hero-appear], .hero-controls", { opacity: 0 }, { opacity: 1, duration: appear.duration, ease: appear.ease, stagger: appear.step }, .5);
      };
      if (!reducedMotion()) {
        gsap.set(words.inner, { yPercent: 110 });
        gsap.set([".hero-slide.is-active [data-hero-appear]", ".hero-controls"], { opacity: 0 });
      }
      if (document.documentElement.dataset.intro === "done") play();
      else document.addEventListener("intro:done", play, { once: true });
    }, el);
    return () => { ctx.revert(); words.revert(); };
  }, []);

  // Pause the rotation while the hero is off screen.
  useEffect(() => {
    const el = stage.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { if (reducedMotion()) setPaused(true); }, []);

  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), [slides.length]);

  // Auto-advance.
  useEffect(() => {
    if (!ready || paused || !visible) return;
    const timer = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [ready, paused, visible, index, go]);

  // Slide change: words of the old headline leave upward, the new ones rise in; the photo crossfades.
  useEffect(() => {
    const el = stage.current; if (!el || previous.current === index) return;
    const from = previous.current; previous.current = index;
    const outgoing = el.querySelectorAll<HTMLElement>(".hero-slide")[from];
    const incoming = el.querySelectorAll<HTMLElement>(".hero-slide")[index];
    const photo = el.querySelectorAll<HTMLElement>(".hero-photo")[index];
    if (reducedMotion()) return;
    const inSplit = splitMask(incoming.querySelector("h2")!);
    const outSplit = splitMask(outgoing.querySelector("h2")!);
    const tl = gsap.timeline({ onComplete: () => { inSplit.revert(); outSplit.revert(); gsap.set(outgoing, { clearProps: "all" }); } });
    tl.set(outgoing, { visibility: "visible" })
      .to(outSplit.inner, { yPercent: -110, duration: .45, ease: "power2.in", stagger: .02 }, 0)
      .to(outgoing.querySelectorAll("[data-hero-appear]"), { opacity: 0, duration: .3, ease: appear.ease }, 0)
      .fromTo(photo.querySelector("img"), { scale: 1.12 }, { scale: 1.04, duration: 1.8, ease: "power2.out" }, 0)
      .fromTo(inSplit.inner, { yPercent: 110 }, { yPercent: 0, duration: reveal.duration * 1.2, ease: reveal.ease, stagger: .045 }, .35)
      .fromTo(incoming.querySelectorAll("[data-hero-appear]"), { opacity: 0 }, { opacity: 1, duration: appear.duration, ease: appear.ease, stagger: appear.step }, .6);
    return () => { tl.progress(1).kill(); };
  }, [index]);

  const running = ready && !paused && visible;

  return <section className="hero" ref={stage} data-tone="ink" aria-roledescription="carousel" aria-label="GlobalHUB at a glance">
    <h1 className="sr-only">GlobalHUB</h1>
    <div className="hero-photos" aria-hidden="true">
      {slides.map((slide, i) => <div key={slide.title} className={`hero-photo photo ${i === index ? "is-active" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.image.src} alt="" width={slide.image.width} height={slide.image.height} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : undefined} decoding="async" />
      </div>)}
      <div className="hero-shade" />
      <div className="hero-veil" />
    </div>
    <div className="hero-inner wrap">
      <div className="hero-slides" aria-live={paused ? "polite" : "off"}>
        {slides.map((slide, i) => <div key={slide.title} className={`hero-slide ${i === index ? "is-active" : ""}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} aria-hidden={i !== index} inert={i !== index}>
          <h2 className="hero-title">{slide.title}</h2>
          <div className="hero-foot">
            <p data-hero-appear>{slide.description}</p>
            <div className="hero-ctas" data-hero-appear>
              <Pill href={slide.primary.href} external>{slide.primary.label}</Pill>
              <Pill href={slide.secondary.href} variant="outline">{slide.secondary.label}</Pill>
            </div>
          </div>
        </div>)}
      </div>
      <div className="hero-controls">
        <p className="hero-count" aria-hidden="true"><span>{pad(index + 1)}</span> / {pad(slides.length)}</p>
        <div className="hero-bars">
          {slides.map((slide, i) => <button key={slide.title} className={`hero-bar ${i === index ? "is-active" : ""} ${running ? "is-running" : ""}`} style={{ "--slide": `${SLIDE_MS}ms` } as React.CSSProperties} onClick={() => go(i)} aria-label={`Show slide ${i + 1}: ${slide.title}`} aria-current={i === index}><span /></button>)}
        </div>
        <button className="hero-pause" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>
          {paused ? <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg> : <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>}
        </button>
      </div>
    </div>
  </section>;
}
