# Hollow Client — website

Static site (plain HTML, CSS and JavaScript). No build step, no dependencies, no backend.

```
index.html        Home
downloads.html    Downloads
changelog.html    Release notes
shop.html         Cosmetics shop
assets/
  style.css       All styling (design tokens at the top)
  app.js          Page behaviour
  data.js         Releases and cosmetics  <-- the file you edit most
  hero.jpg        Hero background
  favicon.svg
```

## Put it on GitHub Pages (free)

1. Create a new repository on GitHub (for example `hollowclient`).
2. Upload everything in this folder to the repository root, so `index.html` sits at the top level.
3. Open **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, pick `main` and `/ (root)`, then Save.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.
   Name the repo `<your-username>.github.io` to get `https://<your-username>.github.io/` with no path.

Netlify and Vercel also work: drag the folder in, or connect the repository.

## Common edits

**Add a real download link** — in `assets/data.js`, paste the installer URL (a GitHub Releases asset works well):

```js
downloads: { windows: "https://github.com/you/hollow/releases/download/v0.0.1/Hollow-Setup.exe", macos: "", linux: "" }
```

An empty string keeps the button on "Coming soon".

**Add a release** — copy the release object in `data.js`, change the version, date and notes, and set `is_latest: true` on the newest one only (and `false` on the old one). The home page, downloads page and changelog all update.

**Change cosmetics** — edit the `cosmetics` list in `data.js`. The names and quests there are placeholders.

**Change colours** — edit the HSL values under `:root` at the top of `assets/style.css`.

## License

MIT, see `LICENSE`. Third-party credits (Lucide icons, fonts, hero image) are in `THIRD_PARTY_NOTICES.md`.

## Notes

- Unlocked cosmetics are remembered per browser (`localStorage`). There are no accounts, so this is a preview of the idea, not real unlocking. Real unlocking needs the game client and a server.
- Fonts (Inter, Space Grotesk) load from Google Fonts.
- "Not affiliated with Mojang Studios or Microsoft." is in the footer. Keep it.
