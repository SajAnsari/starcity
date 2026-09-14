'use client';

import React, { useState } from 'react';
import { 
  Receipt, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  Printer, 
  Filter, 
  Search, 
  FileCheck, 
  PlusCircle, 
  Settings, 
  TrendingUp, 
  Check, 
  X, 
  Eye, 
  Send,
  Building
} from 'lucide-react';
import { 
  MaintenanceChargeItem, 
  PaymentItem, 
  BillingConfig,
  INITIAL_DEMO_CHARGES, 
  INITIAL_DEMO_PAYMENTS, 
  DEMO_BILLING_CONFIG 
} from '@/lib/finance-actions';
import { formatCurrency, formatDate } from '@/lib/utils';
import UpiPaymentModal from '@/components/finance/UpiPaymentModal';
import ReceiptModal from '@/components/finance/ReceiptModal';

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<'bills' | 'reconcile' | 'defaulters' | 'settings'>('bills');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');

  // State arrays initialized with demo data
  const [charges, setCharges] = useState<MaintenanceChargeItem[]>(INITIAL_DEMO_CHARGES);
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_DEMO_PAYMENTS);
  const [config, setConfig] = useState<BillingConfig>(DEMO_BILLING_CONFIG);

  // Modals state
  const [selectedChargeForPay, setSelectedChargeForPay] = useState<MaintenanceChargeItem | null>(null);
  const [selectedChargeForReceipt, setSelectedChargeForReceipt] = useState<MaintenanceChargeItem | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showProofPreviewUrl, setShowProofPreviewUrl] = useState<string | null>(null);

  // Form state for generating next month
  const [genMonth, setGenMonth] = useState('2026-10');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Metrics
  const totalInvoiced = charges.reduce((acc, c) => acc + c.total_amount, 0);
  const totalCollected = charges
    .filter((c) => c.status === 'PAID')
    .reduce((acc, c) => acc + c.total_amount, 0);
  const totalPending = totalInvoiced - totalCollected;
  const pendingApprovals = payments.filter((p) => p.status === 'PENDING_APPROVAL').length;
  const collectionPercent = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  // Handle resident payment submission
  const handleSubmitPayment = (chargeId: string, utr: string, mode: string, filePreview: string | null) => {
    const charge = charges.find((c) => c.id === chargeId);
    if (!charge) return;

    // Add to reconciliation queue
    const newPayment: PaymentItem = {
      id: 'pay-' + Date.now(),
      society_id: charge.society_id,
      flat_id: charge.flat_id,
      flat_number: charge.flat_number,
      wing_name: charge.wing_name,
      user_name: charge.resident_name,
      user_phone: charge.resident_phone,
      maintenance_charge_id: charge.id,
      billing_month: charge.billing_month,
      amount: charge.total_amount,
      payment_date: new Date().toISOString().split('T')[0],
      payment_mode: mode as any,
      reference_number: utr,
      receipt_url: filePreview || undefined,
      status: 'PENDING_APPROVAL',
      created_at: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    showToast(`Payment submitted with UTR ${utr}. Awaiting Treasurer approval.`);
  };

  // Treasurer Approve Payment
  const handleApprovePayment = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update payment
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'APPROVED',
              receipt_number: receiptNo,
              verified_by: 'Hon. Treasurer (Current User)',
              verified_at: new Date().toISOString(),
            }
          : p
      )
    );

    // Update corresponding charge to PAID
    setCharges((prev) =>
      prev.map((c) =>
        c.id === payment.maintenance_charge_id
          ? {
              ...c,
              status: 'PAID',
              payment_id: payment.id,
              receipt_number: receiptNo,
            }
          : c
      )
    );

    showToast(`Payment of ₹${payment.amount} approved! Receipt ${receiptNo} issued.`);
  };

  // Treasurer Reject Payment
  const handleRejectPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'REJECTED',
              rejection_reason: 'UTR mismatch or uncredited amount.',
            }
          : p
      )
    );
    showToast(`Payment marked as rejected.`);
  };

  // Generate Monthly Invoices
  const handleGenerateInvoices = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGenerateModal(false);
    showToast(`Generated 42 maintenance invoices for ${genMonth} successfully!`);
  };

  const filteredCharges = charges.filter((c) => {
    const matchesMonth = c.billing_month === selectedMonth;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesQuery =
      c.flat_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.resident_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {notificationMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl animate-fade-in border border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {notificationMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Maintenance & Accounting</h2>
          <p className="text-sm text-slate-500">Invoicing, instant UPI QR payments, and Treasurer reconciliation</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            Generate Monthly Dues
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Invoiced */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Invoiced</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalInvoiced)}</span>
            <span className="ml-2 text-xs font-medium text-slate-500">Month {selectedMonth}</span>
          </div>
        </div>

        {/* Total Collected */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-700">{formatCurrency(totalCollected)}</span>
            <span className="ml-2 text-xs font-bold text-emerald-600">({collectionPercent}%)</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${collectionPercent}%` }}
            />
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Dues</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-amber-700">{formatCurrency(totalPending)}</span>
            <span className="ml-2 text-xs font-medium text-amber-600">
              {charges.filter((c) => c.status !== 'PAID').length} Flats Pending
            </span>
          </div>
        </div>

        {/* Verification Queue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reconcile Queue</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-purple-900">{pendingApprovals}</span>
            <span className="ml-2 text-xs font-semibold text-purple-700">Awaiting Approval</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Review UTRs & bank credits</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('bills')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'bills'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" />
          Maintenance Invoices ({charges.length})
        </button>
        <button
          onClick={() => setActiveTab('reconcile')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition relative ${
            activeTab === 'reconcile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          Reconciliation Queue
          {pendingApprovals > 0 && (
            <span className="ml-1 rounded-full bg-purple-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
              {pendingApprovals}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('defaulters')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'defaulters'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          Defaulters & Arrears
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="h-4 w-4" />
          Rate Configuration
        </button>
      </div>

      {/* TAB 1: MAINTENANCE INVOICES DIRECTORY */}
      {activeTab === 'bills' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search flat or member..."
                  className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAID">Paid Only</option>
                  <option value="PENDING">Pending Only</option>
                  <option value="OVERDUE">Overdue Only</option>
                </select>
              </div>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Billing Cycle:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="2026-09">September 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="border-b bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Flat & Wing</th>
                    <th className="px-5 py-3.5">Resident</th>
                    <th className="px-5 py-3.5">Base Fee</th>
                    <th className="px-5 py-3.5">Area Charge</th>
                    <th className="px-5 py-3.5">Parking/Late</th>
                    <th className="px-5 py-3.5">Total Amount</th>
                    <th className="px-5 py-3.5">Due Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCharges.map((charge) => (
                    <tr key={charge.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {charge.flat_number}
                        <span className="block text-[11px] font-normal text-slate-400">{charge.wing_name}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800">{charge.resident_name}</span>
                        <span className="block text-[11px] text-slate-400">{charge.resident_type}</span>
                      </td>
                      <td className="px-5 py-4">{formatCurrency(charge.base_amount)}</td>
                      <td className="px-5 py-4">
                        {formatCurrency(charge.area_amount)}
                        <span className="block text-[10px] text-slate-400">({charge.area_sqft} sqft)</span>
                      </td>
                      <td className="px-5 py-4">
                        {charge.parking_amount > 0 && (
                          <span className="block">{formatCurrency(charge.parking_amount)} (Parking)</span>
                        )}
                        {charge.penalty_amount > 0 && (
                          <span className="block text-red-600 font-semibold">
                            +{formatCurrency(charge.penalty_amount)} (Late)
                          </span>
                        )}
                        {charge.parking_amount === 0 && charge.penalty_amount === 0 && '₹0'}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-slate-900 text-sm">
                        {formatCurrency(charge.total_amount)}
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-medium">{formatDate(charge.due_date)}</td>
                      <td className="px-5 py-4">
                        {charge.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        )}
                        {charge.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-bold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {charge.status === 'OVERDUE' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 font-bold text-red-700 border border-red-200">
                            <AlertCircle className="h-3 w-3" />
                            Overdue
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {charge.status === 'PAID' ? (
                          <button
                            onClick={() => setSelectedChargeForReceipt(charge)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                          >
                            <Printer className="h-3.5 w-3.5 text-slate-500" />
                            Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedChargeForPay(charge)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            Pay via UPI
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TREASURER RECONCILIATION QUEUE */}
      {activeTab === 'reconcile' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 text-xs text-purple-900">
            <p className="font-bold text-sm mb-0.5">Treasurer Reconciliation Desk</p>
            Review offline & UPI submissions against your society bank statement. Upon clicking <strong>Approve</strong>, an official sequential receipt is generated and dues are marked as cleared.
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="border-b bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Flat & Resident</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Date & Mode</th>
                    <th className="px-5 py-3.5">UTR / Reference No</th>
                    <th className="px-5 py-3.5">Proof Attachment</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 block">{p.flat_number}</span>
                        <span className="text-slate-500">{p.user_name}</span>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="block font-medium">{formatDate(p.payment_date)}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono font-bold text-slate-600 uppercase">
                          {p.payment_mode}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-semibold text-slate-800">
                        {p.reference_number}
                      </td>
                      <td className="px-5 py-4">
                        {p.receipt_url ? (
                          <button
                            onClick={() => setShowProofPreviewUrl(p.receipt_url!)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Proof
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">No file attached</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {p.status === 'PENDING_APPROVAL' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 font-bold text-purple-700 border border-purple-200">
                            <Clock className="h-3 w-3" />
                            Pending Review
                          </span>
                        )}
                        {p.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Approved
                          </span>
                        )}
                        {p.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 font-bold text-red-700 border border-red-200">
                            <X className="h-3 w-3" />
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {p.status === 'PENDING_APPROVAL' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRejectPayment(p.id)}
                              className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprovePayment(p.id)}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                            >
                              Approve & Issue Receipt
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {p.receipt_number || 'Processed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEFAULTERS LIST */}
      {activeTab === 'defaulters' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-xs text-red-900">
            <p className="font-bold text-sm mb-0.5">Overdue Defaulters & Arrears Tracker</p>
            Flats with unpaid dues past the grace period. Committee members can send batch reminders or initiate bye-law interest penalties.
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {charges
              .filter((c) => c.status === 'OVERDUE')
              .map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between border-b pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Flat {c.flat_number}</h4>
                      <p className="text-xs text-slate-500">{c.resident_name} • {c.resident_phone}</p>
                    </div>
                    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                      Overdue (15 Days)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block">Total Outstanding</span>
                      <span className="text-lg font-extrabold text-red-600">{formatCurrency(c.total_amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Late Fee Added</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(c.penalty_amount)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => showToast(`Sent overdue payment reminder notice to ${c.resident_name}`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Send className="h-3.5 w-3.5 text-slate-500" />
                      Send Reminder Notice
                    </button>
                    <button
                      onClick={() => setSelectedChargeForPay(c)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: RATE CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-bold text-slate-900 text-lg">Society Maintenance Calculation Rules</h3>
            <p className="text-xs text-slate-500">
              Configure calculation algorithms, per-sq.ft rates, parking fees, and society UPI VPA.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Billing Formula
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, billing_type: 'FLAT_RATE' })}
                  className={`rounded-lg p-3 text-xs font-bold border text-center transition ${
                    config.billing_type === 'FLAT_RATE'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Flat Rate Only
                  <span className="block font-normal text-[10px] text-slate-500 mt-0.5">e.g. ₹2,500/unit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, billing_type: 'PER_SQFT' })}
                  className={`rounded-lg p-3 text-xs font-bold border text-center transition ${
                    config.billing_type === 'PER_SQFT'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Per Sq.Ft Area Rate
                  <span className="block font-normal text-[10px] text-slate-500 mt-0.5">e.g. ₹3.50 × Area</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, billing_type: 'HYBRID' })}
                  className={`rounded-lg p-3 text-xs font-bold border text-center transition ${
                    config.billing_type === 'HYBRID'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Hybrid (Recommended)
                  <span className="block font-normal text-[10px] text-slate-500 mt-0.5">Base + Area + Parking</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Base Maintenance Amount (₹)
                </label>
                <input
                  type="number"
                  value={config.base_maintenance_amount}
                  onChange={(e) => setConfig({ ...config, base_maintenance_amount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Rate per Sq.Ft (₹)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={config.rate_per_sqft}
                  onChange={(e) => setConfig({ ...config, rate_per_sqft: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Monthly Due Day (Day of Month)
                </label>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={config.due_day_of_month}
                  onChange={(e) => setConfig({ ...config, due_day_of_month: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Late Fee Penalty (₹)
                </label>
                <input
                  type="number"
                  value={config.late_fee_amount}
                  onChange={(e) => setConfig({ ...config, late_fee_amount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Official Society UPI VPA (For Dynamic QR Payments)
              </label>
              <input
                type="text"
                value={config.upi_id}
                onChange={(e) => setConfig({ ...config, upi_id: e.target.value })}
                placeholder="e.g. starcity@sbi"
                className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm font-mono focus:border-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                All residents will scan QR codes pointing directly to this bank VPA.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => showToast('Billing rules and UPI ID saved successfully!')}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PAY VIA UPI */}
      {selectedChargeForPay && (
        <UpiPaymentModal
          charge={selectedChargeForPay}
          upiId={config.upi_id}
          onClose={() => setSelectedChargeForPay(null)}
          onSubmitPayment={handleSubmitPayment}
        />
      )}

      {/* MODAL: VIEW OFFICIAL RECEIPT */}
      {selectedChargeForReceipt && (
        <ReceiptModal
          charge={selectedChargeForReceipt}
          onClose={() => setSelectedChargeForReceipt(null)}
        />
      )}

      {/* MODAL: GENERATE DUES */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Generate Monthly Invoices</h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleGenerateInvoices} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Billing Month
                </label>
                <input
                  type="month"
                  value={genMonth}
                  onChange={(e) => setGenMonth(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Preview calculation:</p>
                <p>• Total Active Units: 42 Flats</p>
                <p>• Billing Formula: {config.billing_type}</p>
                <p>• Due Date: 10th of {genMonth}</p>
                <p>• Estimated Billing: ~₹1,25,000</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Generate All Invoices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROOF SCREENSHOT PREVIEW MODAL */}
      {showProofPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative max-w-lg rounded-2xl bg-white p-4 shadow-2xl">
            <button
              onClick={() => setShowProofPreviewUrl(null)}
              className="absolute top-2 right-2 rounded-full bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Resident Payment Proof</h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={showProofPreviewUrl}
              alt="Payment Proof Screenshot"
              className="max-h-96 w-full rounded-lg object-contain border"
            />
          </div>
        </div>
      )}
    </div>
  );
}

