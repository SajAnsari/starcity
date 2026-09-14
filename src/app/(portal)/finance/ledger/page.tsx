'use client';

import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Download, 
  Printer, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  FileText,
  Building2,
  ExternalLink
} from 'lucide-react';
import { 
  ExpenseItem, 
  IncomeItem, 
  CashBookTransaction, 
  getExpenseItems, 
  getIncomeItems, 
  getCashBookLedger, 
  getFinancialMetrics, 
  addExpenseVoucher, 
  addIncomeItem, 
  exportCashBookCsv 
} from '@/lib/ledger-actions';
import { formatCurrency, formatDate } from '@/lib/utils';
import NewExpenseModal from '@/components/finance/NewExpenseModal';
import NewIncomeModal from '@/components/finance/NewIncomeModal';

export default function CashBookLedgerPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'expenses' | 'income'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => getExpenseItems());
  const [incomeList, setIncomeList] = useState<IncomeItem[]>(() => getIncomeItems());
  const [ledger, setLedger] = useState<CashBookTransaction[]>(() => getCashBookLedger());

  const metrics = useMemo(() => {
    return getFinancialMetrics(385000, expenses, incomeList);
  }, [expenses, incomeList]);

  const handleExpenseCreated = (newExp: Omit<ExpenseItem, 'id' | 'created_at' | 'status'>) => {
    const created = addExpenseVoucher(newExp);
    setExpenses(getExpenseItems());
    setLedger(getCashBookLedger());
    setToastMessage(`Expense Voucher ${created.voucher_number} recorded successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleIncomeCreated = (newInc: Omit<IncomeItem, 'id' | 'created_at' | 'status'>) => {
    const created = addIncomeItem(newInc);
    setIncomeList(getIncomeItems());
    setLedger(getCashBookLedger());
    setToastMessage(`Income Receipt ${created.receipt_number} recorded successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Ledger
  const filteredLedger = useMemo(() => {
    return ledger.filter((item) => {
      const matchesSearch = 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.voucher_or_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesMode = modeFilter === 'ALL' || item.payment_mode === modeFilter;

      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [ledger, searchQuery, categoryFilter, modeFilter]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch = 
        exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.voucher_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.invoice_number && exp.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === 'ALL' || exp.category_name === categoryFilter;
      const matchesMode = modeFilter === 'ALL' || exp.payment_mode === modeFilter;

      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [expenses, searchQuery, categoryFilter, modeFilter]);

  // Filtered Income
  const filteredIncome = useMemo(() => {
    return incomeList.filter((inc) => {
      const matchesSearch = 
        inc.received_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.receipt_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inc.reference_number && inc.reference_number.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === 'ALL' || inc.category_name === categoryFilter;
      const matchesMode = modeFilter === 'ALL' || inc.payment_mode === modeFilter;

      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [incomeList, searchQuery, categoryFilter, modeFilter]);

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Treasurer Desk
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">FY 2026–2027</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Society Cash Book & General Ledger
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time double-entry cash flow, approved maintenance receipts, vendor expense vouchers, and running bank balance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            onClick={() => exportCashBookCsv(ledger)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print Ledger
          </button>
          <button
            onClick={() => setShowIncomeModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            Record Income
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
          >
            <Plus className="h-4 w-4" />
            Record Expense Voucher
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Income (Sep)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{formatCurrency(metrics.total_income)}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-semibold text-emerald-600">{formatCurrency(metrics.maintenance_income)}</span> Maint. +{' '}
              <span className="font-semibold text-blue-600">{formatCurrency(metrics.other_income)}</span> Sundry
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Expenses (Sep)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{formatCurrency(metrics.total_expenses)}</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Across <span className="font-semibold text-slate-700">{expenses.length} approved vouchers</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Surplus / (Deficit)</span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                metrics.net_surplus >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {metrics.net_surplus >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-black ${
                metrics.net_surplus >= 0 ? 'text-blue-600' : 'text-amber-600'
              }`}
            >
              {metrics.net_surplus >= 0 ? `+${formatCurrency(metrics.net_surplus)}` : formatCurrency(metrics.net_surplus)}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Net monthly operational margin</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Closing Society Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-900">{formatCurrency(metrics.closing_balance)}</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Bank: <span className="font-semibold text-slate-700">{formatCurrency(metrics.bank_current_account)}</span> • Cash: {formatCurrency(metrics.petty_cash)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Tabs & Search Header */}
        <div className="border-b p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cash Book ({ledger.length})
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === 'expenses'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense Vouchers ({expenses.length})
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === 'income'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sundry Income ({incomeList.length})
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendor, description, voucher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Modes</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
        </div>

        {/* TAB 1: ALL TRANSACTIONS (CASH BOOK) */}
        {activeTab === 'all' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-4">Category & Particulars</th>
                  <th className="py-3.5 px-3">Party / Entity</th>
                  <th className="py-3.5 px-3">Voucher / Ref #</th>
                  <th className="py-3.5 px-3">Mode</th>
                  <th className="py-3.5 px-4 text-right text-emerald-700">Credit (+)</th>
                  <th className="py-3.5 px-4 text-right text-rose-700">Debit (-)</th>
                  <th className="py-3.5 px-4 text-right font-black text-slate-800">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No ledger transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            txn.type === 'INCOME'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {txn.type === 'INCOME' ? (
                            <ArrowDownLeft className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 text-rose-600" />
                          )}
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{txn.category}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{txn.description}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                        {txn.party}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {txn.voucher_or_ref}
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                          {txn.payment_mode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                        {txn.income_amount > 0 ? formatCurrency(txn.income_amount) : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600 whitespace-nowrap">
                        {txn.expense_amount > 0 ? formatCurrency(txn.expense_amount) : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                        {formatCurrency(txn.running_balance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: EXPENSE VOUCHERS */}
        {activeTab === 'expenses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Voucher #</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-4">Category & Vendor</th>
                  <th className="py-3.5 px-3">Invoice No.</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-3">Payment Mode</th>
                  <th className="py-3.5 px-4 text-right font-black text-slate-800">Amount</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-3 text-center">Attachment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No expense vouchers found.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-rose-700 whitespace-nowrap">
                        {exp.voucher_number}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                        {formatDate(exp.expense_date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{exp.vendor}</div>
                        <div className="text-[11px] text-slate-500">{exp.category_name}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                        {exp.invoice_number || '—'}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 max-w-sm">
                        {exp.description}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{exp.payment_mode.replace('_', ' ')}</div>
                        {exp.reference_number && (
                          <div className="font-mono text-[10px] text-slate-400">{exp.reference_number}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-rose-600 whitespace-nowrap">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {exp.attachment_url ? (
                          <a
                            href={exp.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SUNDRY INCOME RECEIPTS */}
        {activeTab === 'income' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Receipt #</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Received From</th>
                  <th className="py-3.5 px-4">Particulars</th>
                  <th className="py-3.5 px-3">Mode & Reference</th>
                  <th className="py-3.5 px-4 text-right font-black text-slate-800">Amount</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncome.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No sundry income entries found.
                    </td>
                  </tr>
                ) : (
                  filteredIncome.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {inc.receipt_number}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                        {formatDate(inc.income_date)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {inc.category_name}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {inc.received_from}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 max-w-sm">
                        {inc.description}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{inc.payment_mode.replace('_', ' ')}</div>
                        {inc.reference_number && (
                          <div className="font-mono text-[10px] text-slate-400">{inc.reference_number}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-emerald-600 whitespace-nowrap">
                        {formatCurrency(inc.amount)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {inc.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showExpenseModal && (
        <NewExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onCreated={handleExpenseCreated}
        />
      )}

      {showIncomeModal && (
        <NewIncomeModal
          onClose={() => setShowIncomeModal(false)}
          onCreated={handleIncomeCreated}
        />
      )}
    </div>
  );
}

