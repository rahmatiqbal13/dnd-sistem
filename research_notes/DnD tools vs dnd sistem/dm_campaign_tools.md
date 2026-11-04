# DM-side Campaign Management and Utility Tools for D&D 5e (as of November 2026)

Research date: 2026-11-04. Method: web search plus direct fetches of official pages where reachable. Many official pricing pages could not be fetched (403/404, or prices on a separate Patreon), so several numbers come from third-party sources and are flagged. Items marked **[Training knowledge, unverified 2026]** come from the researcher's background knowledge (cutoff mid-2026). They were not re-verified in this session and have no citation. The report writer should treat them as context, not as cited fact.

---

## Q0. Tool profiles (pricing, platforms, features, 2024 rules, offline, localisation, legal)

### Takeaway
The market splits into four groups. Paid worldbuilding wikis: World Anvil, LegendKeeper, and Kanka (Kanka has a generous free tier). Free browser combat tools: Kobold Fight Club, Improved Initiative, and Shieldmaiden (free core, Patreon extras). Discord-native bots: Avrae, dddice, and dice bots. Subscription AI GMs: Friends & Fables. None of the tools checked showed any Indonesian localisation.

### Cited Findings

**LegendKeeper (wiki + atlas/maps)**
- Basic (free) lets you view and export projects and collaborate in other people's projects. Pro is $9/month, or $7.50/month billed annually, priced in local currency. Pro adds unlimited projects, wiki pages, maps, timelines, events, whiteboards, collaborators, and storage, plus publish to web. It has a 14-day trial with no card and no refunds — [LegendKeeper Pricing](https://www.legendkeeper.com/pricing)
- Only the project owner pays; guests and players join free. If a subscription lapses, the owner can still view and export, but guests lose access — [LegendKeeper Pricing](https://www.legendkeeper.com/pricing)
- Works offline: edits to the wiki and atlas save locally and sync on reconnect. Still labelled "Beta" — [LegendKeeper FAQ](https://legendkeeper.com/faq)
- Existing patrons get a lifetime price discount — [Patron Price Guarantee](https://legendkeeper.com/patron-price-guarantee)

**World Anvil (wiki/worldbuilding, campaign manager)**
- The free tier allows up to 2 worlds, 42 articles, and 100 MB of images. Guild (paid) members get unlimited articles and more storage — [World Anvil FAQ](https://www.worldanvil.com/faq)
- Guild tiers are named Freeman, Master, Grandmaster, and Sage, plus an application-only "Inner Sanctum". Co-authors don't need a membership — [World Anvil Codex: Guild](https://www.worldanvil.com/w/WorldAnvilCodex/a/guild)
- Prices (unverified, possibly stale): Master $7, Grandmaster $12, Sage $34 per month per a 2023 review — [Self-Publishing School, Nov 2023](https://self-publishingschool.com/world-anvil-review/). A different source lists "Journeyman $5/mo" — [Kindlepreneur](https://kindlepreneur.com/world-anvil/). The two conflict, and I could not get the official 2026 pricing page.
- [Training knowledge, unverified 2026] World Anvil has campaign-manager features: session reports, player-character pages, secrets and subscriber groups that reveal content to specific players, and RPG statblock "sheets" for 5e. It is browser-only with no true offline mode.

**Kanka (open-core campaign wiki)**
- The free tier ("Kobold") has core features and unlimited campaigns and entries, with 50 MB of storage. Premium campaigns get 1 GB — [Kanka blog 2.0](https://blog.kanka.io/2023/11/01/2-0-harder-better-faster-stronger); [kanka.io](https://kanka.io)
- The paid "Owlbear" tier is $4.99/month — [Kanka (es) v2 pricing](https://kanka.io/es/v2). A campaign stays premium only while its booster keeps subscribing — [Kanka features](https://Kanka.io/features)
- The site is localised (a Spanish version exists). French docs note the translation is still pending. I found no evidence of Indonesian — [Kanka docs FR](https://docs.kanka.io/fr/latest/overview.html)
- Kanka's 2022 changes to the free tier caused community debate — [Kanka blog, Jul 2022](https://blog.kanka.io/2022/07/16/thoughts-on-the-discussions-surrounding-changes-to-the-free-tier)
- [Training knowledge, unverified 2026] Kanka has entity types for characters/NPCs, locations, organisations, journals (session notes), quests, calendars, and timelines, plus per-role permissions so players see only revealed entries. Translation is community-run (Weblate). It is web-only.

**Obsidian + TTRPG plugins (local-first notes)**
- Javalent's Initiative Tracker plugin calculates XP and supports custom and SRD creatures from the Fantasy Statblocks plugin — [Obsidian community: Initiative Tracker](https://community.obsidian.md/plugins/initiative-tracker). Fantasy Statblocks "create, manage and view a Fantasy Bestiary in Obsidian" — [npm fantasy-statblocks](https://www.npmjs.com/package/fantasy-statblocks)
- "Compendio SRD" imports the SRD 5.2.1 (2024 rules) as linked notes with 2024 stat blocks. It can send encounters to Initiative Tracker and supplies a 2024 stat-block layout for Fantasy Statblocks in each language folder (multilingual) — [Compendio SRD plugin](https://community.obsidian.md/plugins/compendio-srd)
- "Initiative Tracker Plus" is an independently maintained fork (msweat254) — [Initiative Tracker Plus](https://community.obsidian.md/plugins/initiative-tracker-plus). This suggests the original's maintenance has slowed (inference).
- A TTRPG plugin roundup was dated 2026-08-11 — [obsidianstats TTRPG plugins](https://www.obsidianstats.com/posts/2026-08-11-ttrpg-plugins)
- [Training knowledge, unverified 2026] Obsidian itself is free for personal use. Sync costs about $4–5/month and Publish about $8–10/month. Desktop and mobile apps work fully offline because files are local Markdown. The Initiative Tracker plugin supports conditions and has a "player view" leaf, but has no real-time multi-device sharing without extra plugins. There is no Indonesian D&D content. Notion templates (free or paid on Gumroad/Etsy) are popular for campaign notes, but they have no combat automation.

**5e.tools (reference + DM screen, initiative tracker, encounter builder)**
- In 2017 WotC's counsel filed a DMCA notice to remove a GitHub repository hosting 5etools — [GitHub DMCA 2017-12-04 (mirror)](https://source-hub.etos-pro.ru/github/dmca/src/branch/update-1620770506/2017/2017-12-04-WizardsoftheCoast.md)
- In August 2024 a DMCA notice (2024-08-07) targeted 5etools-mirror-1.github.io and 5etools-mirror-2.github.io, citing verbatim core rulebook, supplement, and setting content — [GitHub DMCA commit (mirror)](https://git.randommeaninglesscharacters.com/github/dmca/commit/97be5b13fae70b0d94cc13f29826dcc1e4f35057.diff); [Tildes discussion](https://tildes.net/~games.tabletop/1i39/5etools_repository_taken_down_after_dmca_request_by_wizards_of_the_coast)
- Development continues under "5etools-mirror-3/5etools-src" (for example v2.20.0 and v2.25.0 releases) — [newreleases v2.25.0](https://newreleases.io/project/github/5etools-mirror-3/5etools-src/release/v2.25.0)
- Mirrors and a "Plutonium Mirror" browser extension exist for when the main site is down — [Firefox add-on](https://addons.mozilla.org/firefox/addon/plutonium-mirror); [EN World mirror thread (undated)](https://www.enworld.org/threads/5e-tools-mirror-request.682411/)
- Legal status: 5e.tools hosts non-SRD WotC text without a licence. It has a repeated DMCA history and is not a safe model for a legitimate product. Only SRD 5.1/5.2 content under CC-BY-4.0 is safe to reuse (inference from the DMCA notices; the CC-BY status of SRD 5.2 is [training knowledge]).
- [Training knowledge, unverified 2026] 5e.tools has had 2024 (XPHB/XDMG/XMM) data since late 2024 and works offline as a PWA. Its DM screen, initiative tracker (with conditions), and encounter builder are free.

**Kobold Fight Club (encounter builder)**
- Community threads treat KFC's adjusted-XP math as the reference. It added mixed party levels and random encounter generation over time — [EN World](https://www.enworld.org/goto/post?id=7486486); [GiantITP](https://forums.giantitp.com/archive/index.php/t-600637.html)
- Kobold Press runs its own "Kobold Press Encounter Builder", described as "the encounter generation strategy you know and love from Kobold+ Fight Club" — [Kobold Press Encounter Builder](https://koboldpress.com/kobold-press-encounter-builder)
- **Observed on 2026-11-04:** `https://kobold.club` now returns a 301 redirect to `thenicestplace.net`, an unrelated landing page with no KFC content — [kobold.club (fetched)](https://kobold.club) → [thenicestplace.net](https://thenicestplace.net/). This strongly suggests the original domain lapsed or was repurposed. Users now rely on forks or alternatives (inference; I could not verify where the canonical KFC now lives).
- I found no evidence that KFC supports the 2024 DMG XP-budget method (Low/Moderate/High) — [search found nothing](https://www.dungeonsolvers.com/?p=4310)
- [Training knowledge, unverified 2026] KFC is open source (Asmor's "5e-monsters" repo on GitHub), free, has no account, and stores encounters in localStorage. It is built on 2014 DMG multipliers.

**Improved Initiative (combat tracker)**
- Open source under MIT, "Combat tracker for D&D 5th Edition". The repo had 5,691 commits, 348 stars, 116 forks, and 73 open issues as of the 2026 fetch. The code has an "epicinitiative" account level (the paid tier) — [GitHub: cynicaloptimist/improved-initiative](https://github.com/cynicaloptimist/improved-initiative)
- [Training knowledge, unverified 2026] It is free in the browser with SRD creatures, conditions tags, and a player view URL that updates in real time. Epic Initiative (Patreon, about $1–$3/month) adds account sync and extra storage. Its UI is desktop-oriented.

**Shieldmaiden (combat tracker + campaign manager)**
- Core features are free. A Patreon subscription adds storage and quality-of-life features, including uploading and cropping avatars. Free users must link to an online image — [Shieldmaiden pricing](https://shieldmaiden.app/pricing); [shieldmaiden.app](https://shieldmaiden.app)
- It has an "advanced" initiative tracker, a live initiative list shared with players that updates while the DM runs the encounter, and "Character Sync" with D&D Beyond and DiceCloud — [shieldmaiden.app](https://shieldmaiden.app); [Shieldmaiden pricing](https://shieldmaiden.app/pricing)
- [Training knowledge, unverified 2026] It tracks conditions, concentration, reminders (timed effects), legendary actions, and damage/healing logs. It has campaigns with players, a separate player screen for TVs or second monitors, and a weather/background effects overlay. It is web-based and works on tablets. English only. Tier prices were not on the fetched page.

**Avrae (Discord bot, owned by D&D Beyond)**
- Its dice roller supports adv/dis, crits, keep/drop, reroll, exploding, and bounded dice. It imports character sheets from D&D Beyond, DiceCloud, or Google Sheets and generates attack, check, save, and cast macros. Its initiative tracker sorts combatants and tracks HP, AC, resistances, and status effects, integrated with 5e content — [avrae.io](https://avrae.io)
- Owned and maintained by D&D Beyond (forum statement) — [D&D Beyond forum](https://www.dndbeyond.com/forums/d-d-beyond-feedback/118972-expertise-and-asi/previous). Help is via `!help init` and the Avrae Development Discord — [Avrae Development Discord](https://discord.com/servers/avrae-development-269275778867396608)
- I could not confirm 2024 rules support or the current server count (top.gg returned 403) — [top.gg listing](https://top.gg/bot/261302296103747584)
- [Training knowledge, unverified 2026] Avrae is free. Content access mirrors the user's D&D Beyond purchases (linked account). Effects/concentration are handled through `!i effect` and automation for SRD spells. Its "Aliasing" community scripts (workshop) are a big part of its stickiness. English only.

**dddice (3D dice platform)**
- 3D browser dice need no account to roll. It has a marketplace of 617+ dice sets (examples $5.99–$7.99), a public API, and a JS SDK. Integrations: Roll20, D&D Beyond, Foundry VTT, Owlbear Rodeo, TaleSpire, Above VTT, Pathbuilder 2e, Discord, Twitch, OBS, Streamlabs, and Stream Deck, plus Chrome/Firefox/Edge extensions — [dddice.com](https://dddice.com)
- Paid "Upgrade" features exist, but tiers were not listed on the homepage — [dddice.com](https://dddice.com)

**Friends & Fables (AI GM "Franz")**
- Pricing (official page, fetched): Free $0 (up to 25 turns/day, 3 player campaigns). Starter $19.95 (unlimited standard turns, 100 bonus credits, TTS). Pro $29.95 (300 credits). Legend $39.95 (600 credits). Yearly billing gives "2 months free" — [fables.gg/pricing](https://fables.gg/pricing)
- All tiers get long-term memory, unlimited campaign slots, and public worlds, and friends play free in a subscriber's campaign — [fables.gg/pricing](https://fables.gg/pricing)
- The company's own comparison pages (late 2025) give the free tier as 5–25 AI turns/day — [F&F vs Old Greg's Tavern](https://fables.gg/blog/old-gregs-tavern-vs-friends--fables-plan--feature-comparison)
- A one-time 1:1 credit transfer was open until Aug 31, 2026, for accounts created before Aug 1, 2026. This indicates a 2026 change to the billing/credit system — [F&F changelog](https://feedback.fables.gg/changelog)
- Patch notes mention model swaps (for example "MiMo, GLM-4.7, GPT Image 1.5") — [F&F patch notes](https://fables.gg/patch-notes/patch-notes-2552-mimo-glm-47-gpt-image-15-and)
- Competitors named in comparisons: Old Greg's Tavern, AI Game Master, FableAI, Everweave, AI Realm, and Mythmaker — [F&F blog](https://fables.gg/blog/best-ai-dungeon-alternatives); [Mythmaker vs F&F (reviewed Jun 2026)](https://mythmakerpg-marketing.pages.dev/compare/friends-and-fables/)
- The pricing page did not say which rules version (2014/2024) is used or which languages are supported — [fables.gg/pricing](https://fables.gg/pricing)

### Inferences
- The common pricing pattern is: the owner (DM) pays, and players join free (LegendKeeper, World Anvil co-authors, F&F friends, Kanka boosters). A free Indonesian app removes the payment barrier entirely, which is a real differentiator in a price-sensitive market.
- The only clear local-first or offline options are Obsidian, LegendKeeper (local save + sync), and 5e.tools/KFC (static or localStorage). Everything else needs a connection.
- KFC's apparent domain loss and the 5e.tools DMCA history show that the "free tool" niche is fragile. A legally clean (SRD 5.2 CC-BY) and maintained encounter builder is an open gap.

### Gaps
- Official 2026 prices for World Anvil, Shieldmaiden Patreon tiers, Improved Initiative's Epic tier, and dddice's paid tier could not be fetched.
- Avrae's server count, and whether it supports the 2024 rules, are unverified (top.gg blocked).
- Whether 5e.tools' main domain is currently up was not verified.
- Where Kobold Fight Club is hosted now (fork/new domain) was not found.
- None of the tools showed evidence of an Indonesian UI. Kanka and Obsidian support community translations, but I did not confirm an Indonesian locale.

---

## Q1. What do DMs value most in campaign tools and combat trackers?

### Takeaway
DMs value speed at the table and less prep (fast initiative entry, HP/conditions at a glance). Next comes a player-facing view, then campaign memory (NPCs, session notes, revealed vs secret info). Pricing models that let players join free also matter.

### Cited Findings
- Shieldmaiden markets itself around tracking "what you need during combat" and a live, shared initiative list for players — [shieldmaiden.app](https://shieldmaiden.app)
- Avrae's tracker leads with auto-sorting and HP/AC/resistance/status-effect tracking tied to character sheets — [avrae.io](https://avrae.io)
- KFC is valued because it updates XP totals live as party size and levels change, and expresses XP "per player" — [D&D Beyond forum](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/dungeon-masters-only/34096-adjusted-xp)
- LegendKeeper competes on offline editing, unlimited collaborators, and free guest access — [LegendKeeper FAQ](https://legendkeeper.com/faq); [Pricing](https://www.legendkeeper.com/pricing)
- World Anvil and Kanka both gate storage and premium features behind payment, and Kanka's free-tier changes drew backlash. This shows DMs are sensitive to losing free capacity — [Kanka blog 2022](https://blog.kanka.io/2022/07/16/thoughts-on-the-discussions-surrounding-changes-to-the-free-tier)

### Inferences
- For dnd-sistem, the most visible missing combat feature compared with Shieldmaiden, Improved Initiative, Avrae, and 5e.tools is condition and concentration tracking, including effect durations in rounds. Every major tracker has it in some form ([training knowledge] for Improved Initiative and 5e.tools; Avrae "status effects" cited).
- A player-facing live initiative view (read-only link via invite code) would match Shieldmaiden's main selling point.

### Gaps
- I found no recent quantitative survey of DM feature priorities. The evidence comes from feature pages and forum posts.

---

## Q2. Which free tools dominate and what makes them sticky?

### Takeaway
Kobold Fight Club (encounter math), Improved Initiative (open-source tracker), and Shieldmaiden (tracker + player view + campaigns) are the classic free trio. They are sticky because they need no signup and are free forever, they are fast, they include SRD monsters, and (for Shieldmaiden and Improved Initiative) they offer a shareable player view.

### Cited Findings
- Improved Initiative is MIT-licensed with about 5.7k commits and still active in 2026, and has an optional paid account level — [GitHub](https://github.com/cynicaloptimist/improved-initiative)
- Shieldmaiden's free tier "is sufficient for most users". Its paid tier mostly adds storage and convenience — [Shieldmaiden pricing](https://shieldmaiden.app/pricing)
- KFC's math is cited as definitive in community threads, and Kobold Press built an official successor that borrows its approach — [GiantITP](https://forums.giantitp.com/archive/index.php/t-600637.html); [Kobold Press builder](https://koboldpress.com/kobold-press-encounter-builder)
- The kobold.club domain redirects to an unrelated site as of 2026-11-04 — [thenicestplace.net](https://thenicestplace.net/)
- In Obsidian, the free Initiative Tracker and Fantasy Statblocks plugins plus the Compendio SRD 2024 import form a free, offline, 2024-capable stack — [Compendio SRD](https://community.obsidian.md/plugins/compendio-srd)

### Inferences
- These tools are sticky because of zero friction (no account) and a monster database, not deep campaign features. KFC's apparent disappearance leaves room for a mobile-friendly encounter builder using 2024 XP budgets. This is a natural add-on to dnd-sistem's DM tools page.

### Gaps
- No traffic numbers for KFC, Improved Initiative, or Shieldmaiden were found (Similarweb data was not fetched).

---

## Q3. Discord-first workflows (Avrae, dddice, dice bots), especially in Indonesia

### Takeaway
Online play in Indonesia centres on Discord (D&D Indonesia has about 7.8k members, and DnD Jakarta is also active). There, Avrae acts as the shared dice, character-sheet, and initiative layer, and dddice adds 3D dice across VTTs and Discord.

### Cited Findings
- The D&D Indonesia Discord was created in 2017 and has about 7,800 members with 2,000+ online when fetched. It hosts, plays, and spectates games and has LFG channels — [Discord Bot List: D&D Indonesia](https://discordbotlist.com/servers/dungeons-dragons-indonesia-360721640558166016); [Discord server page](https://discord.com/servers/dandd-indonesia-360721640558166016)
- Indonesian D&D communities moved online during COVID. The largest are the D&D Indonesia and DnD Jakarta Discord servers — [Jakarta Post, Feb 2022](https://www.thejakartapost.com/culture/2022/02/18/indonesian-dungeons-dragons-communities-grow-online.html)
- Regional groups include D&D Yogyakarta — [Afraid of Encounters blog](https://afraidofencounters.bearblog.dev/afraid-of-communities-indonesian-tabletop-rpg-scene-lfg/)
- Avrae runs dice, D&D Beyond/DiceCloud/Google Sheets character import, and initiative directly in text channels — [avrae.io](https://avrae.io)
- dddice integrates with Discord, Owlbear Rodeo, Foundry, Roll20, and D&D Beyond, so one dice set rolls everywhere — [dddice.com](https://dddice.com)
- [Training knowledge, unverified 2026] Dice Maiden is a free, dice-only Discord bot with complex syntax that is popular for systems beyond D&D. Other bots include Sidekick and RPG Sage.

### Inferences
- A mobile-first web app like dnd-sistem complements Discord rather than competing with it. Discord-related features that would fit include a Discord webhook to post dice rolls, initiative turns, or session summaries to a channel, and invite-code links shared in Discord.
- Avrae is English-only and tied to D&D Beyond, which Indonesian players may not buy (price in USD). This leaves room for a Bahasa Indonesia tool built on SRD content.

### Gaps
- I found no data on which bots Indonesian servers actually use. Member counts are from a single snapshot of a listing page.

---

## Q4. AI features in 2025–2026 and user reactions

### Takeaway
AI tools for D&D now include full AI game masters (Friends & Fables, Mythmaker, Everweave, AI Realm, Old Greg's Tavern, FableAI) and prep assistants. Friends & Fables has settled on a $0–$39.95/month model with credits. Community reaction is polarised. Many people accept AI for prep or encounter help, while there is strong hostility to generated art and rules text and to undisclosed use.

### Cited Findings
- F&F has a free tier (25 turns/day) and $19.95/$29.95/$39.95 tiers with unlimited standard turns and credits. Friends play free — [fables.gg/pricing](https://fables.gg/pricing)
- F&F changed its credits system in 2026 (one-time credit transfer before Aug 31, 2026) — [F&F changelog](https://feedback.fables.gg/changelog)
- F&F frequently swaps models (for example GLM-4.7 and GPT Image 1.5 in patch notes) — [patch notes](https://fables.gg/patch-notes/patch-notes-2552-mimo-glm-47-gpt-image-15-and)
- A competitive field of AI GM products exists, and many publish side-by-side comparison pages — [F&F alternatives blog](https://fables.gg/blog/best-ai-dungeon-alternatives); [Mythmaker comparison, Jun 2026](https://mythmakerpg-marketing.pages.dev/compare/friends-and-fables/); [Weekend.com 2026 list](https://www.weekend.com/post/ai-dungeon-master)
- Community split: some say AI prep is fine "so long as the players are having fun". One D&D Beyond poster favours AI for encounter building or map generation but not rules text or art. Critics compare it to theft or object to undisclosed use — [D&D Beyond forum thread "How do you feel about AI assistance in DMing"](https://www.dndbeyond.com/forums/d-d-beyond-general/general-discussion/239925-how-do-you-feel-about-ai-assistance-in-dming?comment=8)
- A developer of an AI assistant-DM tool reported hostile reactions when promoting it on Reddit (anecdotal, via a Reddit snapshot mirror, 2026) — [Reddit snapshot](https://reddit.sentinel-team.org/posts/1s1pc85/snapshots/2026-03-23T19%3A10%3A34.820906Z)

### Inferences
- If dnd-sistem adds AI, the least controversial uses are optional, DM-only prep helpers: NPC name and personality generation, session-recap summaries from notes, and encounter suggestions. They should be clearly labelled, with no generated art. Running a full AI GM is a crowded, paid niche with high model costs, and doesn't fit a free app.
- None of the AI GMs surveyed showed evidence of Indonesian-language play. LLMs can handle Bahasa Indonesia, but no product markets it (unverified).

### Gaps
- No hard adoption or user numbers were found for F&F or its competitors.
- Reddit sentiment comes from anecdotal mirror snapshots. There was no systematic survey.
- I found no evidence of AI features added to World Anvil, LegendKeeper, Kanka, Shieldmaiden, or Avrae in 2025–2026 (not searched in depth).
