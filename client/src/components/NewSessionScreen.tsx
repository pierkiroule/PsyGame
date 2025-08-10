import { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { GameFormat, GameStyle, CitationType } from '../types/session';

export const NewSessionScreen = () => {
  const { sessionConfig, updateSessionConfig, navigateToScreen, getPlayerCount } = useSession();
  const [localConfig, setLocalConfig] = useState(sessionConfig);

  const handleFormatChange = (format: GameFormat) => {
    const newConfig = { ...localConfig, format };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleStyleChange = (style: GameStyle) => {
    const newConfig = { ...localConfig, style };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleScoreToggle = (scoreEnabled: boolean) => {
    const newConfig = { ...localConfig, scoreEnabled };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleCitationTypeChange = (citationType: CitationType) => {
    const newConfig = { ...localConfig, citationType };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleConstraintChange = (constraint: string) => {
    const newConfig = { ...localConfig, constraint };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleStartGame = () => {
    navigateToScreen('game');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nouvelle Session</h2>
        <p className="text-gray-600">Configurez votre session créative</p>
      </div>

      <div className="space-y-8">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">Format de jeu</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'solo', label: 'Solo', icon: 'user', desc: '1 joueur' },
              { key: 'duo', label: 'Duo', icon: 'user-friends', desc: '2 joueurs' },
              { key: 'famille', label: 'Famille', icon: 'home', desc: '3-5 joueurs' },
              { key: 'equipe', label: 'Équipe', icon: 'users', desc: '6-10 joueurs' },
            ].map(format => (
              <div key={format.key} className="relative">
                <input
                  type="radio"
                  name="format"
                  value={format.key}
                  className="sr-only peer"
                  checked={localConfig.format === format.key}
                  onChange={() => handleFormatChange(format.key as GameFormat)}
                />
                <label className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                  <i className={`fas fa-${format.icon} text-2xl text-gray-400 mb-2`}></i>
                  <span className="font-medium text-gray-900">{format.label}</span>
                  <span className="text-xs text-gray-500">{format.desc}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">Style de partie</label>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { key: 'libre', label: 'Libre', icon: 'feather', desc: 'Expression créative sans contrainte' },
              { key: 'inspirant', label: 'Inspirant', icon: 'lightbulb', desc: 'Guidé par une citation inspirante' },
              { key: 'defi', label: 'Défi', icon: 'flag', desc: 'Avec une contrainte créative' },
            ].map(style => (
              <div key={style.key} className="relative">
                <input
                  type="radio"
                  name="style"
                  value={style.key}
                  className="sr-only peer"
                  checked={localConfig.style === style.key}
                  onChange={() => handleStyleChange(style.key as GameStyle)}
                />
                <label className="flex flex-col p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-secondary peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all">
                  <i className={`fas fa-${style.icon} text-2xl text-secondary mb-3`}></i>
                  <span className="font-semibold text-gray-900 mb-2">{style.label}</span>
                  <span className="text-sm text-gray-600">{style.desc}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Options for Inspirant Style */}
        {localConfig.style === 'inspirant' && (
          <div className="bg-slate-50 rounded-xl p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-4">Type de citation</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              value={localConfig.citationType || ''}
              onChange={(e) => handleCitationTypeChange(e.target.value as CitationType)}
            >
              <option value="">Choisir un type...</option>
              <option value="poetique">Poétique</option>
              <option value="philosophique">Philosophique</option>
              <option value="humoristique">Humoristique</option>
              <option value="metaphorique">Métaphorique</option>
              <option value="therapeutique">Thérapeutique</option>
            </select>
          </div>
        )}

        {/* Additional Options for Défi Style */}
        {localConfig.style === 'defi' && (
          <div className="bg-slate-50 rounded-xl p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-4">Contrainte créative</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent" 
              rows={3}
              placeholder="Décrivez la contrainte créative à appliquer..."
              value={localConfig.constraint || ''}
              onChange={(e) => handleConstraintChange(e.target.value)}
            />
          </div>
        )}

        {/* Score Toggle */}
        <div className="bg-gradient-to-r from-accent/10 to-orange-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Score Créatif</h3>
              <p className="text-gray-600">Évaluer la créativité et attribuer des badges</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localConfig.scoreEnabled}
                onChange={(e) => handleScoreToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button 
            onClick={handleStartGame}
            className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <i className="fas fa-play mr-2"></i>
            Commencer la Session
          </button>
        </div>
      </div>
    </div>
  );
};
