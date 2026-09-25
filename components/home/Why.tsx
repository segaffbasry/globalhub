import { why } from "@/lib/home-content";

/* Why GlobalHUB? as Heart's editorial long-form: the question holds on the left while the six answers read down the right. */
export default function Why() {
  return <section className="why" data-tone="paper" data-soft aria-labelledby="why-title">
    <div className="wrap why-grid">
      <h2 id="why-title" className="why-title" data-rise>Why Global<span>HUB</span>?</h2>
      <ol className="why-list">{why.items.map((item, i) => <li key={item.title}>
        <span className="why-index" data-appear>0{i + 1}</span>
        <h3 data-rise>{item.title}</h3>
        <p data-words>{item.text}</p>
      </li>)}</ol>
    </div>
  </section>;
}
