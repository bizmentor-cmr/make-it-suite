/**
 * PROBE TURNSTILE v2 — Sign up → le widget apparaît → clic widget → resoumettre
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const { loadMailbox } = require('./mail-provider');

(async () => {
  const mail = loadMailbox();
  const { browser, page } = await launch();

  page.on('console', (msg) => {
    const t = msg.text();
    if (msg.type() === 'error' && !/GSI_LOGGER|accounts list/.test(t)) log('CONSOLE: ' + t.substring(0, 120));
  });
  page.on('response', async (res) => {
    const u = res.url();
    if (u.includes('_clerk') && res.request().method() === 'POST') {
      let b = ''; try { b = (await res.text()).substring(0, 300); } catch (e) { }
      log('← CLERK POST ' + res.status() + ' :: ' + b.replace(/\n/g, ' ').substring(0, 250));
    }
  });

  const dumpIframes = () => page.evaluate(() => {
    const walk = (root, depth) => {
      const out = [];
      root.querySelectorAll('iframe').forEach(f => {
        const r = f.getBoundingClientRect();
        out.push({ depth, src: (f.src || '').substring(0, 100), title: (f.title || '').substring(0, 50), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), visible: r.width > 0 && r.height > 0 });
      });
      root.querySelectorAll('*').forEach(el => { if (el.shadowRoot) out.push(...walk(el.shadowRoot, depth + 1)); });
      return out;
    };
    return walk(document, 0);
  });

  try {
    // ── Flux complet écran 1 → écran 2
    await page.goto('https://higgsfield.ai/auth/sign-up', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);
    const em = page.locator('input[name="email"]:visible').last();
    await em.click({ timeout: 8000 });
    await em.pressSequentially(mail.address, { delay: 25 });
    await page.waitForTimeout(700);
    await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      const cands = [...document.querySelectorAll('span, label')].filter(vis).filter(el => /^I agree/i.test((el.textContent || '').trim()));
      if (cands.length) cands[cands.length - 1].click();
    });
    await page.waitForTimeout(600);
    const cont = em.locator('xpath=ancestor::form[1]').locator('button[type="submit"]:visible').first();
    await cont.click({ timeout: 6000 });
    await page.waitForTimeout(8000);
    log('écran 2: ' + page.url());

    const em2 = page.locator('input[name="email"]:visible').last();
    if (!(await em2.inputValue().catch(() => ''))) { await em2.click(); await em2.pressSequentially(mail.address, { delay: 25 }); }
    const pwd = page.locator('input[type="password"]:visible').last();
    await pwd.click({ timeout: 8000 });
    await pwd.pressSequentially('Phase9-HfTest!2026', { delay: 15 });
    await page.waitForTimeout(1200);

    // ── 1er clic Sign up
    const submit = page.locator('input[type="submit"]:visible').first();
    await submit.click({ timeout: 8000 });
    log('clic Sign up #1');

    // ── Attendre l'apparition du widget (10 s)
    let widget = null;
    for (let w = 0; w < 5; w++) {
      await page.waitForTimeout(2000);
      const fs = await dumpIframes();
      log('iframes: ' + fs.length + (fs.length ? ' — ' + fs.map(f => `${f.w}x${f.h}@${f.x},${f.y} vis=${f.visible} src=${f.src.substring(0, 50)}`).join(' | ') : ''));
      widget = fs.find(f => f.visible && /challenges\.cloudflare|turnstile/i.test(f.src + ' ' + f.title)) || fs.find(f => f.visible && f.w >= 200 && f.h >= 50);
      if (widget) break;
    }

    if (widget) {
      log('🎯 WIDGET: ' + JSON.stringify(widget));
      await page.mouse.click(widget.x + 28, widget.y + widget.h / 2);
      log('clic checkbox widget');
      await page.waitForTimeout(9000);
      await page.screenshot({ path: `${OUT}/p9-ts2-widget-clicked.png` });
      // resoumettre
      const submit2 = page.locator('input[type="submit"]:visible').first();
      if ((await submit2.count()) > 0) { await submit2.click({ timeout: 8000 }); log('clic Sign up #2'); }
      else log('plus de bouton Sign up (navigation ?) — url=' + page.url());
    } else {
      log('pas de widget apparu — screenshot état');
      await page.screenshot({ path: `${OUT}/p9-ts2-no-widget.png` });
    }

    // ── Observer 45 s : code screen / authed / POST clerk
    for (let w = 0; w < 15; w++) {
      await page.waitForTimeout(3000);
      const url = page.url();
      const hasCode = await page.locator('input[name="code"]:visible').count();
      if (hasCode > 0) { log('🎉 ÉCRAN CODE ATTEINT — ' + url); break; }
      if (!/\/auth/.test(url)) { log('🎉 AUTHED — ' + url); break; }
      if (w % 4 === 3) log('  attente… ' + url);
    }
    await page.screenshot({ path: `${OUT}/p9-ts2-final.png` });
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-ts2-error.png` }).catch(() => { });
  }
  await browser.close();
  log('probe turnstile v2 terminé');
})();
