import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import BottomNav from "./BottomNav";
import { useStore } from "../../store/useStore";

export default function MainLayout() {
  const { user } = useStore();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const hideBottomNav = location.pathname.startsWith('/event') || location.pathname.startsWith('/org');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar pb-0"
      >
        <Outlet />
      </div>
      
      {/* Fixed Navigation */}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
