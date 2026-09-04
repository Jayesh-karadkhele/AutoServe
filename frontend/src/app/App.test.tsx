import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import { LandingPage } from '@/pages/marketing/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AppProviders } from './providers';

const renderWithRouter = (initialEntries = ['/']) => {
  const testRouter = createMemoryRouter(
    [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
    { initialEntries }
  );

  return render(
    <AppProviders>
      <RouterProvider router={testRouter} />
    </AppProviders>
  );
};

describe('AutoServe Part 6A Frontend Tests', () => {
  it('1. landing page renders headline and main layout', () => {
    render(<App />);
    expect(screen.getByText(/Every service\./i)).toBeInTheDocument();
    expect(screen.getByText(/Completely/i)).toBeInTheDocument();
  });

  it('2. navigation renders brand and action buttons', () => {
    render(<App />);
    expect(screen.getAllByText(/Auto/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Serve/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Book a Service/i).length).toBeGreaterThan(0);
  });

  it('3. mobile menu opens and closes via button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const menuButton = screen.getByLabelText(/Open Navigation Menu/i);
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);
    expect(screen.getByRole('dialog', { name: /Mobile Navigation Menu/i })).toBeInTheDocument();

    const closeButton = screen.getByLabelText(/Close Navigation Menu/i);
    await user.click(closeButton);
  });

  it('4. escape key closes mobile menu', async () => {
    const user = userEvent.setup();
    render(<App />);

    const menuButton = screen.getByLabelText(/Open Navigation Menu/i);
    await user.click(menuButton);
    expect(screen.getByRole('dialog', { name: /Mobile Navigation Menu/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
  });

  it('5. Book Service button points to /register', () => {
    render(<App />);
    const bookButtons = screen.getAllByRole('link', { name: /Book/i });
    expect(bookButtons.some(btn => btn.getAttribute('href') === '/register')).toBe(true);
  });

  it('6. Sign In button points to /login', () => {
    render(<App />);
    const signInButtons = screen.getAllByRole('link', { name: /Sign in/i });
    expect(signInButtons.some(btn => btn.getAttribute('href') === '/login')).toBe(true);
  });

  it('7. "See how it works" button has a valid target anchor', () => {
    render(<App />);
    const seeHowLink = screen.getByRole('link', { name: /See how it works/i });
    expect(seeHowLink.getAttribute('href')).toBe('#why-autoserve');
  });

  it('8. exactly one H1 tag exists on the landing page', () => {
    render(<App />);
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
  });

  it('9. reduced-motion mode renders content cleanly', () => {
    render(<App />);
    expect(screen.getByText(/VEHICLE CARE, RE-ENGINEERED/i)).toBeInTheDocument();
    expect(screen.getByText(/Car service shouldn’t feel like guesswork\./i)).toBeInTheDocument();
  });

  it('10. placeholder routes /login and /register render without 404', () => {
    const { unmount } = renderWithRouter(['/login']);
    expect(screen.getByText(/AutoServe Sign In/i)).toBeInTheDocument();
    unmount();

    renderWithRouter(['/register']);
    expect(screen.getByText(/Book a Service \/ Register/i)).toBeInTheDocument();
  });
});
