/**
 * PROBE SIGNUP — Diagnostic interactif : DOM de la checkbox Terms + réseau au clic Continue
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const { loadMailbox } = require('./mail-provider');
const fs = require('fs');

(async () => {
  const mail = loadMailbox();
  log('mailbox: ' + mail.address);
  const { browser, page } = await launch();

  // Réseau : tout ce qui touche clerk
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('_clerk') || u.includes('sign')) {
      log('→ ' + req.method() + ' ' + u.replace('https://higgsfield.ai', '').substring(0, 100));
      if (req.postData()) log('   body: ' + req.postData().substring(0, 200));
    }
  });
  page.on('response', async (res) => {
    const u = res.url();
    if (u.includes('_clerk') || u.includes('sign')) {
      let b = '';
      try { b = (await res.text()).substring(0, 250); } catch (e) { }
      log('← ' + res.status() + ' ' + u.replace('https://higgsfield.ai', '').substring(0, 90) + ' :: ' + b.replace(/\n/g, ' '));
    }
  });
  page.on('console', (msg) => { if (msg.type() === 'error') log('CONSOLE ERR: ' + msg.text().substring(0, 150)); });

  try {
    await page.goto('https://higgsfield.ai/auth/sign-up', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);

    // ── 1. DOM autour de la checkbox Terms
    const termsDom = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      // chercher le texte "I agree"
      const walkers = [...document.querySelectorAll('label, div, span, p')].filter(vis).filter(el => /I agree|Terms of Use/i.test(el.textContent || '') && (el.textContent || '').length < 250);
      const target = walkers[walkers.length - 1]; // le plus profond
      if (!target) return { found: false };
      // remonter au conteneur de la checkbox
      let container = target;
      for (let i = 0; i < 3 && container.parentElement; i++) container = container.parentElement;
      return {
        found: true,
        deepText: (target.textContent || '').trim().substring(0, 150),
        html: container.outerHTML.replace(/\s+/g, ' ').substring(0, 1800),
      };
    });
    fs.writeFileSync(`${OUT}/p9-probe-terms-dom.json`, JSON.stringify(termsDom, null, 2));
    log('TERMS DOM: ' + JSON.stringify(termsDom).substring(0, 700));

    // ── 2. Structure du form (boutons + inputs)
    const formInfo = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      const forms = [...document.querySelectorAll('form')].map(f => ({
        action: f.action, id: f.id, cls: (f.className || '').toString().substring(0, 60),
        inputs: [...f.querySelectorAll('input')].map(i => `${i.type}:${i.name || i.id}[vis=${vis(i)}]`).slice(0, 8),
        buttons: [...f.querySelectorAll('button')].map(b => `${(b.textContent || '').trim().substring(0, 25)}[type=${b.type},d=${b.disabled},vis=${vis(b)}]`).slice(0, 6),
      }));
      return forms;
    });
    log('FORMS: ' + JSON.stringify(formInfo, null, 1).substring(0, 1200));

    // ── 3. Saisir email, cocher la checkbox par son vrai mécanisme, cliquer Continue
    const em = page.locator('input[name="email"]:visible').last();
    await em.click({ timeout: 8000 });
    await em.pressSequentially(mail.address, { delay: 25 });
    await page.waitForTimeout(600);

    // cocher via le label/conteneur trouvé
    const clicked = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      const cands = [...document.querySelectorAll('label, div, span')].filter(vis).filter(el => /I agree/i.test(el.textContent || '') && (el.textContent || '').length < 250);
      const label = cands[cands.length - 1];
      if (!label) return 'pas trouvé';
      // le clickable est probablement le premier enfant ou le label lui-même
      const clickable = label.querySelector('[role="checkbox"], [class*="box"], svg')?.parentElement || label;
      clickable.click();
      return 'cliqué: ' + clickable.tagName + '.' + (clickable.className || '').toString().substring(0, 50);
    });
    log('CHECKBOX: ' + clicked);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/p9-probe-terms-checked.png` });

    // ── 4. Clic Continue + observation réseau
    log('— clic Continue —');
    const btn = page.locator('button:text-is("Continue"):visible').first();
    await btn.click({ timeout: 8000 });
    await page.waitForTimeout(10000);
    log('URL après: ' + page.url());
    await page.screenshot({ path: `${OUT}/p9-probe-after-continue.png` });
    const st = await page.evaluate(() => ({
      url: location.href,
      inputs: [...document.querySelectorAll('input')].filter(i => i.offsetParent !== null).map(i => `${i.type}:${i.name || i.id}`).slice(0, 10),
      errs: (document.body.innerText.match(/[^\n]{0,30}(?:error|accept|valid|required|already)[^\n]{0,60}/gi) || []).slice(0, 5),
    }));
    log('ÉTAT: ' + JSON.stringify(st));
  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/p9-probe-error.png` }).catch(() => { });
  }
  await browser.close();
  log('probe terminé');
})();
