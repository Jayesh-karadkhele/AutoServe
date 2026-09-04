import { useState, useEffect, useCallback } from 'react';
import { getMyProfile, updateMyProfile } from '../api/customerApi';
import type { UserResponse, UpdateSelfProfileDto } from '../types/customerTypes';
import { useAuth } from '@/features/auth/context/AuthContext';

export function useCustomerProfile() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const fetchProfile = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyProfile(signal);
      setProfile(data);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      const msg = err.response?.data?.message || err.message || 'Failed to load profile';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile(controller.signal);
    return () => controller.abort();
  }, [fetchProfile]);

  const updateProfile = async (dto: UpdateSelfProfileDto) => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const updated = await updateMyProfile(dto);
      setProfile(updated);
      setSaveSuccess(true);
      if (refreshUser) {
        await refreshUser();
      }
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    isLoading,
    isSaving,
    error,
    saveSuccess,
    updateProfile,
    refetch: () => fetchProfile(),
  };
}
