/**
 * SIGNUP-FULL — Création du compte test avec Chromium COMPLET headful (Xvfb)
 * + strip CSP (libère les sondes Turnstile) + lecture auto du code mail.tm
 * + onboarding + dump final (crédits/plan)
 * Lancer : DISPLAY=:99 HF_BROWSER=full HF_PROFILE=.hf-phase9-test2-profile setsid nohup node signup-full.js …
 */
const { launch, dismissCookies, log, OUT } = require('./hf-common');
const { loadMailbox, pollForCode } = require('./mail-provider');
const fs = require('fs');

const ROOT = '/home/z/my-project';
const STATUS = `${ROOT}/.hf-phase9-signup-status.json`;
const ACCOUNT_FILE = `${ROOT}/.hf-phase9-test-account.json`;
const HF_PASSWORD = 'Phase9-HfTest!2026';
const writeStatus = (s, extra = {}) => fs.writeFileSync(STATUS, JSON.stringify({ status: s, t: new Date().toISOString(), ...extra }, null, 2));

async function detect(page) {
  const [email, password, code, firstName, lastName] = await Promise.all([
    page.locator('input[name="email"]:visible').count(),
    page.locator('input[type="password"]:visible').count(),
    page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').count(),
    page.locator('input[name="firstName"]:visible, input[name="first_name"]:visible').count(),
    page.locator('input[name="lastName"]:visible, input[name="last_name"]:visible').count(),
  ]);
  const err = await page.evaluate(() => {
    const t = document.body.innerText;
    const m = t.match(/([^\n]{0,40}(?:not allowed|already registered|already in use|already exists|blocked|disposable|captcha failed|try another)[^\n]{0,70})/i);
    return m ? m[0].trim() : null;
  }).catch(() => null);
  return { url: page.url(), email, password, code, firstName, lastName, err };
}

const isAuthed = (url) => !/\/auth|\/sign-(?:in|up)|\/login/.test(url);

async function acceptTerms(page) {
  return page.evaluate(() => {
    const vis = (el) => el.offsetParent !== null;
    const cands = [...document.querySelectorAll('span, label')].filter(vis)
      .filter(el => /^I agree/i.test((el.textContent || '').trim()) && (el.textContent || '').length < 300);
    if (cands.length === 0) return { clicked: false };
    cands[cands.length - 1].click();
    return { clicked: true };
  }).catch(() => ({ clicked: false }));
}

const dumpIframes = (page) => page.evaluate(() => {
  const walk = (root, depth) => {
    const out = [];
    root.querySelectorAll('iframe').forEach(f => {
      const r = f.getBoundingClientRect();
      out.push({ depth, src: (f.src || '').substring(0, 90), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), visible: r.width > 0 && r.height > 0 });
    });
    root.querySelectorAll('*').forEach(el => { if (el.shadowRoot) out.push(...walk(el.shadowRoot, depth + 1)); });
    return out;
  };
  return walk(document, 0);
});

