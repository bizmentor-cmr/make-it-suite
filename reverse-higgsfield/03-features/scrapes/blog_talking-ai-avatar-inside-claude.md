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

01. [What Is an AI Avatar?](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#what-is-an-ai-avatar)
02. [What Is Higgsfield MCP in Claude?](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#what-is-higgsfield-mcp-in-claude)
03. [Can Claude Make a Talking AI Avatar?](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#can-claude-make-a-talking-ai-avatar)
04. [How Does the Avatar Pipeline Work on Higgsfield?](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#how-does-the-avatar-pipeline-work-on-higgsfield)
05. [Step-by-Step: From a Fictional Character to a Series of Talking Clips](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-by-step-from-a-fictional-character-to-a-series-of-talking-clips)
06. [Step 1: Create the character](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-1-create-the-character)
07. [Step 2: Train the identity](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-2-train-the-identity)
08. [Step 3: Generate the start frame](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-3-generate-the-start-frame)
09. [Step 4: Choose a voice for your AI avatar](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-4-choose-a-voice-for-your-ai-avatar)
10. [Step 5: Generate the avatar's speech](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-5-generate-the-avatars-speech)
11. [Step 6: Render the talking clip](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-6-render-the-talking-clip)
12. [Step 7: Reuse the same avatar across multiple videos](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#step-7-reuse-the-same-avatar-across-multiple-videos)
13. [What Does This Cost in Credits?](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#what-does-this-cost-in-credits)
14. [A Few Things Worth Knowing Before You Run This](https://higgsfield.ai/blog/talking-ai-avatar-inside-claude#a-few-things-worth-knowing-before-you-run-this)

1. [Blog](https://higgsfield.ai/blog)
2. /
3. [Guides](https://higgsfield.ai/blog/guides)
4. /
5. Talking AI Avatar in Claude

[Back](https://higgsfield.ai/blog)

# How To Create a Talking AI Avatar in Claude with Higgsfield MCP (Full Workflow + Prompts)

HiggsfieldAug 12, 20269 min

![](https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=1920,quality=85/https://cdn.sanity.io/images/s479xw3z/production/f82351ef66a3884e073c8844f6f2aed315fe0ae1-1280x720.jpg)

To create a talking AI avatar in Claude with Higgsfield MCP, you need four parts: a character, a trained identity, a reusable voice, and a video model that syncs the performance to the audio. This walkthrough builds all four for one fictional presenter, then reuses the same identity and voice across four talking clips, prompts included.

## What Is an AI Avatar?

An AI avatar is a digital presenter with a consistent face that reads any typed script in a synthetic voice, with mouth movement matched to the words. The format carries social clips, product explainers, training modules and localized versions of one message for a simple reason: the presenter is generated. A changed script means a new render, not a new shoot, and the same face can front any number of clips without a camera involved.

## What Is Higgsfield MCP in Claude?

Higgsfield MCP is a connector that gives Claude direct access to Higgsfield's generation tools: image and video models, Soul characters, and audio. Setup takes a few minutes and needs no API key or code: you add the connector, sign in to your Higgsfield account, and from that point generations run from the conversation itself. Higgsfield is an AI-native creative suite, so the connector covers the whole toolset, the character system included. If you haven't connected it yet, [the one-time setup is covered here](https://higgsfield.ai/blog/Generate-AI-Videos-From-Claude-with-Higgsfield-MCP). This breakdown picks up from the point where the connection already exists.

## Can Claude Make a Talking AI Avatar?

Claude connected to Higgsfield through MCP can build a talking avatar end to end, in one conversation: the character, the voice, the speech and the finished clips. Claude itself has no generation engine, so the connection is what does the work here: it gives Claude direct access to the tools that render the face, the audio and the video, and the results stay in one account and one asset library. The whole pipeline below ran inside a single chat.

## How Does the Avatar Pipeline Work on Higgsfield?

If you want a consistent talking persona without assembling it layer by layer, AI Influencer covers that as a single flow, and [our guide to creating an AI influencer](https://higgsfield.ai/blog/how-to-create-ai-influencer) walks through it. This breakdown is the detailed path: building the avatar from individual layers, with control over each one, entirely from a Claude chat.

The workflow has four parts:

| Layer | Product | What it does |
| --- | --- | --- |
| Character | Soul 2.0 | Generates a fictional person and their reference set |
| Identity | Soul ID | Trains once on the reference set, then holds the same face everywhere |
| Voice | Seed Audio | Preset voices or a clone of your own |
| Talking clip | Seedance 2.5 | Renders the video with lip movement synced to the audio track |

How Does the Avatar Pipeline Work on Higgsfield?

Soul ID is how Higgsfield handles identity: it trains once on the reference set, and from then on the character applies to any generation by name, with no reference image attached each time. The voice is a separate reusable asset: the preset or cloned voice you pick in Seed Audio stays available for every future script. The video itself comes from Seedance 2.5, which takes a start frame with the character, an audio track and a prompt, and returns a clip with the mouth following the track.

If your avatar is based on a real person, the character step gets shorter: you train directly on photos. If the character is invented, the face is generated first, on the Soul family as in this workflow, or through Nano Banana Pro if you prefer building the reference set on a general image model. Both live in the same suite, so the downstream steps don't change.

## Step-by-Step: From a Fictional Character to a Series of Talking Clips

The full workflow in one line: create the character → train the identity → generate a start frame → choose a voice → generate the speech → render the talking clip → reuse the identity for more scenes.

## Step 1: Create the character

The presenter in this breakdown does not exist. She was generated as a fictional character: one base face, then a set of shots of the same person in different poses, angles and framings. That set is what the identity trains on, so it needs variety: front-facing portraits, a full-height shot, different expressions.

Error while loading

the media...

## Step 2: Train the identity

Ask Claude to train a Soul ID and it opens the Higgsfield upload window right in the conversation. Upload the reference set: use from 20 to 80 photos for the best character consistency, with varied angles and expressions and at least one full-height shot. Training runs for about 10 minutes, the status is trackable in the chat, and no visit to [higgsfield.ai](http://higgsfield.ai/) is required. From this point the character is callable by name in any prompt, in this session or any future one.

## Step 3: Generate the start frame

Each talking clip is built on one still: the start frame. It sets the scene, the outfit and the framing, and the video model keeps everything in it static except the performance. The first clip in this series is a bookshelf monologue, so the start frame puts the character in an armchair with a book:

Horizontal 16:9 talking-head portrait, chest-up framing, subject centered. Young woman in her mid-20s with long voluminous light-brown curls, fair freckled skin, light blue-grey eyes, strong straight eyebrows, seated in a worn fabric armchair, looking directly into the camera, calm soft expression, lips gently closed. Wearing a cream button-up shirt with a chunky pearl necklace, no jacket, a closed hardcover book resting on the armrest, hands relaxed. A filled wooden bookshelf behind her, soft even window daylight. Authentic phone-camera photo: true-to-life pore-level skin with natural texture and fine vellus hair, no beauty-filter smoothing, no retouching, faint true sensor noise, deep focus. Single frame, one person only, no text, no watermark.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Horizontal+16%3A9+talking-head+portrait%2C+chest-up+framing%2C+subject+centered.+Young+woman+in+her+mid-20s+with+long+voluminous+light-brown+curls%2C+fair+freckled+skin%2C+light+blue-grey+eyes%2C+strong+straight+eyebrows%2C+seated+in+a+worn+fabric+armchair%2C+looking+directly+into+the+camera%2C+calm+soft+expression%2C+lips+gently+closed.+Wearing+a+cream+button-up+shirt+with+a+chunky+pearl+necklace%2C+no+jacket%2C+a+closed+hardcover+book+resting+on+the+armrest%2C+hands+relaxed.+A+filled+wooden+bookshelf+behind+her%2C+soft+even+window+daylight.+Authentic+phone-camera+photo%3A+true-to-life+pore-level+skin+with+natural+texture+and+fine+vellus+hair%2C+no+beauty-filter+smoothing%2C+no+retouching%2C+faint+true+sensor+noise%2C+deep+focus.+Single+frame%2C+one+person+only%2C+no+text%2C+no+watermark.)

Error while loading

the media...

Lips gently closed is not a style choice: the video model animates speech more cleanly from a neutral mouth than from a caught expression.

## Step 4: Choose a voice for your AI avatar

Ask for voice options and Claude returns the preset library into the chat, 20 voices with previews. This workflow uses Delia. The alternative is cloning your own voice from a recording of 10 seconds to 3 minutes; clone only a voice that is yours or that you have permission to use.

## Step 5: Generate the avatar's speech

Seed Audio prices speech by script length, and Claude shows the estimated cost before anything is generated: a script around 10 seconds runs about 1 credit, around 20 seconds about 2.3, around 26 seconds about 3.8. The first clip's script, written for roughly 14 seconds of speech:

I finished four books this month and remember maybe ten pages total. And that's fine. Reading isn't a memory test — it's just a nicer place to put your attention than a feed.

Copy [Recreate](https://higgsfield.ai/audio?recreate=I+finished+four+books+this+month+and+remember+maybe+ten+pages+total.+And+that%27s+fine.+Reading+isn%27t+a+memory+test+%E2%80%94+it%27s+just+a+nicer+place+to+put+your+attention+than+a+feed.)

The finished audio lands as a file in your Higgsfield uploads, which is exactly the form the video step needs.

## Step 6: Render the talking clip

Three elements go into the generation: the start frame, the audio file, and a video prompt. The prompt is where the clip stops being generic: it is written against the script, beat by beat, so the performance lands on specific lines rather than looping stock gestures. Seedance 2.5 renders the clip with lip movement synced to the track:

Static locked-off horizontal talking-head video, camera fixed on a tripod, framing identical to the start frame from first to last frame. The exact woman from the start frame — mid-20s, long light-brown curls, cream shirt, pearl necklace, seated in an armchair with a bookshelf behind her, closed book on the armrest — speaks directly into the lens for the entire clip, lips in precise sync with the spoken words. Performance: on the confession about forgetting pages a self-deprecating half-smile with a light eye-roll upward and back to the lens; on "and that's fine" a calm reassuring micro head-shake, shoulders relaxing; on the closing thought she leans in a few centimeters, voice-matched softening of the eyes, thoughtful warm expression. Hands stay resting, only fingers shifting slightly on the armrest. Natural blinks, gentle breathing. In the final second she settles into a quiet content smile. Background completely static, soft window daylight, authentic phone-video look, true-to-life skin texture, faint sensor noise, deep focus.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Static+locked-off+horizontal+talking-head+video%2C+camera+fixed+on+a+tripod%2C+framing+identical+to+the+start+frame+from+first+to+last+frame.+The+exact+woman+from+the+start+frame+%E2%80%94+mid-20s%2C+long+light-brown+curls%2C+cream+shirt%2C+pearl+necklace%2C+seated+in+an+armchair+with+a+bookshelf+behind+her%2C+closed+book+on+the+armrest+%E2%80%94+speaks+directly+into+the+lens+for+the+entire+clip%2C+lips+in+precise+sync+with+the+spoken+words.+Performance%3A+on+the+confession+about+forgetting+pages+a+self-deprecating+half-smile+with+a+light+eye-roll+upward+and+back+to+the+lens%3B+on+%22and+that%27s+fine%22+a+calm+reassuring+micro+head-shake%2C+shoulders+relaxing%3B+on+the+closing+thought+she+leans+in+a+few+centimeters%2C+voice-matched+softening+of+the+eyes%2C+thoughtful+warm+expression.+Hands+stay+resting%2C+only+fingers+shifting+slightly+on+the+armrest.+Natural+blinks%2C+gentle+breathing.+In+the+final+second+she+settles+into+a+quiet+content+smile.+Background+completely+static%2C+soft+window+daylight%2C+authentic+phone-video+look%2C+true-to-life+skin+texture%2C+faint+sensor+noise%2C+deep+focus.)

Your browser does not support the video.

One clean clip confirms the whole setup: the face matches the reference set, the voice matches the preset, the mouth matches the words. Fix anything here, before the series, not after.

## Step 7: Reuse the same avatar across multiple videos

Once the first clip works, you do not repeat the setup. The identity and the voice are reused as they are, and each new clip needs only three new inputs: a script, a start frame for its scene, and a performance prompt written against that script. The face carries across all of them without a single reference image re-attached. Three more clips complete the series.

**A kitchen clip about a phone-free evening.**

**Audio:**

New rule at my place: the phone sleeps in the kitchen. First week was rough, not gonna lie. Now my evenings are about forty percent longer. Turns out boredom was the feature, not the bug.

Copy [Recreate](https://higgsfield.ai/audio?recreate=New+rule+at+my+place%3A+the+phone+sleeps+in+the+kitchen.+First+week+was+rough%2C+not+gonna+lie.+Now+my+evenings+are+about+forty+percent+longer.+Turns+out+boredom+was+the+feature%2C+not+the+bug.)

**Portrait:**

Horizontal 16:9 talking-head portrait, chest-up framing, subject centered. Young woman in her mid-20s with long voluminous light-brown curls, fair freckled skin, light blue-grey eyes, strong straight eyebrows, standing at a kitchen counter in the evening, looking directly into the camera, cozy calm expression with a hint of a smile, lips gently closed. Wearing a plain grey knit sweater, a ceramic mug on the counter beside her, no phone anywhere. Warm dim tungsten pendant light from above, quiet muted kitchen behind her. Authentic phone-camera photo: true-to-life pore-level skin with natural texture and fine vellus hair, no beauty-filter smoothing, no retouching, faint true sensor noise, deep focus. Single frame, one person only, no text, no watermark.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Horizontal+16%3A9+talking-head+portrait%2C+chest-up+framing%2C+subject+centered.+Young+woman+in+her+mid-20s+with+long+voluminous+light-brown+curls%2C+fair+freckled+skin%2C+light+blue-grey+eyes%2C+strong+straight+eyebrows%2C+standing+at+a+kitchen+counter+in+the+evening%2C+looking+directly+into+the+camera%2C+cozy+calm+expression+with+a+hint+of+a+smile%2C+lips+gently+closed.+Wearing+a+plain+grey+knit+sweater%2C+a+ceramic+mug+on+the+counter+beside+her%2C+no+phone+anywhere.+Warm+dim+tungsten+pendant+light+from+above%2C+quiet+muted+kitchen+behind+her.+Authentic+phone-camera+photo%3A+true-to-life+pore-level+skin+with+natural+texture+and+fine+vellus+hair%2C+no+beauty-filter+smoothing%2C+no+retouching%2C+faint+true+sensor+noise%2C+deep+focus.+Single+frame%2C+one+person+only%2C+no+text%2C+no+watermark.)

Error while loading

the media...

**Video:**

Static locked-off horizontal talking-head video, camera fixed on a tripod, framing identical to the start frame from first to last frame. The exact woman from the start frame — mid-20s, long light-brown curls, grey knit sweater, evening kitchen with warm pendant light and a ceramic mug on the counter — speaks directly into the lens for the entire clip, lips in precise sync with the spoken words. Performance: on the "new rule" opening a slight conspiratorial lean toward the camera, eyebrows raised; on "rough, not gonna lie" an honest short laugh-exhale with eyes briefly closing; on the closing line a satisfied slow nod and a relaxed settled smile, one hand briefly wrapping the mug on the counter and releasing it. Natural blinks, gentle breathing, cozy unhurried energy throughout. In the final second she settles into a calm closed-mouth smile. Background completely static, warm dim tungsten light, authentic phone-video look, true-to-life skin texture, faint sensor noise, deep focus.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Static+locked-off+horizontal+talking-head+video%2C+camera+fixed+on+a+tripod%2C+framing+identical+to+the+start+frame+from+first+to+last+frame.+The+exact+woman+from+the+start+frame+%E2%80%94+mid-20s%2C+long+light-brown+curls%2C+grey+knit+sweater%2C+evening+kitchen+with+warm+pendant+light+and+a+ceramic+mug+on+the+counter+%E2%80%94+speaks+directly+into+the+lens+for+the+entire+clip%2C+lips+in+precise+sync+with+the+spoken+words.+Performance%3A+on+the+%22new+rule%22+opening+a+slight+conspiratorial+lean+toward+the+camera%2C+eyebrows+raised%3B+on+%22rough%2C+not+gonna+lie%22+an+honest+short+laugh-exhale+with+eyes+briefly+closing%3B+on+the+closing+line+a+satisfied+slow+nod+and+a+relaxed+settled+smile%2C+one+hand+briefly+wrapping+the+mug+on+the+counter+and+releasing+it.+Natural+blinks%2C+gentle+breathing%2C+cozy+unhurried+energy+throughout.+In+the+final+second+she+settles+into+a+calm+closed-mouth+smile.+Background+completely+static%2C+warm+dim+tungsten+light%2C+authentic+phone-video+look%2C+true-to-life+skin+texture%2C+faint+sensor+noise%2C+deep+focus.)

Your browser does not support the video.

**A thrift-find clip by the clothing rack.**

**Audio:**

This jacket? Twelve dollars, flea market, smelled like someone's garage. Three years later it's the most complimented thing I own. Moral of the story: the best pieces are the ones nobody else wanted.

Copy [Recreate](https://higgsfield.ai/audio?recreate=This+jacket%3F+Twelve+dollars%2C+flea+market%2C+smelled+like+someone%27s+garage.+Three+years+later+it%27s+the+most+complimented+thing+I+own.+Moral+of+the+story%3A+the+best+pieces+are+the+ones+nobody+else+wanted.)

**Portrait:**

Horizontal 16:9 talking-head portrait, chest-up framing, subject centered with the room visible on both sides. Young woman in her mid-20s with long voluminous light-brown curls, fair freckled skin, light blue-grey eyes, strong straight eyebrows, looking directly into the camera, relaxed friendly expression, lips gently closed. Wearing a distressed brown leather biker jacket over a cream button-up shirt with a chunky pearl necklace. Behind her a home clothing rack with a few muted vintage pieces on wooden hangers, soft even window daylight from the left. Authentic phone-camera photo: true-to-life pore-level skin with natural texture and fine vellus hair, no beauty-filter smoothing, no retouching, faint true sensor noise, deep focus. Single frame, one person only, no text, no watermark.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Horizontal+16%3A9+talking-head+portrait%2C+chest-up+framing%2C+subject+centered+with+the+room+visible+on+both+sides.+Young+woman+in+her+mid-20s+with+long+voluminous+light-brown+curls%2C+fair+freckled+skin%2C+light+blue-grey+eyes%2C+strong+straight+eyebrows%2C+looking+directly+into+the+camera%2C+relaxed+friendly+expression%2C+lips+gently+closed.+Wearing+a+distressed+brown+leather+biker+jacket+over+a+cream+button-up+shirt+with+a+chunky+pearl+necklace.+Behind+her+a+home+clothing+rack+with+a+few+muted+vintage+pieces+on+wooden+hangers%2C+soft+even+window+daylight+from+the+left.+Authentic+phone-camera+photo%3A+true-to-life+pore-level+skin+with+natural+texture+and+fine+vellus+hair%2C+no+beauty-filter+smoothing%2C+no+retouching%2C+faint+true+sensor+noise%2C+deep+focus.+Single+frame%2C+one+person+only%2C+no+text%2C+no+watermark.)

Error while loading

the media...

**Video:**

Static locked-off horizontal talking-head video, camera fixed on a tripod, framing identical to the start frame from first to last frame. The exact woman from the start frame — mid-20s, long light-brown curls, distressed brown leather biker jacket, cream shirt, pearl necklace, home clothing rack behind her — speaks directly into the lens for the entire clip, lips in precise sync with the spoken words. Performance: on the opening line she glances down at her jacket lapel and gives it a light one-hand tug, playful proud look; mid-clip a quick amused nose-wrinkle grimace at the memory of the smell, eyebrows up; on the closing moral a warm easy smile with a small one-shoulder shrug, hand already out of frame. Natural blinks, gentle breathing motion, small head tilts on emphasis. In the final second she settles into a soft closed-mouth smile. Background completely static, soft even daylight, authentic phone-video look, true-to-life skin texture, faint sensor noise, deep focus.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Static+locked-off+horizontal+talking-head+video%2C+camera+fixed+on+a+tripod%2C+framing+identical+to+the+start+frame+from+first+to+last+frame.+The+exact+woman+from+the+start+frame+%E2%80%94+mid-20s%2C+long+light-brown+curls%2C+distressed+brown+leather+biker+jacket%2C+cream+shirt%2C+pearl+necklace%2C+home+clothing+rack+behind+her+%E2%80%94+speaks+directly+into+the+lens+for+the+entire+clip%2C+lips+in+precise+sync+with+the+spoken+words.+Performance%3A+on+the+opening+line+she+glances+down+at+her+jacket+lapel+and+gives+it+a+light+one-hand+tug%2C+playful+proud+look%3B+mid-clip+a+quick+amused+nose-wrinkle+grimace+at+the+memory+of+the+smell%2C+eyebrows+up%3B+on+the+closing+moral+a+warm+easy+smile+with+a+small+one-shoulder+shrug%2C+hand+already+out+of+frame.+Natural+blinks%2C+gentle+breathing+motion%2C+small+head+tilts+on+emphasis.+In+the+final+second+she+settles+into+a+soft+closed-mouth+smile.+Background+completely+static%2C+soft+even+daylight%2C+authentic+phone-video+look%2C+true-to-life+skin+texture%2C+faint+sensor+noise%2C+deep+focus.)

Your browser does not support the video.

**A balcony clip in defense of cloudy days.**

**Audio:**

Everyone's chasing golden hour. Give me a grey, overcast Tuesday instead — soft light, empty streets, coffee that stays warm in your hands. Cloudy cities are criminally underrated, and I will die on this hill.

Copy [Recreate](https://higgsfield.ai/audio?recreate=Everyone%27s+chasing+golden+hour.+Give+me+a+grey%2C+overcast+Tuesday+instead+%E2%80%94+soft+light%2C+empty+streets%2C+coffee+that+stays+warm+in+your+hands.+Cloudy+cities+are+criminally+underrated%2C+and+I+will+die+on+this+hill.)

**Portrait:**

Horizontal 16:9 talking-head portrait, chest-up framing, subject centered with the city visible on both sides. Young woman in her mid-20s with long voluminous light-brown curls, fair freckled skin, light blue-grey eyes, strong straight eyebrows, standing on an apartment balcony, looking directly into the camera, calm confident expression, lips gently closed, a few curls lifted by light wind. Wearing a distressed brown leather biker jacket over a cream button-up shirt with a chunky pearl necklace. Flat grey overcast sky, muted city rooftops behind her, even shadowless daylight. Authentic phone-camera photo: true-to-life pore-level skin with natural texture and fine vellus hair, no beauty-filter smoothing, no retouching, faint true sensor noise, deep focus. Single frame, one person only, no text, no watermark.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Horizontal+16%3A9+talking-head+portrait%2C+chest-up+framing%2C+subject+centered+with+the+city+visible+on+both+sides.+Young+woman+in+her+mid-20s+with+long+voluminous+light-brown+curls%2C+fair+freckled+skin%2C+light+blue-grey+eyes%2C+strong+straight+eyebrows%2C+standing+on+an+apartment+balcony%2C+looking+directly+into+the+camera%2C+calm+confident+expression%2C+lips+gently+closed%2C+a+few+curls+lifted+by+light+wind.+Wearing+a+distressed+brown+leather+biker+jacket+over+a+cream+button-up+shirt+with+a+chunky+pearl+necklace.+Flat+grey+overcast+sky%2C+muted+city+rooftops+behind+her%2C+even+shadowless+daylight.+Authentic+phone-camera+photo%3A+true-to-life+pore-level+skin+with+natural+texture+and+fine+vellus+hair%2C+no+beauty-filter+smoothing%2C+no+retouching%2C+faint+true+sensor+noise%2C+deep+focus.+Single+frame%2C+one+person+only%2C+no+text%2C+no+watermark.)

Error while loading

the media...

**Video:**

Static locked-off horizontal talking-head video, camera fixed on a tripod, framing identical to the start frame from first to last frame. The exact woman from the start frame — mid-20s, long light-brown curls, brown leather biker jacket, cream shirt, pearl necklace, balcony with flat grey sky and muted rooftops behind her — speaks directly into the lens for the entire clip, lips in precise sync with the spoken words. Performance: on the golden-hour line a light dismissive flick of one hand rising briefly into frame and dropping out; mid-clip her gaze drifts contentedly a touch off-lens toward the sky while listing the small pleasures, then returns to the lens; on the closing declaration a mock-serious firm slow nod that breaks into a small grin. A few curls move in light wind, everything else static. Natural blinks, gentle breathing, small head tilts on emphasis. In the final second she settles into a soft closed-mouth smile. Even shadowless daylight, authentic phone-video look, true-to-life skin texture, faint sensor noise, deep focus.

Copy [Recreate](https://higgsfield.ai/generate?recreate=Static+locked-off+horizontal+talking-head+video%2C+camera+fixed+on+a+tripod%2C+framing+identical+to+the+start+frame+from+first+to+last+frame.+The+exact+woman+from+the+start+frame+%E2%80%94+mid-20s%2C+long+light-brown+curls%2C+brown+leather+biker+jacket%2C+cream+shirt%2C+pearl+necklace%2C+balcony+with+flat+grey+sky+and+muted+rooftops+behind+her+%E2%80%94+speaks+directly+into+the+lens+for+the+entire+clip%2C+lips+in+precise+sync+with+the+spoken+words.+Performance%3A+on+the+golden-hour+line+a+light+dismissive+flick+of+one+hand+rising+briefly+into+frame+and+dropping+out%3B+mid-clip+her+gaze+drifts+contentedly+a+touch+off-lens+toward+the+sky+while+listing+the+small+pleasures%2C+then+returns+to+the+lens%3B+on+the+closing+declaration+a+mock-serious+firm+slow+nod+that+breaks+into+a+small+grin.+A+few+curls+move+in+light+wind%2C+everything+else+static.+Natural+blinks%2C+gentle+breathing%2C+small+head+tilts+on+emphasis.+In+the+final+second+she+settles+into+a+soft+closed-mouth+smile.+Even+shadowless+daylight%2C+authentic+phone-video+look%2C+true-to-life+skin+texture%2C+faint+sensor+noise%2C+deep+focus.)

Your browser does not support the video.

Four scenes, four scripts, one face and one voice. Adding a fifth clip would take one more script, one more start frame and one more render: the character and the voice are already there.

## What Does This Cost in Credits?

Everything generated through MCP deducts credits at standard rates, regardless of your plan. Worth saying plainly, since [Higgsfield has also run limited-time unlimited access through MCP before](https://higgsfield.ai/blog/unlimited-mcp), and it's easy to assume that's always on. It isn't: Unlimited access and free generations apply only on [higgsfield.ai](http://higgsfield.ai/), and anything generated through MCP spends plan credits.

| Step | What it covers | Credits |
| --- | --- | --- |
| Character generations (Soul 2.0) | The fictional person and poses | 0.125 per image |
| Soul ID training | One-time, on the reference set | 25 |
| Start frames (Soul 2.0, 2K) | One still per scene | 0.125 per image |
| Speech (Seed Audio) | Per script in this series | 1.3 to 2.3 |
| Talking clip (Seedance 2.5, 14 sec, 720p) | Per clip | ~91 |
| **Total for this four-clip series** | Identity, voices, frames, and four clips | **~400** |

What Does This Cost in Credits?

Almost all of the cost sits in two places: the talking clips and the one-time identity training. The images and the speech are close to free by comparison. The four-clip series in this breakdown came to about 400 credits, and the number that grows from there is the per-clip one, since the character and the voice never need to be rebuilt. A useful standing instruction at the top of a session: "Before generating anything, tell me the credit cost and wait for my confirmation."

## A Few Things Worth Knowing Before You Run This

- Train the identity once and call the character by name afterward. Re-attaching reference images per generation is where face drift comes from.
- Generate the speech before the video, since the audio file is an input to the clip. The reverse order doesn't exist in this pipeline.
- Write the video prompt against the script, beat by beat. Naming the exact lines where a gesture should land is what separates a performance from a loop.
- Each scene needs its own start frame, but the character carries between scenes on the identity alone. Keep the framing consistent across frames if the clips will live in one feed.
- Claude shows confirmations, not files. The finished clips live in your Assets on [higgsfield.ai](http://higgsfield.ai/), tagged with the MCP source.

Most of the time in a project like this used to go into moving files between tools: a character from one, a voice from a second, lip sync in a third, an export after every step. Through MCP the whole series happened in one conversation: the identity was trained once, the voice was picked once, and every clip after that needed a script, a frame and a prompt.

### How To Create a Talking AI Avatar in Claude with Higgsfield MCP (Full Workflow + Prompts)

[Connect Higgsfield MCP](https://feat-hub-v2-fnf-landings-tanstack.anwar-695.workers.dev/mcp)

## Got any questions left?

Can Claude generate a talking avatar without Higgsfield MCP?

No. Claude has no video generation of its own, and the MCP connector is what gives it access to the character system, the audio tools, and the video models.

How do I keep the same AI avatar across multiple videos?

Train a Soul ID once on the character's reference set. After that the identity applies to any generation by name, so the face stays the same across scenes, outfits and clips, and the voice you picked is reused per clip.

Do I need real photos to train the identity?

No. The presenter in this workflow is a fictional character, generated in different poses to form the training set. If the avatar is based on a real person, train directly on their photos, with permission.

How many photos does Soul ID training need?

Use from 20 to 80 photos for the best consistency, with varied angles and expressions and at least one full-height shot. Training runs once per character, in about 10 minutes.

Can the avatar speak other languages?

Yes. Higgsfield Audio includes translation and dubbing through MCP, and the same identity keeps the presenter's face across every language version.

Does Unlimited model access work through MCP?

No. Unlimited access applies only on higgsfield.ai; every generation through MCP deducts credits at standard rates.

by Higgsfield

[Seedance 2.5: Complete Prompting Guide (Full Prompt Library)](https://higgsfield.ai/blog/seedance-2-5-prompting-guide) [How to Make Documentary Videos with AI in 2026](https://higgsfield.ai/blog/ai-documentary-videos-2026)

## Discover more

[View all](https://higgsfield.ai/blog)

[Error while loading\\
\\
the media...\\
\\
Guides\\
\\
**How to Generate AI Videos in Claude With the Higgsfield MCP Connector (2026)** \\
\\
7 min·Oct 27, 2026](https://higgsfield.ai/blog/Generate-AI-Videos-From-Claude-with-Higgsfield-MCP) [Error while loading\\
\\
the media...\\
\\
Guides\\
\\
**Claude Fable 5 + Higgsfield MCP = $38,400/Month** \\
\\
10 min·Jun 10, 2026](https://higgsfield.ai/blog/MCP-For-Motion-Designers) [Error while loading\\
\\
the media...\\
\\
Editorials\\
\\
**Meet Higgsfield Unlimited MCP: How It Works and What You Get** \\
\\
8 min·Jul 28, 2026](https://higgsfield.ai/blog/unlimited-mcp) [Error while loading\\
\\
the media...\\
\\
Guides\\
\\
**How To Make a Full Ad Campaign Inside Claude (Full Workflow + Prompts)** \\
\\
10 min·Aug 12, 2026](https://higgsfield.ai/blog/full-ad-campaign-inside-claude)

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