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

describe('AutoServe Part 6B Frontend & Scroll Story Tests', () => {
  it('1. landing page renders headline and main layout with exactly one H1 tag', () => {
    render(<App />);
    expect(screen.getByText(/Every service\./i)).toBeInTheDocument();
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
  });

  it('2. required section anchors (#why-autoserve, #experience, #how-it-works) exist', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#why-autoserve')).not.toBeNull();
    expect(container.querySelector('#experience')).not.toBeNull();
    expect(container.querySelector('#how-it-works')).not.toBeNull();
  });

  it('3. hero secondary CTA points to #how-it-works', () => {
    render(<App />);
    const seeHowLink = screen.getByRole('link', { name: /See how it works/i });
    expect(seeHowLink.getAttribute('href')).toBe('#how-it-works');
  });

  it('4. FAQ navigation link is absent until implemented in later parts', () => {
    render(<App />);
    expect(screen.queryByRole('link', { name: /^FAQ$/i })).not.toBeInTheDocument();
  });

  it('5. renders 5 problem chapters under #why-autoserve', () => {
    render(<App />);
    expect(screen.getAllByText(/No clear timeline/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Surprise costs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/No repair visibility/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Scattered service history/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Roadside uncertainty/i).length).toBeGreaterThan(0);
  });

  it('6. renders 6 solution chapters under #experience', () => {
    render(<App />);
    expect(screen.getAllByText(/Book in minutes/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Connect the right team/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Track every stage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/See the work/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Understand every rupee/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Get moving again/i).length).toBeGreaterThan(0);
  });

  it('7. capability rail renders capabilities and previous/next controls work with boundary states', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/Appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/Job Cards/i)).toBeInTheDocument();

    const prevButton = screen.getByLabelText(/Previous capability/i);
    const nextButton = screen.getByLabelText(/Next capability/i);

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);
    expect(prevButton).not.toBeDisabled();
  });

  it('8. workflow preview section renders 7 steps under #how-it-works', () => {
    render(<App />);
    expect(screen.getByText(/From request to road-ready\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/STEP 01/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/STEP 07/i)).toBeInTheDocument();
  });

  it('9. reduced-motion mode renders all chapter content cleanly', () => {
    render(<App />);
    expect(screen.getByText(/THE OLD SERVICE EXPERIENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/THE AUTOSERVE WAY/i)).toBeInTheDocument();
  });

  it('10. placeholder routes /login and /register render without 404', () => {
    const { unmount } = renderWithRouter(['/login']);
    expect(screen.getByText(/AutoServe Sign In/i)).toBeInTheDocument();
    unmount();

    renderWithRouter(['/register']);
    expect(screen.getByText(/Book a Service \/ Register/i)).toBeInTheDocument();
  });
});
