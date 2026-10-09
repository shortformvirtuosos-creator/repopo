# AI Video Generation Tools and Selling AI Video to Businesses (as of 9 October 2026)

> **Method note for the report writer:** Two limits shaped this research. (1) The sandbox egress proxy blocked direct page fetches: WebFetch got DNS/CONNECT failures on higgsfield.ai, krea.ai, wikipedia.org, saastr.com and others. (2) The shared web-search budget (200 searches per turn across all agents) ran out partway through. So every finding below comes from web-search result summaries of the cited URLs, not from reading the full pages. Most pricing comes from third-party pricing blogs. Many of these are SEO or competitor sites, and they often disagree, so conflicts are flagged inline. Treat every price as "reported in Sept–Oct 2026 unless noted" and check it on the vendor's own page before quoting it to a client. The following were planned but not searched because the budget ran out: Higgsfield's exact per-model credit table, Trustpilot complaints, the Oct 2026 model leaderboard, AI film-studio revenues, YouTube AI-trailer channels, and pricing for real-estate, tourism and restaurant promos.

---

## 1. Higgsfield AI: what it is, features, models, pricing, credits, commercial rights, monetization programs

### Takeaway
Higgsfield is a fast-growing aggregator built for creators and agencies. It reported $700M annualized revenue and raised a $5.4B-valuation Series B in Aug 2026, and agencies are said to account for about 70% of revenue. It bundles third-party models (Veo 3.1, Kling 3.0, Seedance 2.0/2.5, Wan, Hailuo, Sora 2 where still available) with in-house models (Soul, Soul 2.0, DoP) and ad-focused apps: UGC Factory, Lipsync Studio, Higgsfield Ads (product URL to video), Popcorn storyboards, the Supercomputer agent, and Genjutsu, a video-to-video recast tool launched 1 Sept 2026. The latest reported plans (Higgsfield blog, 15 Sept 2026) are Starter $15 (200 credits), Plus $49/mo or $39 annual (1,000 credits), and Ultra $129/mo or $99 annual (3,000 credits). Paid plans include commercial use. The free plan does not, and it comes with no credits.

### Cited Findings

