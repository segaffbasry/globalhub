import { Pill } from "@/components/ui";
import { join } from "@/lib/home-content";

/* The live "Grow your business" banner as a full green scene: the price is the headline. */
export default function Join() {
  return <section className="join" data-tone="green" data-soft aria-labelledby="join-title">
    <div className="wrap join-grid">
      <p className="join-price" data-rise><span>{join.price.lead}</span>{join.price.amount}<small>{join.price.terms}</small></p>
      <div className="join-copy">
        <p className="join-label" data-appear>{join.label}</p>
        <h2 id="join-title" data-rise>{join.title}</h2>
        <p data-words>{join.text}</p>
        <div className="join-ctas" data-appear><Pill href={join.cta.href}>{join.cta.label}</Pill><span className="join-promo">{join.promo}</span></div>
      </div>
    </div>
  </section>;
}
