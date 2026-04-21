import React, { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore, CivicEvent } from "../store/useStore";
import { cn } from "../lib/utils";
import AssistantSheet from "../components/ui/AssistantSheet";

const TAGS = ["All events", "City council", "Speaker series", "Local orgs", "Climate", "Labor", "Housing"];

function useDraggableScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    dragged.current = false;
    startX.current = e.pageX - (ref.current?.offsetLeft || 0);
    scrollLeft.current = ref.current?.scrollLeft || 0;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 10) dragged.current = true;
    if (ref.current) {
      ref.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragged.current) {
      e.stopPropagation();
      e.preventDefault();
      dragged.current = false;
    }
  };

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, onClickCapture, className: "no-scrollbar cursor-grab active:cursor-grabbing" };
}

export default function Home() {
  const { user, events, toggleRsvp } = useStore();
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState("All events");
  const [activeType, setActiveType] = useState<"All" | "Event" | "Opportunity">("All");
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const tagsScroll = useDraggableScroll();
  const featuredScroll = useDraggableScroll();

  const filteredEventsForTag = activeTag === "All events" 
    ? events 
    : events.filter(e => e.topic.toLowerCase() === activeTag.toLowerCase() || e.topic === activeTag);

  const filteredEvents = activeType === "All"
    ? filteredEventsForTag
    : filteredEventsForTag.filter(e => e.type === activeType);

  const featuredEvents = events.slice(0, 3);

  const getTagColor = (topic: string) => {
    switch (topic.toLowerCase()) {
      case 'speaker series': return 'bg-[#185346] text-white';
      case 'city council': return 'bg-[#1e4a86] text-white';
      case 'local org': return 'bg-[#7a4b27] text-white';
      case 'climate': return 'bg-[#e5f5f0] text-gray-800';
      case 'labor': return 'bg-[#f8eedb] text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardBg = (index: number) => {
    const bgs = ['bg-[#E6F5EF]', 'bg-[#EBF3FA]', 'bg-[#FDF3E3]'];
    return bgs[index % bgs.length];
  };

  const SidebarIndicator = ({ topic }: { topic: string }) => {
    switch (topic.toLowerCase()) {
      case 'climate': return <div className="w-1.5 self-stretch bg-emerald-600 rounded-l-xl"></div>;
      case 'city council': return <div className="w-1.5 self-stretch bg-blue-500 rounded-l-xl"></div>;
      case 'local org': return <div className="w-1.5 self-stretch bg-pink-500 rounded-l-xl"></div>;
      case 'labor': return <div className="w-1.5 self-stretch bg-yellow-500 rounded-l-xl"></div>;
      case 'speaker series': return <div className="w-1.5 self-stretch bg-purple-500 rounded-l-xl"></div>;
      default: return <div className="w-1.5 self-stretch bg-gray-400 rounded-l-xl"></div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f2ea]">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex justify-between items-center relative z-10 sticky top-0 bg-[#f4f2ea]">
        <div className="font-bold tracking-tight text-xl flex items-center gap-1">
          Civic<span className="text-emerald-600">Pulse</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate("/profile")}
            className="w-[38px] h-[38px] rounded-full bg-[#e5eee9] flex items-center justify-center text-emerald-800 text-xs font-bold leading-none"
          >
            AR
          </button>
          <button 
            onClick={() => setAssistantOpen(true)}
            className="w-[38px] h-[38px] border border-gray-300 rounded-xl flex items-center justify-center text-gray-500 bg-white hover:bg-gray-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 outline-none" fill="currentColor"/>
          </button>
        </div>
      </div>

      <div className="px-5 mt-4">
        <h2 className="text-[17px] text-gray-700 font-medium">Good morning, {user.firstName}</h2>
        <h1 className="text-[28px] font-serif font-bold text-gray-900 leading-tight">What's happening near you</h1>
      </div>

      {/* Tags */}
      <div 
        className={cn("w-full overflow-x-auto select-none", tagsScroll.className)}
        ref={tagsScroll.ref}
        onMouseDown={tagsScroll.onMouseDown}
        onMouseLeave={tagsScroll.onMouseLeave}
        onMouseUp={tagsScroll.onMouseUp}
        onMouseMove={tagsScroll.onMouseMove}
        onClickCapture={tagsScroll.onClickCapture}
      >
        <div className="flex gap-2 px-5 mt-6 pb-1">
          {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={cn(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              activeTag === tag 
                ? "bg-emerald-600 text-white border-emerald-600" 
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            )}
          >
            {tag}
          </button>
        ))}
        </div>
      </div>

      {/* Neighborhood Pulse */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Neighborhood Pulse</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase">1.2k Active</span>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[
            { name: "Maya", status: "Friend", img: "MR", online: true },
            { name: "Jordan", status: "Active", img: "JT", online: true },
            { name: "Alex", status: "Active", img: "AC", online: true },
            { name: "Sarah", status: "New", img: "SJ", online: false },
            { name: "Marcus", status: "Top 10", img: "MT", online: true },
          ].map((neighbor, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative">
                <div className="w-[52px] h-[52px] rounded-full bg-white border-2 border-gray-100 flex items-center justify-center font-bold text-gray-700 shadow-sm overflow-hidden text-sm">
                  {neighbor.img}
                </div>
                {neighbor.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#fcfaf7]" />
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-bold text-gray-900 leading-none">{neighbor.name}</span>
                <span className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-tight">{neighbor.status}</span>
              </div>
            </div>
          ))}
          <button className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-[52px] h-[52px] rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center text-emerald-600">
              <span className="text-xl font-bold">+</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Invite</span>
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mt-8">
        <h3 className="px-5 text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Featured this week</h3>
        <div 
          className={cn("w-full overflow-x-auto select-none", featuredScroll.className)}
          ref={featuredScroll.ref}
          onMouseDown={featuredScroll.onMouseDown}
          onMouseLeave={featuredScroll.onMouseLeave}
          onMouseUp={featuredScroll.onMouseUp}
          onMouseMove={featuredScroll.onMouseMove}
          onClickCapture={featuredScroll.onClickCapture}
        >
          <div className="flex gap-4 px-5 pb-4">
            {featuredEvents.map((evt, idx) => {
            const isRsvpd = user.rsvps.includes(evt.id);
            return (
            <div 
              key={evt.id} 
              className={cn("w-[280px] shrink-0 rounded-2xl flex flex-col border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform", getCardBg(idx))}
              onClick={() => navigate(`/event/${evt.id}`)}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
            >
              <div className="p-4 flex-1">
                <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full inline-block mb-3", getTagColor(evt.topic))}>
                  {evt.topic}
                </span>
                <h4 className="font-medium text-[17px] text-gray-900 leading-tight mb-2">{evt.title}</h4>
                <div className="text-[13px] text-gray-600 mt-auto leading-relaxed">
                  <div>{evt.dateStr.split('·')[0].trim()} · {evt.dateStr.split('·')[1].trim()}</div>
                  <div className="truncate">{evt.location}</div>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between mt-auto bg-white border-t border-gray-100/50">
                <div className="text-[13px] text-gray-500 font-medium pt-3">{evt.attendees + (isRsvpd ? 1 : 0)} going</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleRsvp(evt.id); }}
                  className={cn("px-5 py-1.5 border rounded-lg text-[13px] font-bold transition mt-3", isRsvpd ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-gray-900 border-gray-300")}
                >
                  {isRsvpd ? 'RSVP\'D' : 'RSVP'}
                </button>
              </div>
            </div>
          )})}
          </div>
        </div>
      </div>

      {/* Upcoming Feed */}
      <div className="px-5 mt-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Upcoming Feed</h3>
          <div className="flex bg-gray-200/50 p-1 rounded-lg">
            {(["All", "Event", "Opportunity"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "px-3 py-1 text-[11px] font-bold rounded-md transition-all",
                  activeType === type ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {type === "All" ? "ALL" : type === "Event" ? "EVENTS" : "ROLES"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => (
              <div 
                key={evt.id} 
                onClick={() => navigate(`/event/${evt.id}`)}
                className="bg-white rounded-xl flex border border-gray-200 cursor-pointer hover:border-gray-300 transition active:scale-[0.98] overflow-hidden"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}
              >
                <SidebarIndicator topic={evt.topic} />
                <div className="p-4 flex-1 flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h4 className="font-medium text-[15px] text-gray-900 leading-snug mb-1">{evt.title}</h4>
                    <div className="text-[13px] text-gray-600 mb-0.5">
                      {evt.dateStr} &nbsp;&nbsp; {evt.location}
                    </div>
                    <div className="text-[12px] text-gray-500">
                      {evt.type === 'Event' ? 'Hosted by ' : 'Volunteers for '}{evt.organization} · {evt.attendees} attending
                    </div>
                  </div>
                  <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0", getTagColor(evt.topic))}>
                    {evt.topic}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">No items found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      <AssistantSheet isOpen={isAssistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}
