import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/CommandPalette";
import { BackToTop } from "@/components/BackToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import GenericTownOverview from "./pages/GenericTownOverview";
import GenericTownZoning from "./pages/GenericTownZoning";
import GenericTownPermits from "./pages/GenericTownPermits";
import GenericTownOrdinances from "./pages/GenericTownOrdinances";
import GenericTownContacts from "./pages/GenericTownContacts";
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
import ProjectDetail from "./pages/ProjectDetail";
import TermsPage from "./pages/TermsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDataReview from "./pages/AdminDataReview";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CommandPalette />
          <BackToTop />
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/town/:slug" element={<GenericTownOverview />} />
          <Route path="/town/:slug/zoning" element={<GenericTownZoning />} />
          <Route path="/town/:slug/permits" element={<GenericTownPermits />} />
          <Route path="/town/:slug/ordinances" element={<GenericTownOrdinances />} />
          <Route path="/town/:slug/contacts" element={<GenericTownContacts />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/query" element={<QueryResults />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/contractor" element={<ProtectedRoute><ContractorDashboard /></ProtectedRoute>} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feasibility" element={<FeasibilityCheck />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/data-review" element={<ProtectedRoute><AdminDataReview /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
