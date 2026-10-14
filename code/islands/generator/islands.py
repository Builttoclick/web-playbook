"""The generator side of the islands recipe: write island markup, render posters, inline the loader.

Import it from the script that writes your HTML (our sites are written by one Python generator per site):

    from islands import island, paint, fill_counters, inline_loader

    node fx/build.mjs must have run first: it writes .cache/ssr.mjs (the Node renderer) and .cache/islands.json
    (the {island: url} map the loader needs).

Every effect is written as real HTML (its poster) inside an element that names its island:

    <span class="fx" data-fx="shiny" data-props='{"text":"..."}'>...poster HTML...</span>

`class="fx"` is meant to be `display: contents` in your CSS when the wrapper must not create a box; the loader
then observes its first child.
"""
import html
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # the folder with fx/, .cache/ and node_modules/
esc = html.escape


def island(name, content, props=None, now=False, quiet=False, tag="span", cls="fx", extra=""):
    """Wrap a poster in the element the loader mounts.

    now=True    -> data-fx-when="now": mounts right after first paint (hero islands)
    quiet=True  -> data-fx-quiet: still mounts with prefers-reduced-motion (anything that must stay usable)
    """
    attrs = f' class="{cls}" data-fx="{name}"'
    if now:
        attrs += ' data-fx-when="now"'
    if quiet:
        attrs += " data-fx-quiet"
    if props is not None:
        attrs += f' data-props="{esc(json.dumps(props, ensure_ascii=False, separators=(",", ":")), quote=True)}"'
    return f"<{tag}{attrs}{extra}>{content}</{tag}>"


def _run(cmd):
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(cmd)}\n{r.stdout}\n{r.stderr}")
    return r.stdout


def paint(spec):
    """Render pieces to HTML with the real components, in Node. spec = [{"id", "piece", "props"}] -> {id: html}.

    Use EXACTLY the props the island will receive in the browser: the output is the poster, and hydration must
    find it identical."""
    cache = os.path.join(ROOT, ".cache")
    src, dst = os.path.join(cache, "spec.json"), os.path.join(cache, "html.json")
    with open(src, "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False)
    _run(["node", os.path.join(cache, "ssr.mjs"), src, dst])
    with open(dst, encoding="utf-8") as f:
        return json.load(f)


# CountUp renders an EMPTY span. Give the piece className="count count-<final value>" and the generator puts the
# final number inside (the poster) plus a box as wide as that number (figure-N, in ch), so nothing moves when the
# island hydrates and counts. css/counters.css holds the matching rules.
RE_COUNT = re.compile(r'<span class="count count-(\d+)([^"]*)"></span>')


def thousands(n, sep="."):
    """1079 -> '1.079' (match the separator you pass to CountUp)."""
    return re.sub(r"\B(?=(\d{3})+(?!\d))", sep, str(int(n)))


def fill_counters(h, sep="."):
    def put(m):
        final = thousands(m.group(1), sep)
        return f'<span class="count count-{m.group(1)}{m.group(2)} figure figure-{len(final)}">{final}</span>'
    return RE_COUNT.sub(put, h)


def inline_loader():
    """The loader, ready to go inside <script>...</script>: comment lines stripped, the island map injected."""
    with open(os.path.join(ROOT, "fx", "loader.js"), encoding="utf-8") as f:
        code = f.read()
    with open(os.path.join(ROOT, ".cache", "islands.json"), encoding="utf-8") as f:
        islands = json.load(f)
    code = re.sub(r"^\s*//.*\n", "", code, flags=re.M)
    return code.replace("__ISLANDS__", json.dumps(islands))
