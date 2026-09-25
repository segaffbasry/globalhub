"use client";

import { useRef } from "react";
import { categoriesTitle, categoryUrl, data } from "@/lib/home-content";

/* Browse by category: all 83 live categories as an A–Z index. On a fine pointer the category photograph
   follows the cursor; on touch the list stands alone. */
export default function Categories() {
  const preview = useRef<HTMLDivElement>(null);
  const show = (src: string | null) => {
    const el = preview.current; if (!el) return;
    const img = el.querySelector("img")!;
    if (src) { img.src = src; el.classList.add("is-on"); } else el.classList.remove("is-on");
  };
  const follow = (event: React.PointerEvent) => {
    const el = preview.current; if (!el || event.pointerType !== "mouse") return;
    el.style.transform = `translate3d(${event.clientX + 24}px, ${event.clientY - 90}px, 0)`;
  };
  return <section className="categories" data-tone="light" data-soft aria-labelledby="categories-title" onPointerMove={follow} onPointerLeave={() => show(null)}>
    <div className="wrap">
      <h2 id="categories-title" className="section-title" data-rise>{categoriesTitle}</h2>
      <ul className="cat-list">{data.categories.map((c) => <li key={c.slug}>
        <a href={categoryUrl(c.slug)} onPointerEnter={(e) => e.pointerType === "mouse" && show(c.image?.src ?? null)} onPointerLeave={() => show(null)}>{c.name}</a>
      </li>)}</ul>
    </div>
    <div className="cat-preview photo" ref={preview} aria-hidden="true">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={data.categories[0].image?.src} alt="" width={480} height={320} /></div>
  </section>;
}
