import { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot' | 'system';
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

const QUICK_REPLIES = [
  '🎓 Admission process',
  '💰 BCA Fee Structure',
  '📊 BTech Statistics',
  '🏆 Scholarships',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const API_URL = import.meta.env.VITE_API_URL || '';
  const CHAT_ENDPOINT = `${API_URL}/api/chat`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    
    setMessages((prev) => {
      // Clear suggestions from previous message
      const updated = prev.map(m => ({ ...m, suggestions: [] }));
      return [...updated, { sender: 'user', content: msg, timestamp: new Date() }];
    });
    setInput('');
    setIsTyping(true);
    setShowQuickReplies(false);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', content: data.content, suggestions: data.suggestions, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: 'system', content: 'Connection failed. Please check your network or try again later.', timestamp: new Date() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = async () => {
    setMessages([]);
    setShowQuickReplies(true);
    try {
      await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'reset' })
      });
    } catch (e) {
      // ignore
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {isOpen && (
        <div
          className="w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200/60 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
          style={{ height: '600px', maxHeight: 'calc(100vh - 6rem)' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 shrink-0 shadow-sm relative z-10"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            <div className="relative shrink-0 w-11 h-11">
              <img
                src="/child_book_avatar.png"
                alt="EduBot"
                className="w-11 h-11 rounded-full object-cover border-2 border-white/40 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1d4ed8] bg-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-base leading-tight tracking-wide">EduBot Assistant</h2>
              <p className="text-blue-100/90 text-[11px] font-medium uppercase tracking-wider mt-0.5">
                Online • Ready to help
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={handleReset} title="Reset conversation" className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scroll-smooth bg-slate-50/50 dark:bg-slate-900/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 shadow-lg border-4 border-blue-100 dark:border-blue-900/40">
                  <img src="/child_book_avatar.png" alt="EduBot" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-1">How can we help?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Ask me anything about admissions, courses, fees, or scholarships. I can even fetch live database statistics!
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className={`flex gap-3 max-w-full ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender !== 'user' && (
                    <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border border-blue-200 dark:border-blue-800 shadow-sm mt-1">
                      <img src="/child_book_avatar.png" alt="EduBot" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`flex flex-col gap-1 min-w-[60px] max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-[14px] leading-[1.6] whitespace-pre-wrap break-words
                        ${msg.sender === 'user'
                          ? 'text-white rounded-tr-sm shadow-md bg-gradient-to-br from-blue-500 to-blue-700'
                          : 'text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm border border-slate-200/60 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1 uppercase tracking-wider">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* Suggested Questions */}
                {msg.suggestions && msg.suggestions.length > 0 && i === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 mt-1 ml-11">
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-end">
                <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border border-blue-200 dark:border-blue-800 shadow-sm">
                  <img src="/child_book_avatar.png" alt="EduBot" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
                  <div className="flex gap-1.5 items-center h-2">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {showQuickReplies && messages.length === 0 && (
            <div className="px-5 py-3 shrink-0 flex flex-wrap gap-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-10">
              {QUICK_REPLIES.map((r) => (
                <button key={r} onClick={() => sendMessage(r)} className="text-[13px] text-blue-700 dark:text-blue-400 font-medium px-3.5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-100/50 dark:border-blue-800/50">
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-20">
            <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/50 transition-all duration-200 shadow-inner">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent text-[14px] text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none px-3 py-2.5 max-h-[120px]"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-white bg-gradient-to-br from-blue-600 to-blue-800"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
            <div className="flex justify-center items-center mt-3 gap-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">Powered by EduBot AI</span>
            </div>
          </div>
        </div>
      )}

      {/* FAB - Child Book Avatar */}
      <button
        onClick={() => {
          setBookOpen(true);
          setTimeout(() => {
            setIsOpen((o) => !o);
            setTimeout(() => setBookOpen(false), 400);
          }, 350);
        }}
        title="Chat with EduBot"
        className="relative w-20 h-20 rounded-full overflow-hidden shadow-[0_8px_32px_rgba(99,102,241,0.55)] transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-700"
        style={{
          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)'
        }}
      >
        {isOpen ? (
          <div className="w-full h-full flex items-center justify-center">
            <X size={30} className="text-white drop-shadow" />
          </div>
        ) : (
          <img
            src="/child_book_avatar.png"
            alt="Open EduBot chat"
            className={`w-full h-full object-cover transition-all duration-300 ${
              bookOpen ? 'scale-125 brightness-125' : 'scale-100'
            }`}
          />
        )}
        {!isOpen && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-[3px] border-white animate-pulse shadow" />
        )}
        {/* shimmer ring on hover */}
        <span className="absolute inset-0 rounded-full ring-4 ring-indigo-300/40 dark:ring-indigo-500/30 animate-ping" style={{ animationDuration: '2.5s' }} />
      </button>
    </div>
  );
}
