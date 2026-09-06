import { useState, useEffect, useCallback } from 'react';
import type { Appointment } from '../../customer/types/customerTypes';
import type {
  ManagerOverview,
  ManagerReportSummary,
  MechanicWorkloadItem,
  ManagerActivityItem,
  ManagerJobCard,
  InventoryItem,
  ManagerInvoice,
} from '../types/managerTypes';
import {
  getManagerOverview,
  getManagerAppointments,
  getManagerTeam,
  getManagerJobCards,
  getInventoryItems,
  getManagerInvoices,
  getManagerReportSummary,
  getManagerActivity,
} from '../api/managerApi';

export function useManagerOverview() {
  const [data, setData] = useState<ManagerOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerOverview();
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load manager overview');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { data, isLoading, error, refresh: fetchOverview };
}

export function useManagerAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerAppointments();
      setAppointments(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load manager appointments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, isLoading, error, refresh: fetchAppointments };
}

export function useManagerTeam() {
  const [team, setTeam] = useState<MechanicWorkloadItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerTeam();
      setTeam(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load team mechanics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, isLoading, error, refresh: fetchTeam };
}

export function useManagerJobCards() {
  const [jobCards, setJobCards] = useState<ManagerJobCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerJobCards();
      setJobCards(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load manager job cards');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobCards();
  }, [fetchJobCards]);

  return { jobCards, isLoading, error, refresh: fetchJobCards };
}

export function useManagerInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getInventoryItems();
      setInventory(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return { inventory, isLoading, error, refresh: fetchInventory };
}

export function useManagerInvoices() {
  const [invoices, setInvoices] = useState<ManagerInvoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerInvoices();
      setInvoices(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load manager invoices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, isLoading, error, refresh: fetchInvoices };
}

export function useManagerReports() {
  const [report, setReport] = useState<ManagerReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerReportSummary();
      setReport(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load report summary');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { report, isLoading, error, refresh: fetchReport };
}

export function useManagerActivity() {
  const [activities, setActivities] = useState<ManagerActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerActivity();
      setActivities(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load activity log');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return { activities, isLoading, error, refresh: fetchActivity };
}
