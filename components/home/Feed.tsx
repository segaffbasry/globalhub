"use client";

import { useRef } from "react";
import { Arrow, Pill } from "@/components/ui";
import { companyUrl, data, feed } from "@/lib/home-content";

/* The live Social Feed: the five latest posts as a sideways row of cards (Ankar's testimonial rail), each
   linking to the posting company's page. Arrows scroll the row; it also scrolls by touch, trackpad and keyboard. */
export default function Feed() {
  const rail = useRef<HTMLUListElement>(null);
  const move = (dir: number) => {
    const el = rail.current; if (!el) return;
    const card = el.querySelector("li"); const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * .8;
    el.scrollBy({ left: dir * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <section className="feed" data-tone="light" aria-labelledby="feed-title">
    <div className="wrap feed-head">
      <h2 id="feed-title" data-rise>{feed.title}</h2>
      <div className="feed-join" data-appear>
        <div><p className="feed-prompt">{feed.prompt}</p><p>{feed.body}</p></div>
        <Pill href={feed.cta.href}>{feed.cta.label}</Pill>
      </div>
    </div>
    <ul className="feed-rail wrap-left" ref={rail} tabIndex={0} aria-label="Latest posts">
      {data.posts.map((post) => <li key={post.id} data-card>
        <a href={companyUrl(post.company.slug)} className="post">
          <span className="post-head">
            {post.company.logo && /* eslint-disable-next-line @next/next/no-img-element */ <img className="post-logo" src={post.company.logo.src} alt="" width={40} height={40} loading="lazy" />}
            <span><strong>{post.company.name} - {post.author}</strong><time>{post.date}</time></span>
          </span>
          {post.text && <span className="post-text">{post.text}</span>}
          {post.image && <span className="post-image photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={post.image.src} alt="" width={post.image.width} height={post.image.height} loading="lazy" decoding="async" /></span>}
          <span className="post-meta">{post.comments} {post.comments === 1 ? "comment" : "comments"}, {post.shares} {post.shares === 1 ? "share" : "shares"}</span>
        </a>
      </li>)}
    </ul>
    <div className="wrap feed-nav" data-appear>
      <button onClick={() => move(-1)} aria-label="Previous posts"><Arrow className="left" /></button>
      <button onClick={() => move(1)} aria-label="Next posts"><Arrow /></button>
    </div>
  </section>;
}
