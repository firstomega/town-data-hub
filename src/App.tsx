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
import TownOrdinances from "./pages/TownOrdinances";
import TownContacts from "./pages/TownContacts";
import ParamusOverview from "./pages/ParamusOverview";
import ParamusZoning from "./pages/ParamusZoning";
import ParamusPermits from "./pages/ParamusPermits";
import ParamusOrdinances from "./pages/ParamusOrdinances";
import ParamusContacts from "./pages/ParamusContacts";
import ComparisonPage from "./pages/ComparisonPage";
import QueryResults from "./pages/QueryResults";
import ChecklistPage from "./pages/ChecklistPage";
import ContractorDashboard from "./pages/ContractorDashboard";
import PricingPage from "./pages/PricingPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SettingsPage from "./pages/SettingsPage";
import GuidesPage from "./pages/GuidesPage";
import GuidePage from "./pages/GuidePage";
import AboutPage from "./pages/AboutPage";
import FeasibilityCheck from "./pages/FeasibilityCheck";
import GlossaryPage from "./pages/GlossaryPage";
import TownStubPage from "./pages/TownStubPage";
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
          <Route path="/town/ridgewood/ordinances" element={<TownOrdinances />} />
          <Route path="/town/ridgewood/contacts" element={<TownContacts />} />
          <Route path="/town/paramus" element={<ParamusOverview />} />
          <Route path="/town/paramus/zoning" element={<ParamusZoning />} />
          <Route path="/town/paramus/permits" element={<ParamusPermits />} />
          <Route path="/town/paramus/ordinances" element={<ParamusOrdinances />} />
          <Route path="/town/paramus/contacts" element={<ParamusContacts />} />
          <Route path="/town/:slug" element={<TownStubPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/query" element={<QueryResults />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/contractor" element={<ContractorDashboard />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feasibility" element={<FeasibilityCheck />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
