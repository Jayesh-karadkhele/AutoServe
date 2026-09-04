import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FaqSection } from './FaqSection';
import { FAQ_ITEMS } from './faqData';

describe('FaqSection Unit & Accessibility Tests', () => {
  it('1. renders #faq section with correct eyebrow and title', () => {
    const { container } = render(<FaqSection />);
    expect(container.querySelector('#faq')).not.toBeNull();
    expect(screen.getByText(/BEFORE YOU BOOK/i)).toBeInTheDocument();
    expect(screen.getByText(/Questions, clearly answered\./i)).toBeInTheDocument();
  });

  it('2. renders all 10 mandatory FAQ questions', () => {
    render(<FaqSection />);
    expect(FAQ_ITEMS).toHaveLength(10);
    FAQ_ITEMS.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
  });

  it('3. accordion items render with aria-expanded and aria-controls attributes', async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    const secondQuestionText = screen.getByText(FAQ_ITEMS[1].question);
    const secondQuestionBtn = secondQuestionText.closest('button')!;
    expect(secondQuestionBtn).toHaveAttribute('aria-expanded', 'false');
    expect(secondQuestionBtn).toHaveAttribute('aria-controls', `faq-answer-${FAQ_ITEMS[1].id}`);

    await user.click(secondQuestionBtn);
    expect(secondQuestionBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(FAQ_ITEMS[1].answer)).toBeInTheDocument();
  });

  it('4. RBAC security FAQ answer describes controlled access without absolute guarantees', () => {
    render(<FaqSection />);
    const rbacItem = FAQ_ITEMS.find((item) => item.category.includes('Role') || item.id === 'faq-10');
    expect(rbacItem).toBeDefined();
    expect(rbacItem?.answer).toContain('controlled according to role');
    expect(rbacItem?.answer).not.toContain('100% unhackable');
    expect(rbacItem?.answer).not.toContain('absolute security');
  });
});
