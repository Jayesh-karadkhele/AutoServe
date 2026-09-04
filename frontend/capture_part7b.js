import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity/brain/a162d9c8-c965-4e54-8abf-2cc9f6369d27';

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Login (1440x900)
  const page1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page1.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page1.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_01_desktop_login.png'), fullPage: false });

  // 2. Desktop Registration (1440x900)
  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page2.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });
  await page2.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_02_desktop_register.png'), fullPage: false });

  // 3. Desktop Registration with Password Checklist (1440x900)
  const page3 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page3.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });
  await page3.fill('#register-name', 'Alex Mercer');
  await page3.fill('#register-email', 'alex@example.com');
  await page3.fill('#register-phone', '9876543210');
  await page3.fill('#register-password', 'Pass123!');
  await page3.fill('#register-confirm-password', 'Pass123!');
  await page3.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_03_desktop_register_checklist.png'), fullPage: false });

  // 4. Desktop Validation Error (1440x900)
  const page4 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page4.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page4.click('button[type="submit"]');
  await page4.waitForTimeout(300);
  await page4.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_04_desktop_validation_error.png'), fullPage: false });

  // 5. Mobile Login (390x844)
  const page5 = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page5.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page5.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_05_mobile_login.png'), fullPage: false });

  // 6. Mobile Registration (390x844)
  const page6 = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page6.goto('http://localhost:5173/register', { waitUntil: 'networkidle' });
  await page6.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_06_mobile_register.png'), fullPage: false });

  // 7. Forbidden Page (1440x900)
  const page7 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page7.goto('http://localhost:5173/forbidden', { waitUntil: 'networkidle' });
  await page7.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_09_forbidden_page.png'), fullPage: false });

  // 8. Reduced Motion Login (1440x900)
  const page8 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page8.emulateMedia({ reducedMotion: 'reduce' });
  await page8.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page8.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_10_reduced_motion_login.png'), fullPage: false });

  await browser.close();
  console.log('Part 7B genuine screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
