'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  BookOpen,
  Calendar,
  Mail,
  Video,
  Plus,
  Trash2,
  Download,
  Search,
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Performance, Short, Booking, Subscriber } from '@/lib/types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  performances: Performance[];
  shorts: Short[];
  bookings: Booking[];
  subscribers: Subscriber[];
  onUpdatePerformances: (list: Performance[]) => void;
  onUpdateShorts: (list: Short[]) => void;
  onUpdateBookings: (list: Booking[]) => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  performances,
  shorts,
  bookings,
  subscribers,
  onUpdatePerformances,
  onUpdateShorts,
  onUpdateBookings
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'performances' | 'shorts' | 'bookings' | 'subscribers'>('performances');
  const [searchQuery, setSearchQuery] = useState('');

  // Performance Form State
  const [pTitle, setPTitle] = useState('');
  const [pGenre, setPGenre] = useState('Ghazal');
  const [pYear, setPYear] = useState('2026');
  const [pThumb, setPThumb] = useState('');
  const [pEmbed, setPEmbed] = useState('');
  const [pDuration, setPDuration] = useState('4:00');

  // Shorts Form State
  const [sTitle, setSTitle] = useState('');
  const [sThumb, setSThumb] = useState('');
  const [sViews, setSViews] = useState('10k');

  if (!isOpen) return null;

  // Add a Performance Track
  const handleAddPerformance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle || !pThumb) return;

    const newPerf: Performance = {
      id: 'p_' + Date.now(),
      title: pTitle,
      genre: pGenre,
      year: pYear,
      thumbnailUrl: pThumb,
      videoUrl: pEmbed || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: '0k',
      duration: pDuration || '3:30'
    };

    const updated = [newPerf, ...performances];
    onUpdatePerformances(updated);
    localStorage.setItem('performances', JSON.stringify(updated));

    // Reset Form
    setPTitle('');
    setPThumb('');
    setPEmbed('');
    setPDuration('4:00');
  };

  // Delete Performance
  const handleDeletePerformance = (id: string) => {
    const updated = performances.filter((item) => item.id !== id);
    onUpdatePerformances(updated);
    localStorage.setItem('performances', JSON.stringify(updated));
  };

  // Add a Short Track
  const handleAddShort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle || !sThumb) return;

    const newShort: Short = {
      id: 's_' + Date.now(),
      title: sTitle,
      thumbnailUrl: sThumb,
      views: sViews || '1.2k'
    };

    const updated = [newShort, ...shorts];
    onUpdateShorts(updated);
    localStorage.setItem('shorts', JSON.stringify(updated));

    // Reset Form
    setSTitle('');
    setSThumb('');
    setSViews('10K');
  };

  // Delete Short
  const handleDeleteShort = (id: string) => {
    const updated = shorts.filter((item) => item.id !== id);
    onUpdateShorts(updated);
    localStorage.setItem('shorts', JSON.stringify(updated));
  };

  // Toggle Booking status
  const handleToggleBookingStatus = (id: string, newStatus: 'Pending' | 'Contacted' | 'Approved') => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    onUpdateBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
  };

  // Export Subscribers to raw file download
  const handleExportSubscribers = () => {
    const headers = 'Email,Date Subscribed\n';
    const rows = subscribers.map((sub) => `"${sub.email}","${sub.subscribedAt}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `newsletter_subscribers_${Date.now()}.csv`);
    a.click();
  };

  // Filter lists based on search
  const filteredBookings = bookings.filter((b) =>
    b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer" />

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="relative w-full max-w-5xl h-[85vh] bg-[#181212] border border-[#D4AF37]/30 rounded p-6 shadow-2xl z-10 flex flex-col overflow-hidden"
        id="admin-dashboard-box"
      >
        {/* Header Options */}
        <div className="flex justify-between items-center border-b border-[#D4AF37]/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <h3 className="text-xl font-display font-bold text-[#FFFDD0] tracking-tight">
                Artist Admin Control Room
              </h3>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold font-body">
                Content Management & Booking Inquiries Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#FFFDD0]/60 hover:text-[#D4AF37] p-2 hover:bg-white/5 rounded-full transition-all"
            id="close-admin-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls toolbar */}
        <div className="flex flex-wrap gap-2 mb-6" id="dashboard-tab-bar">
          <button
            onClick={() => setActiveTab('performances')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider font-body transition-all ${
              activeTab === 'performances'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-black/40 text-[#FFFDD0]/60 hover:text-[#D4AF37]'
            }`}
          >
            <Video className="w-4 h-4" />
            Performances ({performances.length})
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider font-body transition-all ${
              activeTab === 'shorts'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-black/40 text-[#FFFDD0]/60 hover:text-[#D4AF37]'
            }`}
          >
            <Video className="w-4 h-4 rotate-90" />
            Shorts ({shorts.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider font-body transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-black/40 text-[#FFFDD0]/60 hover:text-[#D4AF37]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Event Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider font-body transition-all ${
              activeTab === 'subscribers'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-black/40 text-[#FFFDD0]/60 hover:text-[#D4AF37]'
            }`}
          >
            <Mail className="w-4 h-4" />
            Subscribers ({subscribers.length})
          </button>
        </div>

        {/* Dynamic content screen */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'performances' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form panel to add song */}
              <div className="lg:col-span-1 p-5 rounded border border-[#D4AF37]/10 bg-black/30 h-fit">
                <h4 className="text-[#D4AF37] text-xs uppercase font-bold tracking-wider mb-4 font-body flex items-center gap-1.5 border-b border-[#D4AF37]/10 pb-2">
                  <Plus className="w-4 h-4" /> Add New Performance
                </h4>
                <form onSubmit={handleAddPerformance} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Title *</label>
                    <input
                      type="text"
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      placeholder="Song Title"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Genre</label>
                      <select
                        value={pGenre}
                        onChange={(e) => setPGenre(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      >
                        <option value="Ghazal">Ghazal</option>
                        <option value="Classical Fusion">Classical Fusion</option>
                        <option value="Classic Bollywood">Classic Bollywood</option>
                        <option value="Light Classical">Light Classical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Year</label>
                      <input
                        type="text"
                        value={pYear}
                        onChange={(e) => setPYear(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                        placeholder="Year"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Thumbnail JPG Link *</label>
                    <input
                      type="text"
                      value={pThumb}
                      onChange={(e) => setPThumb(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      placeholder="e.g. https://picsum.photos/..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">YouTube Embed URL</label>
                    <input
                      type="text"
                      value={pEmbed}
                      onChange={(e) => setPEmbed(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Duration</label>
                    <input
                      type="text"
                      value={pDuration}
                      onChange={(e) => setPDuration(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      placeholder="e.g. 4:15"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#D4AF37] text-black font-semibold text-xs py-2.5 rounded transition-all hover:bg-[#FFFDD0] font-body uppercase tracking-wider"
                  >
                    Add to Gallery
                  </button>
                </form>
              </div>

              {/* List grid display */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-[#FFFDD0] text-sm font-semibold tracking-tight font-display border-b border-[#D4AF37]/10 pb-2">
                  Active Collection List ({performances.length})
                </h4>
                {performances.length === 0 ? (
                  <p className="text-xs text-[#FFFDD0]/40 font-body py-8 text-center italic">No performances listed.</p>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {performances.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded border border-[#D4AF37]/10 bg-black/20 hover:bg-black/30"
                        id={`perf-row-${p.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnailUrl}
                            alt={p.title}
                            className="w-12 h-9 object-cover rounded border border-[#D4AF37]/10 shrink-0"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#FFFDD0] font-body">{p.title}</p>
                            <p className="text-[10px] text-[#D4AF37] font-body">
                              {p.genre} • {p.year}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePerformance(p.id)}
                          className="text-red-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'shorts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add form */}
              <div className="lg:col-span-1 p-5 rounded border border-[#D4AF37]/10 bg-black/30 h-fit">
                <h4 className="text-[#D4AF37] text-xs uppercase font-bold tracking-wider mb-4 font-body flex items-center gap-1.5 border-b border-[#D4AF37]/10 pb-2">
                  <Plus className="w-4 h-4" /> Add New Short
                </h4>
                <form onSubmit={handleAddShort} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Title *</label>
                    <input
                      type="text"
                      value={sTitle}
                      onChange={(e) => setSTitle(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      placeholder="e.g. shokh nazar ki bijliyan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Thumbnail URL (Portrait) *</label>
                    <input
                      type="text"
                      value={sThumb}
                      onChange={(e) => setSThumb(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      placeholder="Vertical JPEG cover link"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#FFFDD0]/50 uppercase tracking-widest mb-1 font-body">Views Count Badge</label>
                    <input
                      type="text"
                      value={sViews}
                      onChange={(e) => setSViews(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-[#FFFDD0] text-xs p-2 rounded focus:ring-0"
                      placeholder="e.g. 124K"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#D4AF37] text-black font-semibold text-xs py-2.5 rounded transition-all hover:bg-[#FFFDD0] font-body uppercase tracking-wider"
                  >
                    Add Short Clip
                  </button>
                </form>
              </div>

              {/* Collection list */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-[#FFFDD0] text-sm font-semibold tracking-tight font-display border-b border-[#D4AF37]/10 pb-2">
                  Active Shorts ({shorts.length})
                </h4>
                {shorts.length === 0 ? (
                  <p className="text-xs text-[#FFFDD0]/40 font-body py-8 text-center italic">No shorts clips added.</p>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {shorts.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded border border-[#D4AF37]/10 bg-black/20 hover:bg-black/30"
                        id={`short-row-${s.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={s.thumbnailUrl}
                            alt={s.title}
                            className="w-9 h-12 object-cover rounded border border-[#D4AF37]/10 shrink-0"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#FFFDD0] font-body">{s.title}</p>
                            <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded font-body">
                              {s.views} Views
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteShort(s.id)}
                          className="text-red-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4 items-center border-b border-[#D4AF37]/10 pb-3">
                <h4 className="text-[#FFFDD0] text-sm font-semibold font-display tracking-tight">
                  Inquiries Database ({filteredBookings.length})
                </h4>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[#FFFDD0]/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-xs p-2 pl-9 rounded focus:outline-none focus:ring-0 text-[#FFFDD0] font-body"
                    placeholder="Search queries..."
                  />
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <p className="text-xs text-[#FFFDD0]/40 font-body py-12 text-center italic">No event bookings meet search query.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded border border-[#D4AF37]/10 bg-black/20 space-y-3 relative overflow-hidden"
                      id={`booking-card-${b.id}`}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <p className="text-sm font-bold text-[#FFFDD0] font-body">{b.clientName}</p>
                          <p className="text-[11px] text-[#FFFDD0]/50 font-body">
                            {b.clientEmail} • {b.clientPhone}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-body ${
                          b.status === 'Approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          b.status === 'Contacted' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' :
                          'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-black/40 p-3 rounded border border-white/5">
                        <p className="text-[#FFFDD0]/70 font-body"><strong className="text-[#D4AF37]">Type:</strong> {b.eventType}</p>
                        <p className="text-[#FFFDD0]/70 font-body"><strong className="text-[#D4AF37]">Date:</strong> {b.eventDate}</p>
                        <p className="text-[#FFFDD0]/70 font-body md:col-span-2"><strong className="text-[#D4AF37]">Venue:</strong> {b.venue}</p>
                        {b.message && (
                          <p className="text-[#FFFDD0]/50 font-body md:col-span-2 italic text-[11px] mt-1 border-t border-white/5 pt-1">
                            &quot;{b.message}&quot;
                          </p>
                        )}
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleToggleBookingStatus(b.id, 'Contacted')}
                          className="px-3 py-1 bg-black/50 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider rounded font-body transition-colors"
                        >
                          Mark Contacted
                        </button>
                        <button
                          onClick={() => handleToggleBookingStatus(b.id, 'Approved')}
                          className="px-3 py-1 bg-green-950/20 hover:bg-green-500/20 border border-green-500/30 text-green-300 text-[10px] font-bold uppercase tracking-wider rounded font-body transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Approve Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#D4AF37]/10 pb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-[#FFFDD0] text-sm font-semibold font-display tracking-tight">
                    Newsletter Subscribers ({filteredSubscribers.length})
                  </h4>
                  <button
                    onClick={handleExportSubscribers}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded font-body transition-colors"
                    id="export-subscribers-btn"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV Export
                  </button>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[#FFFDD0]/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-xs p-2 pl-9 rounded focus:outline-none focus:ring-0 text-[#FFFDD0] font-body"
                    placeholder="Search subscribers..."
                  />
                </div>
              </div>

              {filteredSubscribers.length === 0 ? (
                <p className="text-xs text-[#FFFDD0]/40 font-body py-12 text-center italic">No subscribers match database logs.</p>
              ) : (
                <div className="bg-[#0F0F0F] rounded border border-[#D4AF37]/10 overflow-hidden" id="subscribers-table-container">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-black/40 border-b border-[#D4AF37]/10 text-[#D4AF37] font-body">
                        <th className="p-3 font-semibold uppercase tracking-wider">Email Address</th>
                        <th className="p-3 font-semibold uppercase tracking-wider text-right">Date Subscribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 font-body">
                          <td className="p-3 text-[#FFFDD0]">{sub.email}</td>
                          <td className="p-3 text-[#FFFDD0]/50 text-right font-mono">
                            {new Date(sub.subscribedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions info */}
        <div className="mt-6 border-t border-[#D4AF37]/10 pt-4 text-center">
          <p className="text-[10px] text-[#FFFDD0]/40 font-body flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Content updates dynamically and persists directly inside secure client local states.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
