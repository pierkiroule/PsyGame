import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, useLocation } from "wouter";
import "./index.css";

import NotFound from "./pages/not-found";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MinimalProfile from "./pages/minimal-profile";
import Profile from "./pages/profile";
import MinimalPsychotheque from "./pages/minimal-psychotheque";
import MinimalHome from "./pages/minimal-home";
import { SessionProvider, useSession } from './contexts/SessionContext';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { MinimalHeader } from './components/MinimalHeader';
import { HomeScreen } from './components/HomeScreen';
import { NewSessionScreen } from './components/NewSessionScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { PageTransition } from './components/PageTransition';
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Component pour gérer les écrans de l'application authentifiée
const AuthenticatedApp = () => {
  const { currentScreen } = useSession();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'new-session':
        return <NewSessionScreen />;
      case 'game':
        return <GameScreen />;
      case 'results':
        return <ResultsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {renderCurrentScreen()}
    </main>
  );
};

// Component principal avec routing et transitions
const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <MinimalHeader />
      <PageTransition trigger={location}>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/psychotheque">
            <MinimalPsychotheque />
          </Route>
          <Route path="/">
            {user ? (
              <SessionProvider>
                <AuthenticatedApp />
              </SessionProvider>
            ) : (
              <MinimalHome />
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
