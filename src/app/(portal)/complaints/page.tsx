'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Image as ImageIcon, 
  ShieldAlert, 
  Check, 
  User, 
  MapPin, 
  Flame 
} from 'lucide-react';
import { 
  ComplaintItem, 
  INITIAL_DEMO_COMPLAINTS, 
  getComplaints 
} from '@/lib/complaint-actions';
import { formatDate } from '@/lib/utils';
import { ComplaintPriority, ComplaintStatus } from '@/types/database.types';
import NewTicketModal from '@/components/complaints/NewTicketModal';
import TicketDetailModal from '@/components/complaints/TicketDetailModal';

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const [tickets, setTickets] = useState<ComplaintItem[]>(INITIAL_DEMO_COMPLAINTS);
  const [selectedTicket, setSelectedTicket] = useState<ComplaintItem | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Metrics
  const totalTickets = tickets.length;
  const inProgressTickets = tickets.filter((t) => t.status === 'NEW' || t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const emergencyTickets = tickets.filter((t) => t.priority === 'EMERGENCY').length;

  // New ticket submission
  const handleCreateTicket = (ticketData: {
    category: string;
    title: string;
    description: string;
    location: string;
    priority: ComplaintPriority;
    attachmentUrl?: string;
  }) => {
    const newTicket: ComplaintItem = {
      id: 'tck-' + Date.now(),
      ticket_number: 1040 + tickets.length + 1,
      society_id: 'soc-01',
      flat_number: 'A-101',
      wing_name: 'Emerald (Wing A)',
      created_by_name: 'Rajesh Sharma',
      created_by_phone: '+91 98200 11223',
      category: ticketData.category,
      title: ticketData.title,
      description: ticketData.description,
      location: ticketData.location,
      priority: ticketData.priority,
      status: 'NEW',
      attachment_url: ticketData.attachmentUrl,
      comments: [],
      created_at: new Date().toISOString(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Ticket #TCK-${newTicket.ticket_number} created successfully!`);
  };

  // Update status & assign
  const handleUpdateStatus = (ticketId: string, newStatus: ComplaintStatus, assignedTo?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = {
            ...t,
            status: newStatus,
            assigned_to: assignedTo || t.assigned_to,
            resolved_at: newStatus === 'RESOLVED' ? new Date().toISOString() : t.resolved_at,
          };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Ticket updated to ${newStatus.replace('_', ' ')}`);
  };

  // Add comment
  const handleAddComment = (ticketId: string, commentText: string, isInternal: boolean) => {
    const newComment = {
      id: 'c-' + Date.now(),
      complaint_id: ticketId,
      user_name: 'Satish Deshmukh',
      user_role: 'Supervisor',
      comment: commentText,
      is_internal: isInternal,
      created_at: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = {
            ...t,
            comments: [...t.comments, newComment],
          };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  // Rate & close ticket
  const handleRateAndClose = (ticketId: string, rating: number, remarks: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = {
            ...t,
            status: 'CLOSED' as ComplaintStatus,
            resident_rating: rating,
            closure_remarks: remarks,
          };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Thank you! Ticket officially closed with ${rating}-star feedback.`);
  };

  // Filtering
  const filteredTickets = tickets.filter((t) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'my' && t.flat_number === 'A-101') ||
      (activeTab === 'urgent' && (t.priority === 'EMERGENCY' || t.priority === 'HIGH'));

    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticket_number.toString().includes(searchQuery) ||
      t.flat_number.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesCategory && matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl animate-fade-in border border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Helpdesk & Maintenance Tickets</h2>
          <p className="text-sm text-slate-500">Raise complaints, track staff assignments, and verify resolutions</p>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Raise New Ticket
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tickets</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalTickets}</span>
            <span className="text-xs text-slate-400">All categories</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active / In-Progress</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-amber-600">{inProgressTickets}</span>
            <span className="text-xs text-amber-600 font-semibold">Under Action</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved & Closed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-600">{resolvedTickets}</span>
            <span className="text-xs text-emerald-600 font-semibold">SLA Met</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emergency Tickets</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-red-600">{emergencyTickets}</span>
            <span className="text-xs text-red-600 font-semibold">Immediate Priority</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="h-4 w-4" />
          All Society Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'my'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-4 w-4" />
          My Flat Tickets
        </button>
        <button
          onClick={() => setActiveTab('urgent')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'urgent'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flame className="h-4 w-4 text-red-500" />
          High & Emergency ({emergencyTickets})
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket #, issue, or flat..."
            className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Plumbing & Water Seepage">Plumbing</option>
              <option value="Electrical & Corridor Lights">Electrical</option>
              <option value="Lift Breakdown">Lift Issue</option>
              <option value="Security & Gate Vigilance">Security</option>
              <option value="Housekeeping & Cleanliness">Housekeeping</option>
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            No helpdesk tickets found matching your filter criteria.
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    #TCK-{ticket.ticket_number}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{ticket.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Priority Badge */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      ticket.priority === 'EMERGENCY'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : ticket.priority === 'HIGH'
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {ticket.priority}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
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
              </div>

              {/* Title & Description preview */}
              <div>
                <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                  {ticket.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{ticket.description}</p>
              </div>

              {/* Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-slate-600">
                    Flat {ticket.flat_number} ({ticket.wing_name})
                  </span>
                  {ticket.assigned_to ? (
                    <span className="text-blue-700 font-semibold">
                      Tech: {ticket.assigned_to}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Unassigned</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {ticket.attachment_url && (
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Photo
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {ticket.comments.length}
                  </span>
                  <span>{formatDate(ticket.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* NEW TICKET MODAL */}
      {showNewTicketModal && (
        <NewTicketModal
          onClose={() => setShowNewTicketModal(false)}
          onSubmitTicket={handleCreateTicket}
        />
      )}

      {/* TICKET DETAIL & WORKFLOW MODAL */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddComment={handleAddComment}
          onRateAndClose={handleRateAndClose}
        />
      )}
    </div>
  );
}

