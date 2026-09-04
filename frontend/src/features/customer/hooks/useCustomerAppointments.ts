import { useState, useEffect, useCallback } from 'react';
import { getMyAppointments } from '../api/customerApi';
import type { Appointment } from '../types/customerTypes';

export function useCustomerAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyAppointments(signal);
      setAppointments(data);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      const msg = err.response?.data?.message || err.message || 'Failed to load appointments';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAppointments(controller.signal);
    return () => controller.abort();
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    error,
    refetch: () => fetchAppointments(),
  };
}
