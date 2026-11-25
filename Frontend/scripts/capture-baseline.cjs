const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5174';
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/audits/screenshots/baseline');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const DESKTOP_RESOLUTIONS = [
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1536x864', width: 1536, height: 864 },
  { name: '1920x1080', width: 1920, height: 1080 }
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

async function capture() {
  console.log('Starting preview server on port 5174...');
  const server = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', '5174', '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
    detached: false
  });

  try {
    await waitForServer(BASE_URL);
    console.log('Server is running. Launching Edge browser...');

    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true
    });

    for (const res of DESKTOP_RESOLUTIONS) {
      console.log(`Capturing desktop baseline at ${res.name}...`);
      const context = await browser.newContext({
        viewport: { width: res.width, height: res.height },
        deviceScaleFactor: 1
      });

      // Enable demo mode in localStorage
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
        await page.waitForTimeout(600); // allow animations/charts to settle

        const filename = `${p.name}_${res.name}.png`;
        const filepath = path.join(SCREENSHOT_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: false });
        console.log(`Saved ${filename}`);
        await page.close();
      }

      await context.close();
    }

    await browser.close();
    console.log('All baseline desktop screenshots captured successfully.');
  } finally {
    server.kill();
  }
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
