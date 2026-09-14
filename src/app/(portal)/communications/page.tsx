'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Flame, 
  Lock, 
  Eye, 
  Users, 
  CalendarDays,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { 
  AnnouncementItem, 
  EventItem, 
  DocumentItem, 
  INITIAL_DEMO_ANNOUNCEMENTS, 
  INITIAL_DEMO_EVENTS, 
  INITIAL_DEMO_DOCUMENTS 
} from '@/lib/communication-actions';
import { formatDate } from '@/lib/utils';
import { NoticePriority, DocumentCategory, DocumentVisibility } from '@/types/database.types';
import NewNoticeModal from '@/components/communications/NewNoticeModal';
import NewEventModal from '@/components/communications/NewEventModal';
import UploadDocumentModal from '@/components/communications/UploadDocumentModal';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'notices' | 'events' | 'documents'>('notices');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | NoticePriority>('ALL');
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('ALL');

  // State arrays initialized with demo data
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_DEMO_ANNOUNCEMENTS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_DEMO_EVENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DEMO_DOCUMENTS);

  // Modals state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Metrics
  const totalNotices = announcements.length;
  const emergencyNotices = announcements.filter((a) => a.priority === 'EMERGENCY').length;
  const upcomingEvents = events.length;
  const archivedDocs = documents.length;

  // Handlers
  const handleCreateNotice = (noticeData: {
    title: string;
    description: string;
    priority: NoticePriority;
    attachmentName?: string;
  }) => {
    const newNotice: AnnouncementItem = {
      id: 'not-' + Date.now(),
      society_id: 'soc-01',
      title: noticeData.title,
      description: noticeData.description,
      priority: noticeData.priority,
      attachment_name: noticeData.attachmentName,
      published_at: new Date().toISOString(),
      created_by: 'Hon. Committee / Admin',
    };

    setAnnouncements((prev) => [newNotice, ...prev]);
    showToast(`Notice "${newNotice.title}" broadcasted to all residents!`);
  };

  const handleCreateEvent = (eventData: {
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    category: 'AGM' | 'FESTIVAL' | 'MEETING' | 'MAINTENANCE' | 'SPORTS';
  }) => {
    const newEvent: EventItem = {
      id: 'ev-' + Date.now(),
      society_id: 'soc-01',
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.event_date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      location: eventData.location,
      category: eventData.category,
      attendees_count: 25,
      created_by: 'Hon. Committee',
      created_at: new Date().toISOString(),
    };

    setEvents((prev) => [...prev, newEvent]);
    showToast(`Event "${newEvent.title}" scheduled on society calendar!`);
  };

  const handleUploadDocument = (docData: {
    title: string;
    category: DocumentCategory;
    visibility: DocumentVisibility;
    fileSize: string;
    fileType: 'PDF' | 'DOCX' | 'XLSX';
  }) => {
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      society_id: 'soc-01',
      title: docData.title,
      category: docData.category,
      file_url: '#',
      file_size: docData.fileSize,
      file_type: docData.fileType,
      visibility: docData.visibility,
      uploaded_by: 'Hon. Committee',
      uploaded_at: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${newDoc.title}" archived into Vault!`);
  };

  // Filtered lists
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesPriority = priorityFilter === 'ALL' || a.priority === priorityFilter;
    const matchesQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesQuery;
  });

  const filteredDocuments = documents.filter((d) => {
    const matchesCategory = docCategoryFilter === 'ALL' || d.category === docCategoryFilter;
    const matchesQuery = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Communication & Document Vault</h2>
          <p className="text-sm text-slate-500">Notice board circulars, AGM events calendar, and official legal archives</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'notices' && (
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              Publish Notice
            </button>
          )}
          {activeTab === 'events' && (
            <button
              onClick={() => setShowEventModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              Schedule Event
            </button>
          )}
          {activeTab === 'documents' && (
            <button
              onClick={() => setShowDocModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Plus className="h-4 w-4" />
              Upload Document
            </button>
          )}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Notices</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalNotices}</span>
            <span className="text-xs text-blue-600 font-semibold">Broadcasting</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emergency Alerts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-red-600">{emergencyNotices}</span>
            <span className="text-xs text-red-600 font-semibold">Urgent Attention</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Events</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-indigo-600">{upcomingEvents}</span>
            <span className="text-xs text-indigo-600 font-semibold">On Calendar</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vault Documents</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-600">{archivedDocs}</span>
            <span className="text-xs text-emerald-600 font-semibold">Permanent Archive</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'notices'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          Digital Notice Board ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'events'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" />
          AGM & Events Calendar ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'documents'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          Society Document Vault ({documents.length})
        </button>
      </div>

      {/* TAB 1: DIGITAL NOTICE BOARD */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices..."
                className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700"
              >
                <option value="ALL">All Priorities</option>
                <option value="EMERGENCY">Emergency Only</option>
                <option value="IMPORTANT">Important Only</option>
                <option value="NORMAL">Normal Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAnnouncements.map((notice) => (
              <div
                key={notice.id}
                className={`rounded-xl border p-5 shadow-sm space-y-3 transition ${
                  notice.priority === 'EMERGENCY'
                    ? 'border-red-300 bg-red-50/50 hover:bg-red-50/80'
                    : notice.priority === 'IMPORTANT'
                    ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50/70'
                    : 'border-slate-200 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-2">
                    {notice.priority === 'EMERGENCY' && <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />}
                    {notice.priority === 'IMPORTANT' && <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />}
                    {notice.priority === 'NORMAL' && <Bell className="h-5 w-5 text-blue-600 shrink-0" />}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        notice.priority === 'EMERGENCY'
                          ? 'bg-red-100 text-red-800'
                          : notice.priority === 'IMPORTANT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {notice.priority}
                    </span>
                    <span className="text-xs text-slate-500">• Published {formatDate(notice.published_at)}</span>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">{notice.created_by}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">{notice.description}</p>
                </div>

                {notice.attachment_name && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => showToast(`Downloading ${notice.attachment_name}...`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                    >
                      <Download className="h-3.5 w-3.5 text-blue-600" />
                      <span>{notice.attachment_name}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AGM & EVENTS CALENDAR */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs text-indigo-900">
            <p className="font-bold text-sm mb-0.5">Society Meetings & Events Calendar</p>
            Scheduled general body meetings (AGM), festivals, and maintenance operations. All residents receive notification reminders prior to event dates.
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const eventDateObj = new Date(event.event_date);
              const monthStr = eventDateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
              const dayStr = eventDateObj.getDate();

              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <span className="text-[10px] font-bold leading-none">{monthStr}</span>
                      <span className="text-lg font-extrabold leading-none mt-1">{dayStr}</span>
                    </div>

                    <div>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                          event.category === 'AGM'
                            ? 'bg-purple-100 text-purple-700'
                            : event.category === 'MAINTENANCE'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {event.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1 leading-snug">{event.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3">{event.description}</p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{event.start_time} {event.end_time ? `– ${event.end_time}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{event.attendees_count} Members attending</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => showToast(`RSVP confirmed for "${event.title}"`)}
                      className="w-full rounded-lg bg-slate-100 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      RSVP / Confirm Attendance
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENT VAULT */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search official documents..."
                className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={docCategoryFilter}
                onChange={(e) => setDocCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700"
              >
                <option value="ALL">All Categories</option>
                <option value="BYLAWS">Society Bye-laws</option>
                <option value="FINANCIAL">Audited Accounts</option>
                <option value="AGM">AGM Minutes</option>
                <option value="NOTICE">NOC & Safety Certificates</option>
                <option value="FORM">Member Forms</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold text-xs">
                        {doc.file_type}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {doc.category}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${
                        doc.visibility === 'PUBLIC'
                          ? 'bg-emerald-50 text-emerald-700'
                          : doc.visibility === 'COMMITTEE_ONLY'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {doc.visibility === 'COMMITTEE_ONLY' && <Lock className="h-2.5 w-2.5" />}
                      {doc.visibility.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-3 leading-snug">{doc.title}</h4>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{doc.file_size} • {formatDate(doc.uploaded_at)}</span>
                  <button
                    onClick={() => showToast(`Downloading "${doc.title}.${doc.file_type.toLowerCase()}"...`)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW NOTICE MODAL */}
      {showNoticeModal && (
        <NewNoticeModal
          onClose={() => setShowNoticeModal(false)}
          onSubmitNotice={handleCreateNotice}
        />
      )}

      {/* NEW EVENT MODAL */}
      {showEventModal && (
        <NewEventModal
          onClose={() => setShowEventModal(false)}
          onSubmitEvent={handleCreateEvent}
        />
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showDocModal && (
        <UploadDocumentModal
          onClose={() => setShowDocModal(false)}
          onSubmitDocument={handleUploadDocument}
        />
      )}
    </div>
  );
}

