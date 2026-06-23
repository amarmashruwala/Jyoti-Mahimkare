'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Share2, Heart, MessageSquare, Flame } from 'lucide-react';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  genre: string;
  year?: string;
  videoUrl?: string;
  isShort?: boolean;
}

export default function MediaModal({
  isOpen,
  onClose,
  title,
  genre,
  year,
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  isShort = false,
}: MediaModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<{ user: string; text: string }[]>([
    { user: 'Rohan Sharma', text: 'Stunning voice, absolute goosebumps!' },
    { user: 'Meera Iyer', text: 'Classic rendition. Reviving the golden history perfectly.' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [progress, setProgress] = useState(0);

  // Auto increment simulated progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, { user: 'You', text: newComment.trim() }]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        id="player-backdrop"
      />

      {/* Main Player Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className={`relative w-full overflow-hidden bg-[#0F0F0F] border border-[#D4AF37]/30 rounded shadow-2xl z-10 flex flex-col md:flex-row ${
          isShort ? 'max-w-4xl h-[85vh]' : 'max-w-5xl'
        }`}
        id="player-[#dynamic-modal]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#FFFDD0] hover:text-[#D4AF37] z-30 bg-black/50 p-2 rounded-full border border-white/10 hover:border-[#D4AF37] transition-all"
          id="close-player-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Outer Grid Left Container - Screens */}
        <div className={`relative bg-black flex flex-col justify-center items-center ${isShort ? 'w-full md:w-3/5 h-2/3 md:h-full' : 'w-full md:w-3/5 aspect-video'}`}>
          {/* Real Embedded YouTube Frame */}
          <iframe
            src={`${videoUrl}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0`}
            title={title}
            className="absolute inset-0 w-full h-full border-0 brightness-[0.85]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Interactive Equalizer Overlay (Drawn purely with CSS to simulate high-fidelity performance acoustics) */}
          <div className="absolute bottom-16 left-6 right-6 flex items-end justify-center gap-[4px] h-10 pointer-events-none opacity-55 z-20">
            {[12, 24, 18, 30, 15, 28, 22, 14, 32, 19, 25, 16, 29, 20, 15, 27, 21, 13, 30, 17, 24, 18, 28, 12].map((maxHeight, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [10, maxHeight, 10] : 8,
                }}
                transition={{
                  duration: 0.6 + (i % 5) * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-[3px] bg-[#D4AF37] rounded-sm"
              />
            ))}
          </div>

          {/* Screen Custom Player Control Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col z-20 pointer-events-auto">
            {/* ProgressBar */}
            <div className="relative w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress((e.clientX - rect.left) / rect.width * 100);
            }}>
              <div className="absolute h-full bg-[#D4AF37] rounded-full" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-[#D4AF37] transition-colors"
                  id="play-pause-control"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-[#D4AF37] transition-colors"
                  id="mute-control"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              <div className="text-[10px] text-white/60 font-mono">
                {Math.floor((progress * 3) / 100)}:{(Math.floor((progress * 180) / 100) % 65).toString().padStart(2, '0')} / 3:00
              </div>
            </div>
          </div>
        </div>

        {/* Outer Grid Right Container - Sidebar Info, Reviews & Feedback Panel */}
        <div className={`flex flex-col bg-[#181212] p-6 justify-between ${isShort ? 'w-full md:w-2/5 h-1/3 md:h-full' : 'w-full md:w-2/5'}`}>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[75vh] pr-1">
            <div>
              <span className="inline-block text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] uppercase font-semibold px-2 py-[2px] rounded-sm tracking-widest font-body mb-2">
                {genre}
              </span>
              <h4 className="text-xl md:text-2xl font-display font-medium text-[#FFFDD0] tracking-tight leading-snug">
                {title}
              </h4>
              {year && <p className="text-xs text-[#FFFDD0]/40 font-body mt-1">Recorded Session • {year}</p>}
            </div>

            <div className="w-full h-[1px] bg-[#D4AF37]/10" />

            {/* Quick Interactions */}
            <div className="flex items-center gap-6" id="player-interactions">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-body transition-all ${
                  hasLiked ? 'text-[#D4AF37] scale-105' : 'text-[#FFFDD0]/60 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes} Sparks</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-body text-[#FFFDD0]/60">
                <MessageSquare className="w-5 h-5" />
                <span>{comments.length} Thoughts</span>
              </div>
            </div>

            {/* Simulated Live Thoughts List */}
            <div className="space-y-4">
              <h5 className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold font-body flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Soulful feedback
              </h5>
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1" id="comments-container">
                {comments.map((comment, index) => (
                  <div key={index} className="p-3 bg-[#0F0F0F] rounded border border-[#D4AF37]/5 shrink-0 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#FFFDD0]/80 font-body">{comment.user}</span>
                      <span className="text-[9px] text-[#FFFDD0]/30 font-mono font-bold uppercase">Just now</span>
                    </div>
                    <p className="text-xs text-[#FFFDD0]/60 font-body leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick thought input form */}
          <form onSubmit={handleAddComment} className="mt-4 border-t border-[#D4AF37]/10 pt-4 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-[#0F0F0F] border border-[#D4AF37]/25 focus:border-[#D4AF37] text-[#FFFDD0] text-xs py-2 px-3 focus:outline-none rounded font-body focus:ring-0"
              placeholder="Leave a soulful thought..."
            />
            <button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#FFFDD0] text-black font-semibold text-xs px-4 py-2 rounded font-body transition-colors"
            >
              Post
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
