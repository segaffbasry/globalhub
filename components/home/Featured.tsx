import { companyUrl, data, featuredTitle } from "@/lib/home-content";

/* Featured businesses: the eight live cover photographs in an editorial grid, each opening the company page. */
export default function Featured() {
  return <section className="featured" data-tone="light" aria-labelledby="featured-title">
    <div className="wrap">
      <h2 id="featured-title" className="section-title" data-rise>{featuredTitle}</h2>
      <ul className="featured-grid">
        {data.featured.map((c, i) => <li key={c.slug} className={i % 5 === 0 ? "is-wide" : ""} data-card>
          <a href={companyUrl(c.slug)} className="company">
            <span className="company-photo photo">{c.cover && /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.cover.src} alt="" width={c.cover.width} height={c.cover.height} loading="lazy" decoding="async" />}</span>
            <span className="company-body">
              {c.logo && /* eslint-disable-next-line @next/next/no-img-element */ <img className="company-logo" src={c.logo.src} alt="" width={48} height={48} loading="lazy" />}
              <span><strong>{c.name}</strong>{(c.based || c.industries[0]) && <span className="company-meta">{[c.based, c.industries[0]].filter(Boolean).join(" · ")}</span>}</span>
            </span>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
