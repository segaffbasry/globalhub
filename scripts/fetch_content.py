"""Snapshot the live GlobalHUB homepage data into content/home.json and public/images/.

The live homepage (globalhub.co.uk) renders client-side from a public JSON API. This script reads the
same endpoints the homepage calls, keeps only what the homepage displays (no emails, phone numbers or
account data), and saves every image locally as WebP so nothing is hotlinked.

Run: npm run content   (needs Python 3 with Pillow)
"""
import io
import json
import os
import urllib.request
from datetime import datetime

from PIL import Image

API = "https://api.globalhub.co.uk/api"
STORAGE = "https://api.globalhub.co.uk/storage"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, "public", "images")
UA = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}


def get(path):
    with urllib.request.urlopen(urllib.request.Request(f"{API}/{path}", headers=UA), timeout=60) as r:
        return json.load(r)


def image(path, folder, width, name=None):
    """Download one storage image, resize to at most `width`, save as WebP, return its public path."""
    if not path:
        return None
    out_dir = os.path.join(IMAGES, folder)
    os.makedirs(out_dir, exist_ok=True)
    stem = name or os.path.splitext(os.path.basename(path))[0]
    target = os.path.join(out_dir, f"{stem}.webp")
    svg_target = os.path.join(out_dir, f"{stem}.svg")
    if path.endswith(".svg"):
        if not os.path.exists(svg_target):
            req = urllib.request.Request(f"{STORAGE}/{path}", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as r:
                open(svg_target, "wb").write(r.read())
        # Vector artwork: the frame is square, so a nominal square size is enough for layout.
        return {"src": f"/images/{folder}/{stem}.svg", "width": 400, "height": 400}
    if not os.path.exists(target):
        req = urllib.request.Request(f"{STORAGE}/{path}", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        im = Image.open(io.BytesIO(data))
        im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(target, "WEBP", quality=82, method=6)
    with Image.open(target) as im:
        size = im.size
    return {"src": f"/images/{folder}/{stem}.webp", "width": size[0], "height": size[1]}


def date(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")).strftime("%-d %b %Y")


def company(c, cover=False):
    out = {
        "name": c["name"],
        "slug": c["slug"],
        "logo": image(c.get("logo"), "logos", 240),
    }
    if cover:
        industries = json.loads(c["industries"]) if c.get("industries") else []
        out.update({
            "based": c.get("based"),
            "country": c.get("country") or None,
            "industries": industries,
            "cover": image(c.get("cover"), "companies", 1200),
        })
    return out


def main():
    slides = get("home-page-slides")
    feed = get("social-feed?per_page=5&page=1")["posts"]
    featured = get("featured-companies")
    services = get("services")
    categories = get("categories")

    # The homepage shows slides in API order.
    hero = [{
        "title": s["title"],
        "description": s["description"],
        "image": image(s["file_path"], "hero", 2000, f"slide-{i + 1}"),
        "primary": {"label": s["cta_primary_title"], "href": s["cta_primary_link"]},
        "secondary": {"label": s["cta_secondary_title"], "href": s["cta_secondary_link"]},
    } for i, s in enumerate(slides)]

    posts = [{
        "id": p["id"],
        "company": company(p["company"]),
        "author": " ".join(x for x in [p["user"].get("first_name"), p["user"].get("last_name")] if x),
        "date": date(p["created_at"]),
        "text": (p["post"] or "").replace("\r\n", "\n").strip(),
        "image": image(p["post_images"][0]["path"], "posts", 1200) if p["post_images"] else None,
        "comments": p["comments_count"],
        "shares": p.get("share_count") or 0,
    } for p in feed]

    def service(s):
        img = s["images"][0] if s["images"] else None
        return {
            "id": s["id"],
            "title": s["service_title"],
            "description": s["service_description"],
            "image": image(img["path"], "services", 1000) if img else None,
            "company": company(s["company"]),
        }

    # "Popular Services" = highest popularity_count; "Recently added" = newest. Both show six, like the live page.
    popular = [service(s) for s in sorted(services, key=lambda s: -s["popularity_count"])[:6]]
    recent = [service(s) for s in sorted(services, key=lambda s: s["created_at"], reverse=True)[:6]]

    cats = [{
        "name": c["name"],
        "slug": c["slug"],
        "image": image(c.get("thumbnail") or c.get("image"), "categories", 480),
    } for c in categories if c.get("active", 1)]

    data = {
        "fetched": datetime.utcnow().strftime("%Y-%m-%d"),
        "hero": hero,
        "posts": posts,
        "featured": [company(c, cover=True) for c in featured],
        "popular": popular,
        "recent": recent,
        "categories": cats,
    }
    os.makedirs(os.path.join(ROOT, "content"), exist_ok=True)
    json.dump(data, open(os.path.join(ROOT, "content", "home.json"), "w"), indent=1, ensure_ascii=False)
    print(f"slides {len(hero)}, posts {len(posts)}, featured {len(data['featured'])}, popular {len(popular)}, recent {len(recent)}, categories {len(cats)}")


if __name__ == "__main__":
    main()
