/* Hollow Launcher — site content.
   Edit this file to change releases; no build step needed.

   To enable a download button, paste the installer URL into `downloads`
   (for example a GitHub Releases link). Empty string = "Coming soon". */

window.HOLLOW = {
  releases: [
    {
      id: "0.0.1",
      version: "0.0.1",
      channel: "stable",            // "stable" or "beta"
      release_date: "2026-10-25",
      is_latest: true,
      size_mb: null,                // e.g. 64
      summary: "First public build of Hollow Launcher.",
      minecraft_versions: ["1.8.9", "1.12.2", "1.16.5", "1.18.2", "1.20.6", "1.21.4", "25.4", "26.3"],
      notes: [
        "First public build: the launcher with every Minecraft version from 1.8.9 to 26.3.",
        "One-click profiles for PvP, survival, building and recording.",
        "Mod browser with one-click installs.",
        "Windows, macOS and Linux installers ship in the same release."
      ],
      downloads: { windows: "", macos: "", linux: "" }
    }
  ]
};
