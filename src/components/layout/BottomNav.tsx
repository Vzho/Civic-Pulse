import { NavLink } from "react-router-dom";
import { Home, BarChart2, User } from "lucide-react";
import { cn } from "../../lib/utils";

export default function BottomNav() {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/leaderboard", icon: BarChart2, label: "Leaderboard" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-transparent flex justify-center pointer-events-none">
      <div className="w-full max-w-[430px] bg-white border-t border-gray-200 safe-area-pb flex pointer-events-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium border-r border-gray-100 last:border-r-0 active:scale-[0.95] transition-transform",
                isActive ? "text-emerald-700 bg-emerald-50/50" : "text-gray-500 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn("w-6 h-6 mb-1", isActive ? "stroke-[2.5px]" : "stroke-2")}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
