// ============================================================
// PHASE 8 — Threads Reddit via navigateur (old.reddit.com)
// ============================================================
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const OUT = '/home/z/my-project/reverse-higgsfield/06-business-logic/captures';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const THREADS = [
  { name: 'reddit-scam-or-worth',  url: 'https://old.reddit.com/r/generativeAI/comments/1sp4ivr/higgsfield_ai_review_scam_or_actually_worth_it/' },
  { name: 'reddit-4-months',       url: 'https://old.reddit.com/r/generativeAI/comments/1rvaj50/my_honest_experience_with_higgsfield_after_4/' },
  { name: 'reddit-proscons',       url: 'https://old.reddit.com/r/HiggsfieldAI/comments/1qdj607/higgsfield_proscons_from_real_users_not_the/' },
  { name: 'reddit-cheap-alt',      url: 'https://old.reddit.com/r/generativeAI/comments/1x3zfom/any_higgsfield_alternatives_that_are_actually/' },
  { name: 'reddit-professional',   url: 'https://old.reddit.com/r/generativeAI/comments/1u0jhm0/which_video_company_for_professional_work_kling/' },
  { name: 'reddit-legit',          url: 'https://old.reddit.com/r/generativeAI/comments/1u3183z/is_higgsfield_actually_legit_now_looking_to_sign/' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent: UA, locale: 'en-US' });
  const page = await ctx.newPage();

  for (const t of THREADS) {
    try {
      console.log(`→ ${t.name}`);
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await sleep(5000);
      const data = await page.evaluate(() => {
        const title = (document.querySelector('p.title a') || {}).textContent || (document.querySelector('a.title') || {}).textContent || '';
        const selftext = (document.querySelector('.expando .usertext-body') || {}).textContent || '';
        const score = (document.querySelector('.score.unvoted') || {}).textContent || '';
        const comments = [];
        document.querySelectorAll('.commentarea .entry').forEach(e => {
          const author = (e.querySelector('.author') || {}).textContent || '';
          const score = (e.querySelector('.score.unvoted') || {}).textContent || '';
          const body = (e.querySelector('.usertext-body') || {}).textContent || '';
          if (body && body.length > 40) comments.push({ author, score, body: body.trim().slice(0, 900) });
        });
        return { title: title.trim(), selftext: (selftext || '').trim().slice(0, 1500), score, url: location.href, n_comments: comments.length, comments: comments.slice(0, 20) };
      });
      fs.writeFileSync(`${OUT}/comp-${t.name}.json`, JSON.stringify(data, null, 1));
      await page.screenshot({ path: `${OUT}/comp-${t.name}.png`, fullPage: false });
      console.log(`   OK: "${data.title}" score=${data.score} | ${data.n_comments} commentaires`);
    } catch (e) { console.log(`   err: ${e.message.slice(0, 120)}`); }
    await sleep(2500);
  }

  await browser.close();
  console.log('Terminé');
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
