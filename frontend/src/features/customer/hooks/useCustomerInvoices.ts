import { useState, useEffect, useCallback } from 'react';
import { getMyInvoices } from '../api/customerApi';
import type { Invoice } from '../types/customerTypes';

export function useCustomerInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyInvoices(signal);
      setInvoices(data);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      const msg = err.response?.data?.message || err.message || 'Failed to load invoices';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchInvoices(controller.signal);
    return () => controller.abort();
  }, [fetchInvoices]);

  return {
    invoices,
    isLoading,
    error,
    refetch: () => fetchInvoices(),
  };
}
