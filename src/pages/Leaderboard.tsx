import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";

const TIME_FILTERS = ["Today", "This week", "All time"];
const AREA_FILTERS = ["Berkeley", "Oakland", "Fremont", "All areas"];

const mockLeaderboard = [
  { id: '1', name: "Maya R.", init: "MR", pts: 1240, events: 12, rank: 1, isMe: false },
  { id: '2', name: "Jordan T.", init: "JT", pts: 1180, events: 10, rank: 2, isMe: false },
  { id: '3', name: "", init: "AR", pts: 1115, events: 8, rank: 3, isMe: true },
  { id: '4', name: "StarSpangledChic", init: "SC", pts: 890, events: 4, rank: 4, isMe: false },
  { id: '5', name: "BigAppleExplorer", init: "BA", pts: 720, events: 3, rank: 5, isMe: false },
  { id: '6', name: "LoneStarRider", init: "LS", pts: 650, events: 2, rank: 6, isMe: false },
  { id: '7', name: "LibertyLover88", init: "LL", pts: 540, events: 2, rank: 7, isMe: false },
  { id: '8', name: "BerkeleyBlaze", init: "BB", pts: 420, events: 2, rank: 8, isMe: false },
];

export default function Leaderboard() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [activeTime, setActiveTime] = useState("Today");
  const [activeArea, setActiveArea] = useState("Berkeley");

  const displayLeaderboard = useMemo(() => {
    const timeMultiplier = activeTime === "Today" ? 1 : activeTime === "This week" ? 4.5 : 24.5;
    const areaSeed = activeArea.charCodeAt(0) + activeArea.length;
    
    let list = mockLeaderboard.map((u) => {
      // Generate some deterministic variation based on the filters
      const pseudoRand = ((parseInt(u.id) * areaSeed) % 10) / 10 + 0.5; // 0.5 to 1.4
      let pts = Math.floor(u.pts * timeMultiplier * pseudoRand);
      let init = u.init;
      
      if (u.isMe) {
        // Sync "me" with actual user points, but scaled by time filter
        pts = Math.floor(user.points * timeMultiplier * (activeArea === "Berkeley" || activeArea === "All areas" ? 1 : 0.6));
        init = `${user.firstName.charAt(0) || ''}${user.lastName.charAt(0) || ''}`;
      }
      
      return { ...u, pts, init };
    });

    list.sort((a, b) => b.pts - a.pts);
    return list.map((u, i) => ({ ...u, rank: i + 1, name: u.isMe ? "You" : u.name, avatar: u.isMe ? user.avatar : undefined }));
  }, [activeTime, activeArea, user.points, user.firstName, user.lastName, user.avatar]);

  const topThree = displayLeaderboard.slice(0, 3);
  const theRest = displayLeaderboard.slice(3);
  const meEntry = displayLeaderboard.find(u => u.isMe);
  const myRank = meEntry?.rank || "253";
  const myPoints = meEntry?.pts || user.points;

  return (
    <div className="flex flex-col h-full bg-[#f4f2ea] overflow-hidden relative">
      <div className="px-5 pt-8 pb-4 text-center border-b border-gray-100 bg-[#f4f2ea] shrink-0">
        <h1 className="text-xl font-serif font-bold text-gray-900">Leaderboard</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 bg-[#f4f2ea] space-y-4">
          {/* Time Filters */}
          <div className="flex gap-2">
            {TIME_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveTime(f)}
                className={cn(
                  "flex-1 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  activeTime === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Area Filters */}
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-2 pb-1">
              {AREA_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveArea(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-medium border transition-colors whitespace-nowrap",
                    activeArea === f ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-gray-500 border-gray-200"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="px-5 py-8 flex justify-center items-end gap-3 bg-[#f4f2ea] mt-2">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2 border overflow-hidden", topThree[1]?.isMe ? "bg-emerald-50 text-emerald-600 border-emerald-500" : "bg-blue-50 text-blue-500 border-blue-100")}>
              {topThree[1]?.avatar ? <img src={topThree[1].avatar} className="w-full h-full object-cover" alt="" /> : topThree[1]?.init}
            </div>
            <div className={cn("text-xs font-bold", topThree[1]?.isMe ? "text-emerald-700" : "text-gray-900")}>{topThree[1]?.name}</div>
            <div className="text-[10px] text-gray-500 mb-2">{topThree[1]?.pts.toLocaleString()} pts</div>
            <div className="w-[85px] h-[70px] bg-[#53C594] rounded-t-lg flex items-center justify-center text-white font-bold text-2xl">2</div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1 flex items-center justify-center motion-safe:animate-bounce">👑</div>
            <div className={cn("w-[68px] h-[68px] rounded-full flex items-center justify-center font-bold text-2xl mb-2 border-2 relative overflow-hidden", topThree[0]?.isMe ? "bg-emerald-50 text-emerald-600 border-emerald-500" : "bg-orange-50 text-orange-600 border-orange-200")}>
              {topThree[0]?.avatar ? <img src={topThree[0].avatar} className="w-full h-full object-cover" alt="" /> : topThree[0]?.init}
            </div>
            <div className={cn("text-xs font-bold", topThree[0]?.isMe ? "text-emerald-700" : "text-gray-900")}>{topThree[0]?.name}</div>
            <div className="text-[10px] text-gray-500 mb-2">{topThree[0]?.pts.toLocaleString()} pts</div>
            <div className="w-24 h-[100px] bg-[#F4A836] rounded-t-lg flex items-center justify-center text-white font-bold text-3xl">1</div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2 border overflow-hidden", topThree[2]?.isMe ? "bg-emerald-50 text-emerald-600 border-emerald-500" : "bg-purple-50 text-purple-600 border-purple-100")}>
              {topThree[2]?.avatar ? <img src={topThree[2].avatar} className="w-full h-full object-cover" alt="" /> : topThree[2]?.init}
            </div>
            <div className={cn("text-xs font-bold", topThree[2]?.isMe ? "text-emerald-700" : "text-gray-900")}>{topThree[2]?.name}</div>
            <div className="text-[10px] text-gray-500 mb-2">{topThree[2]?.pts.toLocaleString()} pts</div>
            <div className="w-[85px] h-[55px] bg-[#3B82F6] rounded-t-lg flex items-center justify-center text-white font-bold text-2xl">3</div>
          </div>
        </div>

        {/* List */}
        <div className="bg-[#f4f2ea] px-4 pt-4 pb-32">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            <span>Rank</span>
            <span>Points</span>
          </div>
          
          <div className="space-y-2 relative">
            {theRest.map(u => (
              <div key={u.id} className={cn("bg-white p-3 rounded-xl flex items-center border shadow-sm transition-all duration-300", u.isMe ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20" : "border-gray-100")}>
                <span className="w-6 text-center text-sm font-bold text-gray-400">{u.rank}</span>
                <div className={cn("w-10 h-10 rounded-full font-bold flex items-center justify-center ml-3 mr-3 text-sm overflow-hidden", u.isMe ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-600")}>
                  {u.avatar ? <img src={u.avatar} className="object-cover w-full h-full" alt="" /> : u.init}
                </div>
                <div className="flex-1">
                  <div className={cn("font-bold text-sm", u.isMe ? "text-emerald-800" : "text-gray-900")}>{u.name}</div>
                  <div className="flex gap-1 mt-0.5">
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded">{u.events} events</span>
                    {u.rank % 2 === 0 && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded">council</span>}
                  </div>
                </div>
                <div className={cn("font-bold text-[15px]", u.isMe ? "text-emerald-600" : "text-gray-900")}>
                  {u.pts.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Me Bar */}
      <div className="absolute bottom-4 left-0 right-0 px-4 z-20">
        <button 
          onClick={() => navigate('/profile')}
          className="w-full bg-emerald-600 rounded-xl p-3 flex items-center text-white shadow-lg hover:bg-emerald-700 transition-colors"
        >
          <div className="text-lg font-bold w-10 text-center">{myRank}</div>
          <div className="flex-1 ml-2 text-left">
            <div className="font-bold">🔥 You — {user.firstName} {user.lastName.charAt(0)}.</div>
            <div className="text-emerald-100 text-[11px]">+120 pts today</div>
          </div>
          <div className="font-bold text-lg mr-3">{myPoints.toLocaleString()}</div>
          <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs shrink-0">▶</div>
        </button>
      </div>
    </div>
  );
}
