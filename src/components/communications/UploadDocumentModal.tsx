'use client';

import React, { useState } from 'react';
import { X, FileText, Upload, CheckCircle2, Lock } from 'lucide-react';
import { DocumentCategory, DocumentVisibility } from '@/types/database.types';

interface UploadDocumentModalProps {
  onClose: () => void;
  onSubmitDocument: (docData: {
    title: string;
    category: DocumentCategory;
    visibility: DocumentVisibility;
    fileSize: string;
    fileType: 'PDF' | 'DOCX' | 'XLSX';
  }) => void;
}

export default function UploadDocumentModal({ onClose, onSubmitDocument }: UploadDocumentModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('BYLAWS');
  const [visibility, setVisibility] = useState<DocumentVisibility>('MEMBERS_ONLY');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);
      if (file.name.endsWith('.docx')) setFileType('DOCX');
      else if (file.name.endsWith('.xlsx')) setFileType('XLSX');
      else setFileType('PDF');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onSubmitDocument({
        title,
        category,
        visibility,
        fileSize,
        fileType,
      });
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Upload to Document Vault</h3>
              <p className="text-xs text-slate-500">Archive official society certificates, bye-laws, and audits</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Document Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Society Lift Safety Audit NOC (2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Document Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="BYLAWS">Society Bye-laws</option>
                <option value="AGM">AGM / Committee Minutes</option>
                <option value="FINANCIAL">Audited Accounts & Balance Sheet</option>
                <option value="NOTICE">Statutory NOC & Certificates</option>
                <option value="FORM">Member Forms & NOC Templates</option>
                <option value="OTHER">Other Documents</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Access Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as DocumentVisibility)}
                className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="PUBLIC">Public (All visitors)</option>
                <option value="MEMBERS_ONLY">Members Only (Owners & Tenants)</option>
                <option value="COMMITTEE_ONLY">Managing Committee Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Document File (PDF, Word, Excel)
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center hover:bg-slate-100 transition">
              <Upload className="h-6 w-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">
                {fileName ? fileName : 'Click to select file from your computer'}
              </span>
              <span className="text-[11px] text-slate-400">PDF, DOCX, or XLSX up to 25 MB</span>
              <input
                type="file"
                accept=".pdf,.docx,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {submitting ? 'Uploading...' : 'Store Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

