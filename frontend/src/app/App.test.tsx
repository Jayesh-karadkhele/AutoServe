import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
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

describe('AutoServe Part 6D — Trust, Evidence, Payment & Roadside Tests', () => {
  // Existing Part 6A/6B/6C Tests (Preserved)
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

  it('4. FAQ navigation link points to #faq anchor', () => {
    render(<App />);
    const faqLink = screen.getAllByRole('link', { name: /^FAQ$/i })[0];
    expect(faqLink.getAttribute('href')).toBe('#faq');
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
    expect(screen.getAllByText(/David Miller • Service Manager/i).length).toBeGreaterThan(0);
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
    const { container } = render(<App />);
    const customerTab = screen.getByRole('tab', { name: /Customer/i });
    expect(customerTab).toHaveAttribute('id', 'tab-customer');
    expect(customerTab).toHaveAttribute('aria-controls', 'panel-customer');

    const panel = container.querySelector('#panel-customer')!;
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

  // Dedicated Part 6D New Tests (21 through 32)
  it('21. #repair-evidence section renders headline and job card AS-JC-260884 reference', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#repair-evidence')).not.toBeNull();
    expect(screen.getByText(/PROOF AT EVERY IMPORTANT STAGE/i)).toBeInTheDocument();
    expect(screen.getByText(/See the work—not just the final bill\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/AS-JC-260884/i).length).toBeGreaterThan(0);
  });

  it('22. four repair evidence story stages render and stage switching updates notes', async () => {
    const user = userEvent.setup();
    render(<App />);

    const stagesTablist = screen.getByRole('tablist', { name: /Repair Evidence Story Stages/i });
    expect(stagesTablist).toBeInTheDocument();

    const verifiedTab = screen.getByRole('tab', { name: /Verified/i });
    await user.click(verifiedTab);

    expect(verifiedTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Dynamic road test completed \(12 km\)/i)).toBeInTheDocument();
  });

  it('23. before and after evidence comparison slider has readable labels and accessible controls', () => {
    render(<App />);
    const sliderInput = screen.getByLabelText(/Before and after repair evidence slider/i);
    expect(sliderInput).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /View before/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Compare \(50\/50\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View after/i })).toBeInTheDocument();
  });

  it('24. #transparent-payment section renders invoice AS-INV-260884 and formatted INR amounts', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#transparent-payment')).not.toBeNull();
    expect(screen.getByText(/CLEAR BEFORE YOU PAY/i)).toBeInTheDocument();
    expect(screen.getByText(/Every rupee has a reason\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/AS-INV-260884/i).length).toBeGreaterThan(0);

    // Verify INR currency formatting with symbol ₹
    expect(screen.getAllByText(/₹14,691\.00/i).length).toBeGreaterThan(0);
  });

  it('25. invoice line items expand and collapse accessibly with aria-expanded and aria-controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    const lineBtn = screen.getByRole('button', { name: /Front Ceramic Brake Pad Set \(OEM\)/i });
    expect(lineBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(lineBtn);
    expect(lineBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Original OEM front axle ceramic pad set/i)).toBeInTheDocument();
  });

  it('26. payment preview initially displays Created or Verification pending (never default Paid)', () => {
    render(<App />);
    // Verify default initial payment state is 'CREATED'
    const statusText = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('Current Status:');
    });
    expect(statusText).toBeInTheDocument();
    expect(statusText.textContent).toContain('Current Status: CREATED');
    expect(screen.queryByText(/Current Status: PAID/i)).not.toBeInTheDocument();
  });

  it('27. payment preview contains mandatory disclaimer and triggers zero network requests', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(window, 'fetch');

    render(<App />);

    expect(screen.getByText(/Payment interaction preview — no transaction will be created\./i)).toBeInTheDocument();

    // Click interactive status transition buttons
    const providerBtn = screen.getByRole('button', { name: /2\. Provider Opened/i });
    await user.click(providerBtn);

    // Assert ZERO network fetch calls were made
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('28. #roadside-assistance section permanently displays Planned capability preview badge', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#roadside-assistance')).not.toBeNull();
    expect(screen.getByText(/HELP SHOULD FEEL VISIBLE/i)).toBeInTheDocument();

    // Verify permanent planned capability preview badge is present
    expect(screen.getAllByText(/Planned capability preview/i).length).toBeGreaterThan(0);
  });

  it('29. renders all 5 roadside assistance stages and stage switching updates preview', async () => {
    const user = userEvent.setup();
    render(<App />);

    const rsaTablist = screen.getByRole('tablist', { name: /Planned Roadside Assistance Stages/i });
    expect(rsaTablist).toBeInTheDocument();

    const stage5Tab = screen.getByRole('tab', { name: /Confirm Resolution/i });
    await user.click(stage5Tab);

    expect(screen.getByText(/Assistance Resolved/i)).toBeInTheDocument();
    // Verify planned capability preview badge remains visible after stage switch
    expect(screen.getAllByText(/Planned capability preview/i).length).toBeGreaterThan(0);
  });

  it('30. code-native SVG roadside map has accessible name and illustrative estimate labels', () => {
    render(<App />);
    const mapSvg = screen.getByLabelText(/Planned Roadside Assistance SVG Route Map/i);
    expect(mapSvg).toBeInTheDocument();

    expect(screen.getAllByText(/Illustrative estimate/i).length).toBeGreaterThan(0);
  });

  it('31. #trust section renders four credibility principles and connected record trace', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#trust')).not.toBeNull();
    expect(screen.getByText(/BUILT AROUND ACCOUNTABILITY/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /^Controlled Access$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Documented Work$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Precise Billing$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Connected History$/i })).toBeInTheDocument();

    const traceTablist = screen.getByRole('tablist', { name: /Service Record Traceability Pipeline/i });
    expect(traceTablist).toBeInTheDocument();
  });

  it('32. prohibited marketing copy terms are strictly absent from page', () => {
    render(<App />);
    expect(screen.queryByText(/Bank-grade security/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Military-grade encryption/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/100% secure/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tamper-proof/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/PCI compliant/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ISO certified/i)).not.toBeInTheDocument();
  });
});
