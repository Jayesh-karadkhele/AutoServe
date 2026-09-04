import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvoicePreview } from './InvoicePreview';

describe('InvoicePreview Accessible Dialog Modal Tests', () => {
  it('1. renders preview trigger button with aria-expanded="false"', () => {
    render(<InvoicePreview />);
    const triggerBtn = screen.getByRole('button', { name: /Preview invoice/i });
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('2. opening modal shows dialog with role="dialog", aria-modal="true" and aria-labelledby', async () => {
    const user = userEvent.setup();
    render(<InvoicePreview />);

    const triggerBtn = screen.getByRole('button', { name: /Preview invoice/i });
    await user.click(triggerBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'invoice-modal-title');
    expect(screen.getByText(/Full Digital Invoice Document/i)).toBeInTheDocument();
  });

  it('3. pressing Escape closes the modal dialog and restores focus to trigger button', async () => {
    const user = userEvent.setup();
    render(<InvoicePreview />);

    const triggerBtn = screen.getByRole('button', { name: /Preview invoice/i });
    await user.click(triggerBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(triggerBtn);
  });

  it('4. modal contains accessible labelled close button', async () => {
    const user = userEvent.setup();
    render(<InvoicePreview />);

    const triggerBtn = screen.getByRole('button', { name: /Preview invoice/i });
    await user.click(triggerBtn);

    const closeBtn = screen.getByRole('button', { name: /Close invoice preview/i });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
