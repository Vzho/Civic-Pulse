import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { cn } from "../../lib/utils";

interface AssistantSheetProps {
  isOpen: boolean;
  onClose: () => void;
  contextMessage?: string;
}

export default function AssistantSheet({ isOpen, onClose, contextMessage }: AssistantSheetProps) {
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: "Hi! I can summarize this event, explain who's organizing it, or break down local civic terms." }
  ]);
  const [input, setInput] = useState("");

  // Lock body scroll when Bottom Sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Provide an initial context message if opened from an event page that passes it
      if (contextMessage && messages.length === 1 && !messages.some(m => m.text === contextMessage)) {
        setTimeout(() => {
           setMessages(prev => [...prev, { role: 'user', text: contextMessage }]);
           setTimeout(() => {
             setMessages(prev => [...prev, { role: 'ai', text: "Sure! This is a core focus in our community. Are you wondering about the specifics, or who to contact?"}]);
           }, 600);
        }, 300);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, contextMessage, messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "EBCAC is a grassroots coalition founded in 2019 by local activists. They focus on environmental justice in our area." 
      }]);
    }, 600);
  };

  const handleSuggested = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Got it! Feel free to ask if you want me to summarize other aspects, like who organizes it." 
      }]);
    }, 600);
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Dimmed Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Bottom Sheet Container */}
      <div 
        className={cn(
          "w-full max-w-[430px] bg-[#f8f9fa] h-[60vh] max-h-[500px] rounded-t-3xl relative flex flex-col pb-safe-offset-4 transition-transform duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle / Drag Pill */}
        <div className="flex justify-center pt-3 pb-2 w-full">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Minimal Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">Event assistant</h3>
            <p className="text-[12px] text-gray-500">Ask about any event or term</p>
          </div>
          <button onClick={onClose} className="p-2 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 bg-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 no-scrollbar pb-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div 
                className={cn(
                  "p-3 rounded-2xl max-w-[85%] text-[14px] leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-emerald-600 text-white rounded-br-sm" 
                    : "bg-[#F4F1EB] text-gray-900 border border-gray-200/50 rounded-bl-sm"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Quick Suggestions Mid-feed */}
          {messages.length === 1 && (
            <div className="flex justify-end pt-1 flex-col items-end gap-2.5">
              <button 
                onClick={() => handleSuggested("Who runs this coalition and what do they do?")}
                className="bg-white border border-emerald-100 text-emerald-700/90 rounded-2xl p-2.5 text-[13.5px] font-medium text-left leading-snug hover:bg-emerald-50 transition shadow-sm max-w-[85%]"
              >
                Who runs this coalition and what do they do?
              </button>
              <button 
                onClick={() => handleSuggested("What does 'public comment' mean here?")}
                className="bg-white border border-emerald-100 text-emerald-700/90 rounded-2xl p-2.5 text-[13.5px] font-medium text-left leading-snug hover:bg-emerald-50 transition shadow-sm max-w-[85%]"
              >
                What does 'public comment' mean here?
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 pb-2 pt-3 bg-white border-t border-gray-100 flex gap-2">
          <input 
            type="text" 
            placeholder="Ask a question..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-[14px]"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-11 h-11 shrink-0 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 shadow-sm"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
