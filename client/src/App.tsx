import { SessionProvider, useSession } from './contexts/SessionContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { NewSessionScreen } from './components/NewSessionScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';

const AppContent = () => {
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
    <div className="min-h-full">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {renderCurrentScreen()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}

export default App;
