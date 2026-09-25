import { Arrow } from "@/components/ui";
import { pillars } from "@/lib/home-content";

/* The three live cards (Collaborate, Services, Products) as crazyui.com's component tiles: a grey frame holding
   a real GlobalHUB photograph, then the title, the live copy and a small black arrow button. */
export default function Pillars() {
  return <section className="pillars" data-tone="paper" aria-labelledby="pillars-title">
    <h2 id="pillars-title" className="sr-only">What you can do on GlobalHUB</h2>
    <ul className="wrap pillars-grid">
      {pillars.map((pillar, i) => <li key={pillar.title} data-card>
        <a href={pillar.href} className="pillar">
          <span className="pillar-photo photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pillar.image.src} alt="" width={pillar.image.width} height={pillar.image.height} loading="lazy" decoding="async" />
            <span className="pillar-index">0{i + 1}</span>
          </span>
          <span className="pillar-body">
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
            <span className="pillar-cta">{pillar.cta}<span className="pillar-go" aria-hidden="true"><Arrow /></span></span>
          </span>
        </a>
      </li>)}
    </ul>
  </section>;
}
