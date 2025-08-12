import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import "./index.css";

import NotFound from "./pages/not-found";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MinimalApp from "./pages/minimal-app";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Component principal avec routing simplifié
const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
          <p className="text-slate-400">Chargement de votre studio psychographique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/" component={MinimalApp} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;