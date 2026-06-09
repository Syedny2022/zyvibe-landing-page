import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Sparkles, ChevronLeft, ChevronRight, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const SchedulingWidget: React.FC<{ className?: string }> = ({ className }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const [events, setEvents] = useState([
    { id: 1, day: 1, start: 1, duration: 1.5, title: 'Content Strategy', type: 'event' },
    { id: 2, day: 2, start: 3, duration: 1, title: 'AI Suggestion: Post Video', type: 'suggestion' },
    { id: 3, day: 3, start: 0.5, duration: 2, title: 'Brand Meeting', type: 'event' },
    { id: 4, day: 4, start: 4, duration: 1, title: 'Edit Session', type: 'event' },
  ]);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const confirmDelete = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    setDeletingId(null);
  };

  return (
    <div className={cn("bento-card p-6 flex flex-col gap-6 relative overflow-hidden", className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-purple/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-brand-purple" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tightest">Content Scheduler</h3>
            <p className="text-[11px] text-slate-500">April 2025</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-slate-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-slate-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative flex-1 min-h-[300px] border border-white/5 rounded-lg bg-white/[0.01] overflow-hidden">
        {/* Time Labels */}
        <div className="absolute left-0 top-8 bottom-0 w-12 flex flex-col justify-between py-2 border-r border-white/5">
          {hours.map((h, i) => (
            <span key={i} className="text-[9px] text-slate-600 text-center">{h}</span>
          ))}
        </div>

        {/* Grid Columns */}
        <div className="absolute left-12 right-0 top-0 bottom-0 grid grid-cols-7">
          {days.map((day, i) => (
            <div key={i} className="border-r border-white/5 flex flex-col">
              <div className="h-8 flex items-center justify-center border-b border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{day}</span>
              </div>
              <div className="flex-1 relative">
                {/* Grid Lines */}
                {hours.map((_, j) => (
                  <div key={j} className="absolute w-full border-b border-white/[0.02]" style={{ top: `${(j / (hours.length - 1)) * 100}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="absolute left-12 right-0 top-8 bottom-0">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "absolute rounded-md p-2 border shadow-lg overflow-hidden group cursor-pointer transition-all",
                event.type === 'suggestion' 
                  ? "bg-brand-indigo/20 border-brand-indigo/30" 
                  : "bg-brand-purple/20 border-brand-purple/30"
              )}
              style={{
                left: `${(event.day / 7) * 100}%`,
                width: `${(1 / 7) * 100}%`,
                top: `${(event.start / hours.length) * 100}%`,
                height: `${(event.duration / hours.length) * 100}%`,
                margin: '2px'
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-1">
                  {event.type === 'suggestion' ? (
                    <div className="px-1.5 py-0.5 rounded-full bg-brand-indigo text-[8px] font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-2 h-2" />
                      AI
                    </div>
                  ) : <div className="w-2 h-2" />}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(event.id);
                    }}
                    className="p-1 rounded bg-black/20 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                  >
                    <Trash2 className="w-2 h-2" />
                  </button>
                </div>
                <p className="text-[9px] font-bold text-white leading-tight truncate">{event.title}</p>
              </div>
            </motion.div>
          ))}

          {/* Now Indicator */}
          <div className="absolute w-full h-[1px] bg-red-500/50 z-10 flex items-center" style={{ top: '45%' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 -ml-0.5" />
            <div className="px-1.5 py-0.5 rounded bg-red-500 text-[8px] font-bold text-white ml-2">NOW</div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg-main/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-[240px] bg-bg-main border border-white/10 rounded-xl p-5 shadow-2xl text-center"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 tracking-tightest">Delete Event?</h4>
              <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                This action cannot be undone. Are you sure you want to remove this scheduled content?
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => confirmDelete(deletingId)}
                  className="flex-1 py-2 rounded-lg bg-red-500/10 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Suggestions */}
      <div className="flex flex-wrap gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] text-slate-400 flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer">
          <Sparkles className="w-3 h-3 text-brand-purple" />
          <span>Suggest best time to post</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] text-slate-400 flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer">
          <Clock className="w-3 h-3 text-brand-indigo" />
          <span>Optimize queue</span>
        </div>
      </div>
    </div>
  );
};

export default SchedulingWidget;
