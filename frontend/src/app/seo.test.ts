import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('SEO & Metadata Static Verification (index.html)', () => {
  const indexPath = path.resolve(__dirname, '../../index.html');
  const htmlContent = fs.readFileSync(indexPath, 'utf-8');

  it('1. index.html contains exact brand page title', () => {
    expect(htmlContent).toContain('<title>AutoServe — Vehicle Service, Completely in View</title>');
  });

  it('2. meta description is present and under 150 characters', () => {
    const metaMatch = htmlContent.match(/<meta\s+name="description"\s+content="([^"]+)"/);
    expect(metaMatch).not.toBeNull();
    const description = metaMatch![1];
    expect(description.length).toBeLessThanOrEqual(150);
    expect(description).toContain('AutoServe');
  });

  it('3. html tag has lang="en"', () => {
    expect(htmlContent).toContain('<html lang="en">');
  });

  it('4. theme-color meta tag is set to light background #F7F5EF', () => {
    expect(htmlContent).toContain('<meta name="theme-color" content="#F7F5EF" />');
  });

  it('5. Open Graph and Twitter metadata tags are configured', () => {
    expect(htmlContent).toContain('<meta property="og:title" content="AutoServe — Vehicle Service, Completely in View" />');
    expect(htmlContent).toContain('<meta property="og:type" content="website" />');
    expect(htmlContent).toContain('<meta property="og:site_name" content="AutoServe" />');
    expect(htmlContent).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });

  it('6. favicon link points to /favicon.svg', () => {
    expect(htmlContent).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
  });

  it('7. metadata excludes fake values (no fake canonical, og:url, fake org schema, or invented domain)', () => {
    expect(htmlContent).not.toContain('og:url');
    expect(htmlContent).not.toContain('canonical');
    expect(htmlContent).not.toContain('schema.org');
    expect(htmlContent).not.toContain('https://autoserve.example.com');
  });
});
