import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity/brain/a162d9c8-c965-4e54-8abf-2cc9f6369d27';

async function captureRemainingScreenshots() {
  const browser = await chromium.launch({ headless: true });

  // 7. Session Restoration Loading State (1440x900)
  const page7 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Intercept refresh API to simulate bootstrapping delay
  await page7.route('**/api/auth/refresh', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await route.abort();
  });
  await page7.goto('http://localhost:5173/login');
  await page7.waitForTimeout(400);
  await page7.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_07_session_restoration_loader.png'), fullPage: false });

  // 8. Customer Authenticated Entry Page (1440x900)
  const page8 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Mock /api/auth/refresh and /api/users/me for customer user
  await page8.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-jwt-customer-token',
        tokenType: 'Bearer',
        userId: 101,
        name: 'Alex Mercer',
        email: 'alex.mercer@autoserve.com',
        phone: '9876543210',
        role: 'CUSTOMER',
        sessionId: 'sess-customer-101',
      }),
    })
  );

  await page8.route('**/api/users/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        userId: 101,
        userName: 'Alex Mercer',
        email: 'alex.mercer@autoserve.com',
        userRole: 'CUSTOMER',
        mobile: '9876543210',
        isActive: true,
      }),
    })
  );

  await page8.goto('http://localhost:5173/customer/dashboard', { waitUntil: 'networkidle' });
  await page8.screenshot({ path: path.join(ARTIFACT_DIR, 'part7b_08_customer_entry_page.png'), fullPage: false });

  await browser.close();
  console.log('Remaining 2 screenshots captured successfully!');
}

captureRemainingScreenshots().catch(console.error);
