import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/CommandPalette";
import { BackToTop } from "@/components/BackToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingState } from "@/components/states/LoadingState";
import HomePage from "./pages/HomePage";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const GenericTownOverview = lazy(() => import("./pages/GenericTownOverview"));
const GenericTownZoning = lazy(() => import("./pages/GenericTownZoning"));
const GenericTownPermits = lazy(() => import("./pages/GenericTownPermits"));
const GenericTownOrdinances = lazy(() => import("./pages/GenericTownOrdinances"));
const GenericTownContacts = lazy(() => import("./pages/GenericTownContacts"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const QueryResults = lazy(() => import("./pages/QueryResults"));
const ChecklistPage = lazy(() => import("./pages/ChecklistPage"));
const ContractorDashboard = lazy(() => import("./pages/ContractorDashboard"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const GuidesPage = lazy(() => import("./pages/GuidesPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const FeasibilityCheck = lazy(() => import("./pages/FeasibilityCheck"));
const GlossaryPage = lazy(() => import("./pages/GlossaryPage"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminDataReview = lazy(() => import("./pages/AdminDataReview"));
const AdminSources = lazy(() => import("./pages/AdminSources"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
          <Suspense fallback={<LoadingState fill size="lg" />}>
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
              <Route path="/admin/sources" element={<ProtectedRoute><AdminSources /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
