/**
 * Design Token Extractor — Analyse computed styles de higgsfield.ai
 * Extrait les couleurs, typos, espacements RÉELLEMENT utilisés sur les pages rendues.
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const PAGES = [
  { id: 'homepage', url: 'https://higgsfield.ai/' },
  { id: 'pricing', url: 'https://higgsfield.ai/pricing' },
  { id: 'apps', url: 'https://higgsfield.ai/apps' },
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const results = {};
  for (const page of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA });
    const p = await ctx.newPage();
    try {
      await p.goto(page.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await p.waitForTimeout(10000);

      // Extraction des computed styles agrégés
      const data = await p.evaluate(() => {
        const freq = (obj, key, val) => { if (val && val !== 'none' && val !== 'auto' && !val.includes('rgba(0, 0, 0, 0)')) { obj[key] = obj[key] || {}; obj[key][val] = (obj[key][val] || 0) + 1; } };
        const agg = {};
        const els = document.querySelectorAll('body *');
        let count = 0;
        for (const el of els) {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          count++;
          freq(agg, 'color', cs.color);
          freq(agg, 'backgroundColor', cs.backgroundColor);
          if (el.tagName === 'A' || el.tagName === 'BUTTON') {
            freq(agg, 'btn.background', cs.backgroundColor);
            freq(agg, 'btn.border', cs.border);
            freq(agg, 'btn.radius', cs.borderRadius);
            freq(agg, 'btn.padding', cs.padding);
            freq(agg, 'btn.fontSize', cs.fontSize);
            freq(agg, 'btn.fontWeight', cs.fontWeight);
            freq(agg, 'btn.height', Math.round(r.height) + 'px');
          }
          freq(agg, 'fontFamily', cs.fontFamily.split(',')[0].replace(/["']/g, ''));
          freq(agg, 'fontSize', cs.fontSize);
          freq(agg, 'fontWeight', cs.fontWeight);
          freq(agg, 'letterSpacing', cs.letterSpacing);
          freq(agg, 'lineHeight', cs.lineHeight);
          freq(agg, 'borderRadius', cs.borderRadius);
          freq(agg, 'boxShadow', cs.boxShadow === 'none' ? null : cs.boxShadow.substring(0, 160));
          freq(agg, 'transition', cs.transitionDuration === '0s' ? null : `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}`);
          freq(agg, 'padding', cs.padding === '0px' ? null : cs.padding);
          if (cs.backgroundImage && cs.backgroundImage !== 'none' && cs.backgroundImage.includes('gradient')) {
            freq(agg, 'gradient', cs.backgroundImage.substring(0, 200));
          }
          if (cs.animationName !== 'none') freq(agg, 'animation', `${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction} ${cs.animationIterationCount}`);
        }
        // Typo par heading
        const headings = {};
        for (const tag of ['h1','h2','h3','h4','h5','h6','p','span','a','button','label','small']) {
          const sample = document.querySelector(tag);
          if (sample) {
            const cs = getComputedStyle(sample);
            headings[tag] = { fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily.split(',')[0], lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing };
          }
        }
        // CSS variables :root live
        const rootVars = {};
        const sheets = document.styleSheets;
        for (const sheet of sheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (rule.selectorText === ':root' || (rule.selectorText && rule.selectorText.includes('.dark'))) {
                for (const prop of rule.style) {
                  if (prop.startsWith('--hf') || prop.startsWith('--font')) {
                    const v = rule.style.getPropertyValue(prop).trim();
                    if (v && !rootVars[prop]) rootVars[prop] = v;
                  }
                }
              }
            }
          } catch (e) { /* cross-origin */ }
        }
        // breakpoints containers
        const container = document.querySelector('main') || document.body;
        return { totalVisible: count, agg, headings, rootVars, bodyBg: getComputedStyle(document.body).backgroundColor, bodyColor: getComputedStyle(document.body).color, mainWidth: container.getBoundingClientRect().width, scrollbarWidth: window.innerWidth - document.documentElement.clientWidth };
      });

      // Tri par fréquence
      const sorted = {};
      for (const [k, vals] of Object.entries(data.agg)) {
        sorted[k] = Object.entries(vals).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([v, c]) => ({ v, c }));
      }
      results[page.id] = { ...data, agg: sorted };

      // Screenshot full page
      await p.screenshot({ path: `/home/z/my-project/reverse-higgsfield/04-ui-ux/captures/${page.id}-full.png`, fullPage: true }).catch(() => {});
      // Screenshot viewport
      await p.screenshot({ path: `/home/z/my-project/reverse-higgsfield/04-ui-ux/captures/${page.id}-viewport.png` }).catch(() => {});
      console.log(`OK ${page.id}: ${data.totalVisible} éléments visibles`);
    } catch (e) {
      console.error(`ERREUR ${page.id}:`, e.message.substring(0, 200));
      results[page.id] = { error: e.message };
    }
    await ctx.close();
  }

  fs.writeFileSync('/home/z/my-project/reverse-higgsfield/04-ui-ux/computed-styles-raw.json', JSON.stringify(results, null, 1));
  await browser.close();
  console.log('Terminé — JSON sauvé');
})();
