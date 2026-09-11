import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Mic, MicOff, Volume2, Sparkles, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { aiService, VoiceAssistantResponse } from '../../services/aiService';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProduceParsed?: (data: { crop: string; quantityKg: number }) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onProduceParsed,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'gu-IN' | 'hi-IN' | 'en-IN'>('gu-IN');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<VoiceAssistantResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if available in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        processCommand(transcript);
      }
    } else {
      setTranscript('');
      setResponse(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        // mic fallback
        setIsListening(true);
      }
    }
  };

  const processCommand = (text: string) => {
    const res = aiService.parseVoiceCommand(text);
    setResponse(res);
    speakResponse(res.message, res.language);
  };

  const speakResponse = (text: string, lang: 'Gujarati' | 'Hindi' | 'English') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'Gujarati' ? 'gu-IN' : lang === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sampleQueries = [
    { text: 'Mare 500 kilo dungri vechvi che.', lang: 'Gujarati', label: '🌾 વેચવું (Gujarati)' },
    { text: 'Aaje tomato no bhav ketlo che?', lang: 'Gujarati', label: '💰 ભાવ જાણો (Gujarati)' },
    { text: 'Mara order nu status shu che?', lang: 'Gujarati', label: '🚚 ટ્રેકિંગ (Gujarati)' },
    { text: 'Mujhe 300 kg tamatar bechna hai.', lang: 'Hindi', label: '🍅 फसल बेचना (Hindi)' },
    { text: 'What is the current market price for Onion?', lang: 'English', label: '📈 Onion Rate (English)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        window.speechSynthesis?.cancel();
        recognitionRef.current?.stop();
        onClose();
      }}
      title="🎙️ FarmSetu AI Voice & Multilingual Assistant"
      subtitle="Speak in Gujarati, Hindi, or English to list crops, get real-time mandi prices, and track shipments."
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Language selector chips */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Speech Recognition Language:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage('gu-IN')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLanguage === 'gu-IN'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
              }`}
            >
              ગુજરાતી (Gujarati)
            </button>
            <button
              onClick={() => setSelectedLanguage('hi-IN')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLanguage === 'hi-IN'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => setSelectedLanguage('en-IN')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLanguage === 'en-IN'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Central Microphone Animation */}
        <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-800/80">
          <div className="relative">
            {isListening && (
              <>
                <span className="absolute -inset-3 rounded-full bg-emerald-400/30 animate-ping" />
                <span className="absolute -inset-6 rounded-full bg-emerald-400/20 animate-pulse" />
              </>
            )}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/40'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/40'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isListening ? 'Listening now... Speak your crop details or inquiry' : 'Click microphone to speak or choose a sample prompt'}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Supported intents: Sell Produce, Check Mandi Price, Order Tracking, Buyer Matching
          </span>
        </div>

        {/* Live Transcript / Input Field */}
        <div className="relative">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && processCommand(transcript)}
            placeholder='Or type e.g. "Mare 500 kilo dungri vechvi che" or "Tamatar ka bhav kya hai"...'
            className="w-full pl-4 pr-12 py-3 text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
          <button
            onClick={() => processCommand(transcript)}
            disabled={!transcript.trim()}
            className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sample Query Chips */}
        <div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Try Instant Demo Queries (from PDF specification):
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(q.text);
                  processCommand(q.text);
                }}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Intent & Response Output */}
        {response && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  AI Intent Detected: {response.intent}
                </span>
              </div>
              <button
                onClick={() => speakResponse(response.message, response.language)}
                className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 font-medium hover:underline"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-amber-500 animate-pulse' : ''}`} />
                {isSpeaking ? 'Speaking...' : 'Listen'}
              </button>
            </div>

            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {response.message}
            </p>

            {/* If intent is SELL_PRODUCE, show quick-action button to populate listing */}
            {response.intent === 'SELL_PRODUCE' && response.actionableData && (
              <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 dark:border-emerald-800/60">
                <span className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Parsed: {response.extractedQuantityKg} kg {response.extractedCrop}
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    if (onProduceParsed && response.actionableData) {
                      onProduceParsed({
                        crop: response.extractedCrop || 'Tomato',
                        quantityKg: response.extractedQuantityKg || 500,
                      });
                    }
                    onClose();
                  }}
                  className="gap-1 text-xs"
                >
                  Proceed to Listing <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
