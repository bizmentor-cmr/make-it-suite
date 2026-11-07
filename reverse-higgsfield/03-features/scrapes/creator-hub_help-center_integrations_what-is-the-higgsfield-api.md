[Higgsfield](https://higgsfield.ai/)

- [Explore](https://higgsfield.ai/)
- [Image](https://higgsfield.ai/ai/image?model=gpt_image_2)
- [Video](https://higgsfield.ai/ai/video)
- [Audio](https://higgsfield.ai/audio)
- [MCP](https://higgsfield.ai/mcp)
- [API](https://console.higgsfield.ai/)
- [GenjutsuNew](https://higgsfield.ai/ai/video?model=genjutsu)
- [Content FactoryNew](https://higgsfield.ai/content-factory)
- [PlayableNew](https://higgsfield.ai/playable)
- [AI Influencer](https://higgsfield.ai/ai-influencer-studio)
- [AcademyNew](https://higgsfield.ai/academy)
- [Katana](https://higgsfield.ai/katana)
- [ChatGPT Plugin](https://higgsfield.ai/mcp?tab=chatgpt)
- [Ads Studio](https://higgsfield.ai/ads-studio)
- [Effects](https://higgsfield.ai/effects/use)
- [Cinema Studio](https://higgsfield.ai/generate)
- [ContestsContests](https://higgsfield.ai/community/contests)
- [Marketing Studio](https://higgsfield.ai/marketing-studio)
- [Supercomputer](https://higgsfield.ai/supercomputer)
- [Edit](https://higgsfield.ai/layers)
- [Community](https://higgsfield.ai/community)
- [Plugins](https://higgsfield.ai/plugins/after-effects)
- [Canvas](https://higgsfield.ai/canvas)
- [Originals](https://higgsfield.ai/original-series)

[Higgsfield on Instagram](https://www.instagram.com/higgsfield.ai)[Pricing30% OFF](https://higgsfield.ai/pricing "View Higgsfield AI pricing plans and subscription options") [Enterprise](https://higgsfield.ai/enterprise)

LoginSign up

[Creator Hub](https://higgsfield.ai/creator-hub/help-center)

Sign Up

[Creator Hub](https://higgsfield.ai/creator-hub/help-center) [Help center](https://higgsfield.ai/creator-hub/help-center) [Blog](https://higgsfield.ai/blog) [Changelog](https://higgsfield.ai/creator-hub/changelog) [Customer Stories](https://higgsfield.ai/creator-hub/case-studies)Search Creator Hub

On this page

1. [How is the API different from my Higgsfield plan?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#how-is-the-api-different-from-my-higgsfield-plan)
2. [Which models are available through the API?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#which-models-are-available-through-the-api)
3. [How do I get started?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#how-do-i-get-started)
4. [How is API usage billed?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#how-is-api-usage-billed)
5. [How does generation work?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#how-does-generation-work)
6. [How long are generated files stored?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#how-long-are-generated-files-stored)
7. [Where do I see my API spending?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#where-do-i-see-my-api-spending)
8. [How is the API different from MCP and CLI?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api#how-is-the-api-different-from-mcp-and-cli)

1. [Help center](https://higgsfield.ai/creator-hub/help-center)
2. /
3. [Integrations](https://higgsfield.ai/creator-hub/help-center/integrations)
4. /
5. What is the Higgsfield API, and how do I get started?

[Back](https://higgsfield.ai/creator-hub/help-center)

Copy page

# What is the Higgsfield API, and how do I get started?

Copy page

HiggsfieldSep 16, 20264 min

The Higgsfield API lets you generate video and images from your own code: one API key opens every model in the API catalog, and each request is paid in US dollars from a prepaid balance. No plan or subscription is involved: fund the balance, send requests at the rates listed in the catalog, and new requests simply wait once the balance hits zero.

## How is the API different from my Higgsfield plan?

A subscription on [higgsfield.ai](http://higgsfield.ai/) and the API are two separate products with separate billing. Your plan, credits, and Unlimited access exist only on the website; the API runs on its own account balance in US dollars.

| Criteria | Higgsfield plan ( [higgsfield.ai](https://higgsfield.ai/)) | Higgsfield API |
| --- | --- | --- |
| Who it's for | Creators working in the visual interface | Developers building generation into their own products |
| Billing | Subscription plus credits | US dollar balance, pay per generation |
| Unlimited models | Yes, where included in plan | Not applicable |
| Requires the other | No | No |

How is the API different from my Higgsfield plan?

## Which models are available through the API?

One API key unlocks every model in the API catalog: 50+ current video and image models, including Seedance, Kling, Wan, MiniMax, PixVerse, LTX, and Grok for video and Ideogram, Recraft, and Qwen for images, alongside Higgsfield's own Soul 2, Soul Cinema, DoP, and Marketing Studio Image. The API has its own curated catalog, and the selection may differ from the model lineup on [higgsfield.ai](http://higgsfield.ai/).

Every model has its own catalog page listing the current rate, supported resolutions and durations, sample code, a short overview, and a side-by-side table of similar models, so picking the right model doesn't require testing each one in code.

## How do I get started?

1. Sign up for an API account, either as an individual or as a company.
2. Register a payment method and fund your balance.
3. Generate an API key in the console at [open.higgsfield.ai](http://open.higgsfield.ai/). For security, the full key appears only once, so save it right away. Creating a key unlocks 20 concurrent requests.
4. Connect through the Python or TypeScript SDK, or call the REST API directly from any language with an HTTP client, sending requests to [api.higgsfield.ai](http://api.higgsfield.ai/). Each model page carries sample code, and if you work through a coding agent, ready setup prompts for Claude Code, Cursor, and ChatGPT (Codex).

Full reference documentation, quickstart guides, and code examples are available at [docs.higgsfield.ai](https://docs.higgsfield.ai/docs).

## How is API usage billed?

Billing is pay-as-you-go from a US dollar balance, and the minimum top-up is $5. Video models are priced per second of output and image models per image; DoP is the exception, priced per generation. Each model has a fixed rate for every configuration: the rate depends on settings like resolution and audio, is listed publicly, and stays the same regardless of how much you top up. An estimate endpoint returns the cost of a request before you run it. Funds expire one year after they are added to the balance. The balance can't go below zero: once it's empty, new requests wait until you add funds, or you can turn on auto top-up so production traffic never stops.

You're only charged for generations that finish successfully. If a request fails, its cost returns to your balance automatically.

## How does generation work?

Generation is asynchronous. You submit a request and receive a request ID, then track progress by polling the status or by receiving a webhook when the result is ready. Once the generation completes, you download the output file.

## How long are generated files stored?

Generated output files stay available for at least 7 days after creation and may be removed from Higgsfield servers after that period. For long-term retention, download completed files to your own storage as part of your integration.

## Where do I see my API spending?

Everything lives in the console at [open.higgsfield.ai](http://open.higgsfield.ai/). Analytics shows spend and request volume over time and exports to CSV for reporting; Billing holds your current balance, payment methods, and invoice history.

## How is the API different from MCP and CLI?

MCP and CLI are agent connections: they attach Claude, Cursor, or another agent to your existing [higgsfield.ai](http://higgsfield.ai/) account, and everything they generate deducts your plan credits. The API doesn't touch your account or credits at all: it runs on its own key and dollar balance, and it's built for shipping generation inside your own product.

| Criteria | API | MCP and CLI |
| --- | --- | --- |
| Account | Separate API account | Your higgsfield.ai account |
| Billing | US dollars per generation | Plan credits |
| API key | Yes | No |
| Best for | Building generation into your own product | Generating from an AI agent |

How is the API different from MCP and CLI?

See [What is Higgsfield MCP, and how is it different from the web?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp) and [How do I access Higgsfield via CLI?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli)

## Got any questions left?

Is Open Higgsfield a different product?

No. Open Higgsfield is the name of the API console at [open.higgsfield.ai](http://open.higgsfield.ai/). The product, the catalog, and the billing are the same Higgsfield API.

Can I use the API without a Higgsfield plan?

Yes. The API works entirely on its own dollar balance. Having or not having a plan on [higgsfield.ai](https://higgsfield.ai/) changes nothing about API access or rates.

Can I use content generated through the API commercially?

Yes. Under the Higgsfield [Terms of Use](https://higgsfield.ai/terms-of-use-agreement) you hold the rights to use your generated content, so API outputs can go into commercial products, advertising, and client work.

Can the API generate audio?

There are no standalone audio models in the catalog. Some video models, including Seedance, Kling, LTX, and PixVerse, generate native audio inside the clip as a configuration option, which affects the model's rate.

Can several people use one API account?

Yes. Every account starts as a personal organization, and you can create a team organization and invite people to it. To switch between workspaces, click your profile icon and open Organization. Usage across the account shows up in the Analytics and Billing sections.

I lost my API key. Can I see it again?

No. The key is visible only at the moment of creation. Generate a new key in the console and update your integration.

Do failed generations cost anything?

No. Failed requests aren't billed, and the amount is returned to your balance automatically.

Share Feedback

Was this article helpful?

YesNo

by Higgsfield

Share Feedback

Was this article helpful?

YesNo

[How do I access Higgsfield via CLI?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli) [How do I use Higgsfield Katana?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana)

## AI-native creative suite

### Create

- [AI Video](https://higgsfield.ai/ai-video)
- [AI Video Effects](https://higgsfield.ai/motion)
- [AI Image](https://higgsfield.ai/ai-image)
- [Edit Image](https://higgsfield.ai/layers?model=nano_banana_pro_inpaint)
- [Inpaint](https://higgsfield.ai/image-editing)
- [Upscale](https://higgsfield.ai/upscale)
- [Sora 2 Upscale](https://higgsfield.ai/sora-2-upscale)
- [Mixed Media](https://higgsfield.ai/mixed-media-intro)
- [AI Face Swap](https://higgsfield.ai/apps/face-swap)
- [AI Influencer](https://higgsfield.ai/ai-influencer)
- [Apps](https://higgsfield.ai/apps)

### Video Models

- [Seedance 2.5](https://higgsfield.ai/seedance/2.5)
- [Seedance 2.0](https://higgsfield.ai/seedance/2.0)
- [Kling 3.0](https://higgsfield.ai/kling-3.0)
- [Sora 2 Introduction](https://higgsfield.ai/sora-2)
- [Veo 3.1 Introduction](https://higgsfield.ai/veo3.1)
- [WAN 2.6](https://higgsfield.ai/wan-2.6)
- [Grok Imagine 1.5](https://higgsfield.ai/grok-imagine-1.5)
- [Gemini Omni Flash](https://higgsfield.ai/gemini-omni-flash)

### Image Models

- [Nano Banana](https://higgsfield.ai/nano-banana-intro)
- [Flux 2](https://higgsfield.ai/flux-2-intro)
- [Seedream 5](https://higgsfield.ai/seedream-5.0)
- [GPT Image 2](https://higgsfield.ai/gpt-2)
- [Ideogram 4.5](https://higgsfield.ai/ideogram-4-5-intro)

### Studios

- [Cinema Studio](https://higgsfield.ai/cinematic-video-generator)
- [Marketing Studio](https://higgsfield.ai/marketing-studio-intro)
- [Lipsync Studio](https://higgsfield.ai/lipsync-studio)
- [Higgsfield Popcorn](https://higgsfield.ai/storyboard-generator)
- [Higgsfield Canvas](https://higgsfield.ai/canvas-intro)

### Soul

- [Soul 2.0](https://higgsfield.ai/soul-intro)
- [Soul ID Character](https://higgsfield.ai/character)
- [Soul Cinema](https://higgsfield.ai/soul-cinema)

### Platform

- [Supercomputer](https://higgsfield.ai/supercomputer-intro)
- [AI Motion Designer](https://higgsfield.ai/ai-motion-designer)
- [MCP/CLI](https://higgsfield.ai/mcp)
- [API](https://higgsfield.ai/higgsfield-api)
- [Collab](https://higgsfield.ai/chat-intro)
- [Games](https://higgsfield.ai/games-intro)
- [Reference Extension](https://chromewebstore.google.com/detail/higgsfield-reference/oohmjaflbknghbidmaoonmchcodhmkgj)

### Resources

- [Blog](https://higgsfield.ai/blog)
- [Help Center](https://higgsfield.ai/creator-hub/help-center)
- [Academy](https://higgsfield.ai/academy)
- [Prompt Guide](https://higgsfield.ai/nano-banana-pro-prompt-guide)

### Company

- [About](https://higgsfield.ai/about)
- [Trust](https://higgsfield.ai/trust)
- [Report a vulnerability](https://bugcrowd.com/engagements/higgsfield-ai-vdp-pro)
- [Enterprise](https://higgsfield.ai/enterprise)
- [Team](https://higgsfield.ai/team-plan)
- [Pricing](https://higgsfield.ai/pricing)
- [Careers](https://jobs.ashbyhq.com/higgsfieldai)
- [Contact](https://higgsfield.ai/contact)

### Community

- [Community](https://higgsfield.ai/community)
- [Contests](https://higgsfield.ai/community/contests)
- [Creative Partners](https://higgsfield.ai/creator-partnership-program)

- [X / Twitter](https://x.com/higgsfield)
- [Youtube](https://www.youtube.com/@HiggsfieldAI)
- [LinkedIn](https://www.linkedin.com/company/higgsfield)
- [Tiktok](https://www.tiktok.com/@higgsfield.ai90)
- [Discord](https://discord.com/invite/higgsfield)

### Create

- [AI Video](https://higgsfield.ai/ai-video)
- [AI Video Effects](https://higgsfield.ai/motion)
- [AI Image](https://higgsfield.ai/ai-image)
- [Edit Image](https://higgsfield.ai/layers?model=nano_banana_pro_inpaint)
- [Inpaint](https://higgsfield.ai/image-editing)
- [Upscale](https://higgsfield.ai/upscale)
- [Sora 2 Upscale](https://higgsfield.ai/sora-2-upscale)
- [Mixed Media](https://higgsfield.ai/mixed-media-intro)
- [AI Face Swap](https://higgsfield.ai/apps/face-swap)
- [AI Influencer](https://higgsfield.ai/ai-influencer)
- [Apps](https://higgsfield.ai/apps)

### Video Models

- [Seedance 2.5](https://higgsfield.ai/seedance/2.5)
- [Seedance 2.0](https://higgsfield.ai/seedance/2.0)
- [Kling 3.0](https://higgsfield.ai/kling-3.0)
- [Sora 2 Introduction](https://higgsfield.ai/sora-2)
- [Veo 3.1 Introduction](https://higgsfield.ai/veo3.1)
- [WAN 2.6](https://higgsfield.ai/wan-2.6)
- [Grok Imagine 1.5](https://higgsfield.ai/grok-imagine-1.5)
- [Gemini Omni Flash](https://higgsfield.ai/gemini-omni-flash)

### Image Models

- [Nano Banana](https://higgsfield.ai/nano-banana-intro)
- [Flux 2](https://higgsfield.ai/flux-2-intro)
- [Seedream 5](https://higgsfield.ai/seedream-5.0)
- [GPT Image 2](https://higgsfield.ai/gpt-2)
- [Ideogram 4.5](https://higgsfield.ai/ideogram-4-5-intro)

### Studios

- [Cinema Studio](https://higgsfield.ai/cinematic-video-generator)
- [Marketing Studio](https://higgsfield.ai/marketing-studio-intro)
- [Lipsync Studio](https://higgsfield.ai/lipsync-studio)
- [Higgsfield Popcorn](https://higgsfield.ai/storyboard-generator)
- [Higgsfield Canvas](https://higgsfield.ai/canvas-intro)

### Soul

- [Soul 2.0](https://higgsfield.ai/soul-intro)
- [Soul ID Character](https://higgsfield.ai/character)
- [Soul Cinema](https://higgsfield.ai/soul-cinema)

### Platform

- [Supercomputer](https://higgsfield.ai/supercomputer-intro)
- [AI Motion Designer](https://higgsfield.ai/ai-motion-designer)
- [MCP/CLI](https://higgsfield.ai/mcp)
- [API](https://higgsfield.ai/higgsfield-api)
- [Collab](https://higgsfield.ai/chat-intro)
- [Games](https://higgsfield.ai/games-intro)
- [Reference Extension](https://chromewebstore.google.com/detail/higgsfield-reference/oohmjaflbknghbidmaoonmchcodhmkgj)

### Resources

- [Blog](https://higgsfield.ai/blog)
- [Help Center](https://higgsfield.ai/creator-hub/help-center)
- [Academy](https://higgsfield.ai/academy)
- [Prompt Guide](https://higgsfield.ai/nano-banana-pro-prompt-guide)

### Company

- [About](https://higgsfield.ai/about)
- [Trust](https://higgsfield.ai/trust)
- [Report a vulnerability](https://bugcrowd.com/engagements/higgsfield-ai-vdp-pro)
- [Enterprise](https://higgsfield.ai/enterprise)
- [Team](https://higgsfield.ai/team-plan)
- [Pricing](https://higgsfield.ai/pricing)
- [Careers](https://jobs.ashbyhq.com/higgsfieldai)
- [Contact](https://higgsfield.ai/contact)

### Community

- [Community](https://higgsfield.ai/community)
- [Contests](https://higgsfield.ai/community/contests)
- [Creative Partners](https://higgsfield.ai/creator-partnership-program)

535 Mission St, 14th floor, San Francisco, CA, 94105

- [X / Twitter](https://x.com/higgsfield)
- [Youtube](https://www.youtube.com/@HiggsfieldAI)
- [LinkedIn](https://www.linkedin.com/company/higgsfield)
- [Tiktok](https://www.tiktok.com/@higgsfield.ai90)
- [Discord](https://discord.com/invite/higgsfield)

© 2026 Higgsfield, Inc.All rights reserved.

- ![English flag](https://higgsfield.ai/country-flags/English.png)English

- [Help center](https://higgsfield.ai/creator-hub/help-center)
- [Cookie Notice](https://higgsfield.ai/cookie-notice)
- [Terms](https://higgsfield.ai/terms-of-use-agreement)
- [Privacy](https://higgsfield.ai/privacy-policy)
- [Report a vulnerability](https://bugcrowd.com/engagements/higgsfield-ai-vdp-pro)