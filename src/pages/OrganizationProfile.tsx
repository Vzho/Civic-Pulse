import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import { ChevronLeft, Globe, Mail, MapPin, CheckCircle2, ShieldCheck, Users, Calendar, ExternalLink } from "lucide-react";

export default function OrganizationProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizations, events } = useStore();

  const org = organizations.find(o => o.id === id);
  const orgEvents = events.filter(e => e.orgId === id);

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ea]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Organization not found</h2>
          <button onClick={() => navigate(-1)} className="text-emerald-600 font-medium">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ea] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-[#189F6B] text-white pt-10 pb-20 px-6 relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-10 left-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500/50 px-2 py-0.5 rounded border border-emerald-400">
              {org.category}
            </span>
            {org.verified && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            )}
          </div>
          <h1 className="text-3xl font-serif font-bold leading-tight">{org.name}</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6">
          <div className="p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed italic">
              "{org.mission}"
            </p>
          </div>
          
          <div className="grid grid-cols-2 divide-x border-t border-gray-50 bg-gray-50/50 text-center">
            <div className="p-4">
              <div className="text-xl font-bold text-gray-900">{org.stats.eventsHosted}</div>
              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Events Hosted</div>
            </div>
            <div className="p-4">
              <div className="text-xl font-bold text-gray-900">{org.stats.volunteersEngaged.toLocaleString()}</div>
              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Neighbors Engaged</div>
            </div>
          </div>
        </div>

        {/* Credibility & Trust Section */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-emerald-900">Credibility Pulse</h3>
            </div>
            <div className="bg-white px-3 py-1 rounded-full border border-emerald-200">
              <span className="text-emerald-700 font-bold">{org.credibilityScore}%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-200/50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              </div>
              <p className="text-[13px] text-emerald-800 leading-snug">
                Transparent data reporting for the last 12 months.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-200/50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              </div>
              <p className="text-[13px] text-emerald-800 leading-snug">
                Active community involvement in {org.category} policy.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-10">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Connect with us</h3>
          <div className="grid grid-cols-1 gap-3">
            <a href={org.contact.website} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-gray-400 font-bold uppercase">Website</div>
                <div className="text-sm font-medium text-gray-900 truncate">{org.contact.website.replace('https://', '')}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-gray-400 font-bold uppercase">Email</div>
                <div className="text-sm font-medium text-gray-900">{org.contact.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-gray-400 font-bold uppercase">Office</div>
                <div className="text-sm font-medium text-gray-900">{org.contact.address}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Opportunities */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Active Roles & Events</h3>
          <div className="space-y-3">
            {orgEvents.map(event => (
              <motion.div 
                key={event.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/event/${event.id}`)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  event.type === 'Opportunity' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                )}>
                  {event.type === 'Opportunity' ? <Users className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-0.5">{event.type}</div>
                  <h4 className="font-bold text-gray-900 truncate">{event.title}</h4>
                  <div className="text-[11px] text-gray-500 mt-0.5">{event.dateStr}</div>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
