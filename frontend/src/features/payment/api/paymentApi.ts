import { apiClient as api } from '@/lib/api/apiClient';
import type { PaymentOrderResponse, VerifyPaymentPayload, PaymentAttempt } from '../types/paymentTypes';

export const paymentApi = {
  createPaymentOrder: async (invoiceId: number): Promise<PaymentOrderResponse> => {
    const res = await api.post<PaymentOrderResponse>(`/api/invoices/${invoiceId}/payment-order`);
    return res.data;
  },

  verifyPayment: async (invoiceId: number, payload: VerifyPaymentPayload): Promise<PaymentAttempt> => {
    const res = await api.post<PaymentAttempt>(`/api/invoices/${invoiceId}/verify-payment`, payload);
    return res.data;
  },

  capturePayment: async (invoiceId: number, providerOrderId: string, providerPaymentId?: string): Promise<PaymentAttempt> => {
    const res = await api.post<PaymentAttempt>(`/api/invoices/${invoiceId}/capture-payment`, null, {
      params: { providerOrderId, providerPaymentId },
    });
    return res.data;
  },

  getPaymentHistory: async (invoiceId: number): Promise<PaymentAttempt[]> => {
    const res = await api.get<PaymentAttempt[]>(`/api/invoices/${invoiceId}/payment-history`);
    return res.data;
  },

  getGlobalPaymentAttempts: async (page = 0, size = 20): Promise<{ content: PaymentAttempt[] }> => {
    const res = await api.get<{ content: PaymentAttempt[] }>('/api/admin/payments/attempts', {
      params: { page, size },
    });
    return res.data;
  },
};