**Company and scale**
- Higgsfield announced a $400M Series B at a $5.4B valuation, led by DST Global (dated 17 Aug 2026). That is more than 4x its $1.3B valuation in January 2026. It says annualized revenue reached $700M as of August (a company claim and a run rate, not audited revenue) — [Business Today MY](https://www.businesstoday.com.my/2026/08/26/higgsfield-secures-us400-million-series-b-at-us5-4-billion-valuation/); [The Next Web](https://thenextweb.com/news/higgsfield-series-b-400m-5-4bn-valuation-700m-revenue); [BNN Bloomberg](https://bnnbloomberg.ca/business/company-news/2026/08/17/higgsfields-valuation-soars-fourfold-to-us54-billion-in-six-months-on-ai-content-demand)
- Third-party revenue estimates differ. Sacra estimated $11M ARR (May 2025), $100M (Nov 2025) and $230M (Jan 2026), and later about $400M run-rate (May 2026). Business Insider reported a $500M run rate. The figures use different methods and dates — [Sacra](https://sacra.com/research/higgsfield-at-230m-arr/)
- The January 2026 round was described as an $80M Series A extension led by Accel at a $1.3B valuation. Another review instead calls it a "$130M Series A at a $1.3B valuation", so the amount conflicts — [The Next Web](https://thenextweb.com/news/higgsfield-series-b-400m-5-4bn-valuation-700m-revenue); [Higgsfield review roundup via search](https://aiforesight360.com/higgsfield-ai-review-2026/)
- CEO Alex Mashrabov told SaaStr that about 70% of revenue comes from agencies, "from early on". The article headline cites $500M ARR, 60 engineers and cash-flow positive — [SaaStr](https://www.saastr.com/500m-arr-60-engineers-cash-flow-positive-how-higgsfield-actually-runs-with-ceo-alex-mashrabov/)
- Inc. reports that agencies use Higgsfield to create "hundreds of different permutations" of models in different settings and poses for clients' social media. One agency estimates it spends $3,000–$50,000 a month on Higgsfield credits — [Inc.](https://www.inc.com/lisa-bonos/how-higgsfield-became-one-of-the-fastest-growing-ai-video-platforms-for-creators-and-startups/91397929)
- Higgsfield's revenue mix has shifted toward business customers. In January, business accounts were under a quarter of revenue; now most revenue comes from businesses — [The Next Web](https://thenextweb.com/news/higgsfield-series-b-400m-5-4bn-valuation-700m-revenue)

**Models available inside Higgsfield (verify in-app; the lineup changes often)**
- Higgsfield's own AI video page lists Seedance 2.0, Kling 3.0, Veo 3.1, Wan 2.7 and Sora 2 in one workspace with side-by-side comparison — [Higgsfield AI Video page](https://higgsfield.ai/ai-video)
- Third-party guides list Veo 3 and 3.1; Kling 3.0, 2.6, 2.5, 2.1, Omni and o1; Seedance 2.0 and 2.5; Sora 2, Pro and Max; Wan 2.2 through 3.0; Hailuo/MiniMax; plus in-house Soul, Soul 2.0 and DoP (DoP Lite is a budget option) — [Pasquale Pillitteri guide](https://pasqualepillitteri.it/en/news/677/higgsfield-ai-video-guide); [Skybreak AI](https://skybreakai.com/blog/higgsfield-models-explained-2026); [Krea "Is Higgsfield free"](https://www.krea.ai/blog/what-is-higgsfield-ai-pricing-free-plan-and-alternatives-in-2026)
- The Starter plan reportedly includes only selected models: Kling 3.0 at 720p, Seedance 2.0 Fast and Mini, and DoP. It does not include Seedance 2.5 — [Krea](https://www.krea.ai/blog/what-is-higgsfield-ai-pricing-free-plan-and-alternatives-in-2026); [Flowith](https://flowith.io/blog/higgsfield-pricing-2026-free-vs-creator-vs-studio/)
- Sora caveat: one source warns that OpenAI was winding down Sora's API through late 2026, so Sora on Higgsfield may disappear (see section 2) — [Skybreak AI](https://skybreakai.com/blog/higgsfield-models-explained-2026)
- Higgsfield can also be driven from Claude Code through an MCP integration (Sora, Veo and Kling are named) — [claudefa.st](https://claudefa.st/blog/tools/mcp-extensions/higgsfield-mcp)

**Feature set (ads and creator tools)**
- Soul ID and Soul 2.0 keep a character's look consistent across images and clips. Reviewers name Soul ID, UGC-style avatar ads and lipsync as Higgsfield's core strengths — [Promer review](https://promer.ai/blog/higgsfield-review); [Tadka Higgsfield Ads review](https://tadkai.io/resources/higgsfield-ads-review-2026)
- **UGC Factory**: Higgsfield's blog says it turns a product idea into a creator-led ad, with the same avatar throughout the clip. It has 6 templates: Unboxing, Product Review, SaaS, Try-On, Tutorial and Localization. One review says it sits inside Lipsync Studio (base image or clip, then voiceover, then lipsync model); another says it is built on Veo 3 — [Higgsfield blog: faceless videos & UGC ads](https://higgsfield.ai/blog/faceless-videos-ugc-ads-2026); [Tadka UGC explainer](https://tadkai.io/resources/higgsfield-ugc-ads-explained-2026)
- **Lipsync Studio** (also called "Higgsfield Speak") syncs a generated or cloned voice to a face. One reviewer says it is more accurate than most competitors. An unverified benchmark cites about 85% accuracy — [Higgsfield lipsync blog](https://higgsfield.ai/blog/make-ai-lipsync-videos); [Techjournal review](https://techjournal.org/higgsfield-review)
- **Higgsfield Ads**: turns a product URL into a video in about 2 minutes, with 40+ AI avatars for UGC-style ads. There are 80+ mini-apps covering lipsync, face swap, product placement and VFX. **Marketing Studio** and **Popcorn** (a storyboard tool) also target ads and talking-head content — [Tadka Higgsfield Ads review](https://tadkai.io/resources/higgsfield-ads-review-2026); [Promer review](https://promer.ai/blog/higgsfield-review)
- **Supercomputer agent**: Higgsfield's "Make Money With AI" post describes it taking a brand from research to launch, reaching 500K views and 833 waitlist sign-ups from a brand-new account with zero paid ads (a company case study) — [Higgsfield blog: Make Money With AI](https://higgsfield.ai/blog/make-many-with-ai)
- **"Higgsfield Skills"** are positioned for faceless YouTube videos and UGC ads — [Higgsfield blog](https://higgsfield.ai/blog/faceless-videos-ugc-ads-2026)
- Weaknesses reported by reviewers: there is no batch or variant engine, so each ad variant is generated one at a time. Static ads are a secondary feature. Higgsfield does not guarantee commercial rights to realistic human likenesses in every UGC scenario — [Tadka Higgsfield Ads review](https://tadkai.io/resources/higgsfield-ads-review-2026); [Tadka UGC explainer](https://tadkai.io/resources/higgsfield-ugc-ads-explained-2026)

**"Genjutsu" (the tool the user mentioned): it exists, and it is a Higgsfield product**
- Genjutsu is Higgsfield's video-to-video transformation tool. It launched on **1 Sept 2026**, according to most sources. Others give a blog announcement on 31 Aug, a changelog entry on 4 Sept, or a directory listing on 9 Sept. It has two modes. **Motion Transfer** rebuilds characters, locations and style from reference images while keeping the original motion, camera and timing. **Object Swap** replaces specific items (outfits, products, characters, locations) and leaves the rest of the footage untouched — [Higgsfield blog: Meet Genjutsu](https://higgsfield.ai/blog/higgsfield-genjutsu); [Higgsfield changelog](https://higgsfield.ai/creator-hub/changelog); [Stork.ai review](https://www.stork.ai/en/higgsfield-genjutsu)
- Specs: reference videos of about 3–30 seconds, up to 40 reference images, output up to 1080p, and a prompt is optional (presets can drive it). It is not a text-to-video generator and not a face or identity swap tool. The API version allows fewer reference images and is priced per second — [Rekreate](https://rekreate.ai/news/higgsfield-genjutsu); [Riffkit guide](https://riffkit.ai/blog/how-to-use-higgsfield-genjutsu); [Stork.ai](https://www.stork.ai/en/higgsfield-genjutsu)
- Credit cost (the most consistent figure across sources), per 15-second clip: 40 credits at 480p (about $2.00), 104 at 720p (about $5.20), 144 at 1080p (about $7.20). Motion Transfer and Object Swap cost the same, and re-rolls are charged — [Kavel.ai price guide](https://www.kavel.ai/blog/higgsfield-genjutsu-price-guide); [Pippit review](https://www.pippit.ai/resource/higgsfield-genjutsu)
- Reported problems: a Sept 2026 review says some renders sat at "processing" for days. Hands and heads lose sharpness during rapid motion — [Kavel.ai](https://www.kavel.ai/blog/higgsfield-genjutsu-price-guide); [AIChief](https://aichief.com/ai-video-tools/higgsfield-genjutsu/)
- Several "Genjutsu AI" comparison pages on aiindigo.com, and the site higgsfieldgenjutsu.lol, look auto-generated or unofficial. Do not rely on them — [aiindigo](https://aiindigo.com/compare/genjutsu-ai-vs-kling-ai); [higgsfieldgenjutsu.lol](https://higgsfieldgenjutsu.lol/)

**Pricing tiers and credits (conflicting; latest first)**
- **Most recent (Higgsfield blog, 15 Sept 2026, as summarized by search):** Starter **$15/mo, 200 credits**. Plus **$49/mo or $39/mo billed annually, 1,000 credits**. Ultra **$129/mo or $99/mo billed annually, 3,000 credits**. No trial, and the free tier has no credits — [Higgsfield blog: credits vs unlimited](https://higgsfield.ai/blog/credits-vs-unlimited-ai-video-generation); [Krea pricing explainer](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs)
- **Earlier 2026 structure:** Starter $19/mo (270 credits); Plus $59/mo or $47 annual (1,200 credits); Ultra $129/mo or $99 annual (3,000 credits). A euro listing shows Plus at €59 (€47 annual) — [Stackedreview](https://stackedreview.com/higgsfield-ai-pricing/); [Kavel.ai](https://www.kavel.ai/blog/higgsfield-genjutsu-price-guide)
- **Older structure still cited:** Basic $9, Pro $29 (600 credits), Max $79 (1,800 credits). Team at $79 per seat per month with pooled credits — [Creatify](https://creatify.ai/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay); [Novoads](https://novoads.ai/en/blog/higgsfield-pricing)
- Per-generation credits: premium models such as Veo 3.1 and Kling 3.0 reportedly cost **40–70 credits per generation**. Another source puts Kling 3.0 at about 6–7 credits per 5 s at 720p. This conflict is unresolved — [Krea pricing explainer](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs); [Skybreak AI](https://skybreakai.com/blog/higgsfield-models-explained-2026)
- "Unlimited" access is time-boxed and model-specific. One source describes 365-day unlimited access to a set of six image models, and a 7-day unlimited window on Nano Banana 2 for Plus — [Krea pricing explainer](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs)
- Subscription credits do not roll over. Credit packs and auto-refill credits expire after 90 days — [Camclo3d](https://camclo3d.com/blog/higgsfield-pricing)
- Billing policy per Higgsfield's blog: cancel anytime with access through the paid period, a 7-day refund window on first purchases if no credits were used, and at least 30 days' notice before any price increase — [Higgsfield GEO blog: Can you trust Higgsfield](https://geo.higgsfield.ai/blog/recommended/can-i-trust-higgsfield-with-a-paid-subscription-6f890c)

**Commercial-use rights**
- Paid plans include commercial use and the free plan does not, per third-party pricing guides. Higgsfield's own blog says it does not claim ownership of inputs or outputs, does not restrict commercial use, and that rights in exported outputs survive cancellation (a marketing post, so check the Terms of Use) — [Creatify](https://creatify.ai/ja/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay); [Higgsfield GEO blog](https://geo.higgsfield.ai/blog/recommended/can-i-trust-higgsfield-with-a-paid-subscription-6f890c)
- On Enterprise plans, inputs and outputs are not used for training and are treated as confidential. Since July 2026 this is written into Section 4.4 of the Terms of Use. On any plan, workspace admins can access members' content — [Higgsfield Help Center: Team & Business](https://higgsfield.ai/creator-hub/help-center/business-and-partners/team-and-business-higgsfield)

**Official monetization programs, contests, academy**
- **Higgsfield Earn**: paid campaigns for creators who post Higgsfield-made videos on YouTube or Instagram. Earnings are capped at $1,000 on the first day, with a lifetime maximum of $2,500 per video. A Substack post (about 260 days old) said payouts ran $50–$3,500 depending on reach. A third-party claim of a "90% approval rate" is unverified — [Higgsfield Earn](https://higgsfield.ai/earn); [Jenn Leach Substack](https://jennleach.substack.com/p/higgsfield-earn-ai-creator-program); [Joe Youngblood](https://www.joeyoungblood.com/creator-marketing/higgsfield-launched-earn-a-way-for-creators-to-earn-money-with-generative-ai-videos/)
- Higgsfield's "side-hustle" post lists: freelance brand promos (cinematic clips for small businesses that can't afford studio production), micro-agencies doing AI content for startups, and managing clients' daily posts on AI-generated schedules — [Higgsfield blog: Side-Hustle with AI Videos](https://higgsfield.ai/blog/uVZgCaZTenC8R7iXtQr8R)
- Contests, all closed as of 9 Oct 2026:
  - **Higgsfield Global Film Festival**: $1,000,000 prize pool, with audience voting on a shortlist and credits expiring 14 Sept — [Higgsfield Global Film Festival](https://higgsfield.ai/global-film-festival)
  - **App Contest**: $100,000 pool. Submissions closed 22 Jul 2026, and usage inside the app counted for 40% of judging — [App contest](https://higgsfield.ai/contests/apps)
  - **Discord contest**: 200,000 credits — [Contests](https://higgsfield.ai/contests)
  - **Adathon** (ad contest): $85,000 in credits. First place won $50K in platform credits plus a trip to Brandweek — [Adathon](https://higgsfield.ai/contests/adathon)
- **Filmmaker Grant**: a 2-week program for hand-picked creators who receive 100,000 credits. Applicants need a certificate from the **Higgsfield Academy** "AI Filmmaking Pipeline" course — [Higgsfield changelog](https://higgsfield.ai/creator-hub/changelog); [Contests](https://higgsfield.ai/contests)
- **Skool**: no official Higgsfield Skool community was found. Skool groups such as AIography ("I Made an AI Influencer with Higgsfield AI & Got Paid") are third-party and use the Earn program as a hook — [AIography Skool](https://www.skool.com/aiography/i-made-an-ai-influencer-with-higgsfield-ai-got-paid)
- A third-party guide suggests a recurring local-business package of 3–10 short clips (10–20 s) plus 6–12 images per month, and starting with friends' businesses, local shops you already use, event organizers, and creators you follow — [Creative Marketing AI](https://creativemarketing.ai/blog/make-money-with-higgsfield-ai-service-ideas)

### Inferences
- The implied value of a Higgsfield credit is about **$0.043–$0.05** (Ultra $129 / 3,000 = $0.043; Plus $49 / 1,000 = $0.049; Genjutsu's "40 credits ≈ $2.00" implies $0.05). At 40–70 credits per premium clip, each premium generation costs about **$2–$3.50**. Ultra's 3,000 credits buy only about 45–75 premium generations a month. So for client volume you must either buy top-ups or draft on cheaper models (Kling/Seedance Fast, DoP Lite) and save Veo 3.1 for final shots.
- For selling to business owners, Higgsfield's toolset fits four products:
  1. **UGC-style avatar ads**: UGC Factory templates plus Lipsync, aimed at e-commerce and SaaS.
  2. **Cinematic product or brand promos**: keyframes in Soul or Nano Banana, image-to-video in Kling, Veo or Seedance, with camera-style shots.
  3. **Monthly social content packs** with a consistent brand character (Soul ID).
  4. **Recasting a client's existing footage** with Genjutsu, e.g., swap the product or outfit, or restyle a phone-shot clip into a branded scene, for about $7 per 15 s at 1080p plus re-rolls.

  The agency-heavy revenue mix (about 70%) and Inc.'s "hundreds of permutations" anecdote suggest that high-volume social and ad variants are the main commercial use, rather than long-form film.
- Because plan names and prices changed at least three times in 2026, any client quote should be built on credits per finished asset, not on a plan name.

### Gaps
- Could not open higgsfield.ai/pricing, which was blocked by the proxy, so there is no exact per-model credit table (Veo 3.1 vs Kling 3.0 vs Seedance 2.0 vs Soul image) and no current Team/Business seat price.
- Not verified in this session: the camera-motion preset library traditionally associated with Higgsfield DoP (crash zoom, dolly, bullet-time, etc.) and its current preset count. Third-party sources only confirm DoP as an in-house model and call Higgsfield films "camera-first" ([AI Film Contests](https://aifilmcontests.com/topics/best-ai-film-festivals-for-higgsfield-users)).
- Trustpilot and Reddit complaints about credit burn or "unlimited" marketing were not checked (search budget exhausted).
- The curriculum of the Higgsfield Academy "AI Filmmaking Pipeline" course was not found.

---

## 2. Other key tools: current prices and strengths

### Takeaway
As of Oct 2026, Google Veo 3.1 (through Flow and Google AI plans), Kling 3.0, Seedance 2.0/2.5 and Runway Gen-4.5 are the main paid video engines, and Luma, Freepik/Magnific and Krea act as multi-model aggregators like Higgsfield. **OpenAI's Sora is effectively gone.** The app was shut down (announced 24 Mar 2026, reportedly discontinued 26 Apr 2026) and the API was reportedly sunset on 24 Sept 2026. ElevenLabs v3 officially supports **Bosnian, Croatian and Serbian**, which makes local-language voiceover feasible. Suno is the practical music choice, since Udio downloads are still disabled.

### Cited Findings

**Google Veo 3.1 (Gemini / Flow)**
- Google AI Pro is **$19.99/mo** with 1,000 Flow credits a month (no rollover). AI Ultra is **$99.99/mo** for 10,000 credits, and a top Ultra tier is **$199.99/mo** for 25,000 credits. AI Plus is $4.99/mo for 200 credits. Every account gets 50 free Flow credits a day (no rollover). These figures come from third-party sites dated late Sept to early Oct 2026. The $249.99 Ultra price from 2025 is outdated — [SaaSCRMReview Flow pricing](https://saascrmreview.com/google-flow-pricing/); [Camclo3d Veo pricing](https://camclo3d.com/blog/veo-3-pricing); [Felloai Flow](https://felloai.com/google-flow/)
- Veo 3.1 credits per clip: **Lite 10** (5 on Ultra), **Fast 20** (10 on Ultra), **Quality 100** for everyone. Pro's 1,000 credits therefore buy about 100 Lite, 50 Fast or 10 Quality clips a month. Ultra's 10,000 buy about 100 Quality clips — [SaaSCRMReview](https://saascrmreview.com/google-flow-pricing/); [Toolcolumn](https://www.toolcolumn.com/pricing/google-flow-pricing)

**OpenAI Sora 2: discontinued**
- OpenAI announced on X on **24 Mar 2026** that it was shutting down Sora. WSJ reporting cited operating costs of about $1M a day against only $2.1M in lifetime in-app revenue. The Sora team moved to world-simulation and robotics research. Disney, which had a Sora character deal, said it respected the exit — [NBC News](https://www.nbcnews.com/tech/tech-news/openai-shuttering-sora-video-generating-service-rcna264989); [Hollywood Reporter](https://www.hollywoodreporter.com/business/digital/openai-shutting-down-sora-ai-video-app-1236546187/); [Forbes](https://www.forbes.com/sites/rachelwells/2026/03/26/openai-shuts-down-ai-video-app-sora-the-first-crack-in-the-ai-bubble/)
- One explainer says the web and app were discontinued on **26 Apr 2026** and the API on **24 Sept 2026** (secondary source, not confirmed against OpenAI) — [Techjournal](https://techjournal.org/what-happened-to-sora-openai-shutdown); [Costgoat Sora sunset guide](https://costgoat.com/pricing/sora)
- Last API prices listed: Sora 2 $0.10/s (720p); Sora 2 Pro $0.30–$0.70/s; batch at half price — [Costgoat](https://costgoat.com/pricing/sora)

**Kling (Kuaishou)**
- Plans as listed in Kling's official guide (13 Sept 2026, per a third-party summary), with a $10 / $37 / $92 list price also reported for the first three:

  | Plan | First month | After that | Annual | Credits/month |
  |---|---|---|---|---|
  | Standard | $6.99 | $8.80/mo | $79.20 | 660 |
  | Pro | $25.99 | $32.56/mo | $293.04 | 3,000 |
  | Premier | $64.99 | $80.96/mo | $728.64 | 8,000 |
  | Ultra | — | $159.99–$180/mo | no annual discount | — |

  [Magichour Kling pricing](https://magichour.ai/blog/kling-ai-pricing); [Vo3ai](https://www.vo3ai.com/kling-ai-pricing); [Layer3labs](https://www.layer3labs.io/guides/kling-ai-pricing)
- The free Basic tier gets daily login credits (66 a day in one report) and **no commercial use** — [Lorphic](https://lorphic.com/kling-ai-pricing-full-breakdown/); [Felloai](https://felloai.com/kling-ai-pricing/)
- Kling 3.0 costs 6–12 credits per second. A 5 s 1080p clip is 40 credits silent or 60 with native audio. The API costs $0.112/s at 1080p without audio and $0.168/s with audio, sold in prepaid packages starting at $700 — [Shhots](https://shhots.ai/blog/kling-ai-pricing/); [Zsky](https://zsky.ai/blog/how-much-does-kling-cost)

**Runway**
- From the official pricing page:
  - Standard: **$15/mo** ($12 annual), 625 credits.
  - Pro: **$35/mo** ($28 annual), 2,250 credits.
  - Max: **$76/mo** annual, 114,000 credits a year.
  - Free: 125 one-time credits.
  - Gen-4.5 costs **12 credits per second**, so Standard buys about 52 s and Pro about 187 s of Gen-4.5 a month.
  - Third parties also describe an "Unlimited" tier at $95/mo with unlimited Explore-mode generations.

  [Runway pricing](https://runway.com/pricing); [eesel Runway](https://www.eesel.ai/blog/runway-ai-pricing)

**Luma (Dream Machine / Luma Agents)**
- New tiers: Plus **$30/mo** ($25 annual), 10,000 credits. Pro **$90** ($75), 40,000 credits. Ultra **$300** ($250), 150,000 credits. Paid plans include commercial use and pool Luma Ray models with Veo 3.1, Kling 3.0, Seedance 2.0, GPT Image, Nano Banana and ElevenLabs audio. A 10 s Ray3.2 clip at 720p costs 300 credits (about $0.90 on Plus). 1080p costs 4x as much, and HDR multiplies it further. Legacy plans: Lite $9.99, Plus $29.99, Unlimited $94.99 — [eesel Luma](https://eesel.ai/blog/luma-ai-pricing); [Hooked](https://www.hooked.so/compare/luma-ai-pricing)
- Monthly credits do not roll over, and failed generations still consume credits — [eesel ES](https://www.eesel.ai/es/blog/precios-luma-ai)

**Seedance (ByteDance) via Dreamina / CapCut**
- Official Dreamina tiers (first month / regular, credits per month):

  | Tier | First month | Regular | Credits/month |
  |---|---|---|---|
  | Basic | $1.50 | $15/mo | 1,575 |
  | Standard | $22 | $36/mo | 3,885 |
  | Advanced | $95 | $159/mo | — |
  | Ultra | $312 | $520/mo | — |

  The first-month promos apply to eligible accounts in 12 countries. Bosnia was not among the named examples (US, UK, Japan, Germany) — [Dreamina Seedance 2.0 pricing](https://dreamina.capcut.com/seedance/seedance-2-0-pricing); [Dreamina Seedance price](https://dreamina.capcut.com/seedance/seedance-price)
- Promotional per-second rates at 720p: Seedance 2.0 Fast or Mini at $0.008/s and Pro at $0.016/s (promo window 23 Sept–9 Oct 2026). ByteDance's official API costs about $0.15/s at 720p. Free daily credits were about 120 a day in Aug 2026 — [Dreamina](https://dreamina.capcut.com/seedance/seedance-price); [Framesurfer](https://framesurfer.com/blogs/seedance-2-0-pricing); [Higgsfield Seedance pricing blog](https://higgsfield.ai/blog/seedance-2-0-pricing-2026)

**Hailuo / MiniMax**
- Prices conflict. The entry tier is $7.99–$14.99/mo for 1,000 credits, and Pro is $24.99–$54.99 for 4,500. The most consistent figure is **Max at $199.99 for 20,000 credits**. Hailuo 2.3 Fast costs about 15–20 credits per clip and Standard about 25–35. New users get 200 free credits that expire in 3 days. Through third-party APIs it costs about $0.28 per 6 s clip (Runware) — [Magichour Hailuo](https://magichour.ai/blog/hailuo-23-pricing); [Aiarty](https://www.aiarty.com/ai-video-generator/hailuo-ai-pricing.htm)

**Pika**
- Starter $10 ($8 annual), 900 credits, no commercial license. Creator **$35** ($28), 3,150 credits, includes a commercial license. Fancy $95 ($76), 8,550 credits; this plan was raised from $70 to $95 on 1 Apr 2026. The free plan has no credits and no commercial license — [Hooked Pika](https://www.hooked.so/compare/pika-pricing); [Costbench Pika change](https://costbench.com/changelog/pika-price-increase-2026-04/)

**Midjourney (images + image-to-video)**
- Plans:

  | Plan | Price | Fast GPU hours/month | Notes |
  |---|---|---|---|
  | Basic | $10/mo | 3.3 | no Relax mode; SD video only |
  | Standard | $30/mo | 15 | unlimited Relax images; SD/HD video on Fast hours |
  | Pro | $60/mo | 30 | Relax SD video; Stealth mode |
  | Mega | $120/mo | 60 | Relax SD video; Stealth mode |

  Other terms: annual billing saves 20%, extra Fast time costs $4/hr, and companies with more than $1M gross revenue must use Pro or Mega. Video is **image-to-video only**, 5 s per clip and extendable to 21 s. The default model is V8.1 (Jun 2026) or V8.2 (24 Jul 2026), depending on the source — [eesel Midjourney](https://eesel.ai/blog/midjourney-pricing); [aiproductivity](https://aiproductivity.ai/pricing/midjourney/); [Pixverse review](https://pixverse.ai/es/blog/midjourney-ai-image-generator-review)

**Nano Banana (Google Gemini image) and FLUX**
- **Nano Banana 2** (Gemini 3.1 Flash Image) API: about $0.045 at 0.5K, $0.067 at 1K, $0.101 at 2K and $0.151 at 4K. **Nano Banana Pro** (Gemini 3 Pro Image): $0.134 at 1K or 2K, $0.24 at 4K — [Myarchitectai](https://www.myarchitectai.com/blog/nano-banana-api-pricing); [Magichour benchmark](https://magichour.ai/blog/nano-banana-2-vs-nano-banana-pro-we-benchmarked-both-on-the-same-5-prompts)
- **FLUX.2** (Black Forest Labs) is billed per megapixel:
  - klein: from $0.014–$0.015 per image. The 4B model is Apache 2.0; the 9B model is non-commercial.
  - pro: $0.03/MP for generation, $0.045/MP for editing.
  - max: $0.07 for the first MP, then $0.03 per MP.

  [Invideo Flux explainer](https://invideo.io/blog/flux-ai-image-generator/); [Pricepertoken](https://pricepertoken.com/image/model/black-forest-labs-flux-2-pro)

**Freepik (rebranded Magnific) and Krea: aggregators**
- **Freepik/Magnific Premium+**: **$45/mo or $33.75/mo annual**, 600K credits a year. Generations are "unlimited" only on selected models; reviewers say unlimited access was cut back in 2026 to about 10 image models, and video still uses credits — [Magnific pricing](https://www.magnific.com/pricing); [eesel Freepik](https://www.eesel.ai/blog/freepik-ai-pricing); [Autoposting review](https://autoposting.ai/blog/freepik-review)
- **Krea** (as of 30 Sept 2026):

  | Plan | Price | Compute units | Notes |
  |---|---|---|---|
  | Free | $0 | 100 a day | — |
  | Basic | $9/mo | 5,000 | minimum plan for commercial use |
  | Pro | $35/mo | 20,000 | needed for all video models |
  | Max | $105/mo (another source says $70) | 60,000 | — |
  | Business | $200/mo | 80,000 | up to 50 seats |

  [Costbench Krea](https://costbench.com/software/ai-image-generators/krea/); [Tooljunction](https://www.tooljunction.io/ai-tools/krea)

**Upscaling: Topaz**
- Topaz Video AI costs **$299/yr** (Personal) or $699/yr (Pro), or $59/mo with no commitment. The perpetual license was retired in Oct 2025. **Astra**, the cloud upscaler, starts at about $39/mo; its higher tiers conflict across sources. Topaz Studio, a bundle of all apps, is $399/yr — [Renderahouse](https://www.renderahouse.com/blog/topaz-ai-pricing); [Myarchitectai Topaz](https://www.myarchitectai.com/blog/topaz-ai-pricing)

**Voice: ElevenLabs (incl. Bosnian / Croatian / Serbian)**
- The free plan has no commercial rights. Plans:
  - Starter **$5–6/mo**, 30,000 credits, commercial license plus instant voice cloning.
  - Creator **$22/mo**, 100k–121k credits; professional voice cloning starts here.
  - Pro **$99/mo**, 500k–600k credits.
  - Scale $299–$330.
  - Business $990–$1,320.

  Annual billing saves about 17% — [Smallest.ai](https://smallest.ai/blog/elevenlabs-pricing-plans-cost-what-you-get-in-2026); [BIGVU](https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/)
- **Eleven v3 officially supports Bosnian (bos), Croatian (hrv) and Serbian (srp)** across 70+ languages. The Eleven v4 section lists Bosnian and Croatian; Serbian was not confirmed for v4. Many "Croatian" library voices are community voices with Serbian or Balkan accents, so model support is not the same as a native-sounding voice — [ElevenLabs Models docs](https://elevenlabs.io/docs/overview/models); [ElevenLabs on X (v3 language list)](https://x.com/elevenlabsio/status/1933557207582355635); [ElevenLabs Help: languages](https://help.elevenlabs.io/hc/en-us/articles/13313366263441-What-languages-do-you-support); [json2video Croatian voices](https://json2video.com/ai-voices/elevenlabs/languages/croatian/)

**Music: Suno and Udio**
- **Suno**: Pro **$10/mo** ($8 annual), 2,500 credits, about 500 songs. Premier **$30/mo** ($24), 10,000 credits, and the only plan with Suno Studio. Free is 50 credits a day, non-commercial, and requires attribution. Commercial rights cover only songs made while subscribed. Several blogs report a Sept 2026 terms change that caps commercial downloads at **20/mo on Pro and 60/mo on Premier** (not verified on suno.com) — [Musicmake](https://musicmake.ai/blog/suno-ai-pricing-plans-2026); [Terms.law Suno](https://terms.law/ai-output-rights/suno/); [Dynamoi](https://dynamoi.com/learn/ai-music-distribution/suno-commercial-rights-explained)
- **Udio**: downloads have been disabled since late 2025 (apart from a 48-hour export window in Nov 2025). Udio signed a Kobalt licensing deal in Apr 2026. Universal–Udio and Warner–Suno have settled, while Sony's claims are ongoing. Udio's licensed "walled garden" platform had not launched by the end of Sept 2026, so it is **not usable for client deliverables** — [Digital Music News](https://www.digitalmusicnews.com/2026/04/09/udio-kobalt-deal/); [Dynamoi lawsuit timeline](https://dynamoi.com/learn/ai-music-distribution/ai-music-copyright-cases-timeline); [aitools-directory Udio](https://www.aitools-directory.com/blog/udio-ai-review-2026/)

**Editing: CapCut and DaVinci Resolve**
- **CapCut Pro** is about **$19.99/mo or $179.99/yr**. Prices vary by region and store; app stores are 20–30% dearer than capcut.com. There is no lifetime option — [eesel CapCut](https://eesel.ai/blog/capcut-pricing); [BIGVU CapCut](https://www.bigvu.tv/blog/capcut-pricing-2026-free-vs-pro-included-alternatives)
- **DaVinci Resolve Studio** is **$295 one-time** ($299.99 on the Mac App Store). The free Resolve has no export limit — [Thepricer](https://www.thepricer.org/how-much-does-davinci-resolve-cost/); [Apple App Store](https://apps.apple.com/app/davinci-resolve-studio/id900392332)

### Inferences
- Strengths by tool, synthesized from the findings above (no benchmark leaderboard was checked):
  - **Veo 3.1**: native-audio realism, with a cheap Lite/Fast drafting path inside Google AI plans.
  - **Kling 3.0**: cost-efficient image-to-video with optional native audio.
  - **Seedance 2.0/2.5**: very low per-second promo cost and multimodal "4K" positioning.
  - **Runway Gen-4.5**: a pro editing toolset, but at 12 credits/s it is expensive per second.
  - **Midjourney**: style and aesthetic keyframes; video is i2v only.
  - **Nano Banana / FLUX**: product-accurate keyframes and edits at cents per image.
  - **Higgsfield, Luma, Krea, Magnific**: one subscription for many models.
- A lean Bosnia-based starter stack:

  | Tool | Monthly cost |
  |---|---|
  | Kling Standard | $8.80 |
  | ElevenLabs Starter | $5–6 |
  | Suno Pro | $10 |
  | DaVinci Resolve free | $0 |
  | Nano Banana via Gemini / Google AI Pro | $19.99 |
  | **Total** | **about $45–50/mo** |

  A "pro" stack swaps in Higgsfield Plus ($49) or Ultra ($129), ElevenLabs Creator ($22), CapCut Pro ($20) and Topaz Astra ($39), for about **$130–$210/mo**.
- Drop Sora 2 from any recommended stack. Its availability through aggregators after the 24 Sept 2026 API sunset is doubtful.

### Gaps
- No independent quality leaderboard (e.g., Artificial Analysis video arena, Oct 2026) was retrieved, so "best at" claims are positioning, not benchmarked.
- Whether a "Veo 4" or newer Google model exists as of Oct 2026 is unverified. Sources only reference Veo 3.1.
- Regional availability and pricing for Bosnia & Herzegovina (e.g., whether Dreamina first-month promos or Google AI plans are sold in BiH) was not checked.
- CapCut's own subscription page and the official Pika and Hailuo pages could not be opened.

---

## 3. What AI video freelancers and agencies charge

### Takeaway
Prices fall into three layers. **Fiverr-style gigs** charge $25–$150 for a 15–30 s AI ad; top gigs go to about $400 per order, and "cinematic" gigs start at $450. **Direct-client freelancers** charge about $150–$400 (beginner), $400–$1,000 (mid) and $1,000–$4,000 (expert or full creative direction) per 30 s ad. **Retainers** for monthly social and ad content run about $1,500–$4,000 for beginners up to $10,000–$20,000+ for experts. These figures come mostly from vendor and blog rate guides, not audited data.

### Cited Findings

**Per-video rates (direct clients)**
- 30 s AI video: $150–$400 (beginner), $400–$800 (mid) and $800–$1,200 (expert), before usage rights. The same guide's rate card goes up to $1,000–$3,500+ for expert work — [Playcut: How much to charge](https://playcut.ai/blog/how-much-to-charge-for-ai-video/); [Fueler](https://fueler.io/blog/how-much-should-you-charge-as-an-ai-video-creator)
- Mid tier with custom script and brand-matched visuals: **$500–$1,500 per video**. Premium with full creative direction: **$1,500–$4,000** — [Channel.farm](https://channel.farm/blog/how-to-price-ai-video-services-freelancer-agency)
- UGC-style AI ads: **$250–$700 per video** (one guide). Another cites a 2026 average of **$198** for a single UGC video. Paid-campaign product ads: **$500–$1,500 per video**. Low-end ad creatives: **$50–$150**, often in bundles of 5–10 variations — [Wireflow: AI UGC ad pricing](https://www.wireflow.ai/blog/how-much-to-charge-clients-for-ai-ugc-ads); [inReels](https://www.inreels.ai/blog/how-much-do-ai-video-ads-cost-2026)
- By client category: B2B and professional services **$700–$1,500 per video**; retail and **restaurant** clients often **$350–$500 each** — [Wireflow](https://www.wireflow.ai/blog/how-much-to-charge-clients-for-ai-ugc-ads) (exact page attribution came from a search summary, so treat as approximate)
- Per finished minute: $100–$500+ for higher-production AI video. Another guide gives $50–$75 per minute for beginners and $120–$150+ for experts — [Playcut AI video ads cost](https://playcut.ai/blog/ai-video-ads-cost-2026/); [Freelance with Erica](https://freelancewitherica.com/library/ai-automation/ai-video)
- Add-ons (one vendor's figures): paid-ads licensing **+50%**, category exclusivity **+40%**, rush delivery **+25%** — [Playcut rate calculator](https://playcut.ai/tools/ai-video-rate-calculator/)
- Suggested career path: start at a mid-tier per-video rate, then move to retainers (e.g., from $600 to $800 per video) — [Genra.ai freelancer guide](https://genra.ai/blog/ai-video-freelancer-business-guide)

**Retainers / social content packages**
- Monthly retainers: **$1,500–$4,000** (beginner), **$5,000–$8,000** (mid), **$10,000–$20,000+** (expert) — [Fueler](https://fueler.io/blog/how-much-should-you-charge-as-an-ai-video-creator); [Playcut](https://playcut.ai/blog/how-much-to-charge-for-ai-video/)
- Higgsfield-oriented package idea: 3–10 clips (10–20 s) plus 6–12 images a month for local businesses (no price given) — [Creative Marketing AI](https://creativemarketing.ai/blog/make-money-with-higgsfield-ai-service-ideas)
- AI-assisted short-form editing: $20–$80 per video, undercutting the typical $50–$80 — [Goodreads author blog](https://www.goodreads.com/author_blog_posts/25585940-genius-idea-start-this-agency-without-any-skills)

**Marketplace (Fiverr) evidence**
- A 15 s AI product-ad gig starts at **$55** and has 844 reviews; its orders range from $50 to $400 — [Fiverr gig (kaifmd70045)](https://www.fiverr.com/kaifmd70045/convert-image-to-animated-gif-and-video)
- AI commercial gigs start at $40, $60, $70 and $135 (24-hour delivery). A "cinematic AI film or commercial" starts at **$450**. A "Fiverr's Choice" commercial video ad starts at $205. An agency's AI product ad starts at **$4,875** — [Fiverr AI commercials](https://www.fiverr.com/gigs/ai-commercials); [Fiverr AI commercial video](https://block.fiverr.com/gigs/ai-commercial-video)
- **AI music videos**: one "realistic AI music video" gig starts at **$30**, and a guide cites an average of **$93** on Fiverr. Custom projects cost more — [Fiverr AI music video](https://block.fiverr.com/gigs/ai-music-video); [Playcut Fiverr playbook](https://playcut.ai/blog/fiverr-ai-video-gig-playbook/)
- Typical Fiverr tier ladder:
  - Basic ($75–$100): 30 s video, stock music, basic voiceover, 2 revisions, 48 h delivery.
  - Standard ($150–$200): 60 s video, custom voiceover, captions, 3 revisions.
  - Premium ($300–$500): 3–5 videos or a monthly package, with a custom AI actor and source files.

  [Playcut Fiverr playbook](https://playcut.ai/blog/fiverr-ai-video-gig-playbook/); [Fluxnote](https://fluxnote.io/guides/sell-ai-video-services-fiverr)
- One source frames the same 30 s AI video as worth about $57 as a race-to-the-bottom gig, or about $600 as a licensed ad — [Playcut](https://playcut.ai/blog/fiverr-ai-video-gig-playbook/)

**Trailers / longer pieces**
- One seller's offer (Gumroad): **$500** for a 30 s ad, **$1,000** for a 60 s video with AI visuals and AI voiceover, and **$2,500** for a premium cinematic trailer — [Gumroad: bobbyguions](https://bobbyguions.gumroad.com/l/aivideoadvertising)
- An agency estimate puts a commercial like Coca-Cola's at $3,000–$16,000 with AI, depending on scope (an industry estimate, not Coca-Cola's figure) — [RetailBoss](https://retailboss.co/coca-colas-ai-generated-holiday-campaign-and-the-backlash-that-went-viral)

### Inferences
- A defensible price ladder for an SMB-focused freelancer, synthesized from the ranges above:

  | Deliverable | Starting price | Notes |
  |---|---|---|
  | 15–30 s AI product ad | **$300–$800** | +50% for paid-ads usage |
  | 60 s brand commercial | **$1,000–$2,500** | |
  | Monthly social pack (10–20 shorts) | **$800–$2,500/mo** (local SMB) | $3,000–$8,000 for funded brands or agencies |
  | Music video (local artist) | **$300–$1,500** | Fiverr floor is $30–$93, so position on concept and quality |
  | Cinematic trailer / spec | **$1,500–$2,500+** | |

  Because tool cost per ad is low (often under $50–$150, see section 5), gross margins are very high. The hard limits are creative skill, revision time and sales.
- **Bosnian / Balkan market adjustment (inference, no source):** local SMB budgets are likely well below US guide figures. Selling to EU, diaspora or US clients remotely, or through Upwork or Fiverr, is the way to reach the higher tiers.

### Gaps
- No Reddit or X practitioner threads with real invoices could be retrieved; the search returned marketplace pages instead.
- No category-specific price data was found for **real estate, tourism or restaurant** AI promos beyond the generic "retail/restaurant $350–$500" line.
- Upwork rate data for AI video specialists was not extracted. The Upwork hire page appeared ([Upwork](https://www.upwork.com/hire/ai-generated-video-specialists/)) but no figures were captured.
- No Balkan or CEE-specific pricing data was found.

---

## 4. Real case studies: brand AI ads, AI studios, competitions with prize money

### Takeaway
The best-known cost data point is **Kalshi's Veo 3 ad** aired during the 2025 NBA Finals: about $2,000 and 2–3 days of work by PJ Accetturo, with 300–400 generations for 15 usable clips. Big brands (Coca-Cola 2025, Svedka at Super Bowl LX 2026) use AI studios like Silverside and Secret Level and face consumer backlash. Prize money is substantial: Higgsfield's $1M film festival, Runway AIF 2026 with $10K plus 500K credits per track, and Chroma Awards with $175K+ cash per season.

### Cited Findings

**Brand ads**
- **Kalshi (June 2025, NBA Finals):**
  - Made with Google Veo 3 by filmmaker **PJ Accetturo** for about **$2,000** in **2–3 days**. He claimed a "95% cost reduction vs traditional ads".
  - It needed "300–400 generations to get 15 usable clips". Workflow: script, then Gemini to write the Veo prompts, then Veo 3, then an edit in CapCut or Premiere.
  - The spot shows surreal scenes promoting Kalshi markets (NBA Finals, hurricanes, egg prices). Search summaries describe it as a 15-second spot; verify the length.
  - The $2,000 figure comes from press reports, not an audited budget.

  [CO/AI](https://getcoai.com/news/kalshis-nba-finals-ad-costs-just-2k-using-googles-ai-video-tool/); [Public Gaming](https://www.publicgaming.com/news-categories/advertising/14510-heres-the-2-000-fully-ai-generated-ad-that-aired-during-the-nba-finals); [3DVF](https://3dvf.com/en/this-2000-ai-ad-aired-during-the-nba-finals-astonishes-everyone)
- **Coca-Cola "Holidays Are Coming" (Nov 2025):**
  - Made by AI studios **Silverside** and **Secret Level**. The budget was not disclosed.
  - The CMO said production that used to start a year ahead now takes "around a month". Reports cite more than **70,000 video fragments**. Headcount reports conflict: "five people" vs about 100 people including 5 gen-AI specialists.
  - Viewers criticized inconsistent truck designs (extra wheels). Coca-Cola's head of gen AI said the craftsmanship was "ten times better" than in 2024.

  [NBC Bay Area](https://www.nbcbayarea.com/news/national-international/coca-cola-ai-generated-holiday-ad-backlash/3975523/); [The Decoder](https://the-decoder.com/coca-cola-once-again-turns-to-ai-for-its-global-holidays-are-coming-christmas-campaign/); [RetailBoss](https://retailboss.co/coca-colas-ai-generated-holiday-campaign-and-the-backlash-that-went-viral); [PetaPixel](https://petapixel.com/2025/11/03/generative-ai-is-here-to-ruin-christmas/)
- **Super Bowl LX (Feb 2026):**
  - **Svedka "Shake Your Bots Off"** was billed as the first "primarily" AI-generated national Super Bowl spot. It was made with Silverside and took about 4 months to rebuild the Fembot character. The storyline was human-written. Reception was mixed and YouTube comments were disabled.
  - **Artlist** said it made its own 30 s Super Bowl spot in **5 days for "a few thousand dollars"** (company claim).
  - Pepsi Zero Sugar, Amazon Alexa+ (an AI bear) and Manscaped also used AI in their spots.

  [Semafor](https://www.semafor.com/article/02/04/2026/first-entirely-ai-generated-ad-hits-the-super-bowl); [TechCrunch](https://techcrunch.com/2026/02/08/super-bowl-60-ai-ads-svedka-anthropic-brands-commercials/); [The Drum](https://www.thedrum.com/news/ai-moves-to-center-stage-at-super-bowl-lx); [Artlist blog](https://artlist.io/blog/super-bowl-2026-ai-ads/)
- **Toys"R"Us (June 2024)**: a brand film made with OpenAI Sora by agency **Native Foreign**, premiered at Cannes Lions 2024. It was not purely AI: about a dozen people applied "corrective VFX" — [Tech Times](https://www.techtimes.com/articles/306053/20240626/toys-r-us-comeback-iconic-retail-chain-uses-openai-sora-brand-film)
- **Higgsfield's own case study**: a brand launched with the Supercomputer agent reached 500K views and 833 waitlist sign-ups with no paid ads (company claim) — [Higgsfield blog](https://higgsfield.ai/blog/make-many-with-ai)
- **Agency spend**: one agency spends $3K–$50K a month on Higgsfield credits producing social variants for clients — [Inc.](https://www.inc.com/lisa-bonos/how-higgsfield-became-one-of-the-fastest-growing-ai-video-platforms-for-creators-and-startups/91397929)

**Competitions and prize money**
- **Runway AI Festival 2026** (expanded beyond film): official terms list five tracks (New Media, Fashion, Gaming, Advertising, Design), each with **$10,000 cash plus 500,000 Runway credits** for first place, a total ARV of $75,000. Winners were due around 30 Apr 2026. Deadline (Jan 2026) instead reported $15,000 for the first-place filmmaker and $10,000 for other category winners. An older edition's terms list $50,000 plus 1M credits for first place in film. Runway also runs **Gen:48**, a 48-hour film challenge — [Runway AIF terms](https://aif.runwayml.com/terms); [Deadline](https://deadline.com/2026/01/runway-ai-festival-adding-new-categories-1236700233/); [Runway Gen:48](https://runway.com/gen48); [AIF film terms](https://aif.runwayml.com/terms-film)
- **Chroma Awards**: Season 1 had **$175K** in cash prizes, 6,500 submissions and 13 film categories, with winners screened in London. Season 2 is free to enter and **open until 31 Dec 2026**, with **$175K+ cash and $1M+ in tool credits** across about 25 categories. A partner page says more than $250K — [Chroma Awards on X](https://x.com/chromaawards); [Wonder Studios](https://wonderstudios.com/blog/chroma-awards-london-ai-film-screening); [AI Film Contests guide](https://aifilmcontests.com/guide/best-ai-film-festivals-for-beginners); [Warsaw Glitch](https://warsawglitch.com/press/partner-chroma-awards)
- **Higgsfield contests**: Global Film Festival ($1M pool), App Contest ($100K), Adathon ($85K in credits, with first place getting $50K credits and a Brandweek trip), Discord (200K credits) — [Higgsfield GFF](https://higgsfield.ai/global-film-festival); [Higgsfield contests](https://higgsfield.ai/contests); [Adathon](https://higgsfield.ai/contests/adathon)
- An index of open AI film festivals and calls: [Kajimelo submission index](https://www.kajimelo.com/ai-film-festivals)

### Inferences
- The Kalshi case is the template for selling to SMBs: a strong comedic concept, very cheap production and a fast turnaround. The lesson for pricing is that the client paid for **concept, taste and speed**, not compute.
- Contests such as **Chroma Season 2** (open until 31 Dec 2026), Runway's annual AIF and Higgsfield's recurring contests are realistic ways for a beginner in Bosnia to win prizes or credits and build a portfolio.

### Gaps
- AI film studios' revenue (e.g., Promise, Asteria, Wonder Studios) and AI-generated series deals were not researched (search budget exhausted).
- The economics of YouTube AI-trailer and AI-film channels, including YouTube's 2025 demonetization of fake-trailer channels, were not researched.
- Names of the Runway AIF 2026 winners were not found.
- AI-made music videos with known budgets were not found.

---

## 5. Workflow, time per 30 s ad, and tool cost per finished video

### Takeaway
The standard pipeline is: script/concept, then LLM-written shot prompts, then keyframes (Nano Banana, Midjourney, Soul, FLUX), then image-to-video (Kling, Veo, Seedance) or text-to-video, then voice (ElevenLabs) and music (Suno), then an edit (CapCut or Resolve), upscaling (Topaz) and delivery. Documented timelines run from **2–3 days** (Kalshi) and **5 days** (Artlist Super Bowl spot) to **about 1 month** for a Coca-Cola-scale campaign. Re-roll ratios of about 20–27 generations per usable clip are what drive tool cost.

### Cited Findings
- Kalshi workflow: script, then Gemini-generated prompts, then Veo 3 generations (300–400 for 15 usable clips), then an edit in CapCut or Premiere, in 2–3 days — [CO/AI](https://getcoai.com/news/kalshis-nba-finals-ad-costs-just-2k-using-googles-ai-video-tool/)
- Artlist produced a 30 s Super Bowl spot in 5 days for a few thousand dollars (company claim) — [Artlist blog](https://artlist.io/blog/super-bowl-2026-ai-ads/)
- Coca-Cola went from about a year of lead time to "around a month", with more than 70,000 video fragments generated — [The Decoder](https://the-decoder.com/coca-cola-once-again-turns-to-ai-for-its-global-holidays-are-coming-christmas-campaign/); [RetailBoss](https://retailboss.co/coca-colas-ai-generated-holiday-campaign-and-the-backlash-that-went-viral)
- UGC Factory production flow: base image or clip, then voiceover audio, then a lipsync model — [Tadka UGC explainer](https://tadkai.io/resources/higgsfield-ugc-ads-explained-2026)
- Fiverr sellers commonly promise 24–48 h delivery for 30–60 s AI videos — [Fluxnote](https://fluxnote.io/guides/sell-ai-video-services-fiverr); [Fiverr AI commercials](https://www.fiverr.com/gigs/ai-commercials)
- Unit costs to plug in (all from section 2):

  | Item | Unit cost | Source |
  |---|---|---|
  | Veo 3.1 Fast | 20 credits (10 on Ultra) | [SaaSCRMReview](https://saascrmreview.com/google-flow-pricing/) |
  | Veo 3.1 Quality | 100 credits | [SaaSCRMReview](https://saascrmreview.com/google-flow-pricing/) |
  | Kling 3.0, 5 s 1080p | 40 credits (60 with audio) | [Shhots](https://shhots.ai/blog/kling-ai-pricing/) |
  | Runway Gen-4.5 | 12 credits/s | [Runway](https://runway.com/pricing) |
  | Higgsfield premium models | 40–70 credits per generation | [Krea](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs) |
  | Higgsfield Genjutsu, 15 s at 1080p | 144 credits | [Kavel.ai](https://www.kavel.ai/blog/higgsfield-genjutsu-price-guide) |
  | Nano Banana 2 image, 1K | $0.067 | [Myarchitectai](https://www.myarchitectai.com/blog/nano-banana-api-pricing) |

- Failed or re-rolled generations still consume credits on Luma and Higgsfield Genjutsu — [eesel ES](https://www.eesel.ai/es/blog/precios-luma-ai); [Kavel.ai](https://www.kavel.ai/blog/higgsfield-genjutsu-price-guide)

### Inferences (worked cost estimates; assumptions stated)
- **Assumption:** a 30 s ad has about 8 shots. Starting from approved stills (image-to-video) should need far fewer re-rolls than Kalshi's pure text-to-video ratio of about 25:1. Assume about 10 generations per shot, so about 80 video generations plus about 40 keyframe images.
  - **Google AI Ultra ($99.99, 10,000 credits):** draft 80 generations in Veo 3.1 Fast at 10 credits = 800 credits, then render 8 finals in Quality at 100 = 800 credits. That is 1,600 credits, about **$16 of subscription value**.
  - **Kling Pro ($32.56, 3,000 credits):** 80 × 40 credits = 3,200 credits, about **one month's plan (~$35)**.
  - **Higgsfield Ultra ($129, 3,000 credits, ≈$0.043/credit):** 80 × 55 credits (midpoint of 40–70) = 4,400 credits, about **$190**. That exceeds one month, so use cheaper drafting models.
  - **Add-ons:** keyframes ~40 × $0.07 ≈ **$3**; voiceover (ElevenLabs Starter) **$5–6**; music (Suno Pro) **$10**; edit in Resolve free or CapCut Pro **$0–20**; upscale with Topaz Astra (about $39/mo, if needed).
  - **Result:** roughly **$40–$250 in tool cost per finished 30 s ad**, depending on the model mix. At $300–$800 client prices, margins are high.
- **Kalshi-style pure text-to-video at 300–400 generations:** on Higgsfield at 55 credits that would be 16,500–22,000 credits (about $700–$950), which is consistent with the reported ~$2,000 all-in budget.
- **Time:** a solo practitioner who already has templates can probably deliver a 15–30 s SMB ad in **1–3 working days**, including one revision round. Fiverr sellers advertise 24–48 h for simpler UGC formats.

### Gaps
- No systematic survey of practitioner hours per finished minute was found. The figures above are extrapolated from a few case studies.
- Exact clip durations per generation (e.g., Veo 3.1 8 s, Kling 5/10 s) were not verified in this session.

---

## 6. What sells to SMBs vs brands/agencies; limitations (consistency, hands, text, legal/IP, platform AI-labeling)

### Takeaway
SMBs buy **cheap, fast, high-volume** content: UGC-style avatar ads, product promos, monthly social packs and localized voiceovers, usually at $50–$800 per asset. Brands and agencies buy **concept-led cinematic spots** and **volume variant production**, and they spend from thousands to tens of thousands of dollars a month (Higgsfield agencies spend $3K–$50K a month on credits alone). The main risks are visual inconsistency (Coca-Cola's trucks; hands and heads in fast motion), likeness and commercial-rights gaps, music licensing (Udio, Suno download caps), consumer backlash, and platform AI-disclosure rules (Meta and TikTok auto-label C2PA content; TikTok requires disclosure in Ads Manager).

### Cited Findings

**What sells**
- About 70% of Higgsfield's revenue comes from agencies, and Higgsfield's business revenue now exceeds consumer revenue — [SaaStr](https://www.saastr.com/500m-arr-60-engineers-cash-flow-positive-how-higgsfield-actually-runs-with-ceo-alex-mashrabov/); [The Next Web](https://thenextweb.com/news/higgsfield-series-b-400m-5-4bn-valuation-700m-revenue)
- Agencies generate hundreds of model and setting permutations for clients' social media — [Inc.](https://www.inc.com/lisa-bonos/how-higgsfield-became-one-of-the-fastest-growing-ai-video-platforms-for-creators-and-startups/91397929)
- Higgsfield pitches freelance brand promos to small businesses that can't afford studio production, plus micro-agencies and daily-post management — [Higgsfield side-hustle blog](https://higgsfield.ai/blog/uVZgCaZTenC8R7iXtQr8R)
- Retail and restaurant clients pay about $350–$500 per video, B2B $700–$1,500. Low-end ad creatives sell at $50–$150 in bundles of 5–10 variations for testing — [Wireflow](https://www.wireflow.ai/blog/how-much-to-charge-clients-for-ai-ugc-ads); [inReels](https://www.inreels.ai/blog/how-much-do-ai-video-ads-cost-2026)
- AI makes the "cost-to-test" (many ad variants) the selling point for performance marketers — [Novoads: video ad production cost](https://novoads.ai/en/blog/video-ad-production-cost)

**Limitations and quality issues**
- Visual consistency: Coca-Cola's 2025 ad showed trucks with extra wheels and misplaced axles — [RetailBoss](https://retailboss.co/coca-colas-ai-generated-holiday-campaign-and-the-backlash-that-went-viral)
- Genjutsu: hands and heads lose sharpness in rapid movement — [AIChief](https://aichief.com/ai-video-tools/higgsfield-genjutsu/)
- Kalshi's re-roll ratio of about 20–27:1 shows how much output is unusable — [CO/AI](https://getcoai.com/news/kalshis-nba-finals-ad-costs-just-2k-using-googles-ai-video-tool/)
- Higgsfield has no batch or variant engine, and reviewers say it does not guarantee commercial rights for realistic human likenesses in all UGC scenarios — [Tadka](https://tadkai.io/resources/higgsfield-ads-review-2026)
- Toys"R"Us needed about a dozen people doing corrective VFX on top of Sora output — [Tech Times](https://www.techtimes.com/articles/306053/20240626/toys-r-us-comeback-iconic-retail-chain-uses-openai-sora-brand-film)
- **Backlash risk**: Coca-Cola was called "disgusting" and "AI slop". Svedka disabled YouTube comments on its spot — [The Star](https://www.thestar.co.uk/whats-on/coca-cola-ai-christmas-advert-reaction-5388319); [TechCrunch](https://techcrunch.com/2026/02/08/super-bowl-60-ai-ads-svedka-anthropic-brands-commercials/)
- **Vendor risk**: Sora was shut down within about six months of its app launch, so a workflow that depends on one model can break suddenly — [AlternativeTo](https://alternativeto.net/news/2026/3/openai-is-shutting-down-sora-its-ai-video-slop-app-less-than-six-months-after-launch); [eWeek](https://www.eweek.com/news/openai-shuts-down-sora-ai-video-platform/)

**Legal / IP / licensing**
- Free tiers generally exclude commercial use: Kling Basic, Pika free, Suno free, ElevenLabs free and Higgsfield free. Krea needs Basic or higher. Midjourney requires Pro or Mega for companies with more than $1M revenue — [Lorphic Kling](https://lorphic.com/kling-ai-pricing-full-breakdown/); [Hooked Pika](https://www.hooked.so/compare/pika-pricing); [Terms.law Suno](https://terms.law/ai-output-rights/suno/); [Costbench Krea](https://costbench.com/software/ai-image-generators/krea/); [eesel Midjourney](https://eesel.ai/blog/midjourney-pricing)
- Suno commercial rights cover only songs made while subscribed, and a reported Sept 2026 cap limits commercial downloads to 20/mo (Pro) or 60/mo (Premier). Udio downloads are disabled. Sony's label litigation is ongoing — [Dynamoi](https://dynamoi.com/learn/ai-music-distribution/suno-commercial-rights-explained); [Dynamoi lawsuit timeline](https://dynamoi.com/learn/ai-music-distribution/ai-music-copyright-cases-timeline)
- FLUX.2 klein 9B is non-commercial, while klein 4B is Apache 2.0 — [Invideo](https://invideo.io/blog/flux-ai-image-generator/)

**Platform AI-labeling rules for ads (mostly vendor-blog sources; verify against official policies)**
- **Meta** reads C2PA and IPTC metadata and auto-labels AI content. Ad labels appear in "About this ad", and the advertiser is responsible. Sources disagree on whether routine AI UGC product ads need a label, since the label targets significant generative modification — [Billo](https://billo.app/blog/ai-labeling/); [Cinerads](https://www.cinerads.com/blog/ai-ad-disclosure-requirements); [Novoads](https://novoads.ai/en/blog/labeling-ai-generated-ads)
- **TikTok** is the strictest. It requires labeling of all realistic AI images, audio and video. Its AIGC label has been integrated with C2PA Content Credentials since Jan 2025 and cannot be removed once applied. AI-generated or substantially modified ad elements must be disclosed in TikTok Ads Manager — [Billo](https://billo.app/blog/ai-labeling/); [Novoads 2026 rulebooks](https://novoads.ai/en/blog/ai-ad-label-rules-2026); [The Social Outline](https://thesocialoutline.com/blog/ai-ugc-disclosure-rules)
- **YouTube and Google**: YouTube has a mandatory altered/synthetic content checkbox in Creator Studio. Google Ads shows a "How this ad was made" panel in My Ad Center, and detection relies on SynthID for Google's own outputs — [82dash](https://blog.82dash.com/ai-ad-label-rules-meta-google-tiktok/); [Auditsocials](https://www.auditsocials.com/blog/cross-platform-ai-content-labeling-requirements-2026-meta-google-tiktok-youtube-comparison)
- Production-assist uses (AI captions, script drafts, colour grading, beauty filters) generally need no disclosure — [Frameos](https://frameos.studio/blog/ai-content-disclosure-labels)
- **EU AI Act Article 50** (transparency duties for deployers) is cited as the main EU reference. The FTC is said to expect separate disclosures for "ad" and "AI". Neither claim was verified against primary text — [Cinerads](https://www.cinerads.com/blog/ai-ad-disclosure-requirements)

### Inferences
- For Bosnia-based sellers, the most realistic early products are:
  1. **Local-language (Bosnian, Croatian, Serbian) voiced promo and UGC ads** for local SMBs (restaurants, tourism, real estate, clinics), using ElevenLabs v3 support.
  2. **Remote performance-ad variant packs** for EU or US e-commerce through Fiverr or Upwork.
  3. **Cinematic tourism and real-estate promos** that mix real drone or phone footage with AI shots, using Genjutsu or Object Swap on client footage.
  4. **Contest entries** to build a portfolio.
- Clients serving EU audiences should be told about AI disclosure (EU AI Act Art. 50, plus Meta and TikTok labels) and should be given a rights summary: which tool and plan was used, music licence terms, and no real-person likenesses without consent.

### Gaps
- Official Meta, TikTok and Google ad-policy pages were not retrieved. All labeling details come from secondary blogs.
- Bosnia & Herzegovina-specific advertising and AI regulation (BiH is not in the EU; candidate status alignment) was not researched.
- Text rendering accuracy, and specifically Bosnian/Croatian/Serbian diacritics (č, ć, š, ž, đ) in on-screen video text from current models, was not tested or sourced. The recommendation is to add on-screen text in the editor.
