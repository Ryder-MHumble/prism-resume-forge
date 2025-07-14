import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Portal } from './pages/Portal';
import { Dashboard } from './pages/Dashboard';
import { Crucible } from './pages/Crucible';
import { Revelation } from './pages/Revelation';

type Page = 'portal' | 'dashboard' | 'crucible' | 'revelation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/portal" />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crucible/:weaknessId?" element={<Crucible />} />
              <Route path="/revelation" element={<Revelation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
