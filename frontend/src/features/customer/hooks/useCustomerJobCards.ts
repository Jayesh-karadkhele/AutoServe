import { useState, useEffect, useCallback } from 'react';
import { getMyJobCards } from '../api/customerApi';
import type { JobCard } from '../types/customerTypes';

export function useCustomerJobCards() {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobCards = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyJobCards(signal);
      setJobCards(data);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      const msg = err.response?.data?.message || err.message || 'Failed to load service records';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchJobCards(controller.signal);
    return () => controller.abort();
  }, [fetchJobCards]);

  return {
    jobCards,
    isLoading,
    error,
    refetch: () => fetchJobCards(),
  };
}
