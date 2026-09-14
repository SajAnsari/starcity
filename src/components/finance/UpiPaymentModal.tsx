'use client';

import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Upload, 
  CheckCircle2, 
  Copy, 
  Check, 
  Smartphone, 
  Building2, 
  AlertCircle 
} from 'lucide-react';
import { MaintenanceChargeItem } from '@/lib/finance-actions';
import { formatCurrency } from '@/lib/utils';

interface UpiPaymentModalProps {
  charge: MaintenanceChargeItem;
  upiId: string;
  onClose: () => void;
  onSubmitPayment: (chargeId: string, utr: string, mode: string, filePreview: string | null) => void;
}

export default function UpiPaymentModal({
  charge,
  upiId,
  onClose,
  onSubmitPayment,
}: UpiPaymentModalProps) {
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'BANK_TRANSFER' | 'CHEQUE'>('UPI');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Generate UPI deep link & QR code URL
  const note = `Maintenance ${charge.flat_number} ${charge.billing_month}`;
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Starcity Heights')}&am=${charge.total_amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onSubmitPayment(charge.id, utrNumber, paymentMode, screenshotPreview);
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Pay Society Maintenance</h3>
            <p className="text-xs text-slate-500">
              Flat {charge.flat_number} • {charge.wing_name} • Month: {charge.billing_month}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Due Breakdown Banner */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Total Payable Amount</span>
            <span className="text-2xl font-extrabold text-blue-700">{formatCurrency(charge.total_amount)}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 border-t border-blue-200/60 pt-2 text-[11px] text-blue-900">
            <div>
              <span className="text-blue-600">Base:</span> {formatCurrency(charge.base_amount)}
            </div>
            <div>
              <span className="text-blue-600">Area ({charge.area_sqft} sqft):</span> {formatCurrency(charge.area_amount)}
            </div>
            <div>
              <span className="text-blue-600">Parking / Late:</span> {formatCurrency(charge.parking_amount + charge.penalty_amount)}
            </div>
          </div>
        </div>

        {/* Payment Mode Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMode('UPI')}
              className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                paymentMode === 'UPI'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              UPI QR / App
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('BANK_TRANSFER')}
              className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                paymentMode === 'BANK_TRANSFER'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              NEFT / IMPS
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('CHEQUE')}
              className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                paymentMode === 'CHEQUE'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Cheque / Cash
            </button>
          </div>
        </div>

        {/* Dynamic UPI Section */}
        {paymentMode === 'UPI' && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center space-y-3">
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg bg-white p-2 border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Scan with any UPI App (Google Pay, PhonePe, Paytm, BHIM)
            </p>

            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-xs text-slate-500">Society VPA:</span>
              <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border">
                {upiId}
              </span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="inline-flex items-center gap-1 rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
              >
                {copiedUpi ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                {copiedUpi ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Mobile Direct Intent Button */}
            <div className="pt-2">
              <a
                href={upiIntentUrl}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition w-full"
              >
                <Smartphone className="h-4 w-4" />
                Tap to Pay via Mobile UPI App
              </a>
            </div>
          </div>
        )}

        {/* Form: UTR & Proof Upload */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              {paymentMode === 'UPI'
                ? 'UPI Reference / UTR Number (12 Digits)'
                : paymentMode === 'BANK_TRANSFER'
                ? 'Bank Transaction Reference No'
                : 'Cheque Number / Receipt Reference'}
            </label>
            <input
              type="text"
              required
              placeholder={paymentMode === 'UPI' ? 'e.g. 425519827391' : 'e.g. NEFT12903841'}
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Upload Payment Screenshot / Receipt (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                <Upload className="h-4 w-4 text-slate-400" />
                Choose Screenshot
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {screenshotPreview && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Image Attached
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !utrNumber.trim()}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Payment for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

