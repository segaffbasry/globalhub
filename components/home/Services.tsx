import { Arrow, Pill } from "@/components/ui";
import type { Service } from "@/lib/home-content";
import { data, serviceUrl, services } from "@/lib/home-content";

function List({ title, items, id }: { title: string; items: Service[]; id: string }) {
  return <div className="svc-col">
    <h3 id={id} data-appear>{title}</h3>
    <ul aria-labelledby={id}>{items.map((s) => <li key={s.id} data-card>
      <a href={serviceUrl(s.id)} className="svc">
        <span className={`svc-thumb photo ${s.image?.src.endsWith(".svg") ? "is-vector" : ""}`}>{s.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.image.src} alt="" width={s.image.width} height={s.image.height} loading="lazy" decoding="async" />}</span>
        <span className="svc-text"><strong>{s.title}</strong><span>{s.company.name}</span></span>
        <Arrow />
      </a>
    </li>)}</ul>
  </div>;
}

/* Popular Services and Recently added, merged into one editorial spread of two linked lists (Heart's logo-cloud rhythm). */
export default function Services() {
  return <section className="services" data-tone="light" aria-labelledby="services-title">
    <div className="wrap">
      <div className="services-head">
        <h2 id="services-title" className="section-title" data-rise>{services.title}</h2>
        <div data-appear><Pill href={services.browse.href}>{services.browse.label}</Pill></div>
      </div>
      <div className="services-grid">
        <List id="svc-popular" title={services.popularTitle} items={data.popular} />
        <List id="svc-recent" title={services.recentTitle} items={data.recent} />
      </div>
    </div>
  </section>;
}
