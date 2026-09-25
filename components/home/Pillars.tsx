import { Arrow, Logo } from "@/components/ui";
import { pillars } from "@/lib/home-content";

/* Heart's sticky wordmark moment: the full logo holds still at display size while the three live
   cards (Collaborate, Services, Products) scroll up over it. */
export default function Pillars() {
  return <section className="pillars" data-tone="paper" aria-labelledby="pillars-title">
    <h2 id="pillars-title" className="sr-only">What you can do on GlobalHUB</h2>
    <div className="pillars-sign" aria-hidden="true"><Logo /></div>
    <div className="wrap pillars-cards">
      {pillars.map((pillar, i) => <a key={pillar.title} href={pillar.href} className={`pillar pillar-${i + 1}`} data-card>
        <span className="pillar-index">0{i + 1}</span>
        <h3>{pillar.title}</h3>
        <p>{pillar.text}</p>
        <span className="pillar-cta">{pillar.cta}<Arrow /></span>
      </a>)}
    </div>
  </section>;
}
