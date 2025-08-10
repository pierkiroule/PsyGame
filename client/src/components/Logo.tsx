import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 80, className = "" }) => {
  const textSize = size * 0.15;
  const oSize = size * 0.18;
  
  return (
    <div className={`relative ${className}`} style={{ width: size * 1.6, height: size }}>
      {/* Onde résonnante naissant du O */}
      <svg
        width={size * 1.6}
        height={size}
        viewBox="0 0 128 80"
        className="absolute inset-0"
        style={{ left: '0%' }}
      >
        <defs>
          {/* Dégradé pour l'onde principale */}
          <linearGradient id="echoWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
          </linearGradient>
          
          {/* Dégradé radial pour les cercles d'écho */}
          <radialGradient id="oEcho" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        
        {/* Ondes horizontales naissant du O (position 45) */}
        <path
          d="M 15 40 Q 25 25, 35 40 T 55 40 T 75 40 T 95 40 T 115 40"
          stroke="url(#echoWave)"
          strokeWidth="3"
          fill="none"
          className="opacity-90"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="30,0; 10,0; 30,0"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4; 1; 0.4"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Écho 1 - légèrement décalé */}
        <path
          d="M 15 40 Q 25 20, 35 40 T 55 40 T 75 40 T 95 40 T 115 40"
          stroke="url(#echoWave)"
          strokeWidth="2"
          fill="none"
          className="opacity-60"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="30,0; 10,0; 30,0"
            dur="4s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Écho 2 - plus subtil */}
        <path
          d="M 15 40 Q 25 30, 35 40 T 55 40 T 75 40 T 95 40 T 115 40"
          stroke="url(#echoWave)"
          strokeWidth="1.5"
          fill="none"
          className="opacity-40"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="30,0; 10,0; 30,0"
            dur="4s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Contre-onde vers le bas */}
        <path
          d="M 15 40 Q 25 55, 35 40 T 55 40 T 75 40 T 95 40 T 115 40"
          stroke="url(#echoWave)"
          strokeWidth="1"
          fill="none"
          className="opacity-25"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="30,0; 10,0; 30,0"
            dur="4s"
            begin="1.8s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Cercles concentriques d'écho du O (position 45, 40) */}
        <circle
          cx="45"
          cy="40"
          r="6"
          fill="none"
          stroke="url(#oEcho)"
          strokeWidth="0.8"
          className="opacity-70"
        >
          <animate
            attributeName="r"
            values="6; 18; 6"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7; 0.1; 0.7"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle
          cx="45"
          cy="40"
          r="10"
          fill="none"
          stroke="url(#oEcho)"
          strokeWidth="0.5"
          className="opacity-50"
        >
          <animate
            attributeName="r"
            values="10; 25; 10"
            dur="4s"
            begin="0.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5; 0.05; 0.5"
            dur="4s"
            begin="0.8s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle
          cx="45"
          cy="40"
          r="14"
          fill="none"
          stroke="url(#oEcho)"
          strokeWidth="0.3"
          className="opacity-30"
        >
          <animate
            attributeName="r"
            values="14; 35; 14"
            dur="5s"
            begin="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3; 0.02; 0.3"
            dur="5s"
            begin="1.6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      
      {/* Texte "Psychographe" parfaitement superposé */}
      <div 
        className="absolute inset-0 flex items-center justify-start pointer-events-none z-20"
        style={{ paddingLeft: '8px' }}
      >
        <span 
          className="text-slate-100 font-bold tracking-wide leading-none"
          style={{ fontSize: textSize }}
        >
          <span>Psych</span>
          <span className="relative inline-block mx-1">
            {/* Le O source de toutes les ondes */}
            <span 
              className="text-emerald-400 font-black relative z-30" 
              style={{ 
                fontSize: oSize,
                textShadow: '0 0 8px rgba(52, 211, 153, 0.8), 0 0 16px rgba(52, 211, 153, 0.4), 0 0 24px rgba(52, 211, 153, 0.2)'
              }}
            >
              o
            </span>
            
            {/* Écho lumineux du O qui pulse */}
            <span 
              className="absolute inset-0 text-emerald-300 font-black z-20" 
              style={{ 
                fontSize: oSize,
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              o
            </span>
            
            {/* Halo d'expansion du O */}
            <span 
              className="absolute inset-0 text-emerald-200 font-black z-10" 
              style={{ 
                fontSize: oSize * 1.2,
                animation: 'expandO 3s ease-out infinite',
                transformOrigin: 'center'
              }}
            >
              o
            </span>
            
            {/* Écho lointain */}
            <span 
              className="absolute inset-0 text-emerald-100 font-black z-0" 
              style={{ 
                fontSize: oSize * 1.4,
                animation: 'fadeEcho 4s ease-out infinite',
                transformOrigin: 'center'
              }}
            >
              o
            </span>
          </span>
          <span>graphe</span>
        </span>
      </div>
      
      <style>{`
        @keyframes expandO {
          0% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.1; 
          }
          100% { 
            transform: scale(1.3); 
            opacity: 0; 
          }
        }
        
        @keyframes fadeEcho {
          0% { 
            transform: scale(1); 
            opacity: 0.15; 
          }
          70% { 
            transform: scale(1.2); 
            opacity: 0.05; 
          }
          100% { 
            transform: scale(1.5); 
            opacity: 0; 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

// Version compacte pour la navigation
export const LogoCompact: React.FC<LogoProps> = ({ size = 32, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size * 1.2, height: size }}>
      <svg
        width={size * 1.2}
        height={size}
        viewBox="0 0 38 32"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="compactWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Onde compacte naissant du O */}
        <path
          d="M 8 16 Q 12 12, 16 16 T 24 16 T 32 16"
          stroke="url(#compactWave)"
          strokeWidth="1.5"
          fill="none"
          className="opacity-80"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="10,0; 2,0; 10,0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Écho compact */}
        <path
          d="M 8 16 Q 12 20, 16 16 T 24 16 T 32 16"
          stroke="url(#compactWave)"
          strokeWidth="1"
          fill="none"
          className="opacity-50"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="10,0; 2,0; 10,0"
            dur="3s"
            begin="0.8s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Cercle d'écho autour du O */}
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="none"
          stroke="#34d399"
          strokeWidth="0.5"
          className="opacity-60"
        >
          <animate
            attributeName="r"
            values="4; 8; 4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6; 0.1; 0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      
      {/* P stylisé centré */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ paddingLeft: '2px' }}
      >
        <span 
          className="text-emerald-400 font-black"
          style={{ 
            fontSize: size * 0.5,
            textShadow: '0 0 4px rgba(52, 211, 153, 0.6)'
          }}
        >
          P
        </span>
      </div>
    </div>
  );
};