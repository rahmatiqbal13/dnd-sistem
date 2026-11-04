# dnd-sistem can own Indonesia's phone-first table

As of November 2026, no major D&D 5e tool offers an Indonesian interface, a free phone-native companion built for in-person play, and legally clean 2024 content all at once. That gap is real and durable, and dnd-sistem sits in it. Today, though, the app holds the position more in promise than in function. Every incumbent is English-only, and Indonesian is not among Wizards of the Coast's localisation languages even for print, so an official Indonesian D&D Beyond is very unlikely soon ([D&D Beyond](https://www.dndbeyond.com/posts/1669-change-to-supported-languages-in-d-d-product)). D&D Beyond's 2026 rebuild is pouring its DM tooling into the desktop Maps VTT, and its new mobile app is not due until an early version in 2027 ([VICE](https://www.vice.com/en/article/dungeons-and-dragons-every-new-tool-announced-for-dd-beyond/)). Indonesia itself is mobile-first and card-poor: 230M internet users, and about 2% of adults held a credit card in 2021 ([DataReportal](https://datareportal.com/reports/digital-2026-indonesia); [Statista](https://statista.com/statistics/941999/indonesia-share-credit-card-holders)). The code tells a harder story. dnd-sistem is a local-first single-device app. Only campaign create and join reach Supabase. Characters, notes, NPCs, sessions and dice never sync. Combat state is lost on reload. The Party and DM Tools pages have no way to link a character to a campaign, so they are always empty. There is no PWA or export. Against the field, the app is ahead on language, price, theming and 2024 level-up logic, roughly at parity with free single-device sheets, and behind every serious competitor on multiplayer, combat automation and offline reliability. The good news for a solo developer is that the highest-value fixes are cheap. The server schema and its row-level security already exist and are tested, so most of the gap is wiring, not new architecture.

## D&D Beyond is rebuilding for desktop and English speakers, not for Indonesian phones

D&D Beyond (DDB) is the default 5e tool. A July 2026 Hasbro call claimed 30 million registered accounts and that "3 out of 4" D&D players use it, though commenters pointed out that registered accounts are not active users ([EN World](https://www.enworld.org/posts/9954744/)). **Pricing:** the free tier gives 6 character slots, campaign invites, homebrew, and the right to run Maps games with owned content. Hero costs about US$2.99/month (US$2.17/month billed annually) and adds unlimited characters, Drops and community homebrew. Master costs about US$5.99/month (US$4.58/month annually) and adds content sharing with up to 12 people across 5 campaigns, plus 10 GB of Maps uploads ([D&D Beyond Subscribe](https://www.dndbeyond.com/en/subscribe)). Books are sold separately. In the UK App Store the 2024 Player's Handbook is £29.99 in-app, and a reviewer noted that web prices were lower than in-app prices ([App Store GB](https://apps.apple.com/gb/app/d-d-beyond/id1501810129)). Drops, a subscriber content library, launched on 7 May 2026 with 500+ items and no tier price change ([D&D Beyond](https://www.dndbeyond.com/posts/2156-introducing-d-d-beyond-drops-a-growing-content)). Critics argue Drops make every player pay at least $25.99/year to reach certain spells and feats ([EN World](https://www.enworld.org/threads/d-d-beyond-drops-are-antithetical-to-d-d-beyonds-traditional-subscription-model.719049/page-26)).

**2024 rules:** DDB fully supports the 2024 rules, with free 2024 Free Rules (16 feats, 48 monsters, 333 spells) next to the 2014 Basic Rules. 2014 content carries a "Legacy" badge ([D&D Beyond](https://www.dndbeyond.com/posts/1804-start-playing-today-with-the-2024-d-d-free-rules)). The mix is DDB's most visible quality failure. In August 2024 it planned to auto-update 2014 sheets and reversed after backlash ([Escapist](https://escapistmagazine.com/dd-beyond-pledges-to-retain-2014-character-sheets-after-backlash)). Bug threads since then report 2014 sheets showing 2024 mechanics, and one thread is titled "Character Builder Follows Neither 2014 nor 2024" ([DDB forum](https://www.dndbeyond.com/forums/d-d-beyond-general/d-d-beyond-feedback/204888-character-builder-follows-neither-2014-nor-2024)).

**The 2026 rebuild, shipped versus promised.** On 19 February 2026 WotC announced a ground-up rebuild of the game platform as a data-driven rules engine, a modernised character builder, and new DM tools ([D&D Beyond roadmap](https://www.dndbeyond.com/posts/2132-d-d-beyonds-2026-development-roadmap)). Several pieces have **shipped**:

- **Quickbuilder** (24 March), a level-1-only guided flow. It later gained account-free use, routing to a game or sheet, and premade filters ([Changelog](https://www.dndbeyond.com/changelog)).
- **Journals** inside Maps (27 May), with shared Player Journals in July ([D&D Beyond](https://www.dndbeyond.com/posts/2175-never-lose-the-story-again-introducing-journals-on)).
- **Scene Prep** (31 August).
- **A Theater of the Mind Organizer** (8 September). It is still a surface hosted in Maps.
- **Combat Tracker improvements**, including DM editing of character HP (30 October) ([Changelog](https://www.dndbeyond.com/changelog)).

**The full new-engine Character Builder has not shipped** as of the 30 October changelog. The all-new mobile app is only a teaser, with an early version planned for early 2027 ([VICE](https://www.vice.com/en/article/dungeons-and-dragons-every-new-tool-announced-for-dd-beyond/)).

**Maps and Sigil.** Maps, the 2D browser VTT, has been free to host with owned content since 16 September 2025. Uploads and custom assets stay paid ([Wargamer](https://www.wargamer.com/dnd/free-maps-vtt)). The 3D VTT Sigil was wound down after about 90% of its team was laid off in March 2025. Its servers were scheduled to shut down at the end of October 2026 ([D&D Beyond](https://www.dndbeyond.com/posts/2086-closing-the-chapter-on-sigil-and-thanking-the)). No post-shutdown confirmation was found.

**Offline and sync:** the current app is English-only and rated 4.7★ from about 8.7k UK ratings. It offers an "online or offline" sheet and offline books ([App Store GB](https://apps.apple.com/gb/app/d-d-beyond/id1501810129)). Undated forum posts say rests and hit dice are unavailable offline, and staff called offline rests "on the roadmap... not the immediate one" ([DDB forum](https://www.dndbeyond.com/forums/d-d-beyond-mobile-app-feedback/193640-d-d-beyond-app-on-ios/next)). Multiplayer is DDB's real moat. A DM sees player sheets, a real-time Game Log carries dice, shared dice reached Maps and sheets in February 2026, and Avrae mirrors sheet rolls into Discord once a campaign is linked ([Avrae docs](https://avrae.readthedocs.io/en/latest/ddb.html)). Game Log reliability needed a 2026 refactor ([Changelog](https://www.dndbeyond.com/changelog)).

**Localisation and licensing:** DDB has no Indonesian, and even the French, Italian, German and Spanish 2024 books are not sold on its marketplace ([DDB Support](https://dndbeyond-support.wizards.com/hc/en-us/articles/46247021698452-Will-the-2024-Core-Rulebooks-be-available-in-other-supported-languages)). WotC owns the IP. At the same time, it has released SRD 5.2/5.2.1, the 2024 core, under CC-BY-4.0, which WotC says it cannot revoke ([D&D Beyond SRD](https://dndbeyond.com/srd)). That licence is the legal foundation for everything dnd-sistem can ship.

**What this means for dnd-sistem:** DDB's 2026 energy goes into a desktop VTT and a builder that keeps slipping. The in-person, phone-at-the-table use case stays underserved until at least early 2027, and Indonesian will stay underserved for good. Users already complain that the DDB phone app is "very time consuming" to navigate ([search summary of r/dndnext](https://redlib.nohost.network/r/dndnext/comments/1f9doc5/irl_replacement_for_dnd_beyond_character_sheets/llmqt7g)), and that money and trust are the main sources of friction ([Reddit snapshot](https://reddit.sentinel-team.org/posts/1r8jvv3/snapshots/2026-02-23T09%3A34%3A42.266568Z)). The window is open, and it closes when the 2027 app arrives.

## Virtual tabletops solve online map play, a job dnd-sistem should not take on

The VTT market has split into three pricing models, and official D&D books cost about $30 each on top of all of them:

- **Free software, paid content:** Fantasy Grounds, Owlbear Rodeo, Quest Portal.
- **A one-time GM licence:** Foundry.
- **Subscriptions:** Roll20, Alchemy, Shard.

**Roll20** lets players join free. Plus rose from $4.99 to $5.99/month ($59.99/year) ([Roll20](https://bloghub.roll20.net/posts/roll20-pricing-increase-announcement)), and Pro is $10.99/month or $109.99/year according to a Help Center snippet ([Roll20 Help](https://help.roll20.net/hc/articles/360037774633)). Plus adds Dynamic Lighting and Pro adds Mod scripting ([Roll20 wiki](https://wiki.roll20.net/PLUS)). Roll20 is an official partner. Buying the 2024 PHB unlocks a builder that supports both 2014 and 2024 content, and both sheets can run in one game ([Roll20](https://pages.roll20.net/dnd2024)). Its native mobile app was delisted. Since March 2026 the full D&D sheet and builder work in a phone browser via Roll20 Characters, but phones cannot see maps or move tokens ([Roll20 blog](https://blog.roll20.net/posts/dd-sheet-now-on-phones); [Roll20 Help](https://help.roll20.net/hc/en-us/articles/4411213438231-Using-Roll20-on-Mobile-Devices)). No Indonesian locale was found.

**Foundry VTT** costs about $50 once, paid by the GM ([Wikipedia](https://en.wikipedia.org/wiki/Foundry_VTT)). It has been a WotC partner since January 2024 and sells 2024 PHB, DMG and MM modules ([EN World](https://www.enworld.org/posts/9377886/)). A third-party listing puts the PHB module at $29.99 ([FoundryVTT Hub](https://foundryvtt-hub.com/package/dnd-players-handbook)). A Reddit user reports that the dnd5e system 4.0 added a 2014/2024 toggle ([r/FoundryVTT](https://lr.sudovanilla.org/r/FoundryVTT/comments/1fif361/i_dont_want_to_2024_dnd5e)). Foundry v14 was in user testing in spring 2026 ([Foundry](https://foundryvtt.com/releases/14.358)). It is self-hosted, so the GM's machine runs it locally, but players still need a network connection. Community translations exist for Japanese, Italian and Finnish, but no Indonesian package was found ([Foundry JA](https://foundryvtt.com/packages/foundryVTTja)).

**Fantasy Grounds** became free to play on 10 November 2025. Licensed D&D packs remain paid ([GamingOnLinux](https://www.gamingonlinux.com/2025/11/fantasy-grounds-virtual-tabletop-vtt-is-now-free-to-play)). It is a desktop Steam client, and the 2024 status of its D&D packs was not confirmed.

**Owlbear Rodeo** made its Nestling tier free with 100 MB and full plugin access ([Owlbear blog](https://blog.owlbear.rodeo/state-of-the-rodeo-lets-talk-about-subscriptions)). It is browser-based and has no built-in rules engine.

**Alchemy** costs $8/month or $88/year for Unlimited and offers a limited free account. It says it is "not affiliated with Wizards of the Coast" and gets its 5e content from third parties such as Tales of the Valiant ([Alchemy](https://alchemyrpg.com/dungeonsanddragons)). It positions itself for cinematic theater of the mind.

**Shard Tabletop** starts at $19.99/year and calls itself a "virtual tabletop and character sheet" for 5e. That price comes from an undated page, and its 2024 support was not confirmed ([Shard](https://shardtabletop.com/landing-3); [Shard About](https://www.shardtabletop.com/about)).

**Quest Portal**, a web and mobile VTT, is free with SRD content and an optional Pro tier ([StartPlaying](https://startplaying.games/blog/posts/beginners-guide-quest-portal)).

Two VTT facts matter for strategy. First, the community's top-voted advice on online play is that "most VTTs include character sheets," so online groups rarely need a standalone companion ([Reddit snapshot](https://reddit.sentinel-team.org/posts/1r8jvv3/snapshots/2026-02-23T09%3A34%3A42.266568Z)). Second, WotC itself failed to make a 3D VTT pay, laying off the Sigil team because its "distinct monetization path will not be realized" ([PC Gamer](https://pcgamer.com/games/hasbro-pushed-sigil-out-of-the-nest-d-and-ds-latest-layoffs-happened-because-the-distinct-monetization-path-for-its-virtual-tabletop-sigil-never-materialized)). A solo developer should not build maps. dnd-sistem's job is the in-person table and Discord-adjacent play, where a phone replaces the paper sheet and the DM's clipboard. The VTTs' rules automation is also beyond what a companion needs to match. Primary feature pages were not fetched in this research, so automation depth comparisons in the matrix below are marked as unverified.

## Character builders consolidated around Roll20, leaving the free phone-native niche thin

The 2024-rules builder space now centres on Roll20. Roll20 bought Demiplane in June 2024 ([Demiplane blog](https://www.demiplane.com/blog/roll20-acquires-demiplane)). Demiplane's D&D NEXUS, launched November 2025, is a reader and compendium only. Staff confirmed: "We do not currently have a D&D character sheet or builder available within the D&D Nexus." Purchases unlock on both platforms ([Demiplane forums](https://forums.demiplane.com/t/announcing-d-d-nexus-part-of-the-connected-d-d-experience-on-roll20/5629)).

**Dicecloud** is free, GPL-3.0, Patreon-funded, real-time and cloud-hosted on MongoDB, with optional self-hosting. Its strength is propagation: moving armour updates AC, saves and HP automatically. Its README does not mention 2024 rules ([GitHub](https://github.com/ThaumRystra/DiceCloud)), and users call it "overly complicated but good once learned" ([Reddit snapshot](https://reddit.sentinel-team.org/posts/1r8jvv3/snapshots/2026-02-23T09%3A34%3A42.266568Z)).

**Hero's Diary**, which went public in autumn 2025, is dnd-sistem's closest architectural twin. It is 100% free, needs no account, stores data in the browser, and ships 2014 and 2024 SRD items and spells. It adds a modifier engine and per-rest recovery rules for features. It is built for tablets and laptops, not phones, and has no cloud sync ([EN World](https://www.enworld.org/posts/9755387/)).

**Fight Club 5e** (Lion's Den) is the download leader among standalone apps, with 424K+ Play installs at 4.31★. It is free with in-app purchases. Its last Play update was August 2025 ([AppGoblin](https://appgoblin.info/apps/com.lionsden.fc5)). It ships an SRD 5.1 compendium and imports community XML, which is how users get 2024 content ([FightClub5eXML](https://github.colasdn.workers.dev/lokulin/FightClub5eXML)). Game Master 5e, its DM sibling, could not be verified for 2026.

**Aurora** survives on fan-maintained XML "elements" not affiliated with WotC ([GitHub](https://github.com/Azzzzzy/elements)). **Dungeon Master's Vault** is 2014 SRD only ([StartPlaying](https://startplaying.games/blog/posts/every-character-maker-dnd)). Small iOS apps such as **Actos** and **DnD 5e Character Keep** advertise 2014 and 2024 support ([App Store](https://apps.apple.com/us/app/-/id6745488621); [App Store](https://apps.apple.com/us/app/-/id1527271197)). No evidence was found that Tetra Cube exists. Fast Character appears only on low-reliability pages.

Outside 5e, **Pathbuilder 2e** is the design reference. It works as a planner and a play sheet, exports PDF, and is free with ads plus a reported ~$5 one-time unlock. It rates about 4.9 on iOS ([App Store](https://apps.apple.com/us/app/pathbuilder-2e/id6740821064)).

The licensing models across this group fall into three types:

- **An official licence with paid unlocks:** DDB, Roll20.
- **SRD plus bring-your-own-content import:** Fight Club, Aurora, Dicecloud libraries.
- **SRD only:** Hero's Diary, DM's Vault.

The features users praise most are the same across tools: a modifier engine, resources with short- or long-rest recovery, conditions as toggleable modifiers that revert cleanly, and one-tap rolling from the sheet. Roll20's 2024 sheet, for example, has conditions such as Incapacitated change carrying capacity and revert on removal ([Roll20 blog](https://blog.roll20.net/posts/dd-sheet-now-on-phones)). A free Google Sheets template with separate 2014 and 2024 versions was celebrated for its automated bonuses and its condition and exhaustion trackers ([Reddit snapshot](https://reddit.sentinel-team.org/posts/1r8jvv3/snapshots/2026-02-23T09%3A34%3A42.266568Z)). The bar for a "good free sheet" is automation plus trackers, not content breadth.

dnd-sistem fits this landscape in a specific place. Its level-up dialog is genuinely strong:

- HP by average, roll or manual.
- Required subclass choice at the right level, from 56 subclass entries.
- ASI or feat at levels 4, 8, 12, 16 and 19, plus Fighter 6 and 14 and Rogue 10.
- Feats filtered by prerequisites.

([src/components/character/LevelUpDialog.tsx](../src/components/character/LevelUpDialog.tsx); [src/lib/levelUp.ts](../src/lib/levelUp.ts)). The builder auto-computes AC, HP, speed, spell slots and starting gear, and applies the 2024 background +2/+1 ASI ([src/lib/characterRules.ts](../src/lib/characterRules.ts)).

The rest of the sheet falls short of the free-tool bar:

- The builder is a single form, not a guided flow.
- It offers only manual entry or 4d6-drop-lowest, with no point-buy or standard array.
- Its subclass field is free text.
- Its content is a hybrid: 2024 mechanics alongside 2014 species (Half-Elf and Half-Orc, with no Goliath or Orc) and 2014-era backgrounds such as Folk Hero and Outlander ([src/data/dnd2024/races.ts](../src/data/dnd2024/races.ts); [src/data/dnd2024/backgrounds.ts](../src/data/dnd2024/backgrounds.ts)).
- **Death saves and exhaustion exist in the store but have no UI.** Concentration, sheet conditions, temp-HP entry, attacks and any rolling from the sheet are absent ([src/store/characterStore.ts](../src/store/characterStore.ts); [src/pages/CharacterSheetPage.tsx](../src/pages/CharacterSheetPage.tsx)).
- Equipping armour does not recompute AC.

That puts dnd-sistem behind Hero's Diary, Dicecloud and Roll20 on automation, even though it has the better phone layout.

## Free DM utilities are sticky because they are frictionless, and they are fragile and English-only

DM tools split into three groups.

**Paid worldbuilding wikis:**

- **World Anvil:** the free tier allows 2 worlds, 42 articles and 100 MB ([World Anvil FAQ](https://www.worldanvil.com/faq)). Paid Guild prices could not be verified for 2026.
- **LegendKeeper:** a free Basic tier for viewing, exporting and joining other projects. Pro is $9/month or $7.50 billed annually, priced in local currency. Only the owner pays ([LegendKeeper Pricing](https://www.legendkeeper.com/pricing)). Edits save locally and sync on reconnect, a feature still labelled beta ([LegendKeeper FAQ](https://legendkeeper.com/faq)).
- **Kanka:** a generous free tier with unlimited campaigns and 50 MB, and a $4.99/month booster ([Kanka](https://kanka.io/es/v2)). It is localised into Spanish, with no Indonesian found ([Kanka docs](https://docs.kanka.io/fr/latest/overview.html)). Its 2022 free-tier cuts caused community debate ([Kanka blog](https://blog.kanka.io/2022/07/16/thoughts-on-the-discussions-surrounding-changes-to-the-free-tier)).
- **Obsidian:** offers the most capable free offline stack. The "Compendio SRD" plugin imports SRD 5.2.1 with 2024 stat blocks in multiple languages and sends encounters to Javalent's Initiative Tracker, which calculates XP ([Compendio SRD](https://community.obsidian.md/plugins/compendio-srd); [Initiative Tracker](https://community.obsidian.md/plugins/initiative-tracker)). Notion templates are popular for notes but carry no combat logic. No sourced pricing was retrieved for Obsidian or Notion.

**Free browser combat tools:**

- **Shieldmaiden:** free core with Patreon extras for storage and convenience. Its selling point is a live initiative list shared with players during the encounter, plus Character Sync with DDB and DiceCloud ([Shieldmaiden](https://shieldmaiden.app); [Shieldmaiden pricing](https://shieldmaiden.app/pricing)).
- **Improved Initiative:** MIT-licensed and still active, with 5,691 commits, 348 stars and an "epicinitiative" paid account level in its code ([GitHub](https://github.com/cynicaloptimist/improved-initiative)).
- **Kobold Fight Club:** its adjusted-XP math has been the community reference ([GiantITP](https://forums.giantitp.com/archive/index.php/t-600637.html)). On 4 November 2026, `kobold.club` 301-redirected to an unrelated site ([kobold.club](https://kobold.club)), and no 2024 DMG XP-budget support was found. Kobold Press runs its own builder in the same style ([Kobold Press](https://koboldpress.com/kobold-press-encounter-builder)).
- **5e.tools:** free and feature-rich, but it hosts non-SRD WotC text without a licence. GitHub took down mirrors in a DMCA notice dated 7 August 2024 ([GitHub DMCA mirror](https://git.randommeaninglesscharacters.com/github/dmca/commit/97be5b13fae70b0d94cc13f29826dcc1e4f35057.diff)). Development continues under another repository name ([newreleases](https://newreleases.io/project/github/5etools-mirror-3/5etools-src/release/v2.25.0)). It is a warning, not a model.

**Discord-native tools:**

- **Avrae:** owned by D&D Beyond. It handles rich dice syntax, imports sheets from DDB, DiceCloud or Google Sheets, and runs an initiative tracker with HP, AC, resistances and status effects ([avrae.io](https://avrae.io)). Its 2024 support was unverified.
- **dddice:** 3D dice that need no account, 617+ paid dice sets at $5.99–$7.99, a public API, and integrations with Roll20, DDB, Foundry, Owlbear and Discord ([dddice](https://dddice.com)).

**AI Game Masters** form a crowded paid niche. Friends & Fables offers a free tier of 25 turns/day and paid tiers at $19.95, $29.95 and $39.95 ([fables.gg](https://fables.gg/pricing)). It competes with Mythmaker, Everweave, AI Realm and others ([F&F blog](https://fables.gg/blog/best-ai-dungeon-alternatives)). Sentiment is hostile. In a late-2025 Quantic Foundry survey of video gamers, 85% were below neutral on generative AI in games ([GamesMarket](https://www.gamesmarket.global/quantic-foundry-most-gamers-are-negative-about-the-use-of-gen-ai-in-video-games)). WotC publicly denied rumours of "AI DMs" ([GamesRadar](https://gamesradar.com/dandd-calls-rumors-of-dollar30-subs-ai-dms-and-ignored-feedback-false)). In one DDB thread, posters tolerated AI help for encounter prep but not for rules text or art ([DDB forum](https://www.dndbeyond.com/forums/d-d-beyond-general/general-discussion/239925-how-do-you-feel-about-ai-assistance-in-dming?comment=8)).

The lesson for dnd-sistem is that the free trio of KFC, Improved Initiative and Shieldmaiden stays sticky through zero signup, speed, an SRD monster database and a shareable player view, not through deep campaign features. dnd-sistem's combat tracker already matches their basics: manual initiative, round and turn tracking, damage that temp HP absorbs first, healing, 15 conditions and notes ([src/store/combatStore.ts](../src/store/combatStore.ts)). It misses the four things that make them sticky:

- It has **no persistence**, so a page reload mid-fight wipes the encounter.
- It has **no compendium monster import**, even though 334 SRD monsters ship in the bundle.
- It has **no initiative rolling and no concentration**.
- It has **no player view** ([src/pages/CombatPage.tsx](../src/pages/CombatPage.tsx)).

Its campaign layer is thinner than any wiki. NPCs, sessions and notes are local-only, and the DM Tools "Beri XP ke Party" button only shows a toast ([src/pages/DmToolsPage.tsx](../src/pages/DmToolsPage.tsx)).

## Indonesia has players, Discord habits and e-wallets, but no localised tools

The Indonesian scene is small, Jakarta-centred and Discord-first. D&D Indonesia (formed 2017) showed about 7,830 members in an undated listing ([Discord Bot List](https://discordbotlist.com/servers/dungeons-dragons-indonesia-360721640558166016)). DnD Jakarta moved its play to Discord during COVID ([Jakarta Post](https://www.thejakartapost.com/culture/2022/02/18/indonesian-dungeons-dragons-communities-grow-online.html)). Interest came in waves: Critical Role in 2016, COVID, Raditya Dika's videos, and Baldur's Gate 3 from 2023 to 2025. Conventions are tiny but sell out: LFGcon SESSION 1 in January 2026 had 40+ seats and filled within an hour. The insider account identifies two structural problems, **many players and few DMs, and English rulebooks as a barrier for newcomers** ([Afraid of Encounters](https://afraidofencounters.bearblog.dev/afraid-of-communities-indonesian-tabletop-rpg-scene-lfg/)). Known tools in use are Discord, Roll20, D&D Beyond, Facebook groups and YouTube.

Searches found **no Indonesian SRD translation, glossary or 5e tool**, official or fan. By contrast, French, German and Spanish fan or official SRDs exist ([dnddeutsch.de](https://www.dnddeutsch.de/srd); [Foundry ES SRD 2024](https://foundryvtt.com/packages/translate-dnd5e-sdr2-es)). Local creative output leans indie and OSR. Examples include the Indonesian TTRPG Blogwagon's 22 posts of Nusantara-flavoured material ([Blogwagon](https://afraidofencounters.bearblog.dev/indonesian-ttrpg-blogwagon-roundup/)). Indonesian is in Portuguese's position: WotC dropped Portuguese in 2024, citing "rising costs and shifts in global demand" ([ComicBook](https://comicbook.com/gaming/news/dungeons-dragons-discontinues-portuguese-translations)). Fans then filled the gap with extensions such as DnD Beyond Kit ([GitHub](https://github.com/TaylorHo/dnd-beyond-kit)). Absence of evidence is not proof, since Discord-internal glossaries would not be indexed.

Structurally, the market favours dnd-sistem's model:

- **Mobile-first usage:** 331M mobile connections, and median mobile download speed (45 Mbps) now exceeds fixed (39.9 Mbps) ([DataReportal](https://datareportal.com/reports/digital-2026-indonesia)).
- **Little card access:** about 2% of adults held a credit card in 2021.
- **Local payment rails are growing:** QRIS volume rose about 163% year on year ([Tazapay](https://tazapay.com/en-sg/blog/local-payment-methods-in-indonesia-dana)), and at Xendit, QRIS transactions overtook credit cards ([Kontan](https://keuangan.kontan.co.id/news/transaksi-qris-melalui-xendit-tumbuh-142-lampaui-kartu-kredit)).
- **Tipping platforms already exist:** Saweria and Trakteer accept QRIS and e-wallets for about a 5% fee ([teknologi.id](https://teknologi.id/business/trakteer-dan-saweria-platform-crowdfunding-terlaris-untuk-support-content-creator)).

Elsewhere in Southeast Asia, the Philippines and Singapore play mostly in English through Facebook, Meetup and Discord ([The LaSallian](https://thelasallian.com/2020/01/20/exploring-dd-in-the-philippines/); [The Urban Wire](https://theurbanwire.sg/?p=71989)), so language is a weaker wedge there. A Malay variant is a plausible cheap extension, but that is untested.

## The comparison matrix, November 2026

"n/v" means not verified in this research. Prices are in USD unless noted, and the sources are cited in the sections above. Automation and offline claims for several VTTs come only from background knowledge, so those cells are marked n/v rather than asserted.

| Tool | Price | Platforms / phone | 2024 rules | Offline | Sync / multiplayer | DM features | Indonesian | Licensing model |
|---|---|---|---|---|---|---|---|---|
| **dnd-sistem** | Free | Mobile-first web; no PWA | Hybrid: 2024 ASI, feats and level-up; 2014 species and backgrounds; SRD 5.1 compendium | Data local; app shell needs network | Campaign create and join only; all else single-device | Local combat tracker (not persisted), NPC and session log, thin DM Tools | **Yes** (mixed ID/EN UI; English compendium) | SRD 5.1 CC-BY plus hand-written rules data (audit advised) |
| D&D Beyond | Free (6 chars); Hero $2.99/mo; Master $5.99/mo; books ~$30 | Web; iOS/Android app (new app early 2027) | Full 2024 plus Legacy 2014; mixing complaints | App sheet and books; rests reportedly not | Campaigns, Game Log, shared dice, Avrae | Maps VTT, Journals, Scene Prep, combat tracker | No | Rights owner |
| Roll20 + Roll20 Characters | Free; Plus $5.99/mo; Pro $10.99/mo; books ~$29.99 | Browser; phone sheet since Mar 2026; app delisted | 2024 PHB builder; 2014 and 2024 sheets coexist | n/v | Real-time VTT; rolls to chat | Dynamic Lighting (Plus), Mod scripts (Pro) | Not found | Official licence |
| D&D NEXUS (Demiplane) | Free Basic Rules; books shared with Roll20 | Web | 2024 and 2014 reader; no builder | n/v | n/a | None | Not found | Official licence |
| Foundry VTT | ~$50 once (GM); 2024 modules ~$29.99 | Desktop/self-host; players in browser | dnd5e 2014/2024 toggle | Runs locally; players need network | Real-time | Deep automation (n/v), modules | Community packs; no Indonesian | Open system plus official modules |
| Fantasy Grounds | Free since Nov 2025; packs paid | Desktop (Steam) | Licensed packs; 2024 n/v | Local client | Real-time | Heavy automation (n/v) | n/v | Licensed packs |
| Owlbear Rodeo | Free Nestling (100 MB); paid n/v | Browser | No rules engine; extensions | n/v | Real-time | Maps, fog, extensions | n/v | Extensions/DDB link |
| Alchemy RPG | Free limited; $8/mo or $88/yr | Browser | Third-party 5e (ToV) | n/v | Real-time | Theater-of-mind scenes | n/v | Not WotC-affiliated |
| Shard Tabletop | From $19.99/yr | Web VTT plus sheet | n/v | n/v | Real-time | VTT | n/v | n/v |
| Quest Portal | Free; Pro n/v | Web and mobile | SRD (version n/v) | n/v | Real-time | VTT, assistant (Pro) | n/v | SRD |
| Dicecloud | Free (GPL); Patreon | Web; self-host | Not stated | No | Real-time cloud | Share with party | Not found | SRD plus user libraries |
| Hero's Diary | Free, no account | Web (tablet/laptop, no phone UI) | 2014 and 2024 SRD | Browser storage | None | None | Not found | SRD only |
| Fight Club 5e | Free plus IAP | Android/iOS | Via community XML | Yes (local app) | n/v | Game Master 5e sibling (n/v) | Not found | SRD 5.1 plus import |
| Aurora | Free (fan elements) | Desktop (n/v) | Via fan elements | n/v | n/v | None | Not found | Fan XML |
| DM's Vault | Free | Web | 2014 SRD only | n/v | n/v | None | Not found | SRD only |
| World Anvil | Free: 2 worlds, 42 articles; paid n/v | Browser | n/a | n/v | Co-authors | Wiki, campaign manager | Not found | n/a |
| LegendKeeper | Free Basic; Pro $9/mo ($7.50 annual) | Browser | n/a | Local save plus sync (beta) | Free guests | Wiki, atlas, timelines | Not found | n/a |
| Kanka | Free unlimited (50 MB); $4.99/mo booster | Browser | n/a | n/v | Campaign members | Wiki, entities | Spanish yes; Indonesian not found | n/a |
| Obsidian + plugins | Free core (n/v) | Desktop and mobile | Compendio SRD 5.2.1 | Local files | Paid sync (n/v) | Initiative Tracker with XP | Multilingual SRD; Indonesian not found | SRD 5.2.1 |
| 5e.tools | Free | Web | n/v | n/v | n/a | DM screen, tracker (n/v) | Not found | **Unlicensed; DMCA history** |
| Kobold Fight Club | Free | Web | No 2024 budget found | n/v | No | Encounter math | Not found | Domain redirects away (Nov 2026) |
| Improved Initiative | Free (MIT); paid tier | Web | n/v | n/v | Paid account level | Combat tracker | Not found | SRD |
| Shieldmaiden | Free core; Patreon | Web | n/v | n/v | **Live player initiative** | Tracker, campaigns, DDB/DiceCloud sync | Not found | SRD |
| Avrae | Free | Discord | n/v | No | Discord channel | Dice, init, sheet import | No | DDB-owned |
| dddice | Free rolling; dice $5.99–7.99 | Browser, integrations | n/a | No | Cross-VTT dice | Dice only | n/v | n/a |
| Friends & Fables (AI GM) | Free 25 turns/day; $19.95–39.95/mo | Web | Not stated | No | Friends free | Full AI GM | Not stated | n/a |
| Indonesian/SEA tools | — | — | — | — | — | — | **None found** | — |

## Where dnd-sistem stands: ahead on access, level with the free sheets, behind on everything shared

**Ahead.** No competitor offers an Indonesian UI, and none is likely to. The app costs nothing and needs no card, which beats every option except free SRD-only tools, and those are English and desktop-leaning. It has 18 colour themes with a tested WCAG AA contrast check ([src/lib/themes.ts](../src/lib/themes.ts); [src/lib/themes.test.ts](../src/lib/themes.test.ts)), where most competitors offer only light and dark. Its 2024 level-up flow (ASI or feat, prerequisites, subclass gating) is more correct than DDB's 2014/2024 tangle. Its onboarding needs only a nickname, with no account, matching what users recommend in DDB alternatives. Its server security model is unusually rigorous for a hobby project: 8 RLS tables, a rate-limited `join_campaign` RPC with a 10-attempt lockout, and a PGlite test suite ([supabase/migrations/20261102000000_secure_rls.sql](../supabase/migrations/20261102000000_secure_rls.sql); [supabase/tests/rls.test.ts](../supabase/tests/rls.test.ts)). And its phone layout is designed for phones first, which Hero's Diary, Dicecloud and the VTTs are not.

**At parity.** On the single-device sheet basics, dnd-sistem matches the free field: auto-computed AC, HP and speed, a spell-slot tracker that knows full, half, third and pact casters, short and long rests, inventory with weight, a searchable SRD compendium with sub-filters, a basic dice roller with true advantage, and a manual combat tracker with 15 conditions. Hero's Diary, Fight Club 5e and DM's Vault are the honest peers here, and dnd-sistem compares well apart from automation depth.

**Behind.** The gaps fall into six areas.

- **Multiplayer.** DDB, Roll20, Dicecloud and Shieldmaiden all share state between players, while dnd-sistem shares only a campaign's name, description and member list at join time. The DM's later edits never leave the DM's browser, and the DM likely never sees new members ([src/store/campaignStore.ts](../src/store/campaignStore.ts)).
- **Party and DM Tools.** Both pages filter on a character-to-campaign link that no code ever sets ([src/pages/PartyPage.tsx](../src/pages/PartyPage.tsx)).
- **Data durability.** Clearing the browser or switching phones loses everything, and there is no export.
- **Offline.** There is no service worker, so the app cannot load without a network. That is a worse offline story than Fight Club 5e, Obsidian or LegendKeeper.
- **Content and rules.**
  - The compendium is 1,279 English SRD **5.1** entries (2014 wording), with no feats, backgrounds or magic-item categories ([src/data/generated/compendium.json](../src/data/generated/compendium.json)). Obsidian's Compendio SRD already ships 5.2.1.
  - Dice totals are clamped to a minimum of 1, which is wrong for checks and attacks ([src/lib/dice.ts](../src/lib/dice.ts)).
  - XP is missing.
  - Homebrew is a "Segera Hadir" placeholder ([src/pages/HomebrewPage.tsx](../src/pages/HomebrewPage.tsx)).
- **Polish.** A developer System Check page is exposed from the Dashboard. Fourteen `h-7` controls fall below 44px touch targets. The mobile bottom bar has no Dice entry. The README is still the Vite template.

One risk needs a deliberate check rather than an assumption. The DDB SRD page makes clear that non-SRD book content, including most subclasses, remains off-limits ([D&D Beyond SRD](https://dndbeyond.com/srd)). dnd-sistem ships **56 subclasses (4 to 8 per class), 54 feats and backgrounds such as Folk Hero and Outlander** in hand-written data ([src/data/dnd2024/subclasses.ts](../src/data/dnd2024/subclasses.ts); [src/data/dnd2024/feats.ts](../src/data/dnd2024/feats.ts)). That is far more than an SRD can supply, which strongly suggests some of it comes from non-SRD books. If any of it reproduces non-SRD rules text, it creates exactly the exposure that got 5e.tools DMCA'd. Audit each entry against the SRD 5.2.1 document. Keep SRD entries. Cut the rest, or reduce them to user-entered names with no rules text.

## Gaps ranked by user value against solo-developer effort

The table orders gaps by value-to-effort. Effort estimates are rough figures for one developer familiar with the codebase; they are judgments, not measurements. The ranking leans on the demand signals in the sentiment research. Automation plus resource, condition and concentration tracking ranks first. Free and frictionless comes second, then clean 2014/2024 separation, a DM view of player sheets, fast phone reference, offline reliability with an export backup, and a simple tracker ([Reddit snapshot](https://reddit.sentinel-team.org/posts/1r8jvv3/snapshots/2026-02-23T09%3A34%3A42.266568Z); [Reddit snapshot](https://reddit.sentinel-team.org/posts/1sqozaq/snapshots/2026-04-20T19%3A33%3A50.512576Z)).

| Rank | Gap | User value | Effort | Why now |
|---|---|---|---|---|
| 1 | Persist combat store (add Zustand `persist`) | High | Hours | A reload mid-fight is the "technical glitch gumming up combat" that in-person DMs fear |
| 2 | Death saves, exhaustion levels, temp-HP entry, concentration toggle on the sheet | High | 1–3 days | Store actions already exist; this is the most-praised digital-sheet value |
| 3 | JSON export/import of characters and campaign data | High (trust) | 1–2 days | No account plus localStorage means one cleared cache loses everything |
| 4 | PWA: manifest plus service worker (e.g. a Vite PWA plugin) and caching of the compendium JSON | High | 1–2 days | Uneven coverage outside cities; makes the "works offline" claim true |
| 5 | Sync characters, notes, NPCs and sessions to the existing Supabase tables; link character to campaign | Very high | 1–2 weeks | Schema and RLS are built and tested; unlocks Party, DM Tools and DM view of sheets |
| 6 | Monster import from the bundled 334 SRD monsters into combat, plus initiative rolls | High (DM) | 2–4 days | Matches the Improved Initiative/Shieldmaiden baseline using data already shipped |
| 7 | Roll from the sheet (skills, saves, attacks), and fix the min-1 dice clamp | High | 3–5 days | One-tap rolling is a core expectation; physical-dice users also need manual entry |
| 8 | Builder fixes: point-buy and standard array, structured subclass picker, armour equip recomputes AC | Medium | 2–3 days | Removes visible credibility gaps in the first five minutes |
| 9 | Content audit and 2024 correction: SRD 5.2.1 species and backgrounds, drop non-SRD text, strict per-character edition tag | High (risk plus quality) | 1–2 weeks | Licensing safety; DDB's 2014/2024 leakage is a known failure to beat |
| 10 | Live read-only player view of initiative via Supabase Realtime and invite code | High (differentiator) | 1 week, after #5 | Shieldmaiden's headline feature; nothing in Indonesian does it |
| 11 | Real XP field and working "Beri XP ke Party" | Medium | 1 day, after #5 | Removes a fake button |
| 12 | Hide System Check behind a dev flag; real README; 44px targets; Dice in the bottom bar; safe-area insets | Medium | 1–2 days | Cheap polish that changes first impressions |
| 13 | Encounter builder with 2024 XP budgets | Medium-high (DM) | 1 week | KFC's domain lapsed and no 2024 budget tool was found; addresses "few DMs" |
| 14 | Discord webhook for rolls, turns and session recaps | Medium | 2–4 days | Indonesian play is Discord-first; complements rather than fights Avrae |
| 15 | Indonesian translation of SRD 5.2.1 (spells, conditions, monsters) with a community glossary | Very high (moat) | Months, incremental | The single thing no competitor will ever ship; start with conditions and a core-term glossary |
| 16 | Cross-device identity (link anonymous auth to email or Google) | Medium | 3–5 days, after #5 | Needed once data syncs |
| 17 | Homebrew builder with a DM-shared pool pushed to players | High but niche | Weeks | Explicitly unmet need, but large scope; do after sync |
| 18 | i18n framework (for example i18next) | Low now | 1 week plus | Only needed if an English or Malay UI is planned; a consistent Indonesian glossary matters more first |
| — | Maps/VTT, AI GM, generated art | Low/negative | Very high | Crowded, costly, and hostile sentiment; skip |

Items 1–4 and 12 make a two-week sprint that turns the app from fragile into trustworthy. Item 5 is the pivot from "personal sheet" to "table companion", and everything multiplayer depends on it. Item 15 is the long-term moat and can run in parallel as content work, ideally crowd-sourced through the Discord communities.

## Positioning dnd-sistem for Indonesian tables

**Lead with "no card, no English, no laptop."** Each phrase removes a documented barrier: card-based USD checkout (about 2% card ownership), English rulebooks (the insider blog's named barrier), and desktop-centric VTTs. Pitch the app as the companion for in-person and Discord play, not as a D&D Beyond replacement. Most target users already have a DDB habit, and the free tier there is generous. What dnd-sistem offers that DDB cannot is the language and the phone-first table experience.

**Make the DM shortage the product story.** "Many players, few DMs" is the scene's structural problem. Every DM-side improvement pays off twice: a persisted tracker with SRD monster import, a 2024 encounter builder, a live player initiative view on players' phones, and a DM view of synced sheets. It helps the scarce DMs, and it lets the app spread through them. One DM who adopts the tool brings a table of four or five. Make the invite code a shareable Discord link that drops a new player straight into a guided level-1 build with Indonesian explanations of each choice. That flow answers the onboarding complaint about DDB's Quickbuilder, which "never had to make real choices" ([DDB forum](https://www.dndbeyond.com/forums/d-d-beyond-general/general-discussion/237910-new-quick-builder)).

**Distribute through what already exists.** That means the D&D Indonesia and DnD Jakarta Discords, the LFGcon and DEX circuits, and venues such as Arcanum ([Afraid of Encounters](https://afraidofencounters.bearblog.dev/afraid-of-communities-indonesian-tabletop-rpg-scene-lfg/)). Recruit glossary contributors there. A community-agreed Indonesian term list (for saving throw, advantage, concentration and similar terms) is a durable asset in its own right, following the precedent of the community-built French, German and Spanish SRDs.

**Stay legally boring.** Build on SRD 5.2.1 under CC-BY-4.0, keep the attribution, and audit the non-SRD subclass, feat and background data. Also reconsider branding. "D&D" in a product name invokes a WotC trademark the SRD does not license. The repo name is fine, but the public name should be checked before marketing.

**Monetise only with local rails, and only later.** Use a Saweria or Trakteer link (QRIS, GoPay, OVO, DANA) for tips. If a supporter tier ever exists, take payments through a local gateway such as Xendit or Midtrans, never card-only. Never paywall core table functions. Kanka's backlash and DDB's Drops controversy show how fast free-tier cuts burn trust ([Kanka blog](https://blog.kanka.io/2022/07/16/thoughts-on-the-discussions-surrounding-changes-to-the-free-tier)).

**Do not ship AI or maps.** Hostility to generative AI is strong, and full AI GMs are a crowded subscription niche with real model costs. If anything, a clearly labelled, DM-only, optional session-recap helper is the ceiling. Maps belong to Owlbear, Foundry and DDB's free Maps.

## Conclusion

The competitive picture rewards focus more than breadth. The incumbents are converging on online, desktop, English play. DDB has bet its 2026 on the Maps VTT, Roll20 has absorbed Demiplane's builder, and VTTs bundle their own sheets. That leaves a seam none of them is structurally motivated to fill: an Indonesian-language, phone-first, offline-capable companion for the physical table and the Discord channel. dnd-sistem's real competitors in that seam are free single-device tools such as Hero's Diary and Fight Club 5e, plus paper. Against them, the app's language and phone layout already win. Its fragility is what loses: no persistence in combat, no backup, no offline shell.

The surprising takeaway is how close the app is to a defensible position. Its server half is ahead of its client. The tables, RLS policies and join flow that would power party sync, DM sheet views and a live initiative screen are already written and tested, and the UI simply never calls them. Roughly two weeks of hardening, followed by one to two weeks of sync wiring, would move dnd-sistem from "behind everyone on multiplayer" to the only tool that gives an Indonesian DM and their players a shared, live table on their phones. It would get there before DDB's new app arrives in 2027. Indonesian SRD 5.2.1 content is the slower, compounding moat behind it.
