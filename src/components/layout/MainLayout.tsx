import { Outlet, Navigate, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useStore } from "../../store/useStore";

export default function MainLayout() {
  const { user } = useStore();
  const location = useLocation();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-[100dvh] bg-[#E5E5E5] text-gray-900 font-sans flex justify-center w-full">
      <div className="w-full max-w-[430px] bg-white min-h-[100dvh] relative shadow-md overflow-x-hidden flex flex-col pb-[68px]">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}
