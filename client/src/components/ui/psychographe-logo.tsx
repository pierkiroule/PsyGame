import React from 'react';

interface PsychographeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

export const PsychographeLogo: React.FC<PsychographeLogoProps> = ({ 
  className = '', 
  size = 'md',
  animate = true 
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
    xl: 'w-64 h-64'
  };

  // Wave center coordinates in the 200x200 viewBox - aligned with O letter center
  const waveCenterX = 100;
  const waveCenterY = 100;
  
  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Définition des gradients adaptés au thème sombre */}
        <defs>
          <linearGradient id="echoWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="oEcho" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Cercles d'onde de résonance centrés sur le point d'onde */}
        {animate && (
          <>
            <circle
              cx={waveCenterX}
              cy={waveCenterY}
              r="12"
              fill="none"
              stroke="url(#oEcho)"
              strokeWidth="1.8"
              strokeOpacity="0.8"
            >
              <animate
                attributeName="r"
                values="12;30;12"
                dur="3s"
                repeatCount="indefinite"
                begin="0s"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.8;0.1;0.8"
                dur="3s"
                repeatCount="indefinite"
                begin="0s"
              />
            </circle>
            
            <circle
              cx={waveCenterX}
              cy={waveCenterY}
              r="18"
              fill="none"
              stroke="url(#oEcho)"
              strokeWidth="1.2"
              strokeOpacity="0.6"
            >
              <animate
                attributeName="r"
                values="18;42;18"
                dur="4s"
                repeatCount="indefinite"
                begin="0.8s"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.6;0.05;0.6"
                dur="4s"
                repeatCount="indefinite"
                begin="0.8s"
              />
            </circle>

            <circle
              cx={waveCenterX}
              cy={waveCenterY}
              r="24"
              fill="none"
              stroke="url(#oEcho)"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            >
              <animate
                attributeName="r"
                values="24;60;24"
                dur="5s"
                repeatCount="indefinite"
                begin="1.6s"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.4;0.02;0.4"
                dur="5s"
                repeatCount="indefinite"
                begin="1.6s"
              />
            </circle>
          </>
        )}

        {/* Ondes horizontales partant du centre */}
        {animate && (
          <>
            <path
              d={`M 30 ${waveCenterY} Q 50 80, 70 ${waveCenterY} T 130 ${waveCenterY} T 170 ${waveCenterY}`}
              stroke="url(#echoWave)"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="70,0; 30,0; 70,0"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d={`M 30 ${waveCenterY} Q 50 120, 70 ${waveCenterY} T 130 ${waveCenterY} T 170 ${waveCenterY}`}
              stroke="url(#echoWave)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="70,0; 30,0; 70,0"
                dur="4s"
                begin="0.6s"
                repeatCount="indefinite"
              />
            </path>
          </>
        )}
      </svg>

      {/* Texte PSYCHOGRAPHE superposé et centré */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div className="relative flex items-center">
          {/* PSYCH */}
          <span
            className="text-slate-100 font-bold select-none"
            style={{ 
              fontSize: '14px', 
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            PSYCH
          </span>

          {/* O - Positionné précisément au centre de l'onde */}
          <span 
            className="relative inline-flex items-center justify-center"
            style={{
              width: '18px',
              height: '18px',
              margin: "0 0.5px",
              position: 'relative',
            }}
          >
            {/* O principal avec effet lumineux */}
            <span
              className="text-emerald-400 font-black absolute inset-0 flex items-center justify-center z-30"
              style={{
                fontSize: '16px',
                textShadow: "0 0 8px rgba(52, 211, 153, 0.9), 0 0 16px rgba(52, 211, 153, 0.5)",
                lineHeight: 1,
              }}
            >
              O
            </span>

            {/* Échos du O */}
            {animate && (
              <>
                <span
                  className="text-emerald-300 font-black absolute inset-0 flex items-center justify-center z-20"
                  style={{ 
                    fontSize: '16px',
                    lineHeight: 1,
                    animation: "pulse 2.5s ease-in-out infinite",
                  }}
                >
                  O
                </span>
                <span
                  className="text-emerald-200 font-black absolute inset-0 flex items-center justify-center z-10"
                  style={{ 
                    fontSize: '18px',
                    lineHeight: 1,
                    animation: "expandO 3.5s ease-out infinite",
                    transformOrigin: "center",
                  }}
                >
                  O
                </span>
              </>
            )}
          </span>

          {/* GRAPHE */}
          <span
            className="text-slate-100 font-bold select-none"
            style={{ 
              fontSize: '14px', 
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            GRAPHE
          </span>
        </div>
      </div>

      {/* Sous-titre éco-créatif */}
      <div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
      >
        <span
          className="text-slate-500 select-none"
          style={{
            fontSize: '9px',
            fontWeight: '400',
            letterSpacing: '0.1em'
          }}
        >
          écho-créatif
        </span>
      </div>

      {/* Styles d'animation */}
      <style>{`
        @keyframes expandO {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default PsychographeLogo;