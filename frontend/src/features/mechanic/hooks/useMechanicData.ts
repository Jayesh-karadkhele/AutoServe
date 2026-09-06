import { useState, useEffect, useCallback } from 'react';
import {
  getMechanicOverview,
  getMyMechanicJobs,
  getMechanicJobCardById,
} from '../api/mechanicApi';
import type { MechanicOverview, MechanicJobCard } from '../types/mechanicTypes';

export function useMechanicOverview() {
  const [overview, setOverview] = useState<MechanicOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMechanicOverview();
      setOverview(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load mechanic dashboard overview.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overview, isLoading, error, refresh: fetchOverview };
}

export function useMechanicJobs() {
  const [jobs, setJobs] = useState<MechanicJobCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyMechanicJobs();
      setJobs(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load assigned jobs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, isLoading, error, refresh: fetchJobs };
}

export function useMechanicJobCardDetail(id: number) {
  const [jobCard, setJobCard] = useState<MechanicJobCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id || isNaN(id)) {
      setError('Invalid job card ID');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMechanicJobCardById(id);
      setJobCard(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load job card details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { jobCard, setJobCard, isLoading, error, refresh: fetchDetail };
}
