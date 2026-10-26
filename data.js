/* Hollow Client — site content.
   Edit this file to change releases and cosmetics; no build step needed.

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
      summary: "First public build of Hollow Client.",
      minecraft_versions: ["1.8.9", "1.12.2", "1.16.5", "1.18.2", "1.20.6", "1.21.4", "25.4", "26.3"],
      notes: [
        "First public build: the launcher, 60+ curated mods and every Minecraft version from 1.8.9 to 26.3.",
        "One-click profiles for PvP, survival, building and recording.",
        "Cosmetics shop goes live — every item is free and unlocked through quests.",
        "Windows, macOS and Linux installers ship in the same release."
      ],
      downloads: { windows: "", macos: "", linux: "" }
    }
  ],

  // Placeholder cosmetics — rename, reorder or replace freely.
  // category: cape | wings | emote | hat | aura
  // rarity: common | rare | epic | legendary
  cosmetics: [
    {
      id: "void-cape", name: "Void Cape", category: "cape", rarity: "legendary",
      color_from: "#6d4dff", color_to: "#0e8f7a",
      quest_title: "Stare into the End",
      quest_description: "Cross into the End and come back with proof that you faced the dragon.",
      quest_steps: ["Enter the End dimension", "Defeat the Ender Dragon", "Return through the exit portal"]
    },
    {
      id: "ember-cape", name: "Ember Cape", category: "cape", rarity: "rare",
      color_from: "#ff7a45", color_to: "#ff3d6e",
      quest_title: "Forge Master",
      quest_description: "Prove you can keep a furnace running and a fire going.",
      quest_steps: ["Smelt 64 items in a furnace", "Craft a full set of iron armour", "Visit the Nether and bring back a Blaze Rod"]
    },
    {
      id: "frost-cape", name: "Frost Cape", category: "cape", rarity: "common",
      color_from: "#6ec6ff", color_to: "#3a6df0",
      quest_title: "First Snowfall",
      quest_description: "A gentle starter quest — just get out and explore.",
      quest_steps: ["Play for 30 minutes in the launcher", "Craft a bed and sleep through a night", "Travel 1,000 blocks from spawn"]
    },
    {
      id: "phantom-wings", name: "Phantom Wings", category: "wings", rarity: "epic",
      color_from: "#9b6bff", color_to: "#3de0ff",
      quest_title: "Night Watch",
      quest_description: "The night belongs to those who stay up for it.",
      quest_steps: ["Survive a full in-game night without sleeping", "Defeat 3 Phantoms", "Reach the world height limit and come back down"]
    },
    {
      id: "ash-wings", name: "Ash Wings", category: "wings", rarity: "rare",
      color_from: "#6b6b7a", color_to: "#ff6a3d",
      quest_title: "Out of the Nether",
      quest_description: "Fire, ash and a long walk through hostile territory.",
      quest_steps: ["Build a Nether portal", "Find a Nether Fortress", "Defeat a Wither Skeleton"]
    },
    {
      id: "victory-dance", name: "Victory Dance", category: "emote", rarity: "rare",
      color_from: "#16e0b8", color_to: "#3b82f6",
      quest_title: "Win Something",
      quest_description: "Earn the right to celebrate.",
      quest_steps: ["Win a match on any PvP server", "Finish a parkour course", "Play with a friend for one hour"]
    },
    {
      id: "wave", name: "Wave", category: "emote", rarity: "common",
      color_from: "#f7c948", color_to: "#ff8a3d",
      quest_title: "Say Hello",
      quest_description: "The easiest unlock in the shop.",
      quest_steps: ["Sign in to the launcher", "Join a multiplayer server", "Send a chat message"]
    },
    {
      id: "crown-of-echoes", name: "Crown of Echoes", category: "hat", rarity: "legendary",
      color_from: "#fbbf24", color_to: "#b45309",
      quest_title: "Deep Dweller",
      quest_description: "Go as deep as the world lets you.",
      quest_steps: ["Mine at the bottom of the world", "Find a diamond ore vein", "Locate a stronghold"]
    },
    {
      id: "spectral-aura", name: "Spectral Aura", category: "aura", rarity: "epic",
      color_from: "#c084fc", color_to: "#16e0b8",
      quest_title: "Collector",
      quest_description: "Show off the launcher's range.",
      quest_steps: ["Equip three different cosmetics", "Switch profile four times", "Install two Minecraft versions side by side"]
    }
  ]
};
