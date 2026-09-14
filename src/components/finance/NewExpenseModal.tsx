'use client';

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Receipt, AlertCircle } from 'lucide-react';
import { EXPENSE_CATEGORIES, ExpenseItem } from '@/lib/ledger-actions';
import { PaymentMode } from '@/types/database.types';

interface NewExpenseModalProps {
  onClose: () => void;
  onCreated: (expense: Omit<ExpenseItem, 'id' | 'created_at' | 'status'>) => void;
}

export default function NewExpenseModal({ onClose, onCreated }: NewExpenseModalProps) {
  const [voucherNumber, setVoucherNumber] = useState(`VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [categoryName, setCategoryName] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [vendor, setVendor] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('BANK_TRANSFER');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor.trim()) {
      setError('Please provide the vendor or service provider name.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid expense amount in INR.');
      return;
    }
    if (!description.trim()) {
      setError('Please describe the purpose of this expense.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      onCreated({
        voucher_number: voucherNumber,
        society_id: 'soc-01',
        category_id: `cat-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        category_name: categoryName,
        vendor: vendor.trim(),
        invoice_number: invoiceNumber.trim() || undefined,
        amount: Number(amount),
        expense_date: expenseDate,
        payment_mode: paymentMode,
        reference_number: referenceNumber.trim() || undefined,
        description: description.trim(),
        attachment_url: attachmentPreview || undefined,
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Record Expense Voucher</h2>
              <p className="text-xs text-slate-500">Add a debit entry to the society ledger with vendor invoice</p>
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
              <label className="block text-xs font-semibold text-slate-700">Voucher Number</label>
              <input
                type="text"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Expense Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Expense Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:border-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Vendor / Payee</label>
              <input
                type="text"
                placeholder="e.g. Eagle Eye Security Services"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Vendor Invoice / Bill No.</label>
              <input
                type="text"
                placeholder="e.g. INV-88219"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
              >
                <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS)</option>
                <option value="UPI">UPI Payment</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CASH">Petty Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Reference / Cheque / UTR #</label>
              <input
                type="text"
                placeholder="e.g. NEFT/HDFC99281 or Chq #4401"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Description & Particulars</label>
            <textarea
              rows={2}
              placeholder="e.g. Monthly security guard charges for 4 guards (day & night shifts)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          {/* Invoice File Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Attach Bill / Receipt Proof</label>
            <div className="mt-1.5 flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600 hover:border-rose-400 hover:bg-rose-50/40 transition">
                <Upload className="h-4 w-4 text-slate-400" />
                <span>Upload Invoice (PDF/PNG)</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {attachmentName && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  {attachmentName}
                </span>
              )}
            </div>
            {attachmentPreview && (
              <div className="mt-2 relative inline-block rounded-lg border p-1 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachmentPreview}
                  alt="Invoice Preview"
                  className="h-16 w-16 object-cover rounded-md"
                />
              </div>
            )}
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
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Posting Voucher...' : 'Post Expense to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

