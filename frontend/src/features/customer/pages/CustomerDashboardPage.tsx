import React from 'react';
import { Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { useCustomerVehicles } from '../hooks/useCustomerVehicles';
import { useCustomerAppointments } from '../hooks/useCustomerAppointments';
import { useCustomerJobCards } from '../hooks/useCustomerJobCards';
import { useCustomerInvoices } from '../hooks/useCustomerInvoices';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  Car,
  Calendar,
  Wrench,
  FileText,
  PlusCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Camera,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { vehicles, isLoading: loadingVehicles, error: errorVehicles, refetch: refetchVehicles } = useCustomerVehicles();
  const { appointments, isLoading: loadingAppts, error: errorAppts, refetch: refetchAppts } = useCustomerAppointments();
  const { jobCards, isLoading: loadingJobs, error: errorJobs, refetch: refetchJobs } = useCustomerJobCards();
  const { invoices, isLoading: loadingInvoices, error: errorInvoices, refetch: refetchInvoices } = useCustomerInvoices();

  const isLoading = loadingVehicles || loadingAppts || loadingJobs || loadingInvoices;
  const hasError = errorVehicles || errorAppts || errorJobs || errorInvoices;

  const handleRefreshAll = () => {
    refetchVehicles();
    refetchAppts();
    refetchJobs();
    refetchInvoices();
  };

  // Derive answers to 6 core dashboard questions:
  // 1. Active Vehicle
  const activeVehicle = vehicles.length > 0 ? vehicles[0] : null;

  // 2. Upcoming Appointment
  const upcomingAppointment = appointments.find(
    (a) => a.status === 'PENDING' || a.status === 'APPROVED'
  );

  // 3. Service in Progress
  const activeJobCard = jobCards.find((j) => j.status === 'IN_PROGRESS' || j.status === 'CREATED');

  // 4. Evidence Available
  const evidenceCount = jobCards.reduce((acc, curr) => acc + (curr.evidenceList?.length || 0), 0);
  const latestEvidenceJob = jobCards.find((j) => (j.evidenceList?.length || 0) > 0);

  // 5. Invoice Awaiting Attention
  const pendingInvoice = invoices.find((i) => i.paymentStatus === 'PENDING');

  // 6. Next-Best Action
  let nextBestAction = {
    title: 'Book Regular Maintenance Service',
    description: 'Keep your vehicle running smoothly by scheduling a routine checkup.',
    link: '/customer/appointments/new',
    btnText: 'Book Service Now',
  };

  if (pendingInvoice) {
    nextBestAction = {
      title: `Invoice #${pendingInvoice.invoiceNumber} Awaiting Payment`,
      description: 'Your service invoice has been generated and is ready for your review.',
      link: `/customer/invoices/${pendingInvoice.id}`,
      btnText: 'Review Invoice',
    };
  } else if (activeJobCard) {
    nextBestAction = {
      title: `Service In Progress (Job #${activeJobCard.jobCardNumber || activeJobCard.id})`,
      description: 'Our certified mechanics are currently inspecting/working on your vehicle.',
      link: `/customer/service/${activeJobCard.id}`,
      btnText: 'Track Active Progress',
    };
  } else if (vehicles.length === 0) {
    nextBestAction = {
      title: 'Register Your Vehicle',
      description: 'Add your primary vehicle details to start booking appointments.',
      link: '/customer/vehicles/new',
      btnText: 'Add First Vehicle',
    };
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <CustomerShell pageTitle={`Welcome back, ${user?.name || 'Customer'}!`}>
      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-6 animate-pulse" data-testid="dashboard-loading-skeleton">
          <div className="h-32 bg-[#E5E7EB] rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-[#E5E7EB] rounded-2xl" />
            <div className="h-40 bg-[#E5E7EB] rounded-2xl" />
            <div className="h-40 bg-[#E5E7EB] rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && hasError && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#B91C1C]">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold text-base">Error Loading Dashboard Data</h3>
              <p className="text-sm opacity-90">{hasError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefreshAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-xl font-semibold text-sm hover:bg-[#B91C1C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
          >
            <RefreshCw className="w-4 h-4" /> Retry Loading
          </button>
        </div>
      )}

      {!isLoading && !hasError && (
        <div className="space-y-8">
          {/* Next Best Action Banner */}
          <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-[#EA580C] text-white shadow-sm inline-block">
                  Next-Best Action
                </span>
                <h2 className="text-xl sm:text-2xl font-bold">{nextBestAction.title}</h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {nextBestAction.description}
                </p>
              </div>
              <Link
                to={nextBestAction.link}
                className="shrink-0 px-6 py-3.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white min-h-[44px]"
              >
                <span>{nextBestAction.btnText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              to="/customer/vehicles/new"
              className="p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#EA580C] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group min-h-[44px]"
            >
              <div className="p-3 rounded-xl bg-[#FFF7ED] text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#111827]">Add Vehicle</span>
            </Link>

            <Link
              to="/customer/appointments/new"
              className="p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#EA580C] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group min-h-[44px]"
            >
              <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#111827]">Book Service</span>
            </Link>

            <Link
              to={activeJobCard ? `/customer/service/${activeJobCard.id}` : '/customer/appointments'}
              className="p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#EA580C] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group min-h-[44px]"
            >
              <div className="p-3 rounded-xl bg-[#ECFDF5] text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#111827]">Active Tracker</span>
            </Link>

            <Link
              to="/customer/invoices"
              className="p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#EA580C] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group min-h-[44px]"
            >
              <div className="p-3 rounded-xl bg-[#F3E8FF] text-[#9333EA] group-hover:bg-[#9333EA] group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#111827]">View Invoices</span>
            </Link>
          </div>

          {/* 6 Core Questions Answer Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Active Vehicle */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FFF7ED] text-[#EA580C] rounded-xl">
                    <Car className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#111827]">Primary Vehicle</h3>
                </div>
                <span className="text-xs text-[#6B7280] font-semibold">{vehicles.length} Total</span>
              </div>
              {activeVehicle ? (
                <div>
                  <p className="text-xl font-extrabold text-[#111827]">
                    {activeVehicle.make} {activeVehicle.model}
                  </p>
                  <p className="text-sm font-mono text-[#0284C7] font-bold mt-0.5">
                    {activeVehicle.registrationNumber}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {activeVehicle.year || 'N/A'} • {activeVehicle.fuelType || 'Petrol'}
                  </p>
                </div>
              ) : (
                <div className="py-2 text-sm text-[#6B7280]">
                  No vehicles registered yet.{' '}
                  <Link to="/customer/vehicles/new" className="text-[#EA580C] font-semibold underline">
                    Add your vehicle
                  </Link>
                </div>
              )}
              <Link
                to="/customer/vehicles"
                className="text-xs font-bold text-[#EA580C] hover:underline inline-flex items-center gap-1"
              >
                Manage Vehicles <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Upcoming Appointment */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#E0F2FE] text-[#0284C7] rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#111827]">Upcoming Booking</h3>
                </div>
                {upcomingAppointment && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                    {upcomingAppointment.status}
                  </span>
                )}
              </div>
              {upcomingAppointment ? (
                <div>
                  <p className="text-base font-bold text-[#111827]">
                    {upcomingAppointment.serviceType}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                    Date: {upcomingAppointment.preferredDate} ({upcomingAppointment.timeSlot || 'Standard Slot'})
                  </p>
                  <p className="text-xs text-[#4B5563] font-medium mt-1 truncate">
                    Vehicle: {upcomingAppointment.vehicleRegistration || upcomingAppointment.vehicleId}
                  </p>
                </div>
              ) : (
                <div className="py-2 text-sm text-[#6B7280]">
                  No upcoming appointments scheduled.
                </div>
              )}
              <Link
                to="/customer/appointments"
                className="text-xs font-bold text-[#EA580C] hover:underline inline-flex items-center gap-1"
              >
                All Appointments <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Active Service Progress */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#ECFDF5] text-[#059669] rounded-xl">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#111827]">Active Service</h3>
                </div>
                {activeJobCard && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                    {activeJobCard.status}
                  </span>
                )}
              </div>
              {activeJobCard ? (
                <div>
                  <p className="text-base font-bold text-[#111827]">
                    Job #{activeJobCard.jobCardNumber || activeJobCard.id}
                  </p>
                  <p className="text-xs text-[#4B5563] mt-1">
                    Issues: {activeJobCard.reportedIssues || 'General inspection & service'}
                  </p>
                  {activeJobCard.mechanicName && (
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Mechanic: <span className="font-semibold text-[#111827]">{activeJobCard.mechanicName}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-2 text-sm text-[#6B7280]">
                  No vehicle currently undergoing active workshop repair.
                </div>
              )}
              <Link
                to={activeJobCard ? `/customer/service/${activeJobCard.id}` : '/customer/service/active'}
                className="text-xs font-bold text-[#EA580C] hover:underline inline-flex items-center gap-1"
              >
                View Tracking <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Repair Evidence Status */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FDF4FF] text-[#C026D3] rounded-xl">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#111827]">Repair Evidence</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#9333EA]">
                  {evidenceCount} Photos Available
                </span>
              </div>
              {latestEvidenceJob ? (
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    Latest evidence for Job #{latestEvidenceJob.jobCardNumber || latestEvidenceJob.id}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Transparent photo proof uploaded by mechanic during service.
                  </p>
                </div>
              ) : (
                <div className="py-2 text-sm text-[#6B7280]">
                  No evidence uploaded yet. Photos appear during active service.
                </div>
              )}
              <Link
                to={latestEvidenceJob ? `/customer/service/${latestEvidenceJob.id}` : '/customer/service/active'}
                className="text-xs font-bold text-[#EA580C] hover:underline inline-flex items-center gap-1"
              >
                Evidence Gallery <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Pending Invoice Status */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FFFBEB] text-[#D97706] rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#111827]">Invoice Status</h3>
                </div>
                {pendingInvoice ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                    Pending
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                    All Clear
                  </span>
                )}
              </div>
              {pendingInvoice ? (
                <div>
                  <p className="text-base font-extrabold text-[#111827]">
                    {formatCurrency(pendingInvoice.totalAmount)}
                  </p>
                  <p className="text-xs text-[#4B5563] mt-1 font-mono">
                    Invoice #{pendingInvoice.invoiceNumber}
                  </p>
                </div>
              ) : (
                <div className="py-2 text-sm text-[#6B7280]">
                  No pending invoices awaiting payment.
                </div>
              )}
              <Link
                to="/customer/invoices"
                className="text-xs font-bold text-[#EA580C] hover:underline inline-flex items-center gap-1"
              >
                All Invoices <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. Roadside Assistance Banner */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FEF2F2] text-[#DC2626] rounded-xl">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#111827]">Roadside Assistance</h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                  Planned capability
                </span>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  24/7 Emergency breakdown assistance and GPS dispatch integration preview.
                </p>
              </div>
              <Link
                to="/customer/roadside"
                className="text-xs font-bold text-[#EA580C] hover:underline inline-flex items-center gap-1"
              >
                Preview RSA Capability <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
};