(async () => {
  let browser = null, page = null;
  try {
    const mail = loadMailbox();
    log('mailbox: ' + mail.address);
    writeStatus('FULL_FLOW_START', { mail: mail.address });
    ({ browser, page } = await launch());

    // ── Strip CSP + blocage ressources lourdes (mémoire : ni images/fonts/CSS pour le flux auth)
    await page.route('**/*', async (route) => {
      const req = route.request();
      if (['image', 'media', 'font', 'stylesheet'].includes(req.resourceType())) { return route.abort(); }
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

    // Journal Clerk
    page.on('response', async (res) => {
      const u = res.url();
      if (u.includes('_clerk') && res.request().method() === 'POST') {
        let b = ''; try { b = (await res.text()).substring(0, 220); } catch (e) { }
        log('← CLERK ' + res.status() + ' ' + u.split('?')[0].replace('https://higgsfield.ai', '').substring(0, 60) + ' :: ' + b.replace(/\n/g, ' ').substring(0, 180));
      }
    });

    // ══ ÉCRAN 1
    await page.goto('https://higgsfield.ai/auth/sign-up', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);
    await dismissCookies(page);
    let st = await detect(page);
    if (st.email === 0) throw new Error('écran 1 sans email — ' + st.url);
    const em = page.locator('input[name="email"]:visible').last();
    await em.click({ timeout: 8000 }).catch(() => { });
    await em.pressSequentially(mail.address, { delay: 30 });
    await page.waitForTimeout(800);
    let screen2 = false;
    for (let t = 1; t <= 3 && !screen2; t++) {
      await acceptTerms(page);
      await page.waitForTimeout(700);
      const cont = em.locator('xpath=ancestor::form[1]').locator('button[type="submit"]:visible').first();
      if ((await cont.count()) > 0) await cont.click({ timeout: 6000 });
      else await em.press('Enter');
      log('Continue essai ' + t);
      await page.waitForTimeout(9000);
      if (page.url().includes('/auth/email/sign-up')) screen2 = true;
    }
    if (!screen2) throw new Error('écran 1 → 2 échoué: ' + page.url());
    log('✓ écran 2');
    writeStatus('SCREEN2', { mail: mail.address });

    // ══ ÉCRAN 2
    st = await detect(page);
    const em2 = page.locator('input[name="email"]:visible').last();
    if (st.email > 0 && !(await em2.inputValue().catch(() => ''))) {
      await em2.click({ timeout: 5000 }).catch(() => { }); await em2.pressSequentially(mail.address, { delay: 30 });
    }
    const pwd = page.locator('input[type="password"]:visible').last();
    await pwd.click({ timeout: 8000 }).catch(() => { });
    await pwd.pressSequentially(HF_PASSWORD, { delay: 20 });
    await page.waitForTimeout(1000);
    if (st.firstName > 0) {
      const fn = page.locator('input[name="firstName"]:visible, input[name="first_name"]:visible').first();
      await fn.pressSequentially('Alex', { delay: 25 }).catch(() => { });
    }
    if (st.lastName > 0) {
      const ln = page.locator('input[name="lastName"]:visible, input[name="last_name"]:visible').first();
      await ln.pressSequentially('Test', { delay: 25 }).catch(() => { });
    }
    await page.screenshot({ path: `${OUT}/p9f-01-screen2.png` });

    // ══ SIGN UP + Turnstile
    const submit = page.locator('input[type="submit"]:visible').first();
    await submit.click({ timeout: 8000 });
    log('clic Sign up');

    let codeSeen = false, authed = false, widgetClicked = false;
    for (let w = 0; w < 20; w++) {
      await page.waitForTimeout(3000);
      log(`  [hb ${w}] ${page.url().substring(0, 60)}`);
      st = await detect(page);
      if (isAuthed(st.url)) { authed = true; log('🎉 AUTHED direct'); break; }
      if (st.code > 0) { codeSeen = true; log('🎉 ÉCRAN CODE'); break; }
      if (st.err) log('err: ' + st.err);
      // widget interactif ? (détails + clic large)
      const fs_ = await dumpIframes(page);
      if (w % 3 === 0 && fs_.length > 0) log('  iframes: ' + fs_.map(f => `${f.w}x${f.h}@${f.x},${f.y} vis=${f.visible} ${f.src.substring(0, 45)}`).join(' | '));
      const widget = fs_.find(f => f.visible && /challenges\.cloudflare/i.test(f.src)) || fs_.find(f => f.visible && f.w >= 150 && f.h >= 40);
      if (widget && !widgetClicked) {
        log('🎯 widget Turnstile: ' + JSON.stringify(widget));
        await page.mouse.click(widget.x + 28, widget.y + widget.h / 2);
        widgetClicked = true;
        await page.waitForTimeout(8000);
        const s2 = page.locator('input[type="submit"]:visible').first();
        if ((await s2.count()) > 0 && (await page.locator('input[type="password"]:visible').count()) > 0) {
          await s2.click({ timeout: 6000 }).catch(() => { }); log('clic Sign up #2 après widget');
        }
        continue;
      }
      if (w % 5 === 4) log('  attente ' + (w * 3) + 's — iframes=' + fs_.length);
    }
    await page.screenshot({ path: `${OUT}/p9f-02-after-signup.png` });

    // ══ CODE MAIL.TM
    if (codeSeen && !authed) {
      writeStatus('WAITING_CODE', { mail: mail.address });
      log('⏳ code mail.tm…');
      const res = await pollForCode(mail, Date.now() - 120000, 8 * 60 * 1000);
      if (!res) throw new Error('code non reçu');
      log('📩 code: ' + res.code);
      const codeField = page.locator('input[name="code"]:visible, input[autocomplete="one-time-code"]:visible').first();
      await codeField.click({ timeout: 8000 });
      await codeField.pressSequentially(res.code, { delay: 45 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${OUT}/p9f-03-code.png` });
      await codeField.press('Enter', { timeout: 5000 }).catch(() => { });
      await page.waitForTimeout(5000);
      const vBtn = page.locator('input[type="submit"]:visible, button:text-is("Verify"):visible, button:text-is("Continue"):visible').first();
      if (!isAuthed(page.url()) && (await vBtn.count()) > 0) { await vBtn.click({ timeout: 6000 }).catch(() => { }); log('clic verify'); }
      for (let w = 0; w < 12; w++) {
        await page.waitForTimeout(3000);
        if (isAuthed(page.url())) { authed = true; break; }
      }
      await page.screenshot({ path: `${OUT}/p9f-04-after-code.png` });
    }

    if (!authed) throw new Error('non authentifié — url=' + page.url() + ' err=' + (st.err || 'aucun'));

    // ══ COMPTE CRÉÉ
    fs.writeFileSync(ACCOUNT_FILE, JSON.stringify({ email: mail.address, password: HF_PASSWORD, mailboxFile: '.hf-phase9-mailbox.json', createdAt: new Date().toISOString(), browser: 'chromium-full-xvfb' }, null, 2));
    writeStatus('ONBOARDING');
    log('🎉 COMPTE CRÉÉ: ' + mail.address);

    // ══ ONBOARDING
    for (let step = 0; step < 8; step++) {
      await page.waitForTimeout(5000);
      await dismissCookies(page);
      await page.screenshot({ path: `${OUT}/p9f-ob-${step}.png` });
      const ob = await page.evaluate(() => {
        const vis = (el) => el.offsetParent !== null;
        const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.textContent.trim().substring(0, 70)).filter(Boolean);
        const texts = [...document.querySelectorAll('input[type="text"], input:not([type])')].filter(vis).map(i => ({ name: i.name || i.id || i.placeholder, ph: (i.placeholder || '').substring(0, 50) }));
        const btns = [...document.querySelectorAll('button')].filter(vis).map(b => (b.textContent || '').trim().substring(0, 40)).filter(Boolean);
        return { url: location.href, headings, texts, btns: btns.slice(0, 25) };
      });
      log(`[ob ${step}] ${ob.url.substring(0, 55)} :: ${JSON.stringify(ob.headings).substring(0, 130)}`);
      if (ob.texts.length > 0 && /name|call you|username/i.test(JSON.stringify(ob.texts))) {
        const nf = page.locator('input[type="text"]:visible, input:not([type]):visible').first();
        await nf.click({ timeout: 5000 }).catch(() => { });
        await nf.pressSequentially('AlexTest', { delay: 25, timeout: 10000 }).catch(() => { });
        await page.waitForTimeout(600);
      }
      await acceptTerms(page);
      const next = page.locator('button:visible', { hasText: /^(continue|next|start|get started|skip|done|let'?s go|create|finish)$/i }).first();
      const hasAction = (await next.count()) > 0;
      if (hasAction) {
        try { const t = ((await next.textContent()) || '').trim(); await next.click({ timeout: 4000 }); log('  clic: ' + t); } catch (e) { }
        await page.waitForTimeout(4500);
      } else {
        await page.keyboard.press('Escape').catch(() => { });
      }
      if (isAuthed(ob.url) && !hasAction) break;
    }

    // ══ DUMP FINAL
    await page.goto('https://higgsfield.ai/generate', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(12000);
    await dismissCookies(page);
    await page.screenshot({ path: `${OUT}/p9f-05-final.png` });
    const full = await page.evaluate(() => {
      const credits = (document.body.innerText.match(/(\d[\d,\.]*)\s*(?:\/\s*\d[\d,\.]*)?\s*credits?/i) || [])[0] || null;
      const nav = [...document.querySelectorAll('nav a, aside a')].map(a => ({ t: (a.textContent || '').trim().substring(0, 30), h: (a.getAttribute('href') || '').substring(0, 60) })).filter(l => l.t && l.h).slice(0, 40);
      return { url: location.href, credits, nav, bodyText: document.body.innerText.replace(/\s+/g, ' ').substring(0, 1500) };
    });
    fs.writeFileSync(`${OUT}/p9f-final-state.json`, JSON.stringify(full, null, 2));
    log('CRÉDITS: ' + full.credits);
    writeStatus('DONE', { credits: full.credits, account: mail.address });
  } catch (e) {
    log('ERREUR: ' + e.message);
    writeStatus('FAILED', { error: e.message });
    if (page) await page.screenshot({ path: `${OUT}/p9f-error.png` }).catch(() => { });
  }
  if (browser) await browser.close();
  log('signup-full terminé');
})();
