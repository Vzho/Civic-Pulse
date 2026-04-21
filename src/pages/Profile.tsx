import { useState } from "react";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";
import ChallengeSheet from "../components/ui/ChallengeSheet";
import EditProfileSheet from "../components/ui/EditProfileSheet";

type Tab = "Overview" | "Records" | "Friends";

export default function Profile() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  const friends = [
    { id: '1', name: "Maya R.", pts: 1240, rank: 1, init: "MR" },
    { id: '2', name: "Jordan T.", pts: 1180, rank: 2, init: "JT" },
    { id: '4', name: "StarSpangledChic", pts: 135786, rank: 4, init: "SC" },
    { id: '5', name: "BigAppleExplorer", pts: 25796, rank: 5, init: "BA" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfaf7] overflow-x-hidden pb-16">
      
      {/* Header Profile Info */}
      <div className="bg-[#189F6B] text-white pt-10 pb-4 px-6 rounded-b-[2rem] relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-center">
            <div className="w-[68px] h-[68px] bg-white rounded-full flex items-center justify-center text-[#189F6B] text-2xl font-bold relative shadow-sm overflow-hidden border-2 border-white">
              {user.avatar ? (
                <img src={user.avatar} className="object-cover w-full h-full" alt="Avatar" />
              ) : (
                initials
              )}
              <button 
                onClick={() => setIsEditingProfile(true)} 
                className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-90 transition-transform"
              >
                <span className="text-[10px]">✏️</span>
              </button>
            </div>
            <div>
              <h1 className="text-[22px] font-serif font-bold leading-tight">{user.firstName} {user.lastName}</h1>
              <p className="text-emerald-100 text-[13px] mt-0.5">Berkeley · Joined Jan 2026</p>
            </div>
          </div>
          <div className="bg-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400">
            Lv 4
          </div>
        </div>

        <div className="flex gap-6 mt-2 mb-2 font-medium">
          <div>
            <div className="text-[20px] font-bold leading-none">253</div>
            <div className="text-emerald-100 text-[11px] mt-1">Rank</div>
          </div>
          <div>
            <div className="text-[20px] font-bold leading-none">{user.points.toLocaleString()}</div>
            <div className="text-emerald-100 text-[11px] mt-1">Points</div>
          </div>
          <div>
            <div className="text-[20px] font-bold leading-none">41</div>
            <div className="text-emerald-100 text-[11px] mt-1">Events</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 mt-2">
        {(["Overview", "Records", "Friends"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-4 text-[14px] font-medium border-b-2 transition-colors",
              activeTab === tab ? "border-[#189F6B] text-[#189F6B]" : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 flex-1">
        
        {activeTab === "Overview" && (
          <div className="transition-opacity duration-300">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Activity & Status</h3>
            <div className="space-y-3 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center shadow-sm">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-4 ring-4 ring-emerald-50"></div>
                <div className="flex-1 font-medium text-[15px] text-gray-900">Active now</div>
                <span className="text-emerald-600 text-[13px] font-medium">Active</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center shadow-sm">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                </div>
                <div className="flex-1 font-medium text-[15px] text-gray-900">Last action</div>
                <span className="text-gray-500 text-[13px]">Joined cleanup · 2h ago</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Current Challenges</h3>
            <div className="space-y-3 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-3 shrink-0">📍</div>
                <div className="flex-1">
                  <div className="font-medium text-[15px] text-gray-900">Attend 1 city meeting</div>
                  <div className="text-xs text-gray-500 mt-0.5">0 / 1 completed</div>
                </div>
                <span className="text-emerald-600 font-medium text-sm">+50 pts</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mr-3 shrink-0">👥</div>
                <div className="flex-1">
                  <div className="font-medium text-[15px] text-gray-900">Invite 1 friend</div>
                  <div className="text-xs text-gray-500 mt-0.5">0 / 1 completed</div>
                </div>
                <span className="text-emerald-600 font-medium text-sm">+30 pts</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mr-3 shrink-0">📝</div>
                <div className="flex-1">
                  <div className="font-medium text-[15px] text-gray-900">Comment on 2 local bills</div>
                  <div className="text-xs text-gray-500 mt-0.5">1 / 2 completed</div>
                </div>
                <span className="text-emerald-600 font-medium text-sm">+40 pts</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Badges Earned</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {[
                { name: 'First event', icon: '⭐', color: 'bg-emerald-50 text-emerald-600' },
                { name: 'Civic streak', icon: '🔥', color: 'bg-orange-50 text-orange-500' },
                { name: 'Connector', icon: '💬', color: 'bg-blue-50 text-blue-500' },
                { name: 'Top 100', icon: '🏆', color: 'bg-gray-50 text-gray-400' },
              ].map(b => (
                <div key={b.name} className="w-[88px] h-[92px] bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center shadow-sm shrink-0">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2", b.color)}>
                    {b.icon}
                  </div>
                  <div className="text-[11px] font-medium text-gray-600 px-1 text-center leading-tight">{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Records" && (
          <div className="transition-opacity duration-300">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Stats</h3>
             <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                 <div className="text-2xl font-bold text-gray-900 mb-1">41</div>
                 <div className="text-[13px] text-gray-600">Events attended</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                 <div className="text-2xl font-bold text-gray-900 mb-1">5,356</div>
                 <div className="text-[13px] text-gray-600">Total points</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                 <div className="text-xl font-bold text-gray-900 mb-1">12</div>
                 <div className="text-[13px] text-gray-600">Council meetings</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                 <div className="text-xl font-bold text-gray-900 mb-1">8</div>
                 <div className="text-[13px] text-gray-600">Speaker series</div>
               </div>
             </div>

             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Topic Breakdown</h3>
             <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700">Climate</span><span className="text-gray-500">18 events</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '65%'}}></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700">City council</span><span className="text-gray-500">12 events</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{width: '45%'}}></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700">Labor & wages</span><span className="text-gray-500">7 events</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400 rounded-full" style={{width: '25%'}}></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700">Housing</span><span className="text-gray-500">4 events</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-pink-500 rounded-full" style={{width: '15%'}}></div></div>
               </div>
             </div>
          </div>
        )}

        {activeTab === "Friends" && (
          <div className="transition-opacity duration-300">
            <button 
              onClick={() => setChallengeTarget("All Friends")}
              className="w-full py-4 bg-white border border-gray-200 rounded-xl font-medium text-gray-900 shadow-sm mb-6 flex items-center justify-center gap-2"
            >
              <span className="text-gray-400">⚡</span> Challenge all friends
            </button>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Friends</h3>
            <div className="space-y-3">
              {friends.map(f => (
                <div key={f.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 font-bold flex items-center justify-center mr-3 border border-orange-100">
                      {f.init}
                    </div>
                    <div>
                      <div className="font-bold text-[15px] text-gray-900">{f.name}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5">{f.pts.toLocaleString()} pts · Rank #{f.rank}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setChallengeTarget(f.name)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <ChallengeSheet 
        isOpen={!!challengeTarget} 
        onClose={() => setChallengeTarget(null)}
        friendName={challengeTarget || ""} 
      />

      <EditProfileSheet 
        isOpen={isEditingProfile} 
        onClose={() => setIsEditingProfile(false)} 
      />
    </div>
  );
}
