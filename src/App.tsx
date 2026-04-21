/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import OrganizationProfile from "./pages/OrganizationProfile";

// Global wrapper to simulate a mobile frame on desktop
function AppContainer() {
  return (
    <div className="min-h-screen bg-gray-200 md:bg-gray-100 flex justify-center items-center md:py-8">
      {/* The "Phone" Frame */}
      <div className="w-full h-screen md:h-[844px] md:max-w-[390px] bg-white md:rounded-[3rem] md:shadow-2xl md:ring-8 md:ring-gray-900 overflow-hidden relative flex flex-col">
        {/* Mock Status Bar (Desktop only) */}
        <div className="hidden md:flex px-8 pt-4 pb-2 justify-between items-center text-[10px] font-bold text-gray-900 select-none">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-2 rounded-[2px] border border-gray-900"></div>
            <div className="w-3 h-3 rounded-full bg-gray-900"></div>
          </div>
        </div>
        
        {/* App Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <Outlet />
        </div>

        {/* Home Indicator (Desktop only) */}
        <div className="hidden md:flex justify-center pb-2">
          <div className="w-32 h-1 bg-gray-900/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppContainer />}>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin" element={<Admin />} />
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/org/:id" element={<OrganizationProfile />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
