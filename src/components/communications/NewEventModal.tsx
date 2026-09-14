'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock } from 'lucide-react';

interface NewEventModalProps {
  onClose: () => void;
  onSubmitEvent: (eventData: {
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    category: 'AGM' | 'FESTIVAL' | 'MEETING' | 'MAINTENANCE' | 'SPORTS';
  }) => void;
}

export default function NewEventModal({ onClose, onSubmitEvent }: NewEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('2026-09-27');
  const [startTime, setStartTime] = useState('10:30 AM');
  const [endTime, setEndTime] = useState('01:30 PM');
  const [location, setLocation] = useState('Society Clubhouse Main Hall');
  const [category, setCategory] = useState<'AGM' | 'FESTIVAL' | 'MEETING' | 'MAINTENANCE' | 'SPORTS'>('AGM');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onSubmitEvent({
        title,
        description,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        location,
        category,
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Schedule Society Event</h3>
              <p className="text-xs text-slate-500">Plan an AGM, celebration, or society maintenance drive</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Event Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="AGM">General Body Meeting (AGM / EGM)</option>
              <option value="FESTIVAL">Festival & Cultural Celebration</option>
              <option value="MAINTENANCE">Society Maintenance Drive</option>
              <option value="MEETING">Committee / Floor Meeting</option>
              <option value="SPORTS">Sports & Recreation Activity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 12th Annual General Body Meeting (AGM)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 px-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full rounded-lg border border-slate-300 py-2 px-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="01:30 PM"
                className="w-full rounded-lg border border-slate-300 py-2 px-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Location / Venue
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Society Clubhouse Main Hall"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Agenda & Notes
            </label>
            <textarea
              rows={3}
              placeholder="Outline the meeting agenda items, items requiring member votes, or celebration highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none text-xs"
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
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? 'Scheduling...' : 'Save & Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

