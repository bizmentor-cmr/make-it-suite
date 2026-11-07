/**
 * PROBE FORM — Dump complet du formulaire /auth/email/sign-up
 * Objectif : trouver le champ required qui bloque la soumission (checkbox Terms ?)
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const { loadMailbox } = require('./mail-provider');
const fs = require('fs');

(async () => {
  const mail = loadMailbox();
  const { browser, page } = await launch();
  try {
    await page.goto('https://higgsfield.ai/auth/email/sign-up', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies(page);

    // Remplir email + password pour que le bouton s'active
    const em = page.locator('input[name="email"]:visible').last();
    if ((await em.count()) > 0) {
      const val = await em.inputValue().catch(() => '');
      if (!val) { await em.click(); await em.pressSequentially(mail.address, { delay: 25 }); }
    }
    const pwd = page.locator('input[type="password"]:visible').last();
    const pv = await pwd.inputValue().catch(() => '');
    if (!pv) { await pwd.click(); await pwd.pressSequentially('Phase9-HfTest!2026', { delay: 15 }); }
    await page.waitForTimeout(1000);

    // ── Dump complet du formulaire VISIBLE
    const dump = await page.evaluate(() => {
      const vis = (el) => el.offsetParent !== null;
      const forms = [...document.querySelectorAll('form')].map((f, fi) => ({
        idx: fi,
        visible: vis(f),
        cls: (f.className || '').toString().substring(0, 80),
        novalidate: f.noValidate,
        // tous les inputs avec leurs attributs de validation
        inputs: [...f.querySelectorAll('input, select, textarea')].map(i => ({
          tag: i.tagName, type: i.type, name: i.name || i.id || '(anon)',
          required: i.required, checked: i.checked, disabled: i.disabled,
          visible: vis(i), value: i.type === 'password' ? '(masked ' + (i.value || '').length + ')' : (i.value || '').substring(0, 40),
          ariaReq: i.getAttribute('aria-required'), ariaCheck: i.getAttribute('aria-checked'),
        })),
        buttons: [...f.querySelectorAll('button, input[type="submit"]')].map(b => ({
          tag: b.tagName, type: b.type, text: (b.textContent || b.value || '').trim().substring(0, 30),
          disabled: b.disabled, visible: vis(b),
        })),
      }));
      // checkboxes ANYWHERE (même hors form)
      const anyCb = [...document.querySelectorAll('input[type="checkbox"], [role="checkbox"]')].map(c => ({
        inForm: !!c.closest('form'), visible: vis(c), checked: c.checked || c.getAttribute('aria-checked') === 'true',
        required: c.required, html: c.outerHTML.replace(/\s+/g, ' ').substring(0, 250),
      }));
      // validation native du form
      let validity = null;
      try {
        const f = [...document.querySelectorAll('form')].find(vis);
        if (f) validity = [...f.querySelectorAll('input,select,textarea')].filter(i => vis(i)).map(i => ({ n: i.name || i.id || i.type, valid: i.checkValidity(), msg: i.validationMessage })).filter(x => !x.valid);
      } catch (e) { validity = 'err: ' + e.message; }
      return { forms, anyCb, validity };
    });
    fs.writeFileSync(`${OUT}/p9-probe-form-dump.json`, JSON.stringify(dump, null, 2));
    log('VALIDITY (champs invalides): ' + JSON.stringify(dump.validity));
    log('CHECKBOXES: ' + JSON.stringify(dump.anyCb, null, 1).substring(0, 800));
    for (const f of dump.forms) {
      log(`FORM ${f.idx} vis=${f.visible} novalidate=${f.novalidate} cls=${f.cls}`);
      log('  inputs: ' + JSON.stringify(f.inputs));
      log('  buttons: ' + JSON.stringify(f.buttons));
    }
    await page.screenshot({ path: `${OUT}/p9-probe-form-filled.png` });
  } catch (e) {
    log('ERREUR: ' + e.message);
  }
  await browser.close();
  log('probe form terminé');
})();
