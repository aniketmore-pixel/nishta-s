import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/dashboard/Home";
import Profile from "./pages/dashboard/Profile";
import LoanEligibility from "./pages/dashboard/LoanEligibility";
import Benefits from "./pages/dashboard/Benefits";
import TrackApplication from "./pages/dashboard/TrackApplication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="eligibility" element={<LoanEligibility />} />
            <Route path="benefits" element={<Benefits />} />
            <Route path="track" element={<TrackApplication />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
