"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { appear, reveal } from "@/lib/ease";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitMask } from "@/lib/split";

let registered = false;
export function registerMotion() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create(appear.ease, `M0,0 C${appear.bezier[0]},${appear.bezier[1]} ${appear.bezier[2]},${appear.bezier[3]} 1,1`);
  registered = true;
}

/* The five reveal moves (see the table in the README). Every move plays once, uses the Ankar spring or tween,
   and a [data-soft] section (the later ones) runs the same move shorter and smaller. */
function reveals(reduced: boolean) {
  const soft = (el: Element) => !!el.closest("[data-soft]");
  const mark = (el: HTMLElement) => el.setAttribute("data-ready", "");

  // 1. Headings: the whole phrase fades and rises as one.
  document.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
    mark(el); if (reduced) return;
    const s = soft(el);
    gsap.set(el, { opacity: 0, y: s ? 16 : 28 });
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: reveal.duration * (s ? .8 : 1.1), ease: reveal.ease }) });
  });

  // 2. Paragraphs: words slide up out of a line mask, a few hundredths apart.
  const splits: { revert: () => void }[] = [];
  document.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => {
    if (reduced) { mark(el); return; }
    const s = soft(el);
    const split = splitMask(el); splits.push(split);
    gsap.set(split.inner, { yPercent: 105 });
    mark(el);
    ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => gsap.to(split.inner, { yPercent: 0, duration: reveal.duration * (s ? .9 : 1.2), ease: reveal.ease, delay: s ? .05 : .12, stagger: Math.min(.012, .5 / split.inner.length) }) });
  });

  // 3. Labels and buttons: Ankar's appear tween, a plain fade, 0.1 s apart in reading order.
  document.querySelectorAll<HTMLElement>("[data-appear]").forEach((el) => { mark(el); if (!reduced) gsap.set(el, { opacity: 0 }); });
  if (!reduced) ScrollTrigger.batch("[data-appear]", { start: "top 94%", once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: appear.duration, ease: appear.ease, delay: appear.step, stagger: appear.step }) });

  // 4. Cards: batched as they enter, fade and rise on the spring.
  document.querySelectorAll<HTMLElement>("[data-card]").forEach((el) => { mark(el); if (!reduced) gsap.set(el, { opacity: 0, y: soft(el) ? 20 : 40 }); });
  if (!reduced) ScrollTrigger.batch("[data-card]", { start: "top 92%", once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: reveal.duration * (soft(batch[0]) ? 1 : 1.3), ease: reveal.ease, stagger: appear.step, clearProps: "transform" }) });

  // 5. Images: the frame clips open, and the photo inside drifts about 10% against the scroll.
  document.querySelectorAll<HTMLElement>("[data-image]").forEach((el) => {
    mark(el); if (reduced) return;
    const s = soft(el);
    gsap.set(el, { clipPath: s ? "inset(6% 4% 6% 4%)" : "inset(12% 8% 12% 8%)" });
    ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: reveal.duration * (s ? 1.4 : 2), ease: reveal.ease, clearProps: "clipPath" }) });
    const photo = el.querySelector("img");
    if (photo && el.hasAttribute("data-parallax")) gsap.fromTo(photo, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" } });
  });

  return () => splits.forEach((split) => split.revert());
}

/* Header colour: sections declare data-tone="ink|light|green"; the section under the header decides. */
function headerTone() {
  const root = document.documentElement;
  let sections: { top: number; bottom: number; tone: string }[] = [];
  const measure = () => {
    sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]")).map((el) => {
      const box = el.getBoundingClientRect();
      return { top: box.top + scrollY, bottom: box.bottom + scrollY, tone: el.dataset.tone ?? "light" };
    });
  };
  const update = () => {
    const y = scrollY + 36;
    const hit = sections.filter((s) => y >= s.top && y < s.bottom).pop();
    const tone = hit?.tone ?? "light";
    if (root.dataset.htone !== tone) root.dataset.htone = tone;
  };
  const resize = new ResizeObserver(() => { measure(); update(); });
  resize.observe(document.body);
  measure(); update();
  gsap.ticker.add(update);
  return () => { resize.disconnect(); gsap.ticker.remove(update); };
}

/* Smooth scroll, reveals, header tone and in-page anchors for the whole page. */
export function usePageMotion() {
  useEffect(() => {
    registerMotion();
    const root = document.documentElement;
    const reduced = reducedMotion();
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: .95 });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // The preloader holds the page still until it hands over.
      if (root.classList.contains("is-loading")) lenis.stop();
    }
    const start = () => lenis?.start();
    document.addEventListener("intro:done", start);

    let undoSplits = () => {};
    const ctx = gsap.context(() => { undoSplits = reveals(reduced); });
    const undoTone = headerTone();

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      const id = link.getAttribute("href") ?? "";
      const target = id === "#top" || id === "#" ? null : document.querySelector<HTMLElement>(id);
      if (id !== "#top" && id !== "#" && !target) return;
      event.preventDefault();
      if (lenis) { lenis.start(); lenis.scrollTo(target ?? 0, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) }); }
      else if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
      if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
    };
    document.addEventListener("click", onClick);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("intro:done", start);
      window.removeEventListener("load", refresh);
      ctx.revert(); undoSplits(); undoTone();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); setLenis(null);
    };
  }, []);
}

/* Focus trap for overlays: pauses scrolling, keeps Tab inside, Esc closes, focus returns to the trigger. */
export function focusOverlay(container: HTMLElement, close: () => void, initial?: HTMLElement | null) {
  const previous = document.activeElement as HTMLElement | null;
  const oldOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  getLenis()?.stop();
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')).filter((el) => el.offsetParent !== null);
  (initial ?? focusable()[0])?.focus();
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "Tab") {
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => { document.body.style.overflow = oldOverflow; getLenis()?.start(); document.removeEventListener("keydown", handleKey); previous?.focus(); };
}
