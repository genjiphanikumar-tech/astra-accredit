import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import DataSources from "./pages/DataSources";
import CriteriaTracker from "./pages/CriteriaTracker";
import GapAnalysis from "./pages/GapAnalysis";
import SARGenerator from "./pages/SARGenerator";
import TaskManagement from "./pages/TaskManagement";
import Countdown from "./pages/Countdown";
import ReportsArchive from "./pages/ReportsArchive";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/criteria" element={<CriteriaTracker />} />
            <Route path="/gap-analysis" element={<GapAnalysis />} />
            <Route path="/sar-generator" element={<SARGenerator />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="/reports" element={<ReportsArchive />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
