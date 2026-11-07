/**
 * FEATURE TEST FRAMEWORK — Phase 9
 * Vérifie la session puis explore un outil : UI, options, coûts, génération chronométrée.
 * Usage: node feature-test.js <outil>   (outil = image | video | effects | cinema | ...)
 */
const { launch, dismissCookies, domInfo, log, OUT } = require('./hf-common');
const fs = require('fs');

const TOOLS = {
  image: { url: 'https://higgsfield.ai/ai/image', name: 'AI Image (génération image)' },
  video: { url: 'https://higgsfield.ai/ai/video', name: 'AI Video (génération vidéo)' },
  effects: { url: 'https://higgsfield.ai/effects/use', name: 'Effects (motion presets)' },
  cinema: { url: 'https://higgsfield.ai/generate', name: 'Cinema Studio' },
  edit: { url: 'https://higgsfield.ai/layers', name: 'Edit (layers editor)' },
  canvas: { url: 'https://higgsfield.ai/canvas', name: 'Canvas' },
};

/** Journalise TOUT le réseau xhr/fetch avec timing (pour coûts crédits + polling jobs) */
function watchNet(page, sink) {
  page.on('request', (req) => {
    if (['xhr', 'fetch'].includes(req.resourceType())) {
      const u = req.url();
      if (u.includes('clerk') || u.includes('posthog') || u.includes('datadome') || u.includes('google') || u.includes('cloudflareinsights')) return;
      sink.push({ t: Date.now(), dir: 'REQ', method: req.method(), url: u.substring(0, 200), body: (req.postData() || '').substring(0, 500) });
    }
  });
  page.on('response', async (res) => {
    const u = res.url();
    if (u.includes('clerk') || u.includes('posthog') || u.includes('datadome') || u.includes('google') || u.includes('cloudflareinsights')) return;
    if (['xhr', 'fetch'].includes(res.request().resourceType())) {
      let body = '';
      try { body = (await res.text()).substring(0, 600); } catch (e) { body = ''; }
      sink.push({ t: Date.now(), dir: 'RES', status: res.status(), url: u.substring(0, 200), body });
    }
  });
}

/** Extrait les infos clés d'une page outil : prompts, options, crédits affichés */
async function toolInfo(page) {
  return page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null;
    const textareas = [...document.querySelectorAll('textarea')].filter(vis).map(t => ({ placeholder: t.placeholder.substring(0, 100), name: t.name, id: t.id }));
    const selects = [...document.querySelectorAll('select')].filter(vis).map(s => ({ name: s.name || s.id, options: [...s.options].map(o => o.textContent.trim()).slice(0, 20) }));
    const inputs = [...document.querySelectorAll('input')].filter(vis).filter(i => ['radio', 'checkbox', 'range', 'number'].includes(i.type) || i.name).map(i => ({ type: i.type, name: i.name, id: i.id, placeholder: i.placeholder, value: (i.type === 'range' ? i.value : ''), checked: i.checked })).slice(0, 40);
    const buttons = [...document.querySelectorAll('button')].filter(vis).map(b => ({ text: (b.textContent || '').trim().substring(0, 50), disabled: b.disabled })).filter(b => b.text).slice(0, 60);
    const costs = [...document.body.innerText.matchAll(/(\d[\d,\.]*)\s*(?:credits?|cr\.?)/gi)].map(m => m[0]).slice(0, 20);
    const credits = (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*\s*)?credits?/i) || [])[0] || null;
    const tabs = [...document.querySelectorAll('[role="tab"]')].filter(vis).map(t => t.textContent.trim().substring(0, 40)).slice(0, 20);
    const links = [...document.querySelectorAll('a')].filter(vis).map(a => ({ text: (a.textContent || '').trim().substring(0, 40), href: (a.getAttribute('href') || '').substring(0, 80) })).filter(l => l.text).slice(0, 50);
    const sliders = [...document.querySelectorAll('[role="slider"]')].filter(vis).map(s => ({ label: (s.getAttribute('aria-label') || '').substring(0, 40), valuenow: s.getAttribute('aria-valuenow'), valuemin: s.getAttribute('aria-valuemin'), valuemax: s.getAttribute('aria-valuemax') }));
    return { url: location.href, title: document.title, textareas, selects, inputs, buttons, costs, credits, tabs, links, sliders, bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 2000) };
  });
}

(async () => {
  const toolKey = process.argv[2] || 'image';
  const tool = TOOLS[toolKey];
  if (!tool) { log('outils dispo: ' + Object.keys(TOOLS).join(', ')); process.exit(1); }
  log('OUTIL: ' + tool.name + ' → ' + tool.url);

  const { browser, page } = await launch();
  const net = [];
  watchNet(page, net);

  try {
    // ── Vérif session d'abord (page generate = privée)
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000);
    if (page.url().includes('/auth') || page.url().includes('/login')) {
      log('❌ PAS DE SESSION — login requis avant les tests');
      fs.writeFileSync(`${OUT}/p9-${toolKey}-NOSESSION.json`, JSON.stringify({ url: page.url() }, null, 2));
      await browser.close();
      process.exit(2);
    }
    log('✅ session OK');

    // ── Navigation vers l'outil
    const t0 = Date.now();
    await page.goto(tool.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);
    await dismissCookies(page);
    const loadMs = Date.now() - t0;
    log('chargement outil: ' + loadMs + 'ms — ' + page.url());
    await page.screenshot({ path: `${OUT}/p9-${toolKey}-01-landing.png`, fullPage: false });

    // ── Détecter un onboarding/modal éventuel
    const modalBtns = page.locator('button:visible', { hasText: /^(skip|got it|close|later|start|continue|next)$/i });
    let nModals = 0;
    while ((await modalBtns.count()) > 0 && nModals < 5) {
      try { await modalBtns.first().click({ timeout: 3000 }); nModals++; await page.waitForTimeout(2000); } catch (e) { break; }
    }
    if (nModals > 0) { log(nModals + ' modal(s) onboarding fermée(s)'); await page.screenshot({ path: `${OUT}/p9-${toolKey}-02-after-modals.png` }); }

    // ── Analyse UI complète
    const info = await toolInfo(page);
    fs.writeFileSync(`${OUT}/p9-${toolKey}-03-ui.json`, JSON.stringify({ loadMs, ...info }, null, 2));
    log('CREDITS: ' + info.credits + ' | coûts vus: ' + JSON.stringify(info.costs.slice(0, 8)));
    log('TEXTAREAS: ' + JSON.stringify(info.textareas));
    log('TABS: ' + JSON.stringify(info.tabs.slice(0, 10)));
    log('SELECTS: ' + JSON.stringify(info.selects.map(s => ({ n: s.name, nOpts: s.options.length }))));
    log('BOUTONS(20): ' + JSON.stringify(info.buttons.filter(b => !b.disabled).slice(0, 20).map(b => b.text)));
    log('SLIDERS: ' + JSON.stringify(info.sliders));
    log('BODY(300): ' + info.bodyText.substring(0, 300));
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-${toolKey}-error.png` }).catch(() => {});
  }
  fs.writeFileSync(`${OUT}/p9-${toolKey}-net.json`, JSON.stringify(net, null, 2));
  log('req réseau capturées: ' + net.length);
  await browser.close();
  log('Terminé');
})();
