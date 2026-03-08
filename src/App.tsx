import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import DataSources from "./pages/DataSources";
import CriteriaTracker from "./pages/CriteriaTracker";
import GapAnalysis from "./pages/GapAnalysis";
import SARGenerator from "./pages/SARGenerator";
import TaskManagement from "./pages/TaskManagement";
import Countdown from "./pages/Countdown";
import ReportsArchive from "./pages/ReportsArchive";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import ChatWidget from "./components/chat/ChatWidget";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/data-sources" element={<ProtectedRoute><DataSources /></ProtectedRoute>} />
              <Route path="/criteria" element={<ProtectedRoute><CriteriaTracker /></ProtectedRoute>} />
              <Route path="/gap-analysis" element={<ProtectedRoute><GapAnalysis /></ProtectedRoute>} />
              <Route path="/sar-generator" element={<ProtectedRoute><SARGenerator /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TaskManagement /></ProtectedRoute>} />
              <Route path="/countdown" element={<ProtectedRoute><Countdown /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportsArchive /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          <ChatWidget />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
