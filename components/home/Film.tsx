"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui";
import { film } from "@/lib/home-content";

const origin = "https://www.youtube-nocookie.com";

/* The official "What is GlobalHUB?" film. It is a narrated explainer, so it never autoplays: the local poster
   stands in until someone presses play, then the YouTube player loads. It pauses when scrolled out of view. */
export default function Film() {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = box.current; if (!el || !playing) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), origin);
    }, { threshold: .1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [playing]);

  return <section className="film" id="film" data-tone="ink" aria-labelledby="film-title">
    <div className="wrap film-grid">
      <div className="film-copy">
        <Label>Watch the video</Label>
        <h2 id="film-title" data-rise>{film.title}</h2>
      </div>
      <div className="film-frame" ref={box} data-image>
        {playing
          ? <iframe ref={frame} src={`${origin}/embed/${film.youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&playsinline=1`} title={film.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          : <button className="film-poster photo" onClick={() => setPlaying(true)} aria-label={`Play the film: ${film.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/film/poster.webp" alt="" width={1280} height={720} loading="lazy" decoding="async" />
            <span className="film-play"><span className="film-dot" aria-hidden="true" />Play video</span>
          </button>}
        <noscript><a className="film-link" href={film.href}>Watch “{film.title}” on YouTube</a></noscript>
      </div>
    </div>
  </section>;
}
