/**
 * EXPLORATEUR INTERACTIF DES FLOWS OUTILS (surfaces publiques)
 * Pour chaque route outil : structure du composer, options, coûts crédits, upsells
 * + interactions réelles (frappe prompt, clics, model pickers)
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const OUT = '/home/z/my-project/reverse-higgsfield/05-user-flows/captures';

// 24 outils + routes connues (marketing + app)
const TOOLS = [
  { id: 'create-image', url: 'https://higgsfield.ai/ai/image', prompt: 'cinematic portrait of a woman in neon light' },
  { id: 'create-video', url: 'https://higgsfield.ai/ai/video', prompt: 'a car drifting in tokyo at night, rain' },
  { id: 'cinema-studio', url: 'https://higgsfield.ai/generate', prompt: 'a detective enters a dark alley, film noir' },
  { id: 'soul-id', url: 'https://higgsfield.ai/soul', prompt: null },
  { id: 'soul-cinema', url: 'https://higgsfield.ai/soul/cinema', prompt: null },
  { id: 'soul-moodboard', url: 'https://higgsfield.ai/moodboard', prompt: null },
  { id: 'ai-influencer', url: 'https://higgsfield.ai/ai-influencer-studio', prompt: null },
  { id: 'photodump', url: 'https://higgsfield.ai/photodump', prompt: null },
  { id: 'relight-image', url: 'https://higgsfield.ai/apps/relight', prompt: null },
  { id: 'genjutsu', url: 'https://higgsfield.ai/genjutsu', prompt: null },
  { id: 'edit-video', url: 'https://higgsfield.ai/edit', prompt: null },
  { id: 'relight-video', url: 'https://higgsfield.ai/apps/relight-video', prompt: null },
  { id: 'content-factory', url: 'https://higgsfield.ai/content-factory', prompt: null },
  { id: 'ads-studio', url: 'https://higgsfield.ai/ads-studio', prompt: null },
  { id: 'marketing-studio', url: 'https://higgsfield.ai/marketing-studio', prompt: null },
  { id: 'supercomputer', url: 'https://higgsfield.ai/supercomputer', prompt: 'make a product video for a coffee brand' },
  { id: 'effects', url: 'https://higgsfield.ai/effects/use', prompt: null },
  { id: 'templates', url: 'https://higgsfield.ai/templates', prompt: null },
  { id: 'apps', url: 'https://higgsfield.ai/apps', prompt: null },
  { id: 'community', url: 'https://higgsfield.ai/community', prompt: null },
  { id: 'faceless-studio', url: 'https://higgsfield.ai/faceless-studio', prompt: null },
  { id: 'shorts-studio', url: 'https://higgsfield.ai/shorts-studio', prompt: null },
  { id: 'audio', url: 'https://higgsfield.ai/audio', prompt: null },
  { id: 'canvas-layers', url: 'https://higgsfield.ai/layers', prompt: null },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);
  const results = {};

  for (const tool of TOOLS) {
    try {
      log(`→ ${tool.id}`);
      await page.goto(tool.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(8000);
      await page.evaluate(() => { document.querySelector('.cc-window, [aria-label="cookieconsent"]')?.remove(); }).catch(() => {});
      await page.waitForTimeout(800);

      const data = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
        const composer = {
          textareas: [...document.querySelectorAll('textarea')].filter(vis).map(t => ({ placeholder: (t.placeholder || '').substring(0, 100), name: t.name })),
          inputs: [...document.querySelectorAll('input:not([type=hidden])')].filter(vis).map(i => ({ type: i.type, name: i.name, placeholder: (i.placeholder || '').substring(0, 60) })).slice(0, 12),
          tabs: [...document.querySelectorAll('[role="tab"]')].filter(vis).map(t => (t.textContent || '').trim().substring(0, 40)),
          selects: [...document.querySelectorAll('select')].filter(vis).map(s => ({ name: s.name, options: [...s.options].slice(0, 8).map(o => o.text) })),
          uploadZones: [...document.querySelectorAll('input[type=file]')].map(f => ({ accept: f.accept, multiple: f.multiple })),
          generateBtns: [...document.querySelectorAll('button')].filter(b => vis(b) && /generate|create|render|make/i.test(b.textContent || '')).map(b => ({ text: (b.textContent || '').trim().substring(0, 50), credits: (b.textContent || '').match(/\d+/)?.[0] || null })),
          modelPickers: [...document.querySelectorAll('button, [role="combobox"]')].filter(b => vis(b) && /seedance|veo|kling|sora|nan banana|soul|genjutsu|cinema|model|gpt|flux|dop|popcorn|qwen|wan|hailuo|midjourney/i.test(b.textContent || '')).map(b => (b.textContent || '').trim().substring(0, 45)).slice(0, 10),
          fileDropZones: [...document.querySelectorAll('[class*="drop"], [data-dropzone], [class*="upload"]')].filter(vis).length,
        };
        const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 80)).filter(Boolean).slice(0, 10);
        const primaryCtas = [...document.querySelectorAll('a[href], button')].filter(vis).map(b => ({ text: (b.textContent || '').trim().substring(0, 45), href: b.tagName === 'A' ? (b.getAttribute('href') || '').substring(0, 70) : null })).filter(b => b.text && (/^(start|try|create|open|use|launch|get|sign|upgrade|generate)/i.test(b.text) || b.href)).slice(0, 18);
        const upsells = (document.body.innerText.match(/[^\n]*(unlimited|30%|discount|upgrade|credits|free|off\b)[^\n]*/gi) || []).slice(0, 8);
        const steps = (document.body.innerText.match(/(step\s*\d|how it works|^\d\.\s.+)$/gim) || []).slice(0, 10);
        return { url: location.href, title: document.title, headings, composer, primaryCtas, upsells, bodySnippet: document.body.innerText.replace(/\n{2,}/g, '\n').substring(0, 1400) };
      });
      await page.screenshot({ path: `${OUT}/tool-${tool.id}.png`, fullPage: false });
      results[tool.id] = data;
      log(`   ✓ ${data.headings.slice(0, 2).join(' | ').substring(0, 100)}`);
      log(`   composer: ta=${data.composer.textareas.length} tabs=${JSON.stringify(data.composer.tabs.slice(0, 5))} gen=${JSON.stringify(data.composer.generateBtns.slice(0, 2))}`);

      // INTERACTION : si un prompt est défini et une textarea présente → frapper + tenter GENERATE
      if (tool.prompt && data.composer.textareas.length > 0) {
        const ta = page.locator('textarea:visible').first();
        await ta.click({ timeout: 5000 }).catch(() => {});
        await ta.pressSequentially(tool.prompt, { delay: 10, timeout: 15000 }).catch(e => log('   frappe KO: ' + e.message.substring(0, 60)));
        await page.waitForTimeout(1200);
        await page.screenshot({ path: `${OUT}/tool-${tool.id}-prompt-filled.png` });
        // Cliquer GENERATE
        const genBtn = page.locator('button:has-text("Generate"):visible, button:has-text("GENERATE"):visible').first();
        if (await genBtn.count() > 0) {
          try {
            await genBtn.click({ timeout: 6000 });
            await page.waitForTimeout(6000);
            await page.screenshot({ path: `${OUT}/tool-${tool.id}-after-generate-click.png` });
            // Que se passe-t-il ? (login wall ? queue ?)
            const afterState = await page.evaluate(() => {
              const vis = (el) => el.offsetParent !== null;
              const dialogs = [...document.querySelectorAll('[role="dialog"], .modal, [class*="modal"]')].filter(vis).map(d => d.textContent.trim().substring(0, 200));
              const bodySnippet = document.body.innerText.substring(0, 400);
              const url = location.href;
              return { url, dialogs, bodySnippet };
            });
            results[tool.id].afterGenerateClick = afterState;
            log(`   après GENERATE: url=${afterState.url.substring(0, 60)} dialogs=${afterState.dialogs.length} snippet=${afterState.bodySnippet.replace(/\n/g, ' ').substring(0, 120)}`);
          } catch (e) { log('   clic GENERATE KO: ' + e.message.substring(0, 60)); }
        }
      }
    } catch (e) {
      log(`   ERREUR ${tool.id}: ${e.message.substring(0, 100)}`);
      results[tool.id] = { error: e.message.substring(0, 200) };
    }
  }

  fs.writeFileSync(`${OUT}/tools-flows-exploration.json`, JSON.stringify(results, null, 1));
  await browser.close();
  log('SAUVÉ: tools-flows-exploration.json');
})();
