/**
 * EXPLORATEUR DE SURFACES PUBLIQUES — documente les flows accessibles sans login
 * + flow signup (UI seulement) + composer homepage + routes studio publiques
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const OUT = '/home/z/my-project/reverse-higgsfield/05-user-flows/captures';

const ROUTES = [
  { id: 'signup', url: 'https://higgsfield.ai/auth/sign-up', desc: 'Page signup (UI onboarding)' },
  { id: 'composer-homepage', url: 'https://higgsfield.ai/#create', desc: 'Composer homepage' },
  { id: 'ai-image', url: 'https://higgsfield.ai/ai/image', desc: 'Générateur image public' },
  { id: 'ai-video', url: 'https://higgsfield.ai/ai/video', desc: 'Générateur vidéo public' },
  { id: 'generate', url: 'https://higgsfield.ai/generate', desc: 'Cinema Studio (app)' },
  { id: 'canvas', url: 'https://higgsfield.ai/canvas', desc: 'Canvas (app)' },
  { id: 'supercomputer', url: 'https://higgsfield.ai/supercomputer', desc: 'Super Computer' },
  { id: 'pricing-checkout', url: 'https://higgsfield.ai/pricing', desc: 'Pricing + checkout CTA' },
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

  const analyzePage = () => page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
    const inputs = [...document.querySelectorAll('input, textarea, select')].filter(vis).map(i => ({
      tag: i.tagName, type: i.type || null, name: i.name || null, placeholder: (i.placeholder || '').substring(0, 60),
      ariaLabel: i.getAttribute('aria-label'), role: i.getAttribute('role'),
    }));
    const buttons = [...document.querySelectorAll('button, [role="button"], a.btn')].filter(vis).map(b => ({
      text: (b.textContent || '').trim().substring(0, 45), ariaLabel: b.getAttribute('aria-label'),
      disabled: b.disabled, cls: (b.className || '').toString().substring(0, 40),
    })).filter(b => b.text || b.ariaLabel).slice(0, 45);
    const tabs = [...document.querySelectorAll('[role="tab"]')].filter(vis).map(t => (t.textContent || '').trim().substring(0, 30));
    const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 70)).filter(Boolean).slice(0, 12);
    const forms = [...document.querySelectorAll('form')].filter(vis).map(f => ({ action: f.action, method: f.method, inputCount: f.querySelectorAll('input').length }));
    const ctas = [...document.querySelectorAll('a')].filter(vis).map(a => ({ text: (a.textContent || '').trim().substring(0, 40), href: (a.getAttribute('href') || '').substring(0, 80) })).filter(a => a.text && a.href && /sign|upgrade|pricing|checkout|start|create|generate|try/i.test(a.text + a.href)).slice(0, 15);
    const bodyText = document.body.innerText.replace(/\n{2,}/g, '\n').substring(0, 1800);
    const needsLogin = /log in|sign in to|create an account/i.test(bodyText);
    return { url: location.href, title: document.title, needsLogin, inputs, buttons, tabs, headings, forms, ctas, bodyText };
  });

  for (const route of ROUTES) {
    try {
      log(`→ ${route.id}: ${route.url}`);
      await page.goto(route.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(9000);
      // dismiss cookies
      await page.evaluate(() => { document.querySelector('.cc-window, [aria-label="cookieconsent"]')?.remove(); }).catch(() => {});
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/explore-${route.id}.png`, fullPage: false });
      const data = await analyzePage();
      results[route.id] = data;
      log(`   OK — ${data.headings.slice(0, 3).join(' | ').substring(0, 120)}`);
      log(`   inputs: ${data.inputs.length}, buttons: ${data.buttons.length}, tabs: ${JSON.stringify(data.tabs.slice(0, 6))}`);
    } catch (e) {
      log(`   ERREUR: ${e.message.substring(0, 100)}`);
      results[route.id] = { error: e.message };
    }
  }

  fs.writeFileSync(`${OUT}/explore-public-routes.json`, JSON.stringify(results, null, 1));
  await browser.close();
  log('Analyse sauvegardée: explore-public-routes.json');
})();
