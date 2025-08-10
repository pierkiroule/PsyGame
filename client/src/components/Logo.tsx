import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="absolute inset-0"
      >
        {/* Ondes concentriques avec dégradés */}
        <defs>
          <radialGradient id="waveGradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="waveGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="waveGradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        
        {/* Onde extérieure */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="url(#waveGradient3)"
          stroke="#8b5cf6"
          strokeWidth="0.5"
          opacity="0.6"
        />
        
        {/* Onde moyenne */}
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="url(#waveGradient2)"
          stroke="#3b82f6"
          strokeWidth="0.8"
          opacity="0.7"
        />
        
        {/* Onde intérieure */}
        <circle
          cx="60"
          cy="60"
          r="25"
          fill="url(#waveGradient1)"
          stroke="#10b981"
          strokeWidth="1"
          opacity="0.8"
        />
        
        {/* Point central (centre du "o") */}
        <circle
          cx="60"
          cy="60"
          r="2"
          fill="#10b981"
          opacity="0.9"
        />
      </svg>
      
      {/* Texte Psychographe centré sur l'onde */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ 
          fontSize: size * 0.12, 
          fontWeight: 'bold',
          letterSpacing: '0.02em'
        }}
      >
        <span className="text-slate-100 font-bold tracking-wider">
          {/* Positionnement précis pour centrer le "o" */}
          <span style={{ 
            display: 'inline-block',
            transform: 'translateX(-0.1em)' // Ajustement fin pour centrer le "o"
          }}>
            PSYCH
          </span>
          <span style={{ 
            color: '#10b981',
            textShadow: '0 0 4px rgba(16, 185, 129, 0.5)'
          }}>
            O
          </span>
          <span style={{ 
            display: 'inline-block',
            transform: 'translateX(0.1em)' // Ajustement fin pour l'équilibre
          }}>
            GRAPHE
          </span>
        </span>
      </div>
    </div>
  );
};

// Version compacte pour la navigation
export const LogoCompact: React.FC<LogoProps> = ({ size = 32, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        className="absolute inset-0"
      >
        <defs>
          <radialGradient id="compactGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        
        {/* Onde simplifiée */}
        <circle
          cx="40"
          cy="40"
          r="35"
          fill="url(#compactGradient)"
          stroke="#10b981"
          strokeWidth="1.5"
          opacity="0.8"
        />
        
        <circle
          cx="40"
          cy="40"
          r="20"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Point central avec "P" stylisé */}
        <circle
          cx="40"
          cy="40"
          r="12"
          fill="#10b981"
          opacity="0.9"
        />
        
        <text
          x="40"
          y="45"
          textAnchor="middle"
          className="fill-white font-bold"
          style={{ fontSize: '14px' }}
        >
          P
        </text>
      </svg>
    </div>
  );
};