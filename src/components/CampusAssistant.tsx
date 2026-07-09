import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Navigation } from 'lucide-react';
import { POI } from '../types';
import { cn } from '../lib/utils';
import { processQuery } from '../utils/chatbot';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  poi?: POI;
}

interface CampusAssistantProps {
  pois: POI[];
  onNavigate: (poi: POI) => void;
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
  isSearchOpen?: boolean;
}

export function CampusAssistant({
  pois,
  onNavigate,
  externalOpen,
  onExternalOpenChange,
  isSearchOpen = false,
}: CampusAssistantProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : localOpen;
  const setIsOpen = (open: boolean) => {
    setLocalOpen(open);
    onExternalOpenChange?.(open);
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm your LASU Campus Assistant 👋 Ask me about any building, faculty, or department on campus.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userQuery = inputValue;
    const userMsgId = `user-${Date.now()}`;
    
    // Add user message
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: userQuery }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = processQuery(userQuery, pois);
      const assistantMsgId = `assistant-${Date.now()}`;
      
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        sender: 'assistant',
        text: response.text,
        poi: response.poi,
      }]);
      setIsTyping(false);
    }, 600);
  };

  const SUGGESTED_CHIPS = [
    "Where is Computer Science?",
    "Where is LT1?",
    "Which faculty is Accounting under?",
    "Departments in Faculty of Arts"
  ];

  const handleChipClick = (question: string) => {
    setInputValue('');
    setIsTyping(true);

    // Add user message
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: question }]);

    setTimeout(() => {
      const response = processQuery(question, pois);
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        poi: response.poi,
      }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isSearchOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed bottom-28 right-6 lg:bottom-10 lg:right-10 z-[1200] lg:z-[2500]",
            "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-lg animate-fade-in",
            isOpen 
              ? "bg-zinc-800 text-white shadow-zinc-800/20"
              : "bg-lasu-accent text-white shadow-md hover:scale-105 border-none"
          )}
          title="Campus Assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 text-white" />}
        </button>
      )}

      {/* Chat Panel Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={cn(
              "fixed bottom-24 right-4 z-[3000] w-[calc(100%-2rem)] max-w-sm lg:bottom-28 lg:right-10 lg:w-96",
              "bg-white  border border-zinc-250  shadow-2xl rounded-3xl h-[480px] flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
              <div className="flex items-center gap-2">
                <img 
                  src="https://lasu.edu.ng/home/img/logo1.png"
                  alt="LASU Logo"
                  className="w-8 h-8 object-contain shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xs font-black text-lasu-primary flex items-center gap-1.5 leading-none">
                    <span className="w-2 h-2 rounded-full bg-lasu-secondary animate-pulse" />
                    LASU Assistant
                  </h3>
                  <p className="text-[9px] text-zinc-650 font-bold uppercase tracking-wider mt-1">Official Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-zinc-200 rounded-full text-zinc-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col custom-scrollbar">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-1 text-xs max-w-[85%]",
                    msg.sender === 'user' ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl font-black whitespace-pre-line leading-relaxed shadow-sm",
                      msg.sender === 'user'
                        ? "bg-[rgb(245,235,224)]  text-[rgb(49,30,2)]  rounded-tr-none border border-[rgb(230,215,200)] "
                        : "bg-white  text-[rgb(49,30,2)]  border border-zinc-250  rounded-tl-none"
                    )}
                  >
                    {msg.text}
                  </div>

                  {msg.poi && (
                    <button
                      onClick={() => {
                        onNavigate(msg.poi!);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "mt-1 px-3 py-1.5 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-xl shadow-md",
                        "flex items-center gap-1.5 font-black uppercase text-[10px] hover:scale-102 transition-all duration-200 active:scale-95 cursor-pointer border-none"
                      )}
                    >
                      <Navigation className="w-3.5 h-3.5 fill-current text-white" />
                      Navigate
                    </button>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col gap-1 text-xs self-start items-start">
                  <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-zinc-200 rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Chips (Scrollable list above input box) */}
            <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-200 flex gap-2 overflow-x-auto scrollbar-none shrink-0 max-w-full">
              {SUGGESTED_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-lasu-primary rounded-full text-[10px] font-bold text-zinc-700 hover:text-lasu-primary whitespace-nowrap active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input area */}
            <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 bg-zinc-50 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask about departments, buildings..."
                className="flex-1 bg-white border border-zinc-250 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-700 placeholder-zinc-400 focus:outline-none focus:border-lasu-primary focus:ring-2 focus:ring-lasu-primary/10"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 border cursor-pointer",
                  inputValue.trim()
                    ? "bg-lasu-primary hover:bg-lasu-primary-dark border-lasu-primary text-white shadow-md active:scale-95"
                    : "bg-white  border-zinc-250  text-zinc-350 "
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
