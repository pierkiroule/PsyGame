import { useSession } from '../contexts/SessionContext';

export const Header = () => {
  const { currentScreen } = useSession();

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return 'Accueil';
      case 'new-session': return 'Configuration';
      case 'game': return 'Session';
      case 'results': return 'Résultats';
      default: return 'Accueil';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Psychographe</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {getScreenTitle()}
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
};
