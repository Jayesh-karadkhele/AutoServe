import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';
import type {
  AdminOverview,
  UserSummary,
  AdminAuditEvent,
  SystemSettings,
  Role,
} from '../types/adminTypes';

export function useAdminOverview() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getOverview();
      setOverview(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load platform overview metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overview, loading, error, refresh: fetchOverview };
}

export function useAdminUsers(role?: Role, isActive?: boolean, search?: string) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getUsers(role, isActive, search);
      setUsers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  }, [role, isActive, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refresh: fetchUsers };
}

export function useAdminAuditEvents(actorId?: number, actionType?: string, resourceType?: string) {
  const [events, setEvents] = useState<AdminAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAuditEvents(actorId, actionType, resourceType);
      setEvents(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load audit activity trail');
    } finally {
      setLoading(false);
    }
  }, [actorId, actionType, resourceType]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  return { events, loading, error, refresh: fetchAudit };
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSystemSettings()
      .then(setSettings)
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading, error };
}
