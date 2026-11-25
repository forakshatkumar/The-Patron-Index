const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  console.log('Edge launched successfully');
  await browser.close();
}

test().catch(err => {
  console.error('Error launching Edge:', err);
  process.exit(1);
});
