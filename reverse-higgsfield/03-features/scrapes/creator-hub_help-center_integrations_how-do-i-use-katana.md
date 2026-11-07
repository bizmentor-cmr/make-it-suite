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

1. [What is Katana?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#what-is-katana)
2. [What do I need to start?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#what-do-i-need-to-start)
3. [How do I start an edit?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#how-do-i-start-an-edit)
4. [How do I upload files in Claude?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#how-do-i-upload-files-in-claude)
5. [How do I refine the result?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#how-do-i-refine-the-result)
6. [When should I use Katana?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#when-should-i-use-katana)
7. [What presets are in the library?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#what-presets-are-in-the-library)
8. [How many credits does Katana deduct?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana#how-many-credits-does-katana-deduct)

1. [Help center](https://higgsfield.ai/creator-hub/help-center)
2. /
3. [Integrations](https://higgsfield.ai/creator-hub/help-center/integrations)
4. /
5. How do I use Higgsfield Katana?

[Back](https://higgsfield.ai/creator-hub/help-center)

Copy page

# How do I use Higgsfield Katana?

Copy page

HiggsfieldOct 29, 20265 min

Katana is a Higgsfield skill for Claude that recreates a reference video edit with your own characters, products, or clothing. You give it a reference edit and up to 5 photos, and it rebuilds the video with your assets through the Higgsfield MCP connector, on the same account and the same credits as [higgsfield.ai](https://higgsfield.ai/). The result appears in the Claude chat and in your Assets.

## What is Katana?

Katana recreates an existing edit with new content. The reference guides the shot structure, pacing, and overall edit: the order of shots, their length, and the placement of cuts on the music. Your photos define who and what appears in those shots. Optional instructions cover details the model should pay attention to, such as the product shot that matters most or an element that should stay unchanged.

Katana runs on Higgsfield models inside Claude, so it requires an active paid Higgsfield plan and the Higgsfield connector set up in Claude. No API key is needed. The connection steps for Claude and other agents are covered in a separate guide. See [How do I connect Higgsfield to Claude, ChatGPT, or another AI agent?](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent)

## What do I need to start?

A Katana edit takes three inputs:

- A reference edit. A video you upload or a preset from the Katana library. Use a reference that you own or have permission to use, including any music, footage, characters, logos, or other protected material in it.
- Up to 5 photos. The characters, products, or clothing that should appear in the edit.
- Instructions (optional). Anything the model should keep, change, or pay attention to.

## How do I start an edit?

There are two entry points, and both lead to the same Claude chat.

From the Katana page. The form on [higgsfield.ai/katana](https://higgsfield.ai/katana) has fields for the reference video, your characters, and optional instructions. Send & Generate in Claude passes the brief to a Claude chat. The page also holds the preset library and an Install Higgsfield in Claude button for first-time setup.

From Claude directly. With the Higgsfield connector active, three forms of request work:

- `/katana` opens the preset catalog in the chat.
- `/katana/<preset-name>` runs a specific preset.
- A plain request, for example “make me an edit of this product using Higgsfield”, starts Katana without a command.

Katana reads the files sent with the request: a video can be the reference to rebuild or the footage to edit, and photos define who appears in the result.

## How do I upload files in Claude?

Katana works with files stored in your Higgsfield account. When a file is needed, Katana opens a Higgsfield upload window inside the conversation, and the file you select there uploads to your account. A direct link to a media file also works.

## How do I refine the result?

Send follow-up messages in the same Claude chat: ask to change a shot, swap a photo, or adjust a detail. Only the affected shots are regenerated, and each iteration starts from the previous result. A second version with a different character or product is another message in the same conversation. Some generations may be declined by moderation.

By default, the output video follows the reference: duration, aspect ratio, and frame rate come from the reference video. To change them, say so in the request. Every result appears in a widget in the chat with a preview and a download button and is saved to Assets on [higgsfield.ai](http://higgsfield.ai/).

## When should I use Katana?

Katana fits when the edit already exists somewhere: a product video in a proven format, a fashion edit with a specific rhythm, an aura-farming clip. When the task is reproducing a known structure with new characters or products, Katana turns it into a chat exchange.

## What presets are in the library?

A preset is a reference edit that has already been prepared: its motion, its style, and a prompt that describes how to place new assets into it. The library is available on the Katana page and in Claude and is organized along two axes: by category (Personalized edits, Style transfer, Motion transfer) and by source (Higgsfield, Community).

Personalized edits place your characters or products into a finished edit. Style transfer carries the look of the reference onto your material. Motion transfer carries its movement. The library changes as presets are added, so the set on the page may differ from this article.

You can publish your own preset from the Katana page. A shared preset requires a 3 to 30 second video for the motion, up to 40 images, and a prompt that mentions them with @. Shared presets go live right away and can be taken down after reports.

## How many credits does Katana deduct?

Katana deducts the credits of your existing Higgsfield plan, at the same prices as on [higgsfield.ai](https://higgsfield.ai/). Before each generation, Claude shows a card with the exact credit cost, so the price is visible before you confirm. Credits are deducted for generations: a fix that needs a new generation costs credits like any other generation, and a fix in the edit itself, such as timing or a cut, is free.

Unlimited plans don’t change this: unlimited access applies only to generations made on [higgsfield.ai](https://higgsfield.ai/), and Katana runs through MCP.

## Got any questions left?

Do I need an API key to use Katana?

No. Katana works through the Higgsfield connector in Claude, which connects through your Higgsfield account sign-in.

Can I use Katana on a free account?

Katana requires an active paid Higgsfield plan.

Where do my Katana videos save?

Every result appears in the Claude chat with a preview and a download button and is saved to Assets on [higgsfield.ai](http://higgsfield.ai/).

Does Katana work in ChatGPT?

Katana is available in Claude. The Katana page on [higgsfield.ai/katana](https://higgsfield.ai/katana) sends the brief to a Claude chat.

Can I set the duration or aspect ratio of the result?

By default they follow the reference video. To change the duration or aspect ratio, set them in the request.

Why was my generation declined?

Some generations are declined by moderation, including checks for protected material. Credits for declined generations are returned automatically for most models. See [Why was my content flagged as NSFW, and what can I do if it was wrong?](https://higgsfield.ai/creator-hub/help-center/troubleshooting/content-flagged-as-nsfw)

Can I share my own preset?

Yes, from the Katana page: upload a 3 to 30 second video for the motion, up to 40 images, and a prompt that mentions them with @. The preset goes live immediately and can be taken down after reports.

Share Feedback

Was this article helpful?

YesNo

by Higgsfield

Share Feedback

Was this article helpful?

YesNo

[What is the Higgsfield API, and how do I get started?](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api)

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