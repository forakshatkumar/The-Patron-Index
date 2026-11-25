const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5174';
const BASELINE_DIR = path.resolve(__dirname, '../../docs/audits/screenshots/baseline');
const POST_DIR = path.resolve(__dirname, '../../docs/audits/screenshots/post');
const CROSS_DIR = path.resolve(__dirname, '../../docs/audits/screenshots/cross-device');

[POST_DIR, CROSS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const DESKTOP_RESOLUTIONS = [
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1536x864', width: 1536, height: 864 },
  { name: '1920x1080', width: 1920, height: 1080 }
];

const CROSS_DEVICE_MATRIX = [
  { name: 'compact-mobile-320x568', width: 320, height: 568, category: 'Mobile' },
  { name: 'android-small-360x640', width: 360, height: 640, category: 'Mobile' },
  { name: 'iphone-se-375x667', width: 375, height: 667, category: 'Mobile' },
  { name: 'standard-mobile-390x844', width: 390, height: 844, category: 'Mobile' },
  { name: 'large-android-412x915', width: 412, height: 915, category: 'Mobile' },
  { name: 'large-iphone-430x932', width: 430, height: 932, category: 'Mobile' },
  { name: 'mobile-landscape-667x375', width: 667, height: 375, category: 'Mobile' },
  { name: 'mobile-landscape-844x390', width: 844, height: 390, category: 'Mobile' },
  { name: 'small-tablet-600x960', width: 600, height: 960, category: 'Tablet' },
  { name: 'tablet-portrait-768x1024', width: 768, height: 1024, category: 'Tablet' },
  { name: 'tablet-portrait-820x1180', width: 820, height: 1180, category: 'Tablet' },
  { name: 'tablet-landscape-1024x768', width: 1024, height: 768, category: 'Tablet' },
  { name: 'standard-desktop-1440x900', width: 1440, height: 900, category: 'Desktop' }
];

const PAGES = [
  { name: 'landing', path: '/', isAuth: false },
  { name: 'login', path: '/login', isAuth: false },
  { name: 'register', path: '/register', isAuth: false },
  { name: 'dashboard', path: '/dashboard', isAuth: true },
  { name: 'customers', path: '/customers', isAuth: true },
  { name: 'customer-profile', path: '/customers/CUST-1001', isAuth: true },
  { name: 'transactions', path: '/transactions', isAuth: true },
  { name: 'analytics', path: '/analytics', isAuth: true },
  { name: 'settings', path: '/settings', isAuth: true },
  { name: 'import', path: '/import', isAuth: true }
];

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function run() {
  console.log('Starting preview server on port 5174...');
  const server = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', '5174', '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
    detached: false
  });

  const testResults = {
    overflowChecks: [],
    desktopRegressions: [],
    mobileInteractions: []
  };

  try {
    await waitForServer(BASE_URL);
    console.log('Server is running. Launching Edge browser...');

    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true
    });

    // 1. Post-implementation Desktop Screenshots for visual regression
    console.log('\n--- PHASE A: CAPTURING POST-IMPLEMENTATION DESKTOP BASELINE ---');
    for (const res of DESKTOP_RESOLUTIONS) {
      const context = await browser.newContext({
        viewport: { width: res.width, height: res.height },
        deviceScaleFactor: 1
      });

      await context.addInitScript(() => {
        localStorage.setItem('patron_demo', 'true');
        localStorage.setItem('patron-business-settings', JSON.stringify({
          businessName: 'Apex Retailers',
          ownerName: 'Akshat Kumar',
          email: 'akshat@thepatronindex.com',
          phone: '+91 98765 43210',
          industry: 'Retail & Commerce',
          location: 'New Delhi, India'
        }));
      });

      for (const p of PAGES) {
        const page = await context.newPage();
        await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const filename = `${p.name}_${res.name}.png`;
        const postPath = path.join(POST_DIR, filename);
        await page.screenshot({ path: postPath, fullPage: false });

        // Compare file size / presence against baseline
        const baselinePath = path.join(BASELINE_DIR, filename);
        if (fs.existsSync(baselinePath)) {
          const baseSize = fs.statSync(baselinePath).size;
          const postSize = fs.statSync(postPath).size;
          const deltaPct = Math.abs((postSize - baseSize) / baseSize) * 100;
          testResults.desktopRegressions.push({
            page: p.name,
            resolution: res.name,
            baseSize,
            postSize,
            deltaPct: deltaPct.toFixed(2),
            passed: deltaPct < 5 // Under 5% variance (minor render timestamp / animation frame jitter)
          });
        }
        await page.close();
      }
      await context.close();
    }

    // 2. Cross-Device Matrix Capture & Horizontal Overflow Automated Tests
    console.log('\n--- PHASE B: CROSS-DEVICE MATRIX CAPTURE & OVERFLOW VERIFICATION ---');
    for (const dev of CROSS_DEVICE_MATRIX) {
      console.log(`Testing viewport: ${dev.name} (${dev.width}x${dev.height})...`);
      const context = await browser.newContext({
        viewport: { width: dev.width, height: dev.height },
        deviceScaleFactor: 1
      });

      await context.addInitScript(() => {
        localStorage.setItem('patron_demo', 'true');
        localStorage.setItem('patron-business-settings', JSON.stringify({
          businessName: 'Apex Retailers',
          ownerName: 'Akshat Kumar',
          email: 'akshat@thepatronindex.com',
          phone: '+91 98765 43210',
          industry: 'Retail & Commerce',
          location: 'New Delhi, India'
        }));
      });

      for (const p of PAGES) {
        const page = await context.newPage();
        await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);

        // Check horizontal document overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            hasOverflow: scrollWidth > clientWidth,
            scrollWidth,
            clientWidth,
            excess: scrollWidth - clientWidth
          };
        });

        testResults.overflowChecks.push({
          page: p.name,
          viewport: dev.name,
          width: dev.width,
          hasOverflow: overflow.hasOverflow,
          excess: overflow.excess
        });

        // Capture screenshot for documentation
        const filename = `${p.name}_${dev.name}.png`;
        const filepath = path.join(CROSS_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: false });

        await page.close();
      }
      await context.close();
    }

    // 3. Automated Mobile Navigation & Interaction Tests
    console.log('\n--- PHASE C: INTERACTION VERIFICATION ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 }
    });
    const page = await mobileContext.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    // Test mobile menu open
    const menuToggle = await page.$('.mobile-menu-toggle');
    const toggleVisible = await menuToggle?.isVisible();
    console.log('Mobile menu toggle visible:', toggleVisible);

    if (menuToggle) {
      await menuToggle.click();
      await page.waitForTimeout(350);
      const drawer = await page.$('.mobile-nav-drawer.is-open');
      const drawerOpen = await drawer?.isVisible();
      console.log('Mobile drawer opens on click:', drawerOpen);

      testResults.mobileInteractions.push({
        test: 'Mobile menu toggle opens drawer',
        passed: Boolean(drawerOpen)
      });

      // Test mobile menu close via close button
      const closeBtn = await page.$('.mobile-nav-close');
      if (closeBtn) {
        await closeBtn.click();
        await page.waitForTimeout(350);
        const drawerClosed = await page.$('.mobile-nav-drawer.is-open');
        console.log('Mobile drawer closes on close button:', !drawerClosed);
        testResults.mobileInteractions.push({
          test: 'Mobile menu close button closes drawer',
          passed: !drawerClosed
        });
      }
    }

    await page.close();
    await mobileContext.close();
    await browser.close();

    // Summary output
    console.log('\n=============================================');
    console.log('VERIFICATION AUDIT COMPLETE');
    console.log('=============================================');
    const totalOverflowChecks = testResults.overflowChecks.length;
    const failedOverflows = testResults.overflowChecks.filter(c => c.hasOverflow);
    console.log(`Total Viewport Overflow Checks: ${totalOverflowChecks}`);
    console.log(`Zero Overflow Pass Rate: ${((totalOverflowChecks - failedOverflows.length) / totalOverflowChecks * 100).toFixed(1)}%`);
    if (failedOverflows.length > 0) {
      console.log('Overflow Failures:', failedOverflows);
    } else {
      console.log('✓ ZERO HORIZONTAL SCROLL OVERFLOW DETECTED ACROSS ALL 13 VIEWPORTS!');
    }

    const totalRegChecks = testResults.desktopRegressions.length;
    const passedRegChecks = testResults.desktopRegressions.filter(r => r.passed);
    console.log(`Desktop Regression Checks: ${totalRegChecks}`);
    console.log(`Desktop Visual Consistency Pass Rate: ${(passedRegChecks.length / totalRegChecks * 100).toFixed(1)}%`);

    // Write results JSON
    fs.writeFileSync(
      path.resolve(__dirname, '../../docs/audits/audit_results.json'),
      JSON.stringify(testResults, null, 2)
    );
    console.log('Audit results saved to docs/audits/audit_results.json');
  } finally {
    server.kill();
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
