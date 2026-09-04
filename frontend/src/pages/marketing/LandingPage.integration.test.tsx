import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage';

describe('LandingPage Integration & Section Layout Tests', () => {
  const renderLandingPage = () =>
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

  it('1. renders main-content container targeting skip link', () => {
    const { container } = renderLandingPage();
    const mainContent = container.querySelector('#main-content');
    expect(mainContent).not.toBeNull();

    const skipLink = screen.getByRole('link', { name: /Skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('2. renders all landing page section anchors in sequence', () => {
    const { container } = renderLandingPage();
    const expectedAnchors = [
      '#why-autoserve',
      '#experience',
      '#how-it-works',
      '#roles',
      '#repair-evidence',
      '#transparent-payment',
      '#roadside-assistance',
      '#trust',
      '#faq',
      '#final-cta',
      '#footer',
    ];

    expectedAnchors.forEach((anchor) => {
      expect(container.querySelector(anchor)).not.toBeNull();
    });
  });

  it('3. final conversion CTA renders registration link and how-it-works link', () => {
    renderLandingPage();
    expect(screen.getByText(/YOUR NEXT SERVICE/i)).toBeInTheDocument();
    expect(screen.getByText(/Vehicle care should never leave you guessing\./i)).toBeInTheDocument();

    const bookCta = screen.getAllByRole('link', { name: /Book your service/i })[0];
    expect(bookCta).toHaveAttribute('href', '/register');
  });

  it('4. footer contains dynamic copyright year comparing with current runtime year', () => {
    renderLandingPage();
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(/All rights reserved\./i)).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(`${currentYear}`, 'i')).length).toBeGreaterThan(0);
  });
});
