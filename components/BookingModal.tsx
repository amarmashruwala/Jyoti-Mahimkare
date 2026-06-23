'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, CheckCircle2, Music, MapPin, Phone, Mail, User } from 'lucide-react';
import { Booking } from '@/lib/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingAdded: () => void;
}

export default function BookingModal({ isOpen, onClose, onBookingAdded }: BookingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('Ghazal Mehfil');
  const [venue, setVenue] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !date || !venue) {
      setError('Please fill in all required fields.');
      return;
    }

    // Capture booking object
    const newBooking: Booking = {
      id: 'b_' + Date.now(),
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      eventDate: date,
      eventType: eventType,
      venue: venue,
      message: message,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const existingBookingsStr = localStorage.getItem('bookings');
      const existingBookings: Booking[] = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
      localStorage.setItem('bookings', JSON.stringify([newBooking, ...existingBookings]));
      
      setIsSuccess(true);
      onBookingAdded();
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDate('');
    setEventType('Ghazal Mehfil');
    setVenue('');
    setMessage('');
    setError('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={handleReset}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        id="booking-backdrop"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-xl bg-[#181212] border border-[#D4AF37]/30 rounded p-6 md:p-8 shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-y-auto"
        id="booking-box"
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-[#FFFDD0]/60 hover:text-[#D4AF37] transition-colors p-1 hover:bg-white/5 rounded-full"
          id="close-booking-btn"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-6">
                <Music className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <h3 className="text-2xl font-display font-bold text-[#FFFDD0] tracking-tight">
                  Book a Performance
                </h3>
                <p className="text-[#FFFDD0]/60 text-xs font-body mt-1">
                  Fill in the details below to request a soulful rendition at your event.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-body text-center" id="booking-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Client Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1 font-body">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-[#FFFDD0]/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-sm py-2 px-10 rounded transition-colors font-body focus:ring-0"
                      placeholder="e.g. Sanjay Deshmukh"
                      required
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1 font-body">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-[#FFFDD0]/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-sm py-2 px-10 rounded transition-colors font-body focus:ring-0"
                        placeholder="e.g. contact@domain.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1 font-body">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-[#FFFDD0]/40" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-sm py-2 px-10 rounded transition-colors font-body focus:ring-0"
                        placeholder="e.g. +91 98765 43210"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Event Date and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1 font-body">
                      Event Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#FFFDD0]/40" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-sm py-2 px-10 rounded transition-colors font-body focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1 font-body">
                      Performance Type *
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-sm py-2.5 px-3 rounded transition-colors font-body focus:ring-0 appearance-none"
                    >
                      <option value="Ghazal Mehfil">Ghazal Mehfil</option>
                      <option value="Sangeet / Wedding">Sangeet / Classical Wedding</option>
                      <option value="Public Concert">Public Concert</option>
                      <option value="Private / Corporate Event">Private / Corporate Event</option>
                      <option value="Custom Showcase">Custom Classical Showcase</option>
                    </select>
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1 font-body">
                    Venue Details *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#FFFDD0]/40" />
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-sm py-2 px-10 rounded transition-colors font-body focus:ring-0"
                      placeholder="e.g. Royal Opera House, Mumbai"
                      required
                    />
                  </div>
                </div>

                {/* Notes/Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1 font-body">
                    Special Instructions / Notes
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none text-[#FFFDD0] text-sm py-2 px-3 rounded transition-colors font-body focus:ring-0 resize-none"
                    placeholder="Provide any additional customization requests, expected audience size, or song requests..."
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black font-semibold text-sm py-3 transition-colors hover:bg-[#FFFDD0] rounded active:scale-95 duration-200 mt-2 font-body"
                  id="submit-booking-btn"
                >
                  Submit Booking Request
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="booking-success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="text-center py-8"
              id="booking-success-box"
            >
              <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-display font-medium text-[#FFFDD0] mb-3">
                Booking Request Sent!
              </h3>
              <p className="text-[#FFFDD0]/75 font-body text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                Thank you, <span className="text-[#D4AF37] font-semibold">{name}</span>. Your request has been queued. We will review the details and reach out to you within 24 hours.
              </p>
              <button
                onClick={handleReset}
                className="bg-transparent border border-[#D4AF37]/60 text-[#D4AF37] px-8 py-2.5 rounded text-xs uppercase tracking-widest font-semibold hover:bg-[#D4AF37] hover:text-black transition-all"
                id="booking-success-close-btn"
              >
                Return to Gallery
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
