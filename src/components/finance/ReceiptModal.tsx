'use client';

import React from 'react';
import { X, Printer, CheckCircle2, Building2 } from 'lucide-react';
import { MaintenanceChargeItem } from '@/lib/finance-actions';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReceiptModalProps {
  charge: MaintenanceChargeItem;
  onClose: () => void;
}

export default function ReceiptModal({ charge, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl space-y-6 my-8 print:m-0 print:p-0 print:shadow-none">
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b pb-4 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official Society Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save as PDF
            </button>
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="space-y-6 border border-slate-200 p-6 rounded-xl bg-white">
          {/* Header */}
          <div className="text-center border-b pb-4 space-y-1">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mb-2">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Starcity Heights Co-operative Housing Society Ltd.
            </h2>
            <p className="text-xs text-slate-500">
              Registration No: BOM/GEN/12345/2020 • Plot 42, Sector 18, Navi Mumbai - 400705
            </p>
          </div>

          {/* Receipt Info Bar */}
          <div className="flex items-center justify-between text-xs border-b pb-3">
            <div>
              <span className="text-slate-400 block">Receipt Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {charge.receipt_number || 'REC-2026-0819'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Receipt Date</span>
              <span className="font-semibold text-slate-900">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
          </div>

          {/* Resident & Unit Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-lg">
            <div>
              <span className="text-slate-400 block">Received From</span>
              <span className="font-bold text-slate-900 text-sm">{charge.resident_name}</span>
              <span className="block text-slate-500">{charge.resident_type}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Unit Details</span>
              <span className="font-bold text-slate-900 text-sm">Flat {charge.flat_number}</span>
              <span className="block text-slate-500">{charge.wing_name} • {charge.area_sqft} sq.ft</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2">Base Monthly Society Maintenance ({charge.billing_month})</td>
                  <td className="py-2 text-right">{formatCurrency(charge.base_amount)}</td>
                </tr>
                <tr>
                  <td className="py-2">Area-based Maintenance Charge ({charge.area_sqft} sq.ft)</td>
                  <td className="py-2 text-right">{formatCurrency(charge.area_amount)}</td>
                </tr>
                {charge.parking_amount > 0 && (
                  <tr>
                    <td className="py-2">Allotted Reserved Parking Fee</td>
                    <td className="py-2 text-right">{formatCurrency(charge.parking_amount)}</td>
                  </tr>
                )}
                {charge.penalty_amount > 0 && (
                  <tr>
                    <td className="py-2 text-red-600">Late Payment Penalty</td>
                    <td className="py-2 text-right text-red-600">{formatCurrency(charge.penalty_amount)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold text-slate-900 text-sm">
                  <td className="py-2.5">Total Amount Paid</td>
                  <td className="py-2.5 text-right text-blue-600">{formatCurrency(charge.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification Badge & Stamp */}
          <div className="flex items-center justify-between pt-4 border-t text-xs">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <span className="font-bold block">Payment Verified & Approved</span>
                <span className="text-[11px] text-slate-500">Verified by Hon. Treasurer</span>
              </div>
            </div>

            <div className="text-right">
              <div className="border-b border-slate-300 w-32 pb-6"></div>
              <span className="text-[11px] text-slate-500 block pt-1">Authorized Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

