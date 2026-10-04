// App-specific auth cookie name, shared by the browser, server, and proxy
// clients so they always read and write the same cookie.
//
// Why a custom name: Pocket Money used to rely on the default
// `sb-<ref>-auth-token` name. During an earlier fix that cookie got written at
// two different scopes — host-only by the proxy and `.bindergrail.com` by the
// browser client — leaving two cookies with the SAME name in a browser. The
// server reads both, can't tell which is current, reassembles a corrupt
// session, and loops the user back to /login. The only recovery was manually
// clearing website data, because the server can't see a cookie's scope and so
// can't delete just the stale duplicate.
//
// A unique name sidesteps all of that: any leftover `sb-…` cookies are simply
// ignored, so browsers heal themselves on the next sign-in with no manual
// clearing. Cookies are host-only (no domain) to match the web app.
export const AUTH_COOKIE_NAME = "pm-auth";
