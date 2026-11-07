/**
 * FLOW 1 — Simulation utilisateur : visite → login → onboarding → dashboard
 * Playwright avec profil persistant + screenshots à chaque étape
 */
const { chromium } = require('/home/z/.npm-global/lib/node_modules/playwright');
const fs = require('fs');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const OUT = '/home/z/my-project/reverse-higgsfield/05-user-flows/captures';
const EMAIL = 'charles.fabou@yahoo.fr';
const PASSWORD = 'U6B9iGs+quVj/79';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launchPersistentContext('/tmp/hf_user_profile', {
    headless: true,
    executablePath: '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled'],
    locale: 'en-US',
    timezoneId: 'Europe/London',
  });
  const page = browser.pages()[0] || await browser.newPage();
  const log = (m) => console.log(`[${new Date().toISOString().substring(11, 19)}] ${m}`);

  try {
    // ÉTAPE 0 — Rejeter le bandeau cookies (Securiti) s'il bloque
    const dismissCookies = async () => {
      const selectors = [
        'button:has-text("Reject All")', 'button:has-text("Reject")',
        'button:has-text("Allow All")', 'button:has-text("Allow")',
        '.cc-dismiss', '.cc-close', '#cookieconsent:has(button)',
      ];
      for (const sel of selectors) {
        const el = page.locator(sel).first();
        try {
          if (await el.count() > 0 && await el.isVisible()) {
            await el.click({ timeout: 3000 });
            log('Cookies dismissé via ' + sel);
            await page.waitForTimeout(1500);
            return true;
          }
        } catch (e) { /* continue */ }
      }
      // tenter le petit X / chevron de la bannière
      try {
        const cc = page.locator('.cc-window, [aria-label="cookieconsent"]').first();
        if (await cc.count() > 0) {
          const closeBtn = cc.locator('button').first();
          if (await closeBtn.count() > 0) { await closeBtn.click({ timeout: 3000 }); log('Cookies fermé (premier bouton)'); await page.waitForTimeout(1500); return true; }
        }
      } catch (e) { /* ignore */ }
      // Dernier recours : suppression DOM du bandeau
      try {
        const removed = await page.evaluate(() => {
          const w = document.querySelector('.cc-window, [aria-label="cookieconsent"]');
          if (w) { w.remove(); return true; }
          return false;
        });
        if (removed) { log('Cookies banner supprimé du DOM'); await page.waitForTimeout(500); return true; }
      } catch (e) { /* ignore */ }
      return false;
    };

    // ÉTAPE 1 — Homepage
    log('ÉTAPE 1: homepage');
    await page.goto('https://higgsfield.ai/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    await dismissCookies();
    await page.screenshot({ path: `${OUT}/flow1-01-homepage.png` });

    // ÉTAPE 2 — Cliquer Log in
    log('ÉTAPE 2: recherche bouton login');
    const loginSel = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a,button')];
      const el = links.find(e => /log ?in|sign ?in/i.test(e.textContent || '') && (e.textContent || '').length < 25);
      if (el) { 
        const r = el.getBoundingClientRect();
        return { found: true, text: el.textContent.trim().substring(0, 40), href: el.href || '', tag: el.tagName, x: Math.round(r.x), y: Math.round(r.y) };
      }
      return { found: false };
    });
    log('Bouton login: ' + JSON.stringify(loginSel));

    if (loginSel.found && loginSel.href) {
      log('Navigation vers: ' + loginSel.href);
      await page.goto(loginSel.href, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } else {
      // fallback : URL login connue
      await page.goto('https://higgsfield.ai/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    await page.waitForTimeout(8000);
    await dismissCookies();  // la bannière se régénère à chaque navigation
    await page.screenshot({ path: `${OUT}/flow1-02-page-login.png` });
    log('URL après clic login: ' + page.url());

    // ÉTAPE 3 — Identifier le formulaire (Clerk ?)
    const formInfo = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll('input')].map(i => ({ type: i.type, name: i.name, id: i.id, placeholder: i.placeholder, autocomplete: i.autocomplete, visible: i.offsetParent !== null }));
      const buttons = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null).map(b => (b.textContent || '').trim().substring(0, 40)).filter(Boolean);
      const iframes = [...document.querySelectorAll('iframe')].map(f => ({ src: (f.src || '').substring(0, 120), name: f.name }));
      const hasClerk = !!document.querySelector('[data-clerk], .cl-') || document.body.innerHTML.includes('clerk');
      return { url: location.href, title: document.title, inputs, buttons: buttons.slice(0, 15), iframes, hasClerk };
    });
    log('FORM INFO: ' + JSON.stringify(formInfo).substring(0, 1200));
    fs.writeFileSync(`${OUT}/flow1-03-form-analysis.json`, JSON.stringify(formInfo, null, 2));

    // ÉTAPE 4 — Remplir l'email (input VISIBLE, pas celui du portal caché)
    // Stratégie : scoper au <form> qui contient l'input visible
    const emailInput = page.locator('input[name="email"]:visible').last();
    if (await emailInput.count() > 0) {
      log('ÉTAPE 4: saisie email (frappe simulée)');
      await emailInput.click({ timeout: 10000 });
      await emailInput.pressSequentially(EMAIL, { delay: 25, timeout: 20000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/flow1-04-email-filled.png` });

      // Re-dismiss cookies si réapparu
      await dismissCookies();

      // Bouton Continue EXACT visible
      const continueBtn = emailInput.locator('xpath=ancestor::form[1]').locator('button[type="submit"]:visible').last()
        .or(page.locator('button:text-is("Continue"):visible').last());
      log('Boutons Continue visibles: ' + await page.locator('button:text-is("Continue"):visible').count());
      const btnToClick = page.locator('button:text-is("Continue"):visible').last();
      if (await btnToClick.count() > 0) { await btnToClick.click({ timeout: 10000 }); log('Clic Continue (visible)'); }
      else if (await continueBtn.count() > 0) { await continueBtn.click({ timeout: 10000 }); log('Clic Continue (form-scoped)'); }
      await page.waitForTimeout(8000);
      await page.screenshot({ path: `${OUT}/flow1-05-after-email.png` });
      log('URL après email: ' + page.url().substring(0, 120));

      // ÉTAPE 5 — Mot de passe (exclut le champ caché Google hiddenPassword)
      const pwdInput = page.locator('input[type="password"]:visible').last();
      const pwdCount = await pwdInput.count();
      log('Champ password visible présent: ' + pwdCount);
      if (pwdCount > 0) {
        await pwdInput.click({ timeout: 10000 }).catch(() => {});
        await pwdInput.pressSequentially(PASSWORD, { delay: 15, timeout: 20000 });
        await page.waitForTimeout(800);
        await page.screenshot({ path: `${OUT}/flow1-06-password-filled.png` });
        // Soumission : Enter dans le champ, puis fallback bouton "Log in" texte exact
        await pwdInput.press('Enter', { timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(2500);
        if (page.url().includes('/auth/email/sign-in')) {
          const loginBtn = page.locator('button', { hasText: /^Log in$/ }).last();
          const alt = page.locator('button:visible', { hasText: /log ?in/i }).last();
          try {
            if (await loginBtn.count() > 0) { await loginBtn.click({ timeout: 8000 }); log('Clic bouton "Log in"'); }
            else if (await alt.count() > 0) { await alt.click({ timeout: 8000 }); log('Clic bouton login (regex)'); }
          } catch (e) { log('Erreur clic login: ' + e.message.substring(0, 80)); }
        }
        // Attendre la redirection
        await page.waitForTimeout(20000);
        await page.screenshot({ path: `${OUT}/flow1-07-after-login.png` });
        log('URL après login: ' + page.url().substring(0, 120));
        // Détection d'erreur éventuelle
        const errText = await page.evaluate(() => {
          const t = document.body.innerText;
          const m = t.match(/(incorrect|invalid|error|failed|wrong|too many|locked|verify)[^\n]{0,100}/i);
          return m ? m[0] : null;
        });
        if (errText) log('⚠️ Message d\'erreur détecté: ' + errText);
      } else {
        // pas de champ password visible : peut-être déjà connecté ou autre étape
        await page.screenshot({ path: `${OUT}/flow1-06-no-password-step.png` });
        log('Pas de champ password — état: ' + page.url().substring(0, 120));
      }
    }

    // Attendre la stabilisation et capturer l'état final
    await page.waitForTimeout(10000);
    await page.screenshot({ path: `${OUT}/flow1-08-final-state.png`, fullPage: false });
    log('URL FINALE: ' + page.url());

    // Si on est dans l'app, analyser le dashboard
    const finalState = await page.evaluate(() => {
      const nav = [...document.querySelectorAll('nav a, aside a, [role="navigation"] a')].map(a => ({ text: (a.textContent || '').trim().substring(0, 30), href: (a.getAttribute('href') || '').substring(0, 60) })).filter(l => l.text && l.href).slice(0, 40);
      const buttons = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null).map(b => (b.textContent || '').trim().substring(0, 35)).filter(Boolean).slice(0, 40);
      const headings = [...document.querySelectorAll('h1,h2,h3')].filter(h => h.offsetParent !== null).map(h => h.textContent.trim().substring(0, 60)).filter(Boolean).slice(0, 15);
      const credits = (document.body.innerText.match(/(\d[\d,]*)\s*credits?/i) || [])[0] || null;
      return { url: location.href, title: document.title, nav, buttons, headings, credits, bodySnippet: document.body.innerText.substring(0, 700) };
    });
    fs.writeFileSync(`${OUT}/flow1-09-dashboard-analysis.json`, JSON.stringify(finalState, null, 2));
    log('DASHBOARD: ' + JSON.stringify(finalState).substring(0, 900));

  } catch (e) {
    log('ERREUR: ' + e.message);
    await page.screenshot({ path: `${OUT}/flow1-error.png` }).catch(() => {});
  }

  await browser.close();
  log('Terminé');
})();
