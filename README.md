# Hollow Launcher — website

Static site (plain HTML, CSS and JavaScript). No build step, no dependencies, no backend.

```
index.html        Home
downloads.html    Downloads
changelog.html    Release notes
style.css         All styling (design tokens at the top)
app.js            Page behaviour
data.js           Releases  <-- the file you edit most
hero.jpg          Hero background
pixelify-sans.woff2  The pixel font (license in OFL.txt)
favicon.svg
```

All files live in one folder level, so you can drag them all into GitHub at once.

## Put it on GitHub Pages (free)

1. Create a new **public** repository on GitHub.
2. Upload every file in this folder to the repository root, so `index.html` sits at the top level, then click **Commit changes**.
3. Open **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, pick `main` and `/ (root)`, then Save.
4. After a minute the site is live at `https://<your-username-or-org>.github.io/<repo-name>/`.
   Name the repo `<your-username-or-org>.github.io` to get the address without a path.

## Common edits

**Add a real download link** — in `data.js`, paste the installer URL (a GitHub Releases asset works well):

```js
downloads: { windows: "https://github.com/you/hollow/releases/download/v0.0.1/Hollow-Setup.exe", macos: "", linux: "" }
```

An empty string keeps the button on "Coming soon".

**Add a release** — copy the release object in `data.js`, change the version, date and notes, and set `is_latest: true` on the newest one only (and `false` on the old one). The home page, downloads page and changelog all update.

**Change the wording** — the page text is in the `.html` files. Edit them directly on GitHub (pencil icon).

**Change colours or fonts** — edit the values under `:root` at the top of `style.css`.

## License

MIT, see `LICENSE`. Third-party credits (Lucide icons, font, hero image) are in `THIRD_PARTY_NOTICES.md`.

## Notes

- The pixel font (Pixelify Sans) is included in the repo as `pixelify-sans.woff2`, so the site makes no requests to Google. To change it, edit the `@font-face` rule and the three `--font-*` lines at the top of `style.css`.
- "Not affiliated with Mojang Studios or Microsoft." is in the footer. Keep it.
- Some page text describes planned launcher features. Edit it to match what the launcher actually does at release.
