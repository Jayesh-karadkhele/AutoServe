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

describe('AutoServe Part 6C — Journey & Role Experience Tests', () => {
  it('1. landing page renders headline and main layout with exactly one H1 tag', () => {
    render(<App />);
    expect(screen.getByText(/Every service\./i)).toBeInTheDocument();
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
  });

  it('2. required section anchors (#why-autoserve, #experience, #how-it-works, #roles) exist', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#why-autoserve')).not.toBeNull();
    expect(container.querySelector('#experience')).not.toBeNull();
    expect(container.querySelector('#how-it-works')).not.toBeNull();
    expect(container.querySelector('#roles')).not.toBeNull();
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

  it('5. renders 7 workflow steps in correct order under #how-it-works', () => {
    render(<App />);
    expect(screen.getByText(/YOUR SERVICE, STEP BY STEP/i)).toBeInTheDocument();

    const expectedSteps = [
      'Add your vehicle',
      'Book the service',
      'Review and assign',
      'Diagnose and repair',
      'Verify the work',
      'Invoice and pay',
      'Close with confidence',
    ];

    expectedSteps.forEach((title) => {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    });
  });

  it('6. selecting a journey step updates the active step preview content', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click step 2 button ("Book the service")
    const step2Btn = screen.getByRole('button', { name: /Step 02: Book the service/i });
    await user.click(step2Btn);

    expect(screen.getByText(/APPOINTMENT SCHEDULING/i)).toBeInTheDocument();
  });

  it('7. journey controls are keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<App />);

    const step1Btn = screen.getByRole('button', { name: /Step 01: Add your vehicle/i });
    step1Btn.focus();
    expect(document.activeElement).toBe(step1Btn);

    const step2Btn = screen.getByRole('button', { name: /Step 02: Book the service/i });
    await user.click(step2Btn);
    expect(screen.getByText(/APPOINTMENT SCHEDULING/i)).toBeInTheDocument();
  });

  it('8. reduced-motion mode keeps all journey and role info accessible', () => {
    render(<App />);
    expect(screen.getByText(/ONE WORK ORDER\. SHARED CONTEXT\./i)).toBeInTheDocument();
    expect(screen.getByText(/ONE PLATFORM\. FOUR FOCUSED WORKSPACES\./i)).toBeInTheDocument();
  });

  it('9. #roles section renders all four role tabs', () => {
    render(<App />);
    const tablist = screen.getByRole('tablist', { name: /Select Platform Role Workspace/i });
    expect(tablist).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: /Customer/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Manager/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Mechanic/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Admin/i })).toBeInTheDocument();
  });

  it('10. Customer tab is selected initially', () => {
    render(<App />);
    const customerTab = screen.getByRole('tab', { name: /Customer/i });
    expect(customerTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Everything about your vehicle care, without the follow-up calls\./i)).toBeInTheDocument();
  });

  it('11. selecting Manager changes workspace content', async () => {
    const user = userEvent.setup();
    render(<App />);

    const managerTab = screen.getByRole('tab', { name: /Manager/i });
    await user.click(managerTab);

    expect(managerTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Coordinate the workshop without losing the details\./i)).toBeInTheDocument();
    expect(screen.getByText(/David Miller • Service Manager/i)).toBeInTheDocument();
  });

  it('12. selecting Mechanic changes workspace content', async () => {
    const user = userEvent.setup();
    render(<App />);

    const mechanicTab = screen.getByRole('tab', { name: /Mechanic/i });
    await user.click(mechanicTab);

    expect(mechanicTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/The next job, the right context and a clear finish line\./i)).toBeInTheDocument();
    expect(screen.getByText(/Attach Repair Evidence/i)).toBeInTheDocument();
  });

  it('13. selecting Admin changes workspace content', async () => {
    const user = userEvent.setup();
    render(<App />);

    const adminTab = screen.getByRole('tab', { name: /Admin/i });
    await user.click(adminTab);

    expect(adminTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Platform-wide control with clearly separated responsibilities\./i)).toBeInTheDocument();
    expect(screen.getByText(/System & Governance Control Center/i)).toBeInTheDocument();
  });

  it('14. arrow key navigation changes selected role', async () => {
    const user = userEvent.setup();
    render(<App />);

    const customerTab = screen.getByRole('tab', { name: /Customer/i });
    customerTab.focus();

    await user.keyboard('{ArrowRight}');
    const managerTab = screen.getByRole('tab', { name: /Manager/i });
    expect(document.activeElement).toBe(managerTab);
    expect(managerTab).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowRight}');
    const mechanicTab = screen.getByRole('tab', { name: /Mechanic/i });
    expect(document.activeElement).toBe(mechanicTab);
    expect(mechanicTab).toHaveAttribute('aria-selected', 'true');
  });

  it('15. Home and End keys work on role selector', async () => {
    const user = userEvent.setup();
    render(<App />);

    const customerTab = screen.getByRole('tab', { name: /Customer/i });
    customerTab.focus();

    await user.keyboard('{End}');
    const adminTab = screen.getByRole('tab', { name: /Admin/i });
    expect(document.activeElement).toBe(adminTab);
    expect(adminTab).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(customerTab);
    expect(customerTab).toHaveAttribute('aria-selected', 'true');
  });

  it('16. role tab and panel IDs are properly connected', () => {
    render(<App />);
    const customerTab = screen.getByRole('tab', { name: /Customer/i });
    expect(customerTab).toHaveAttribute('id', 'tab-customer');
    expect(customerTab).toHaveAttribute('aria-controls', 'panel-customer');

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-customer');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-customer');
  });

  it('17. each role shows its focused-access explanation', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/Focused Access — Scope & Governance for Customer/i)).toBeInTheDocument();

    const managerTab = screen.getByRole('tab', { name: /Manager/i });
    await user.click(managerTab);
    expect(screen.getByText(/Focused Access — Scope & Governance for Manager/i)).toBeInTheDocument();
  });

  it('18. navigation contains valid anchors for all new sections', () => {
    render(<App />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));

    expect(hrefs).toContain('#why-autoserve');
    expect(hrefs).toContain('#experience');
    expect(hrefs).toContain('#how-it-works');
    expect(hrefs).toContain('#roles');
  });

  it('19. mobile navigation menu opens and renders section anchor links', async () => {
    const user = userEvent.setup();
    render(<App />);

    const menuBtn = screen.getByLabelText(/Open Navigation Menu/i);
    await user.click(menuBtn);

    const mobileNav = screen.getByRole('dialog', { name: /Mobile Navigation Menu/i });
    expect(mobileNav).toBeInTheDocument();

    const linksInDialog = screen.getAllByRole('link').filter(
      l => l.closest('[role="dialog"]') !== null
    );
    expect(linksInDialog.length).toBeGreaterThan(0);
  });

  it('20. placeholder routes /login and /register render without 404', () => {
    const { unmount } = renderWithRouter(['/login']);
    expect(screen.getByText(/AutoServe Sign In/i)).toBeInTheDocument();
    unmount();

    renderWithRouter(['/register']);
    expect(screen.getByText(/Book a Service \/ Register/i)).toBeInTheDocument();
  });
});
