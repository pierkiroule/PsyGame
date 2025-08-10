import { useSession } from '../contexts/SessionContext';

export const ResultsScreen = () => {
  const { generatedContent, scores, badges, sessionConfig, resetSession, navigateToScreen } = useSession();

  const handleNewSession = () => {
    resetSession();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ma Psychographie - Psychographe',
        text: generatedContent?.text || 'Découvrez mon résultat créatif sur Psychographe',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    
    const content = `PSYCHOGRAPHIE - ${new Date().toLocaleDateString()}

${generatedContent.text}

GUIDE D'ANIMATION:
${generatedContent.guide.map((step, index) => `${index + 1}. ${step}`).join('\n')}

${scores ? `SCORES:
Score Créatif: ${scores.creative}/100
Score Poétique: ${scores.poetic}/100

BADGES: ${badges.map(b => b.name).join(', ')}` : ''}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psychographie-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!generatedContent) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Aucun contenu généré.</p>
        <button
          onClick={() => navigateToScreen('home')}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre Psychographie</h2>
        <p className="text-gray-600">Résultat généré à partir de vos contributions créatives</p>
      </div>

      {/* Generated Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Text Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <i className="fas fa-feather-alt text-2xl text-secondary mr-3"></i>
            <h3 className="text-xl font-bold text-gray-900">Texte Poétique</h3>
          </div>
          <div className="prose prose-lg text-gray-700">
            <div className="whitespace-pre-line leading-relaxed">
              {generatedContent.text}
            </div>
          </div>
        </div>

        {/* Image Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <i className="fas fa-image text-2xl text-secondary mr-3"></i>
            <h3 className="text-xl font-bold text-gray-900">Image Générative</h3>
          </div>
          <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <i className="fas fa-image text-4xl mb-4"></i>
              <p className="text-sm">Image générée par IA</p>
              <p className="text-xs mt-1">{generatedContent.imagePrompt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Guide */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <i className="fas fa-compass text-2xl text-accent mr-3"></i>
          <h3 className="text-xl font-bold text-gray-900">Guide d'Animation</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {generatedContent.guide.map((step, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                {index + 1}. {index === 0 ? 'Présentation' : index === 1 ? 'Exploration' : 'Intégration'}
              </h4>
              <p className="text-gray-600 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scores Section (if enabled) */}


      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleShare}
            className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <i className="fas fa-share mr-2"></i>
            Partager
          </button>
          <button 
            onClick={handleSave}
            className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <i className="fas fa-download mr-2"></i>
            Sauvegarder
          </button>
        </div>
        
        <button 
          onClick={handleNewSession}
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
        >
          <i className="fas fa-plus mr-3"></i>
          Nouvelle Session
        </button>
      </div>
    </div>
  );
};
