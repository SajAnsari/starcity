'use client';

import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  User, 
  MapPin, 
  MessageSquare, 
  Send, 
  Star, 
  Wrench, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ComplaintItem } from '@/lib/complaint-actions';
import { formatDate } from '@/lib/utils';
import { ComplaintStatus } from '@/types/database.types';

interface TicketDetailModalProps {
  ticket: ComplaintItem;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, newStatus: ComplaintStatus, assignedTo?: string) => void;
  onAddComment: (ticketId: string, comment: string, isInternal: boolean) => void;
  onRateAndClose: (ticketId: string, rating: number, remarks: string) => void;
}

const TECHNICIANS = [
  'Suresh Kumar (Society Plumber)',
  'Ramesh Patil (Society Electrician)',
  'Mahendra Singh (Security Supervisor)',
  'Shankar (Housekeeping Lead)',
  'Otis Elevator AMC Technician',
];

export default function TicketDetailModal({
  ticket,
  onClose,
  onUpdateStatus,
  onAddComment,
  onRateAndClose,
}: TicketDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(ticket.assigned_to || TECHNICIANS[0]);
  const [rating, setRating] = useState<number>(5);
  const [closureRemarks, setClosureRemarks] = useState('');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(ticket.id, newComment, isInternal);
    setNewComment('');
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRateAndClose(ticket.id, rating, closureRemarks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                #TCK-{ticket.ticket_number}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {ticket.category}</span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mt-1">{ticket.title}</h3>
            <p className="text-xs text-slate-500">
              Raised by {ticket.created_by_name} ({ticket.flat_number}, {ticket.wing_name}) on {formatDate(ticket.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Priority & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Priority:</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                ticket.priority === 'EMERGENCY'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : ticket.priority === 'HIGH'
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              {ticket.priority}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Status:</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : ticket.status === 'IN_PROGRESS'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {ticket.status.replace('_', ' ')}
            </span>
          </div>

          {ticket.location && (
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{ticket.location}</span>
            </div>
          )}
        </div>

        {/* Description & Photo */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Description</h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            {ticket.description}
          </p>
          {ticket.attachment_url && (
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1.5">Attached Photo</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.attachment_url}
                alt="Ticket Photo"
                className="h-44 w-auto rounded-xl object-cover border shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Committee Workflow & Staff Assignment */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Staff Assignment & Status Updates
              </h4>
            </div>
            {ticket.assigned_to && (
              <span className="text-xs font-medium text-blue-700">
                Assigned to: <strong>{ticket.assigned_to}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2">
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs text-slate-800"
              >
                {TECHNICIANS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onUpdateStatus(ticket.id, 'ASSIGNED', selectedTech)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shrink-0"
              >
                Assign
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              {ticket.status !== 'IN_PROGRESS' && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'IN_PROGRESS')}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100"
                >
                  Mark In Progress
                </button>
              )}
              {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'RESOLVED')}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resident Rating & Closure (Shown if Resolved) */}
        {ticket.status === 'RESOLVED' && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Issue Marked as Resolved</h4>
                <p className="text-xs text-emerald-700">Resident feedback confirms closure</p>
              </div>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Service Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-amber-400 hover:text-amber-500"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Leave closing feedback (e.g. Fixed quickly, thank you)..."
                  value={closureRemarks}
                  onChange={(e) => setClosureRemarks(e.target.value)}
                  className="w-full rounded-lg border border-emerald-300 bg-white py-1.5 px-3 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Confirm Resolution & Close Ticket
              </button>
            </form>
          </div>
        )}

        {/* Comment Thread */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-slate-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Activity & Comments ({ticket.comments.length})
            </h4>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto">
            {ticket.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet.</p>
            ) : (
              ticket.comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="font-bold text-slate-800">
                      {c.user_name}{' '}
                      <span className="font-normal text-slate-400">({c.user_role})</span>
                    </span>
                    <span className="text-[10px]">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-slate-700">{c.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add an update or message..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 py-1.5 px-3 text-xs focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 flex items-center gap-1"
            >
              <Send className="h-3 w-3" />
              Reply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

