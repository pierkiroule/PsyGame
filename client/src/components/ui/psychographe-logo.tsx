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
    xl: 'w-48 h-48'
  };

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Définition des gradients adaptés au thème sombre */}
        <defs>
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#475569" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.5" />
          </radialGradient>
          
          <radialGradient id="rippleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0" />
            <stop offset="70%" stopColor="#475569" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.1" />
          </radialGradient>

          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* Cercles d'onde de résonance - éco-conception avec moins d'éléments */}
        {animate && (
          <>
            <circle
              cx="100"
              cy="100"
              r="20"
              fill="none"
              stroke="#475569"
              strokeWidth="1"
              strokeOpacity="0.6"
            >
              <animate
                attributeName="r"
                values="20;60;100"
                dur="3s"
                repeatCount="indefinite"
                begin="0s"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.6;0.3;0"
                dur="3s"
                repeatCount="indefinite"
                begin="0s"
              />
            </circle>
            
            <circle
              cx="100"
              cy="100"
              r="20"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            >
              <animate
                attributeName="r"
                values="20;50;80"
                dur="2.5s"
                repeatCount="indefinite"
                begin="0.8s"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.5;0.2;0"
                dur="2.5s"
                repeatCount="indefinite"
                begin="0.8s"
              />
            </circle>

            <circle
              cx="100"
              cy="100"
              r="15"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="0.6"
              strokeOpacity="0.4"
            >
              <animate
                attributeName="r"
                values="15;40;70"
                dur="2s"
                repeatCount="indefinite"
                begin="1.5s"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.4;0.15;0"
                dur="2s"
                repeatCount="indefinite"
                begin="1.5s"
              />
            </circle>
          </>
        )}

        {/* Cercle central fixe */}
        <circle
          cx="100"
          cy="100"
          r="25"
          fill="url(#centerGradient)"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Point central avec pulsation subtile */}
        <circle
          cx="100"
          cy="100"
          r="3"
          fill="#cbd5e1"
        >
          {animate && (
            <animate
              attributeName="r"
              values="3;5;3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Texte "PSYCHOGRAPHE" avec le O spécial */}
        <g>
          <text
            x="100"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.08em'
            }}
          >
            <tspan fill="url(#textGradient)" x="100" textAnchor="middle">PSYCH</tspan><tspan fill="#94a3b8" fontSize="16">
              {animate ? (
                <animate
                  attributeName="font-size"
                  values="16;18;16"
                  dur="2s"
                  repeatCount="indefinite"
                />
              ) : null}
              O
            </tspan><tspan fill="url(#textGradient)">GRAPHE</tspan>
          </text>

          {/* Sous-titre éco-créatif */}
          <text
            x="100"
            y="170"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#64748b"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '9px',
              fontWeight: '400',
              letterSpacing: '0.1em'
            }}
          >
            écho-créatif
          </text>
        </g>

        {/* Indicateurs minimalistes de résonance */}
        {animate && (
          <>
            <circle cx="85" cy="100" r="1" fill="#94a3b8" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur="3s"
                repeatCount="indefinite"
                begin="0s"
              />
            </circle>
            <circle cx="115" cy="100" r="1" fill="#94a3b8" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.4;0.1;0.4"
                dur="3s"
                repeatCount="indefinite"
                begin="1s"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
};

export default PsychographeLogo;