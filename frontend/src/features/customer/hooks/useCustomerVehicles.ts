import { useState, useEffect, useCallback } from 'react';
import { getMyVehicles } from '../api/customerApi';
import type { Vehicle } from '../types/customerTypes';

export function useCustomerVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyVehicles(signal);
      setVehicles(data);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      const msg = err.response?.data?.message || err.message || 'Failed to load vehicles';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchVehicles(controller.signal);
    return () => controller.abort();
  }, [fetchVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: () => fetchVehicles(),
  };
}
