'use client';

import React, { useState } from 'react';
import { X, Bell, Upload, AlertCircle, ShieldAlert } from 'lucide-react';
import { NoticePriority } from '@/types/database.types';

interface NewNoticeModalProps {
  onClose: () => void;
  onSubmitNotice: (notice: {
    title: string;
    description: string;
    priority: NoticePriority;
    attachmentName?: string;
  }) => void;
}

export default function NewNoticeModal({ onClose, onSubmitNotice }: NewNoticeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<NoticePriority>('NORMAL');
  const [attachmentName, setAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onSubmitNotice({
        title,
        description,
        priority,
        attachmentName: attachmentName.trim() || undefined,
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Publish Notice</h3>
              <p className="text-xs text-slate-500">Post an official society announcement to all residents</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Notice Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('NORMAL')}
                className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                  priority === 'NORMAL'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setPriority('IMPORTANT')}
                className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                  priority === 'IMPORTANT'
                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Important
              </button>
              <button
                type="button"
                onClick={() => setPriority('EMERGENCY')}
                className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                  priority === 'EMERGENCY'
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🚨 Emergency
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Notice Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Water Tank Cleaning Schedule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Announcement Message
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write the full message, timings, impact on elevators/water/electricity, and instructions for residents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Attachment Name / Circular Document (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Water_Tank_Cleaning_Notice.pdf"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none font-mono text-xs"
            />
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
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Broadcast Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

