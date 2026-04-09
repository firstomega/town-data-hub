import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import TownOverview from "./pages/TownOverview";
import TownZoning from "./pages/TownZoning";
import TownPermits from "./pages/TownPermits";
import ComparisonPage from "./pages/ComparisonPage";
import QueryResults from "./pages/QueryResults";
import ChecklistPage from "./pages/ChecklistPage";
import ContractorDashboard from "./pages/ContractorDashboard";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/town/ridgewood" element={<TownOverview />} />
          <Route path="/town/ridgewood/zoning" element={<TownZoning />} />
          <Route path="/town/ridgewood/permits" element={<TownPermits />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/query" element={<QueryResults />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/contractor" element={<ContractorDashboard />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
