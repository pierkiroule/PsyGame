import { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { PlayerInput } from '../types/session';

export const GameScreen = () => {
  const { sessionConfig, updatePlayerInputs, generateResults, getPlayerCount } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Initialiser les inputs directement avec le bon nombre
  const [inputs, setInputs] = useState<PlayerInput[]>(() => {
    const playerCount = getPlayerCount();
    return Array.from({ length: playerCount }, () => ({
      name: '',
      contribution: '',
      keywords: '',
    }));
  });

  useEffect(() => {
    const playerCount = getPlayerCount();
    
    // Préserver les données existantes si possible
    setInputs(currentInputs => {
      if (currentInputs.length === playerCount) {
        return currentInputs; // Pas de changement nécessaire
      }
      
      // Ajuster le nombre d'inputs
      if (currentInputs.length < playerCount) {
        // Ajouter des inputs vides
        const newInputs = [...currentInputs];
        for (let i = currentInputs.length; i < playerCount; i++) {
          newInputs.push({ name: '', contribution: '', keywords: '' });
        }
        return newInputs;
      } else {
        // Réduire le nombre d'inputs
        return currentInputs.slice(0, playerCount);
      }
    });
  }, [sessionConfig.format, getPlayerCount]);

  const updateInput = (index: number, field: keyof PlayerInput, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setInputs(newInputs);
    updatePlayerInputs(newInputs);
  };

  const handleGenerate = async () => {
    // Validate that at least one contribution is provided
    const hasValidInput = inputs.some(input => input.contribution.trim().length > 0);
    if (!hasValidInput) {
      alert('Veuillez fournir au moins une contribution créative.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      generateResults();
      setIsGenerating(false);
    }, 2000);
  };

  const getFormatLabel = () => {
    switch (sessionConfig.format) {
      case 'solo': return 'Solo';
      case 'duo': return 'Duo';
      case 'famille': return 'Famille';
      case 'equipe': return 'Équipe';
      default: return 'Solo';
    }
  };

  const getStyleLabel = () => {
    switch (sessionConfig.style) {
      case 'libre': return 'Libre';
      case 'inspirant': return 'Inspirant';
      case 'defi': return 'Défi';
      default: return 'Libre';
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse">
          <i className="fas fa-magic text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Génération en cours...</h2>
        <p className="text-gray-600 mb-6">L'IA créative analyse vos contributions pour générer votre psychographie unique.</p>
        <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto">
          <div className="h-2 bg-gradient-to-r from-secondary to-purple-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Session en Cours</h2>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
            Format: {getFormatLabel()}
          </span>
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">
            Style: {getStyleLabel()}
          </span>
          <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">
            Score: {sessionConfig.scoreEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Player Inputs */}
      <div className="space-y-6 mb-8">
        {inputs.map((input, index) => (
          <div key={index} className="bg-slate-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                {index + 1}
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Joueur {index + 1}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom (optionnel)
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Votre nom..."
                  value={input.name}
                  onChange={(e) => updateInput(index, 'name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre contribution créative *
                </label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder="Partagez vos idées, émotions, images mentales..."
                  value={input.contribution}
                  onChange={(e) => updateInput(index, 'contribution', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés (séparés par des virgules)
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="rêve, océan, liberté..."
                  value={input.keywords}
                  onChange={(e) => updateInput(index, 'keywords', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-r from-secondary to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-magic mr-3"></i>
          Générer la Psychographie
        </button>
      </div>
    </div>
  );
};
