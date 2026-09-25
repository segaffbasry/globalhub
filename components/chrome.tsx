"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Logo, Pill, Social, reducedMotion } from "@/components/ui";
import { reveal } from "@/lib/ease";
import { join, url } from "@/lib/home-content";
import { contact, footerGroups, headerLinks, legalName, menuCategories, menuTabs, socials } from "@/lib/menu";

/* Full-screen menu. An ink sheet drops from the top edge, then the tabs and category links rise into place.
   The same timeline plays in reverse (faster) on close. */
function Menu({ open, tab, setTab, close }: { open: boolean; tab: number; setTab: (tab: number) => void; close: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const opened = useRef(false);
  const item = menuTabs[tab];

  useEffect(() => {
    const el = root.current; if (!el) return;
    const q = (s: string) => el.querySelectorAll(s);
    const tl = gsap.timeline({ paused: true, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .7, ease: "power4.inOut" }, 0)
      .fromTo(q(".menu-top > *"), { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: reveal.duration, ease: reveal.ease, stagger: .06 }, .4)
      .fromTo(q(".menu-tab"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: reveal.duration, ease: reveal.ease, stagger: .07 }, .45);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      return focusOverlay(el, close, el.querySelector<HTMLElement>(`.menu-tab[aria-selected="true"]`));
    }
    if (opened.current) tl.timeScale(reducedMotion() ? 50 : 1.6).reverse();
  }, [open, close]);

  // Links of the chosen tab rise in; a fresh open waits for the sheet.
  useEffect(() => {
    const el = root.current; if (!el || !open) return;
    const fresh = !opened.current; opened.current = true;
    const items = el.querySelectorAll("[data-m]");
    if (reducedMotion()) { gsap.set(items, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(items, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: reveal.duration, ease: reveal.ease, stagger: .006, delay: fresh ? .55 : 0, overwrite: true });
  }, [open, tab]);
  useEffect(() => { if (!open) opened.current = false; }, [open]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent>
    <div className="menu-top">
      <a href="#top" className="menu-logo" onClick={close} aria-label="GlobalHUB, back to top"><Logo /></a>
      <button className="menu-close" onClick={close}>Close<span aria-hidden="true" /></button>
    </div>
    <div className="menu-body">
      <div className="menu-side">
        <div className="menu-tabs" role="tablist" aria-label="Browse by area">
          {menuTabs.map((entry, index) => <button key={entry.id} id={`tab-${entry.id}`} className="menu-tab" role="tab" aria-selected={tab === index} aria-controls="menu-panel" onClick={() => setTab(index)}><span>0{index + 1}</span>{entry.label}</button>)}
          <a className="menu-tab menu-tab-link" href={headerLinks.find.href}><span>04</span>{headerLinks.find.label}<Arrow /></a>
        </div>
        <div className="menu-account"><Pill href={headerLinks.join.href}>{headerLinks.join.label}</Pill><Pill href={headerLinks.login.href} variant="outline">{headerLinks.login.label}</Pill></div>
      </div>
      <div className="menu-panel" id="menu-panel" role="tabpanel" aria-labelledby={`tab-${item.id}`} key={item.id}>
        <div className="menu-intro">
          <p data-m>{item.blurb}</p>
          <div data-m><Pill href={item.all.href}>{item.all.label}</Pill></div>
        </div>
        <ul className="menu-links">{menuCategories.map((c) => <li key={c.slug} data-m><a href={url(`${item.base}${c.slug}`)}>{c.name}</a></li>)}</ul>
      </div>
    </div>
  </div>;
}

/* CrazyUI's black offer bar, carrying GlobalHUB's own live promotion. The code chip copies GH3. */
function Promo() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(join.code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked: the code stays readable */ }
  };
  return <div className="promo">
    <a href={join.cta.href}>{join.promo}</a>
    <button onClick={copy} aria-label={`Copy code ${join.code}`}><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 4h6v6H4zM2 8V2h6" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>{copied ? "Copied!" : join.code}</button>
    <span className="sr-only" aria-live="polite">{copied ? "Code copied" : ""}</span>
  </div>;
}

/* Frameless header. Its colour follows the section beneath it (data-tone), it hides on the way down and returns on the way up. */
function Header() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY, delta = y - last;
      document.documentElement.classList.toggle("at-top", y < 40);
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0); last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);
  const show = (index: number) => { setTab(index); setOpen(true); };
  return <>
    <header className="site-header" ref={bar}>
      <Promo />
      <div className="header-row">
      <a href="#top" className="brand" aria-label="GlobalHUB, back to top"><Logo /></a>
      <nav className="nav" aria-label="Main">
        <a href={headerLinks.find.href}>{headerLinks.find.label}</a>
        {menuTabs.map((entry, index) => <button key={entry.id} aria-haspopup="dialog" aria-expanded={open && tab === index} aria-controls="site-menu" onClick={() => show(index)}>{entry.label}<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="m2 3.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg></button>)}
      </nav>
      <div className="header-end">
        <a className="header-login" href={headerLinks.login.href}>{headerLinks.login.label}</a>
        <Pill href={headerLinks.join.href} className="header-join">{headerLinks.join.label}</Pill>
        <button className="menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls="site-menu" onClick={() => show(0)}><span /><span /></button>
      </div>
      </div>
    </header>
    <Menu open={open} tab={tab} setTab={setTab} close={close} />
  </>;
}

/* CrazyUI's footer: a light panel with rounded lower corners sits over an ink band, and the giant logo
   rises out of the band below it. Heart's small uppercase group labels are kept. */
function Footer() {
  return <footer className="site-footer">
    <div className="footer-panel" data-tone="light" data-soft>
      <div className="wrap footer-grid">
        <div className="footer-intro">
          <a href="#top" className="footer-brand" aria-label="GlobalHUB, back to top"><Logo /></a>
          <a className="footer-mail" href={contact.href} data-appear>{contact.email}</a>
          <ul className="footer-social" data-appear>{socials.map((s) => <li key={s.name}><a href={s.href} aria-label={`GlobalHUB on ${s.name}`} target="_blank" rel="noopener noreferrer"><Social icon={s.icon} /></a></li>)}</ul>
        </div>
        {footerGroups.map((group) => <nav className="footer-group" key={group.title} aria-label={group.title} data-appear>
          <h2>{group.title}</h2>
          <ul>{group.links.map(([name, href]) => <li key={name}><a href={href}>{name}</a></li>)}</ul>
        </nav>)}
      </div>
      <div className="wrap footer-legal"><p>{legalName}</p><a href="#top">Back to top <Arrow className="up" /></a></div>
    </div>
    <div className="footer-band" data-tone="ink"><div className="wrap footer-sign" data-image><Logo title="GlobalHUB" /></div></div>
  </footer>;
}

/* Everything around the homepage: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" />
    <Header />
    <main id="main">{children}</main>
    <Footer />
  </>;
}
