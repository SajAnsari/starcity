'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Wallet, AlertCircle } from 'lucide-react';
import { SUNDRY_INCOME_CATEGORIES, IncomeItem } from '@/lib/ledger-actions';
import { PaymentMode } from '@/types/database.types';

interface NewIncomeModalProps {
  onClose: () => void;
  onCreated: (income: Omit<IncomeItem, 'id' | 'created_at' | 'status'>) => void;
}

export default function NewIncomeModal({ onClose, onCreated }: NewIncomeModalProps) {
  const [receiptNumber, setReceiptNumber] = useState(`INC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [categoryName, setCategoryName] = useState<string>(SUNDRY_INCOME_CATEGORIES[0]);
  const [receivedFrom, setReceivedFrom] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivedFrom.trim()) {
      setError('Please specify who this income was received from.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount in INR.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter particulars or description for this receipt.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      onCreated({
        receipt_number: receiptNumber,
        society_id: 'soc-01',
        category_id: `cat-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        category_name: categoryName,
        received_from: receivedFrom.trim(),
        amount: Number(amount),
        income_date: incomeDate,
        payment_mode: paymentMode,
        reference_number: referenceNumber.trim() || undefined,
        description: description.trim(),
        created_by: 'Treasurer - Satish Deshmukh',
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Record Sundry Income</h2>
              <p className="text-xs text-slate-500">Record non-maintenance receipts (Clubhouse, scrap, interest, NOC)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Receipt Number</label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Receipt Date</label>
              <input
                type="date"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Income Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                {SUNDRY_INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Amount Received (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Received From (Resident / Entity)</label>
              <input
                type="text"
                placeholder="e.g. Rahul Verma (Flat A-202) or SBI Bank"
                value={receivedFrom}
                onChange={(e) => setReceivedFrom(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="BANK_TRANSFER">Bank Transfer (NEFT / IMPS)</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">UTR / Cheque / Reference Number</label>
            <input
              type="text"
              placeholder="e.g. UPI/39821039821 or Chq #88390"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Particulars & Description</label>
            <textarea
              rows={2}
              placeholder="e.g. Clubhouse booking deposit and rental fee for birthday event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Recording Receipt...' : 'Post Income Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

