// The client's domain is the only host that serves pages. www, the preview host (the <client>.<agency-domain>
// link used in the sales video) and workers.dev all answer with a 301 to the same path and query on the
// canonical domain, so Google sees one copy of the site. Everything else is the static assets in SITE/
// (html_handling, the 404 page and _headers still apply).
//
// A site with an endpoint (a form handler at /api/...) answers /api/* here before the redirect, and lists
// "/api/*" in wrangler's run_worker_first instead of true.
const CANONICAL = 'example.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname !== CANONICAL) {
      url.hostname = CANONICAL;
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
