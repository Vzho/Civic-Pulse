import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import { ArrowLeft, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import AssistantSheet from "../components/ui/AssistantSheet";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, user, toggleRsvp } = useStore();
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const event = events.find(e => e.id === id);

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  const isRsvpd = user.rsvps.includes(event.id);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setAssistantOpen(true)}
          className="p-2 border border-gray-200 rounded-full text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
        >
          <Sparkles className="w-4 h-4" fill="currentColor"/>
        </button>
      </div>

      <div className="p-5">
        <div className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md mb-4 uppercase tracking-wider">
          {event.topic}
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-gray-900 leading-tight mb-4">
          {event.title}
        </h1>
        
        <div className="flex items-center gap-3 text-gray-600 mb-6 border-b border-gray-100 pb-6">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex flex-col items-center justify-center font-bold text-xs leading-none">
            {event.organization.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Hosted by {event.organization}</div>
            <div className="text-xs text-gray-500">{event.attendees + (isRsvpd ? 1 : 0)} people going</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="text-[15px] text-gray-900">{event.dateStr}</div>
          </div>
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="text-[15px] text-gray-900">{event.location}</div>
          </div>
          <div className="flex gap-3">
            <Users className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="text-[15px] text-gray-900">Open to the public</div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">About this {event.type.toLowerCase()}</h2>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
            {event.description}
          </p>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            This is a vital opportunity to engage with local policy makers and voice your community concerns. Join us early to secure seating and prepare your public comments.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="mt-auto px-5 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 pb-safe-offset-4">
        <button 
          onClick={() => toggleRsvp(event.id)}
          className={cn(
            "w-full py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition",
            isRsvpd 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          )}
        >
          {isRsvpd ? 'You are going!' : 'RSVP'}
        </button>
      </div>

      <AssistantSheet 
        isOpen={isAssistantOpen} 
        onClose={() => setAssistantOpen(false)} 
        contextMessage={`Tell me more about: ${event.title}`}
      />
    </div>
  );
}
