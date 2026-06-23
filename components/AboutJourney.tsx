'use client';

import { motion } from 'motion/react';
import { X, Award, Music, BookOpen, Star } from 'lucide-react';

interface AboutJourneyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutJourney({ isOpen, onClose }: AboutJourneyProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        id="about-backdrop"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl h-full bg-[#181212] border-l border-[#D4AF37]/20 p-8 md:p-12 overflow-y-auto shadow-2xl flex flex-col z-10"
        id="about-drawer"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#FFFDD0]/60 hover:text-[#D4AF37] transition-colors p-2 hover:bg-white/5 rounded-full"
          id="close-about-btn"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="flex-1 mt-6">
          <span className="text-[#D4AF37] font-semibold tracking-[0.2em] text-xs uppercase block mb-2 font-body">THE SINGER</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#FFFDD0] mb-8 leading-tight tracking-tight">
            Jyoti Mahimkar
          </h2>

          <div className="w-16 h-[2px] bg-[#D4AF37] mb-8"></div>

          <div className="space-y-6 text-[#FFFDD0]/80 font-body text-base leading-relaxed">
            <p>
              Jyoti Mahimkar is an acclaimed Indian vocalist celebrated for her soulful renditions of vintage melodies, ghazals, and Indian light classical music. With an extraordinary voice that seamlessly blends deep emotional resonance with technical precision, she dedicates her artistry to reviving timeless classics, breathing fresh contemporary life into golden era treasures.
            </p>
            <p>
              Through her active digital sanctuary on YouTube, under her channel name &quot;jyoti mahimkar&quot; (@jyotimahimkar257), Jyoti has established a vibrant global community of vintage music purists and classical enthusiasts. Her performances act as a spiritual bridge between legendary composers and modern listeners, preserving India&apos;s rich musical heritage with rare authenticity and grace. From poignant, nostalgic ghazals to rousing patriotic anthems and inspirational compositions, Jyoti&apos;s versatile vocal range captivates audiences worldwide. Her commitment to maintaining high-fidelity classical aesthetics makes her a true guardian of India&apos;s classical tradition in the modern digital landscape. Collaborating with local musicians, she continues to inspire across generations.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pb-12">
            <div className="p-5 rounded border border-[#D4AF37]/10 bg-[#0F0F0F] flex items-start gap-4" id="highlight-card-1">
              <Music className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <h4 className="text-[#FFFDD0] font-semibold text-sm mb-1 font-body">Classical Rigor</h4>
                <p className="text-[#FFFDD0]/60 text-xs font-body leading-relaxed">
                  Deeply trained in traditional ragas, dadra, thumri, and complex voice modulation.
                </p>
              </div>
            </div>

            <div className="p-5 rounded border border-[#D4AF37]/10 bg-[#0F0F0F] flex items-start gap-4" id="highlight-card-2">
              <Award className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <h4 className="text-[#FFFDD0] font-semibold text-sm mb-1 font-body">Accolades & Recognition</h4>
                <p className="text-[#FFFDD0]/60 text-xs font-body leading-relaxed">
                  Honored at prestigious music festivals, recognized for preserving Indian heritage tracks.
                </p>
              </div>
            </div>

            <div className="p-5 rounded border border-[#D4AF37]/10 bg-[#0F0F0F] flex items-start gap-4" id="highlight-card-3">
              <BookOpen className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <h4 className="text-[#FFFDD0] font-semibold text-sm mb-1 font-body">Artistic Heritage</h4>
                <p className="text-[#FFFDD0]/60 text-xs font-body leading-relaxed">
                  A lifetime committed to vintage Bollywood classics and restoring rare lyrical compositions.
                </p>
              </div>
            </div>

            <div className="p-5 rounded border border-[#D4AF37]/10 bg-[#0F0F0F] flex items-start gap-4" id="highlight-card-4">
              <Star className="w-6 h-6 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <h4 className="text-[#FFFDD0] font-semibold text-sm mb-1 font-body">Live Performances</h4>
                <p className="text-[#FFFDD0]/60 text-xs font-body leading-relaxed">
                  Captivating audiences globally with live showcases in prestigious auditoriums.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-[#D4AF37]/10 pt-6 text-center" id="about-drawer-footer">
          <p className="text-xs text-[#FFFDD0]/40 font-body">
            &quot;Music represents the mirror of the soul and the bridge between eras.&quot;
          </p>
        </div>
      </motion.div>
    </div>
  );
}
