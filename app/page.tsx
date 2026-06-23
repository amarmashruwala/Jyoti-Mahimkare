'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Calendar,
  BookOpen,
  ArrowRight,
  Flame,
  Search,
  Check,
  Instagram,
  Facebook,
  Music,
  Share2,
  ChevronDown,
  LayoutDashboard,
  Youtube,
  Menu,
  X,
  Heart,
  Sparkles,
  Flag,
  Compass
} from 'lucide-react';

import { Performance, Short, Booking, Subscriber } from '@/lib/types';
import {
  INITIAL_PERFORMANCES,
  INITIAL_SHORTS,
  INITIAL_BOOKINGS,
  INITIAL_SUBSCRIBERS
} from '@/lib/initialData';

// Component Imports
import AboutJourney from '@/components/AboutJourney';
import BookingModal from '@/components/BookingModal';
import MediaModal from '@/components/MediaModal';
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
  // Core Portfolio States (statically initialized to guarantee identical server and client initial render)
  const [performances, setPerformances] = useState<Performance[]>(INITIAL_PERFORMANCES);
  const [shorts, setShorts] = useState<Short[]>(INITIAL_SHORTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);

  // Navigation / Filter / Search States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Newsletter Input State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  // Modals & Drawers Toggles
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Immersive Target Player State
  const [selectedTrack, setSelectedTrack] = useState<{
    title: string;
    genre: string;
    year?: string;
    videoUrl?: string;
    isShort?: boolean;
    isOpen: boolean;
  }>({
    title: '',
    genre: '',
    isOpen: false
  });

  // Ensure initial seed variables exist in localStorage of user browser and load them safely as an asynchronous macro-task to prevent hydration errors and cascading renders.
  useEffect(() => {
    // Store original window.onerror
    const originalOnError = window.onerror;

    // Gracefully handle cross-origin script error noise caused by external YouTube Player iframes
    window.onerror = function (message, source, lineno, colno, error) {
      const msgStr = String(message || '');
      const srcStr = String(source || '');
      if (
        !message ||
        msgStr.includes('Script error') ||
        msgStr.includes('cross-origin') ||
        msgStr.includes('postMessage') ||
        msgStr.includes('permission') ||
        srcStr.includes('youtube') ||
        srcStr.includes('ytimg') ||
        srcStr.includes('doubleclick')
      ) {
        // Returning true prevents the default error handling (stops the message from propagating)
        return true;
      }
      if (originalOnError) {
        return originalOnError.apply(window, [message, source, lineno, colno, error]);
      }
      return false;
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message ? String(event.message) : '';
      const source = event.filename ? String(event.filename) : '';
      if (
        !msg ||
        msg.includes('Script error') ||
        msg.includes('cross-origin') ||
        msg.includes('postMessage') ||
        msg.includes('permission') ||
        source.includes('youtube') ||
        source.includes('ytimg') ||
        source.includes('doubleclick')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('error', handleGlobalError, true);

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason ? String(event.reason) : '';
      if (
        reason.includes('Script error') ||
        reason.includes('youtube') ||
        reason.includes('ytimg') ||
        reason.includes('postMessage') ||
        reason.includes('cross-origin')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('unhandledrejection', handleRejection, true);

    try {
      // Create seeds if missing
      if (!localStorage.getItem('performances')) {
        localStorage.setItem('performances', JSON.stringify(INITIAL_PERFORMANCES));
      }
      if (!localStorage.getItem('shorts')) {
        localStorage.setItem('shorts', JSON.stringify(INITIAL_SHORTS));
      }
      if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify(INITIAL_BOOKINGS));
      }
      if (!localStorage.getItem('subscribers')) {
        localStorage.setItem('subscribers', JSON.stringify(INITIAL_SUBSCRIBERS));
      }

      // Safe hydration boundary and React-compliant asynchronous updates
      setTimeout(() => {
        try {
          const localPerfs = localStorage.getItem('performances');
          if (localPerfs) {
            setPerformances(JSON.parse(localPerfs));
          }
          const localShorts = localStorage.getItem('shorts');
          if (localShorts) {
            setShorts(JSON.parse(localShorts));
          }
          const localBookings = localStorage.getItem('bookings');
          if (localBookings) {
            setBookings(JSON.parse(localBookings));
          }
          const localSubscribers = localStorage.getItem('subscribers');
          if (localSubscribers) {
            setSubscribers(JSON.parse(localSubscribers));
          }
        } catch (innerError) {
          console.error('Failed to parse cached states', innerError);
        }
      }, 0);

    } catch (e) {
      console.error('Failed to access or synchronize localStorage seeds', e);
    }

    return () => {
      window.onerror = originalOnError;
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleRejection, true);
    };
  }, []);

  // Update lists after changes made inside Admin Dashboard
  const handleUpdatePerformances = (newList: Performance[]) => setPerformances(newList);
  const handleUpdateShorts = (newList: Short[]) => setShorts(newList);
  const handleUpdateBookings = (newList: Booking[]) => setBookings(newList);

  const handleBookingAdded = () => {
    const updated = localStorage.getItem('bookings');
    if (updated) setBookings(JSON.parse(updated));
  };

  // Categories list
  const genres = ['All', 'Romantic', 'Inspirational', 'Patriotic', 'Classic Bollywood', 'Playful'];

  // Filter vocal pieces dynamically
  const filteredPerformances = performances.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.genre === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Newsletter Subscribe Submit
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');
    setNewsletterSuccess(false);

    if (!newsletterEmail.trim()) {
      setNewsletterError('Email address is required.');
      return;
    }

    if (!newsletterEmail.includes('@')) {
      setNewsletterError('Please provide a valid email format.');
      return;
    }

    // Check duplicates
    if (subscribers.some((s) => s.email.toLowerCase() === newsletterEmail.toLowerCase())) {
      setNewsletterError('This email is already part of our classical journey!');
      return;
    }

    const newSub: Subscriber = {
      id: 'sub_' + Date.now(),
      email: newsletterEmail.trim(),
      subscribedAt: new Date().toISOString()
    };

    const updated = [newSub, ...subscribers];
    setSubscribers(updated);
    localStorage.setItem('subscribers', JSON.stringify(updated));

    setNewsletterSuccess(true);
    setNewsletterEmail('');
  };

  return (
    <div className="relative min-h-screen selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. Header Toolbar (TopNavBar) */}
      <nav className="fixed top-0 w-full z-40 bg-[#4A0404]/80 backdrop-blur-xl border-b border-[#D4AF37]/30 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-6 md:px-12 py-3 max-w-7xl mx-auto">
          {/* Logo Brand Title */}
          <div className="font-display text-2xl font-bold text-[#D4AF37] tracking-wider cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Jyoti Mahimkar
          </div>

          {/* Desktop Navigation Link buttons */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#hero" className="text-[#FFFDD0] font-semibold text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors font-body">Home</a>
            <a href="#featured" className="text-[#FFFDD0]/80 hover:text-[#D4AF37] transition-colors font-body text-xs uppercase tracking-widest">Featured</a>
            <a href="#vision" className="text-[#FFFDD0]/80 hover:text-[#D4AF37] transition-colors font-body text-xs uppercase tracking-widest">Vision</a>
            <a href="#performances" className="text-[#FFFDD0]/80 hover:text-[#D4AF37] transition-colors font-body text-xs uppercase tracking-widest">Performances</a>
            <a href="#shorts" className="text-[#FFFDD0]/80 hover:text-[#D4AF37] transition-colors font-body text-xs uppercase tracking-widest">Shorts</a>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-[#FFFDD0]/80 hover:text-[#D4AF37] transition-colors font-body text-xs uppercase tracking-widest pointer-events-auto"
              id="bio-nav-link"
            >
              About
            </button>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-[#D4AF37] hover:bg-[#FFFDD0] text-black font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-all active:scale-95 font-body"
              id="book-now-top-btn"
            >
              Book Now
            </button>
          </div>

          {/* Secret / Subtle Admin Portal Access key */}
          <div className="hidden md:flex items-center ml-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#D4AF37]/40 hover:text-[#D4AF37] p-2 hover:bg-white/5 rounded transition-all"
              title="Admin Panel"
              id="admin-vault-btn"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Actions togglers */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#D4AF37]/50 hover:text-[#D4AF37] p-2"
              title="Admin Panel"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-[#D4AF37] p-2 hover:bg-white/5 rounded"
              id="mobile-drawer-toggle"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Slide-In Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ x: '105%' }}
              animate={{ x: 0 }}
              exit={{ x: '105%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute inset-y-0 right-0 w-4/5 max-w-sm bg-[#181212] border-l border-[#D4AF37]/30 p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[#D4AF37]/10 pb-4">
                  <span className="font-display text-xl font-bold text-[#D4AF37]">Navigation</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-[#FFFDD0] p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-5 pt-4">
                  <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-[#FFFDD0] text-sm uppercase tracking-widest font-body">Home</a>
                  <a href="#featured" onClick={() => setMobileMenuOpen(false)} className="text-[#FFFDD0]/80 text-sm uppercase tracking-widest font-body">Featured</a>
                  <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="text-[#FFFDD0]/80 text-sm uppercase tracking-widest font-body">Vision</a>
                  <a href="#performances" onClick={() => setMobileMenuOpen(false)} className="text-[#FFFDD0]/80 text-sm uppercase tracking-widest font-body">Performances</a>
                  <a href="#shorts" onClick={() => setMobileMenuOpen(false)} className="text-[#FFFDD0]/80 text-sm uppercase tracking-widest font-body">Shorts</a>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAboutOpen(true);
                    }}
                    className="text-left text-[#FFFDD0]/80 text-sm uppercase tracking-widest font-body block"
                  >
                    Biography
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="w-full bg-[#D4AF37] text-black font-semibold text-sm uppercase tracking-wide py-3 text-center rounded font-body"
              >
                Book Performance
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Hero Header Showcase Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Full-width image cover with dark gradient highlights */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0F0F0F]/60 z-10" />
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6Xvsb6NcathNw-NYkswpwIPgbeLnNgaAhKzb8gAa-mOFff8XGrQQTs2QN1OUJJsphIWeZaDZz8LMGIKsgPLvppFc80NatENxcoIwZDt9WOb15lp3MUhhmnOO7ZqJCKQkgbqYBK5dkb6wO-i3lWcrQCBlczbWoI6qohQGPTG0XpcO5A5rjH0jKG4M200TiLKBGcnLOKxjkF7ZNhF0RF9KcNkcvxC4dHs-xLijS-1m8yCCoxA1mTvGU9nFcnFnKAIHCBaQzVmp1uG8"
            alt="Portrait representation of Jyoti Mahimkar standing in golden glow against deep red backdrop"
            fill
            className="object-cover scale-105"
            priority
            referrerPolicy="no-referrer"
          />
          {/* Subtle bottom gradient sweep towards page content */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent z-20" />
        </div>

        {/* Hero typography elements */}
        <div className="relative z-30 text-center px-6 max-w-4xl pt-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-[#FFFDD0] leading-tight tracking-tight max-w-3xl mx-auto">
              Jyoti Mahimkar
            </h1>
            <p className="font-display text-xs md:text-sm text-[#D4AF37] uppercase tracking-[0.3em] font-medium italic block">
              Soulful Renditions of Classic Melodies
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <a
              href="#performances"
              className="bg-[#D4AF37] hover:bg-[#FFFDD0] text-black border border-[#D4AF37] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded transition-all duration-300 font-body align-middle"
            >
              Listen to Performances
            </a>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="bg-transparent border border-[#FFFDD0]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#D4AF37] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded transition-all duration-300 font-body"
              id="hero-journey-btn"
            >
              Read Journey
            </button>
          </motion.div>
        </div>

        {/* Animated down scroll pointer chevron */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-none">
          <ChevronDown className="text-[#D4AF37] w-8 h-8" />
        </div>
      </section>

      {/* 3. Featured Rendition Section */}
      <section id="featured" className="py-24 md:py-32 px-6 md:px-12 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Featured Video Card Panel Left */}
          <div
            onClick={() => setSelectedTrack({
              title: 'Gar Tum Bhula Na Doge',
              genre: 'Classic Melodies',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              isOpen: true
            })}
            className="w-full lg:w-3/5 group relative overflow-hidden rounded border border-[#D4AF37]/20 cursor-pointer shadow-2xl shrink-0"
            id="featured-player-card"
          >
            <div className="aspect-video relative transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA74DOoj9X1EQbx1Gs2AJvf_UeoFlbqmEhz1Zo7Grikd3iDQPLJpzSTOfZ-nIgT7LcUjDZgTi5Cr5Tk44RChl8bmYsm9nrLqDde7wBm8EkPDNez0LZVu0S8Hlhq2Z5q5UlRtPN0pCXtFtN0fSSDfTC7BenxiO2F2AobP9Byt91coL4cd_4Ih13gFIPWZeI5sPPLDZnH8leY_S0kmAoKq8qGw2uS3kq_FszOIu5KX5eAVFJ-ErwDnxfgIR-EjkKPqeam8oclGAT1U2A"
                alt="Vintage style studio thumbnail highlighting Gar Tum Bhula Na Doge"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Play symbol hover overlays */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity hover:bg-black/40">
                <div className="w-16 h-16 bg-[#D4AF37] hover:bg-[#FFFDD0] text-black rounded-full flex items-center justify-center shadow-2xl transition-all scale-100 group-hover:scale-110">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Description panels right */}
          <div className="w-full lg:w-2/5 space-y-6 pt-4 lg:pt-0">
            <div className="w-16 h-[2px] bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] font-body block">Featured Rendition</span>
            <h3 className="text-3xl md:text-4xl font-display font-medium text-[#FFFDD0] tracking-tight">
              Gar Tum Bhula Na Doge
            </h3>
            <p className="font-body text-sm md:text-base text-[#FFFDD0]/70 leading-relaxed">
              A hauntingly beautiful tribute to a timeless classic. Jyoti brings a contemporary soulfulness to this legendary melody, weaving raw emotion into every note while capturing the poignant essence of nostalgia and love.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setSelectedTrack({
                  title: 'Gar Tum Bhula Na Doge',
                  genre: 'Classic Melodies',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  isOpen: true
                })}
                className="bg-[#CC0000] hover:bg-[#ff1e1e] text-white flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold rounded font-body transition-colors"
                id="watch-youtube-featured"
              >
                <Youtube className="w-5 h-5 shrink-0" />
                Watch on YouTube
              </button>
              <span className="text-[10px] text-[#D4AF37]/60 tracking-widest uppercase font-semibold font-body">
                124k Views
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3.5 Artistic Vision Section */}
      <section id="vision" className="py-24 md:py-32 bg-black border-t border-[#D4AF37]/10 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle decorative lights behind */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4A0404]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-[#D4AF37] text-xs uppercase font-semibold tracking-[0.3em] font-body block">Behind The Artistry</span>
            <h2 className="text-3xl md:text-5xl font-display text-[#FFFDD0] tracking-tight leading-none">Artistic Vision</h2>
            <p className="text-xs md:text-sm text-[#FFFDD0]/60 max-w-2xl mx-auto font-body italic mt-3">
              &quot;Music does not merely entertain; it recreates, restores, and remembers.&quot;
            </p>
            <div className="w-16 h-[1px] bg-[#D4AF37]/40 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Artistic Voice Overview (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 bg-[#181212] p-8 md:p-10 rounded border border-[#D4AF37]/15 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-medium text-[#FFFDD0] tracking-tight">
                Her Voice &amp; Emotional Atmosphere
              </h3>
              <p className="font-body text-sm text-[#FFFDD0]/80 leading-relaxed">
                Jyoti Mahimkar&apos;s voice resides at the convergence of pure classical heritage and nostalgic storytelling. Guided by a profound connection to the lyricists&apos; intent, she masterfully formats an evocative, soulful emotional atmosphere that is warm, deeply reflective, and culturally resonant.
              </p>
              <p className="font-body text-xs text-[#FFFDD0]/50 leading-relaxed">
                Her meticulous voice modulation and classical training allow her to carry the listener along intimate alleys of remembrance, evoking memories that transcend simple melodies.
              </p>
            </div>

            {/* Three Pillars of Expression (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h4 className="text-[#D4AF37] text-xs uppercase font-semibold tracking-[0.2em] font-body">Three Pillars of Lyric &amp; Expression</h4>
              
              <div className="space-y-4">
                
                {/* Pillar 1: Love and Longing */}
                <div className="p-6 rounded bg-[#0F0F0F] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors flex gap-5 items-start">
                  <div className="p-3 bg-[#420404] rounded text-[#ff4c4c] shrink-0 mt-0.5">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display font-semibold text-[#FFFDD0] text-sm mb-1">Timeless Love &amp; Sentimental Devotion</h5>
                    <p className="font-body text-xs text-[#FFFDD0]/70 leading-relaxed">
                      Evocatively mapped in her nostalgic love ballads like <em className="text-[#D4AF37]">&quot;Gar Tum Bhula Na Doge&quot;</em> and <em className="text-[#D4AF37]">&quot;Aajkal Yaad Kuch Aur Rehta Nahi&quot;</em>. Her warm vibrato captures the bittersweet joy of nostalgic yearnings and memories that refuse to fade.
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Dreams and Perseverance */}
                <div className="p-6 rounded bg-[#0F0F0F] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors flex gap-5 items-start">
                  <div className="p-3 bg-[#1e2d42] rounded text-[#54b0ff] shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display font-semibold text-[#FFFDD0] text-sm mb-1">Inspiring Dreams &amp; Pure Endurance</h5>
                    <p className="font-body text-xs text-[#FFFDD0]/70 leading-relaxed">
                      Brought to light through positive, soul-stirring hymns like <em className="text-[#D4AF37]">&quot;Ruk Jaana Nahin&quot;</em> and <em className="text-[#D4AF37]">&quot;Zindagi Ban Gaye Ho Tum&quot;</em>, where she sings of life&apos;s eternal journeys, encouraging listeners to push forward past challenges.
                    </p>
                  </div>
                </div>

                {/* Pillar 3: National Pride */}
                <div className="p-6 rounded bg-[#0F0F0F] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors flex gap-5 items-start">
                  <div className="p-3 bg-[#132c19] rounded text-[#38ef7d] shrink-0 mt-0.5">
                    <Flag className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display font-semibold text-[#FFFDD0] text-sm mb-1">Vibrant National Pride &amp; Versatility</h5>
                    <p className="font-body text-xs text-[#FFFDD0]/70 leading-relaxed">
                      Expressed in stirring anthems like <em className="text-[#D4AF37]">&quot;Har Karm Apna Karenge&quot;</em>, weaving deep pride with impeccable Hindustani notes. It showcases her vocal versatility and her commitment to India&apos;s patriotic heritage.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Artistic Vision Call To Action Banner */}
          <div className="p-8 md:p-10 rounded border border-[#D4AF37]/25 bg-gradient-to-r from-[#4A0404]/20 via-[#181212] to-[#4A0404]/10 flex flex-col md:flex-row items-center justify-between gap-8 mt-6">
            <div className="space-y-2 text-center md:text-left">
              <h5 className="font-display font-semibold text-[#D4AF37] text-lg">Experience the Emotional Landscape In Real-Time</h5>
              <p className="font-body text-xs text-[#FFFDD0]/70 max-w-xl leading-relaxed">
                Connect with legacy melodies, rare updates, and soulful behind-the-scene music crafts. Join Jyoti in her mission to preserve vintage music heritage.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@jyotimahimkar257/videos"
              target="_blank"
              rel="noreferrer"
              className="bg-[#D4AF37] hover:bg-[#FFFDD0] text-black font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded font-body shrink-0 transition-all duration-300 shadow-lg hover:shadow-2xl"
              id="vision-subscribe-btn"
            >
              Discover Her YouTube Channel
            </a>
          </div>

        </div>
      </section>

      {/* 4. Complete Vocal Gallery Collection (Grid List) */}
      <section id="performances" className="py-24 md:py-32 bg-[#181212]/40 border-y border-[#D4AF37]/10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Category titles and summary directions */}
          <div className="text-center space-y-2">
            <span className="text-[#D4AF37] text-xs uppercase font-semibold tracking-[0.3em] font-body block">The Collection</span>
            <h2 className="text-3xl md:text-5xl font-display text-[#FFFDD0] tracking-tight leading-none">Vocal Journeys</h2>
            <div className="w-16 h-[1px] bg-[#D4AF37]/40 mx-auto mt-4" />
          </div>

          {/* Search, category chips, and content navigation elements */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Horizontal Filter Category Row */}
            <div className="flex flex-wrap justify-center gap-2" id="filter-chips">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedCategory(genre)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded font-body border transition-all ${
                    selectedCategory === genre
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-transparent text-[#FFFDD0]/60 border-[#D4AF37]/20 hover:text-[#D4AF37] hover:border-[#D4AF37]'
                  }`}
                  id={`chip-${genre.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Quick search container */}
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#FFFDD0]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none text-xs py-2.5 pl-10 pr-4 rounded text-[#FFFDD0] placeholder-[#FFFDD0]/30 font-body focus:ring-0 transition-colors"
                placeholder="Search vocal performances..."
              />
            </div>
          </div>

          {/* List display grid container */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            id="vocal-journeys-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredPerformances.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full py-16 text-center text-[#FFFDD0]/40 italic text-sm font-body"
                  id="vocal-gallery-empty"
                >
                  No items listed. Enter a different selection.
                </motion.div>
              ) : (
                filteredPerformances.map((track) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedTrack({
                      title: track.title,
                      genre: track.genre,
                      year: track.year,
                      videoUrl: track.videoUrl,
                      isOpen: true
                    })}
                    key={track.id}
                    className="group bg-[#0F0F0F] border border-[#D4AF37]/10 hover:border-[#D4AF37] rounded overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                    id={`vocal-card-${track.id}`}
                  >
                    {/* Thumbnail Frame */}
                    <div className="aspect-video relative overflow-hidden shrink-0">
                      <Image
                        src={track.thumbnailUrl}
                        alt={track.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Play Hover mask */}
                      <div className="absolute inset-0 bg-[#4A0404]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#D4AF37] text-black rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata Content area */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-widest font-body">
                          {track.genre} • {track.year}
                        </span>
                        <h4 className="text-base font-semibold text-[#FFFDD0] font-body tracking-tight group-hover:text-[#D4AF37] transition-colors leading-snug">
                          {track.title}
                        </h4>
                      </div>
                      <div className="w-full h-[1px] bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/30 transition-colors" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick link button footer */}
          <div className="text-center pt-8">
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs uppercase tracking-widest font-semibold font-body text-[#D4AF37] hover:text-[#FFFDD0] border-b border-[#D4AF37] pb-1 hover:border-[#FFFDD0] transition-all flex items-center gap-1.5 mx-auto"
            >
              Explore All Performances <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Portrait Shorts Feed Rows */}
      <section id="shorts" className="py-24 md:py-32 px-6 md:px-12 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section labels */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-[#D4AF37]/10 pb-4">
            <div>
              <h2 className="text-3xl font-display font-medium text-[#FFFDD0]">Shorts</h2>
              <p className="text-xs text-[#FFFDD0]/50 font-body italic mt-1">Quick glimpses into soulful moments.</p>
            </div>
            <a
              href="https://youtube.com/@jyotimahimkar257"
              target="_blank"
              rel="noreferrer"
              className="text-[#D4AF37] hover:text-[#FFFDD0] text-xs font-semibold uppercase tracking-widest font-body"
              id="youtube-handle-shorts-link"
            >
              Follow @jyotimahimkar257
            </a>
          </div>

          {/* Shorts Layout grid display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" id="shorts-tracks-grid">
            {shorts.map((card) => (
              <div
                onClick={() => setSelectedTrack({
                  title: card.title,
                  genre: 'YouTube Shorts',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  isShort: true,
                  isOpen: true
                })}
                key={card.id}
                className="group relative aspect-[9/16] bg-black border border-[#D4AF37]/10 hover:border-[#D4AF37] rounded overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                id={`short-card-${card.id}`}
              >
                {/* Image Cover */}
                <Image
                  src={card.thumbnailUrl}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10" />
                
                {/* Text details bottom overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="text-xs font-semibold text-[#FFFDD0] font-body line-clamp-2 leading-snug">
                    {card.title}
                  </p>
                </div>

                {/* Cover symbols */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-20">
                  <Play className="w-10 h-10 text-[#D4AF37] fill-current" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Join the Journey Newsletter Forms */}
      <section className="py-24 bg-[#4A0404]/20 border-y border-[#D4AF37]/10 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle decorative background musical symbol */}
        <div className="absolute right-[-5%] bottom-[-10%] opacity-5 text-[#D4AF37] scale-150 pointer-events-none">
          <Music className="w-96 h-96" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-display text-[#D4AF37] tracking-tight">Join the Musical Journey</h2>
            <p className="text-sm md:text-base text-[#FFFDD0]/80 max-w-xl mx-auto leading-relaxed font-body">
              Subscribe for weekly soulful renditions, behind-the-scenes access, and live performance updates.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="max-w-lg mx-auto flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-[#0F0F0F] border-b border-[#FFFDD0]/30 focus:border-[#D4AF37] text-sm text-[#FFFDD0] placeholder-[#FFFDD0]/30 py-3 px-4 focus:outline-none transition-colors font-body focus:ring-0"
              placeholder="Your Email Address"
            />
            <button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#FFFDD0] text-black font-semibold text-xs uppercase tracking-widest px-8 py-4 shrink-0 transition-colors duration-300 font-body rounded-sm"
              id="subscribe-newsletter-btn"
            >
              Subscribe Now
            </button>
          </form>

          {/* Feedback states indicator */}
          <AnimatePresence>
            {newsletterSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-green-300 font-body flex items-center justify-center gap-1.5"
                id="newsletter-success"
              >
                <Check className="w-4 h-4 shrink-0" />
                Success! You are subscribed to Jyoti Mahimkar&apos;s classical updates.
              </motion.div>
            )}
            {newsletterError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-300 font-body italic"
                id="newsletter-error"
              >
                {newsletterError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 7. Professional Footer Elements */}
      <footer className="bg-black pt-20 pb-12 border-t border-[#D4AF37]/20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10 text-center">
          
          <div className="space-y-4">
            <span className="font-display text-2xl md:text-3xl font-bold text-[#D4AF37] tracking-wider block">
              Jyoti Mahimkar
            </span>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-semibold font-body leading-none">
              Classical & Soulful Renditions
            </p>
          </div>

          <a
            href="https://youtube.com/@jyotimahimkar257"
            target="_blank"
            rel="noreferrer"
            className="bg-[#D4AF37] text-black hover:bg-[#4A0404] hover:text-[#D4AF37] px-10 py-4 text-xs uppercase tracking-widest font-semibold font-body rounded-full transition-all duration-300 shadow-2xl scale-100 hover:scale-[1.03] active:scale-95 flex items-center gap-2"
          >
            <Youtube className="w-5 h-5" />
            Subscribe on YouTube
          </a>

          {/* Custom social connectivity buttons row */}
          <div className="flex justify-center gap-8 text-[#FFFDD0]/60" id="footer-social-row">
            <a href="https://youtube.com/@jyotimahimkar257" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors" title="YouTube Channel">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors" title="Instagram Profile">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors" title="Facebook Page">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors" title="Spotify Profile">
              <span className="material-symbols-outlined text-[20px] align-middle">music_note</span>
            </a>
          </div>

          <div className="w-24 h-[1px] bg-[#D4AF37]/35" />

          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl text-[10px] text-[#FFFDD0]/40 font-body gap-4 border-t border-white/5 pt-6">
            <p>© 2026 Jyoti Mahimkar. All Rights Reserved.</p>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#D4AF37] uppercase tracking-wider font-semibold">
              Admin Gateway Login
            </button>
            <p>Designed in Classical Minimalist Slate Mode</p>
          </div>

        </div>
      </footer>

      {/* 8. Overlay Drawers and Portals Dialogs */}

      {/* About Drawer */}
      <AnimatePresence>
        {isAboutOpen && (
          <AboutJourney isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            onBookingAdded={handleBookingAdded}
          />
        )}
      </AnimatePresence>

      {/* Admin Control room Panel */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            performances={performances}
            shorts={shorts}
            bookings={bookings}
            subscribers={subscribers}
            onUpdatePerformances={handleUpdatePerformances}
            onUpdateShorts={handleUpdateShorts}
            onUpdateBookings={handleUpdateBookings}
          />
        )}
      </AnimatePresence>

      {/* Media Player full-screen player */}
      <AnimatePresence>
        {selectedTrack.isOpen && (
          <MediaModal
            isOpen={selectedTrack.isOpen}
            onClose={() => setSelectedTrack({ ...selectedTrack, isOpen: false })}
            title={selectedTrack.title}
            genre={selectedTrack.genre}
            year={selectedTrack.year}
            videoUrl={selectedTrack.videoUrl}
            isShort={selectedTrack.isShort}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
