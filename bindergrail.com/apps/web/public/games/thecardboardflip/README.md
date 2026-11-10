# The Cardboard Flip (playable demo)

Static copy of the game from github.com/jawnpack/tcgscalper (main branch).
Served at bindergrail.com/games/thecardboardflip via a rewrite in next.config.ts.
To update: copy main.html (as index.html, keeping the <base> tag, canonical and
GAME_HOME lines), css/ and js/{market,rules,intro,game,progress}.js from that repo.

Then, from apps/web, run `npm run build:flip` — index.html loads one deferred
js/game.bundle.js (generated from those five files), not the files directly.
Also keep these local changes when copying main.html over:
- the Press Start 2P @font-face in css/gamestyle.css (self-hosted in css/fonts/,
  replacing the Google Fonts @import) and its <link rel="preload"> in index.html;
- analytics via the site's GTM container (GTM-WB2SCKMX, after load), not the
  game's own gtag/GA4 property.
