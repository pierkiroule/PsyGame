import { useSession } from '../contexts/SessionContext';

export const HomeScreen = () => {
  const { navigateToScreen } = useSession();

  const handleStartSession = () => {
    navigateToScreen('new-session');
  };

  return (
    <div className="text-center">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <i className="fas fa-palette text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bienvenue sur Psychographe</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Un outil créatif et projectif qui génère, à partir de vos idées, 
            une psychographie unique composée d'un texte poétique, d'une image et d'un guide d'animation.
          </p>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-6">
              <i className="fas fa-users text-primary text-2xl mb-4"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Formats Variés</h3>
              <p className="text-gray-600 text-sm">Solo, Duo, Famille ou Équipe</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <i className="fas fa-magic text-secondary text-2xl mb-4"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Styles Créatifs</h3>
              <p className="text-gray-600 text-sm">Libre, Inspirant ou Défi</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <i className="fas fa-trophy text-accent text-2xl mb-4"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Score Créatif</h3>
              <p className="text-gray-600 text-sm">Évaluation optionnelle</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleStartSession}
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
        >
          <i className="fas fa-play mr-3"></i>
          Créer une Session
        </button>
      </div>
    </div>
  );
};
