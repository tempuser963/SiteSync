import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/ui/Card';
import {
  Bot,
  User,
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  CornerDownLeft,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage } from '../types';
import {
  initialMessages,
  suggestedPrompts,
  mockChatResponses,
} from '../data/mockChat';

export const CopilotPage: React.FC = () => {
  const { currentProject } = useProject();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyData = mockChatResponses[text];
      if (!replyData) {
        // Fallback response for arbitrary user questions
        replyData = {
          content: `### Analysis for: "${text}"

Based on the active project records for **${currentProject.name} (${currentProject.id})**:

- **Current Progress:** ${currentProject.overallProgress}% against planned baseline
- **Data Integrity:** Contradiction engine evaluated 14 field observations with 87% auto-acceptance
- **Active Disciplines:** Civil, Piping, Electrical, Instrumentation, Static Equipment, Rotating Equipment, HSE

If you are querying specific line items (e.g. Line 24-XX, Foundation F-101, or Cable Tray CT-12), please see the **L5/L6 Activity Mapping** and **Review Center** tabs for complete evidentiary breakdowns.`,
          sources: ['Schedule PRJ001', 'DPR-2209'],
        };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyData.content,
        timestamp: new Date().toISOString(),
        sources: replyData.sources,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand dark:text-yellow-300" />
              KaryaSetu AI Copilot
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-tint text-brand-deep dark:bg-yellow-400/15 dark:text-yellow-200">
              EPC Intelligence Assistant
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Ask questions about project execution, schedule mapping, and historical performance
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Active Context: {currentProject.name}</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand dark:text-yellow-300" /> Prompts:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-brand dark:hover:border-yellow-400 hover:bg-brand-soft/50 dark:hover:bg-yellow-400/10 text-slate-700 dark:text-zinc-300 text-[11px] font-medium whitespace-nowrap transition shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white'
                    : 'bg-navy-900 dark:bg-yellow-400 dark:text-zinc-950 text-red-300 border border-red-700 dark:border-yellow-400/40'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-lg p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white font-medium shadow-xs'
                    : 'bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>

                {/* Internal Source Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-zinc-700 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="font-semibold text-slate-400">
                      Verified Citations:
                    </span>
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded font-mono font-bold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-brand dark:text-yellow-300"
                      >
                        [{src}]
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-2 text-right ${
                    isUser ? 'text-brand-tint dark:text-yellow-100' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-navy-900 text-red-300 dark:text-yellow-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg p-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="animate-spin text-brand dark:text-yellow-300">⟳</span>
              <span>Correlating execution evidence across schedule corpus...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 flex items-center gap-2 shadow-xs">
        <input
          type="text"
          placeholder="Ask Copilot about delays, activities, evidence contradictions..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none"
        />
        <button
          disabled={!inputText.trim() || isTyping}
          onClick={() => handleSendMessage()}
          className="p-2 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 disabled:opacity-40 text-white rounded-md transition shadow-xs"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
