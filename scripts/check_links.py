"""Check every outbound link on the homepage against the live site.

Reads the prerendered page (.next/server/app/index.html, so run `npm run build` first), adds the category links of
all three menu tabs (only the open tab is in the HTML), then requests each URL. globalhub.co.uk answers unknown
paths with a real 404, so the status code is trusted. Social networks that block scripted requests are reported
separately rather than as failures.

Run: python3 scripts/check_links.py
"""
import concurrent.futures
import html
import json
import os
import re
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
page = open(os.path.join(ROOT, ".next", "server", "app", "index.html"), encoding="utf8").read()
links = {html.unescape(h) for h in re.findall(r'href="([^"]+)"', page)}
slugs = [c["slug"] for c in json.load(open(os.path.join(ROOT, "content", "home.json")))["categories"]]
for base in ("/services/category/", "/collaborations/category/", "/products/category/"):
    links.update(f"https://globalhub.co.uk{base}{slug}" for slug in slugs)

outbound = sorted(l for l in links if l.startswith("http") and "/_next/" not in l and not l.endswith((".css", ".js", ".woff2", ".png", ".ico")))
anchors = sorted(l for l in links if l.startswith("#"))
mail = sorted(l for l in links if l.startswith("mailto:"))
blocked_hosts = ("linkedin.com", "instagram.com", "facebook.com", "x.com")


def status(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh) link-check"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return url, r.status, r.geturl()
    except urllib.error.HTTPError as e:
        return url, e.code, url
    except Exception as e:  # noqa: BLE001
        return url, str(e)[:60], url


with concurrent.futures.ThreadPoolExecutor(12) as pool:
    results = list(pool.map(status, outbound))

bad = [r for r in results if r[1] != 200 and not any(h in r[0] for h in blocked_hosts)]
social = [r for r in results if any(h in r[0] for h in blocked_hosts)]
print(f"{len(outbound)} outbound links checked, {len(anchors)} in-page anchors {anchors}, {len(mail)} mailto")
for url, code, final in social:
    print(f"  social  {code}  {url}")
for url, code, final in bad:
    print(f"  FAIL    {code}  {url}")
print("all good" if not bad else f"{len(bad)} failing")
