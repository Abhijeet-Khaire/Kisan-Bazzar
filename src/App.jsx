import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStateProvider } from "@/context/GlobalState";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

import NotFound from "./pages/NotFound";
import BuyerMarketplace from "./pages/buyer/Marketplace";
import FarmerDashboard from "./pages/farmer/Dashboard";
import AddCrop from "./pages/farmer/AddCrop";
import PriceAnalytics from "./pages/farmer/PriceAnalytics";
import PaymentHistory from "./pages/farmer/PaymentHistory";
import CropDetails from "./pages/farmer/CropDetails";
import Logistics from "./pages/Logistics";
import Storage from "./pages/Storage";
import Pricing from "./pages/Pricing";
import HelpCenter from "./pages/HelpCenter";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Training from "./pages/Training";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GlobalStateProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/buyer/marketplace" element={<BuyerMarketplace />} />
                <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                <Route path="/farmer/add-crop" element={<AddCrop />} />
                <Route path="/farmer/analytics" element={<PriceAnalytics />} />
                <Route path="/farmer/payments" element={<PaymentHistory />} />
                <Route path="/farmer/crop/:id" element={<CropDetails />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/storage" element={<Storage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/training" element={<Training />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </GlobalStateProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
