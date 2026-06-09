import React, { useState, useCallback } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Loader2, MessageSquare, X } from 'lucide-react';

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleVoiceInteraction = async () => {
    if (isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setAiResponse('');
    };

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsProcessing(true);

      setTimeout(async () => {
        const response = "Understood. Zyvibe's automation engine is designed to handle that workflow. I've noted your interest in our creator suite.";
        setAiResponse(response);
        speak(response);
        setIsProcessing(false);

        try {
          await addDoc(collection(db, 'leads'), {
            struggle: text,
            source: 'voice',
            createdAt: new Date().toISOString(),
            email: 'voice-capture@zyvibe.com'
          });
        } catch (e) {
          console.error(e);
        }
      }, 1500);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.start();
    speak("What is your primary bottleneck in your creative process?");
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVoiceInteraction}
          className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all ${
            isListening 
              ? 'bg-brand-purple border-brand-purple shadow-[0_0_20px_rgba(124,58,237,0.4)]' 
              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
          }`}
        >
          {isListening ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" strokeWidth={1.5} />
          ) : (
            <Mic className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
          )}
        </motion.button>
        {isListening && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-purple rounded-full border-2 border-bg-main animate-pulse" />
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-white tracking-tightest">
          {isListening ? "Listening to your input..." : "Voice Assistant"}
        </p>
        <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">
          {isListening ? "Speak clearly into your mic" : "Click to start consultation"}
        </p>
      </div>

      <AnimatePresence>
        {(transcript || aiResponse || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full p-5 bento-card shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-brand-purple/10 flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-brand-purple" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session Log</span>
              </div>
              <button 
                onClick={() => { setTranscript(''); setAiResponse(''); }}
                className="text-slate-600 hover:text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {transcript && (
              <div className="mb-4 pl-4 border-l border-white/10">
                <p className="text-[11px] text-slate-500 mb-1">User Input</p>
                <p className="text-xs text-slate-300 italic">"{transcript}"</p>
              </div>
            )}
            
            {isProcessing ? (
              <div className="flex items-center gap-2 text-brand-purple py-2">
                <Loader2 className="w-3 h-3 animate-spin" strokeWidth={1.5} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Analyzing bottleneck...</span>
              </div>
            ) : aiResponse && (
              <div className="pl-4 border-l border-brand-purple/50">
                <p className="text-[11px] text-brand-purple font-bold uppercase tracking-wider mb-1">Zyvibe AI</p>
                <p className="text-xs text-white leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAssistant;
