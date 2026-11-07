/**
 * PROBE TURNSTILE v3 — Strip CSP (libère les sondes internes de Turnstile)
 * + attente longue du widget interactif + clic + resoumission
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const { loadMailbox } = require('./mail-provider');

(async () => {
  const mail = loadMailbox();
  const { browser, page } = await launch();

  // ── Strip CSP sur les documents (laisse Turnstile fonctionner normalement)
  await page.route('**/*', async (route) => {
    const req = route.request();
    if (req.resourceType() === 'document') {
      try {
        const response = await route.fetch();
        const headers = { ...response.headers };
        delete headers['content-security-policy'];
        delete headers['content-security-policy-report-only'];
        await route.fulfill({ response, headers });
      } catch (e) { await route.continue(); }
    } else {
      await route.continue();
    }
  });

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
    if (res.status() >= 400 && !/google|clerk|gstatic/.test(u)) {
      log('← HTTP ' + res.status() + ' ' + u.substring(0, 110));
    }
  });

  const dumpIframes = () => page.evaluate(() => {
    const walk = (root, depth) => {
      const out = [];
      root.querySelectorAll('iframe').forEach(f => {
        const r = f.getBoundingClientRect();
        out.push({ depth, src: (f.src || '').substring(0, 90), title: (f.title || '').substring(0, 40), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), visible: r.width > 0 && r.height > 0 });
      });
      root.querySelectorAll('*').forEach(el => { if (el.shadowRoot) out.push(...walk(el.shadowRoot, depth + 1)); });
      return out;
    };
    return walk(document, 0);
  });

  try {
    // ── Flux complet
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

    // ── Clic Sign up
    const submit = page.locator('input[type="submit"]:visible').first();
    await submit.click({ timeout: 8000 });
    log('clic Sign up #1');

    // ── Observer 60 s : POST clerk / widget / code screen / authed
    let done = false, widgetClicked = false;
    for (let w = 0; w < 20 && !done; w++) {
      await page.waitForTimeout(3000);
      const url = page.url();
      const hasCode = await page.locator('input[name="code"]:visible').count();
      if (hasCode > 0) { log('🎉 ÉCRAN CODE — ' + url); done = true; break; }
      if (!/\/auth/.test(url)) { log('🎉 AUTHED — ' + url); done = true; break; }

      // chercher le widget interactif
      const fs = await dumpIframes();
      const widget = fs.find(f => f.visible && (f.w >= 200 && f.h >= 50));
      if (widget && !widgetClicked) {
        log('🎯 WIDGET APPARU: ' + JSON.stringify(widget));
        await page.mouse.click(widget.x + 28, widget.y + widget.h / 2);
        widgetClicked = true;
        log('clic widget effectué');
        await page.waitForTimeout(8000);
        // resoumettre après le widget
        const s2 = page.locator('input[type="submit"]:visible').first();
        if ((await s2.count()) > 0 && (await page.locator('input[type="password"]:visible').count()) > 0) {
          await s2.click({ timeout: 6000 }).catch(() => { }); log('clic Sign up #2');
        }
        continue;
      }
      if (w % 5 === 4) log('  attente (' + (w * 3) + 's)… iframes=' + fs.length + ' url=' + url.substring(0, 60));
    }
    await page.screenshot({ path: `${OUT}/p9-ts3-final.png` });
    log(done ? 'SUCCÈS' : 'toujours pas de progression après 60 s');
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-ts3-error.png` }).catch(() => { });
  }
  await browser.close();
  log('probe turnstile v3 terminé');
})();
