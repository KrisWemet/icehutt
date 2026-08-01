#!/usr/bin/env python3
"""Regenerates flavours-data.json from the A–Z list in flavours.html.

flavours.html is the source of truth for flavour names and descriptions — this
just mirrors the names into a small JSON file that admin.html loads to build the
staff toggle list. Run it after adding, renaming, or removing a flavour:

    python3 scripts/build-flavour-data.py

It also assigns each A–Z entry and spotlight card a data-flavour slug if one is
missing, which is what links a flavour on the page to its status in Firestore.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES_WITH_CARDS = ["flavours.html", "index.html"]


def slugify(raw):
    """Name -> slug. Must match slugify() in script.js."""
    return re.sub(r'-+$', '', re.sub(r'^-+', '', re.sub(r'[^a-z0-9]+', '-', clean(raw).lower())))


def clean(raw):
    """Strip the diet-tag span and any other markup, collapse whitespace."""
    n = re.sub(r'<span class="diet-tag">.*?</span>', '', raw)
    n = re.sub(r'<[^>]+>', '', n)
    return re.sub(r'\s+', ' ', n).strip()


def tag_index_items(html):
    """Ensure every A–Z entry carries a data-flavour slug. Returns (html, n_added)."""
    added = [0]

    def repl(m):
        attrs, dt_inner, rest = m.group(1), m.group(2), m.group(3)
        if 'data-flavour=' in attrs:
            return m.group(0)
        added[0] += 1
        return f'{attrs} data-flavour="{slugify(dt_inner)}"><dt>{dt_inner}</dt>{rest}'

    html = re.sub(
        r'(<div class="flavour-index-item"[^>]*?)><dt>(.*?)</dt>(<dd>.*?</dd></div>)',
        repl, html, flags=re.S)
    return html, added[0]


def tag_cards(html):
    """Ensure every spotlight card carries a data-flavour slug. Returns (html, n_added)."""
    added = [0]

    def repl(m):
        attrs, body = m.group(1), m.group(2)
        if 'data-flavour=' in attrs:
            return m.group(0)
        h3 = re.search(r'<h3>(.*?)</h3>', body, re.S)
        if not h3:
            return m.group(0)
        added[0] += 1
        return f'{attrs} data-flavour="{slugify(h3.group(1))}">{body}'

    html = re.sub(r'(<article class="flavour-card"[^>]*?)>(.*?</article>)', repl, html, flags=re.S)
    return html, added[0]


def main():
    flavours_page = ROOT / "flavours.html"
    html = flavours_page.read_text(encoding="utf-8")

    html, n_idx = tag_index_items(html)
    html, n_card = tag_cards(html)
    flavours_page.write_text(html, encoding="utf-8")
    if n_idx or n_card:
        print(f"flavours.html: tagged {n_idx} new A–Z entries, {n_card} new cards")

    for name in PAGES_WITH_CARDS[1:]:
        page = ROOT / name
        page_html = page.read_text(encoding="utf-8")
        page_html, n = tag_cards(page_html)
        page.write_text(page_html, encoding="utf-8")
        if n:
            print(f"{name}: tagged {n} new cards")

    entries = re.findall(
        r'<div class="flavour-index-item" data-flavour="([^"]+)"><dt>(.*?)</dt>', html, re.S)
    data = sorted(
        ({"slug": slug, "name": clean(dt)} for slug, dt in entries),
        key=lambda d: d["name"].lower())

    slugs = [d["slug"] for d in data]
    dupes = sorted({s for s in slugs if slugs.count(s) > 1})
    if dupes:
        sys.exit(f"ERROR: two flavours share a slug, so they'd share a status: {dupes}")

    out = ROOT / "flavours-data.json"
    out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"flavours-data.json: {len(data)} flavours")


if __name__ == "__main__":
    main()
