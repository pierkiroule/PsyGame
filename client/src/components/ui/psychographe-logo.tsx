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

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients pour les cercles */}
          <radialGradient id="outerCircle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.3" />
          </radialGradient>
          
          <radialGradient id="middleCircle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
          </radialGradient>
          
          <radialGradient id="innerCircle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </radialGradient>

          {/* Gradient pour le texte */}
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          {/* Filtre pour effet de lueur */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Cercle extérieur */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="url(#outerCircle)"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeOpacity="0.3"
        >
          {animate && (
            <>
              <animate
                attributeName="r"
                values="180;185;180"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.3;0.6;0.3"
                dur="4s"
                repeatCount="indefinite"
              />
            </>
          )}
        </circle>

        {/* Cercle moyen */}
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="url(#middleCircle)"
          stroke="#a5b4fc"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        >
          {animate && (
            <>
              <animate
                attributeName="r"
                values="140;145;140"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.4;0.7;0.4"
                dur="3s"
                repeatCount="indefinite"
              />
            </>
          )}
        </circle>

        {/* Cercle intérieur */}
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="url(#innerCircle)"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeOpacity="0.6"
        >
          {animate && (
            <>
              <animate
                attributeName="r"
                values="100;105;100"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.6;0.9;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </>
          )}
        </circle>

        {/* Points décoratifs */}
        <circle cx="235" cy="140" r="3" fill="#3b82f6">
          {animate && (
            <animate
              attributeName="r"
              values="3;5;3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="250" cy="150" r="2" fill="#60a5fa">
          {animate && (
            <animate
              attributeName="r"
              values="2;4;2"
              dur="2.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Texte PSYCHOGRAPH en arc de cercle */}
        <g>
          <path
            id="textCircle"
            d="M 200,50 A 150,150 0 1,1 199,50"
            fill="none"
            stroke="none"
          />
          
          <text className="text-lg font-bold" filter="url(#glow)">
            <textPath
              href="#textCircle"
              startOffset="0%"
              textAnchor="start"
              style={{
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '3px',
                fill: 'url(#textGradient)'
              }}
            >
              PSYCHOGRAPH
              {animate && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 200 200;360 200 200"
                  dur="20s"
                  repeatCount="indefinite"
                />
              )}
            </textPath>
          </text>
        </g>

        {/* Sous-titre A.I.magination */}
        <text
          x="200"
          y="320"
          textAnchor="middle"
          style={{
            fontSize: '16px',
            fontWeight: '500',
            letterSpacing: '2px',
            fill: '#64748b'
          }}
        >
          A.I.magination
          {animate && (
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </text>

        {/* Ondulations subtiles */}
        {animate && (
          <>
            <circle
              cx="200"
              cy="200"
              r="120"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            >
              <animate
                attributeName="r"
                values="120;130;120"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.3;0.1;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="#a5b4fc"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            >
              <animate
                attributeName="r"
                values="160;170;160"
                dur="4s"
                begin="1s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.2;0.05;0.2"
                dur="4s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
};

export default PsychographeLogo;