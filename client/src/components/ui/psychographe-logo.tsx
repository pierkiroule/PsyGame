import React, { useRef, useLayoutEffect, useState } from "react";

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
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-80 h-80'
  };

  // Calculer la taille basée sur le size
  const baseSize = size === 'xl' ? 80 : size === 'lg' ? 64 : size === 'md' ? 48 : 32;
  const textSize = baseSize * 0.15;
  const oSize = baseSize * 0.18;

  // Refs mesure
  const containerRef = useRef<HTMLDivElement>(null);
  const oWrapRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Alignement précis du centre du "O" sur le centre d'onde (64,40) du viewBox 128×80
  useLayoutEffect(() => {
    const align = () => {
      const c = containerRef.current;
      const o = oWrapRef.current;
      if (!c || !o) return;

      const cRect = c.getBoundingClientRect();
      const oRect = o.getBoundingClientRect();

      const targetX = cRect.width * (64 / 128); // centre onde X
      const targetY = cRect.height * (40 / 80); // centre onde Y

      const oCenterX = (oRect.left - cRect.left) + oRect.width / 2;
      const oCenterY = (oRect.top - cRect.top) + oRect.height / 2;

      setOffset({
        x: targetX - oCenterX,
        y: targetY - oCenterY,
      });
    };

    // Recalcule au resize / changement de police
    const ro = new ResizeObserver(align);
    if (containerRef.current) ro.observe(containerRef.current);
    if (oWrapRef.current) ro.observe(oWrapRef.current);

    window.addEventListener("resize", align);
    // Première passe (font rendering)
    requestAnimationFrame(align);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", align);
    };
  }, []);

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{ aspectRatio: '1.6/1' }}
      >
        {/* Onde résonnante (center 64,40 dans viewBox 128x80) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 128 80"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`echoWave-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#2563eb" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id={`oEcho-${size}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Ondes circulaires d'écho centrées sur 64,40 */}
          {animate && (
            <>
              {/* Première onde circulaire */}
              <circle cx="64" cy="40" r="5" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="2.5">
                <animate attributeName="r" values="5; 35; 5" dur="6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.95; 0.3; 0.95" dur="6s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="2.5; 0.8; 2.5" dur="6s" repeatCount="indefinite" />
              </circle>
              
              {/* Deuxième onde circulaire */}
              <circle cx="64" cy="40" r="8" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="2">
                <animate attributeName="r" values="8; 40; 8" dur="7s" begin="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.85; 0.2; 0.85" dur="7s" begin="1.5s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="2; 0.6; 2" dur="7s" begin="1.5s" repeatCount="indefinite" />
              </circle>
              
              {/* Troisième onde circulaire */}
              <circle cx="64" cy="40" r="12" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="1.8">
                <animate attributeName="r" values="12; 45; 12" dur="8s" begin="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.75; 0.15; 0.75" dur="8s" begin="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.8; 0.4; 1.8" dur="8s" begin="3s" repeatCount="indefinite" />
              </circle>
              
              {/* Quatrième onde circulaire */}
              <circle cx="64" cy="40" r="15" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="1.5">
                <animate attributeName="r" values="15; 50; 15" dur="9s" begin="4.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.65; 0.1; 0.65" dur="9s" begin="4.5s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.5; 0.3; 1.5" dur="9s" begin="4.5s" repeatCount="indefinite" />
              </circle>
              
              {/* Cercle central pulsant */}
              <circle cx="64" cy="40" r="3" fill={`url(#oEcho-${size})`}>
                <animate attributeName="r" values="3; 6; 3" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9; 0.5; 0.9" dur="4s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>

        {/* Texte aligné par offset (le centre du O = centre onde) */}
        <div
          className="absolute left-0 top-0 pointer-events-none z-20"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          <span
            className="text-slate-100 font-bold tracking-[0.08em] leading-none select-none"
            style={{ fontSize: textSize, letterSpacing: "0.08em" }}
          >
            <span>PSYCH</span>

            {/* Wrapper du O mesuré */}
            <span
              ref={oWrapRef}
              className="relative inline-block align-middle"
              style={{ margin: "0 0.02em" }}
            >
              {/* O principal */}
              <span
                className="text-blue-400 font-black relative z-30 inline-block"
                style={{
                  fontSize: oSize,
                  textShadow:
                    "0 0 12px rgba(59, 130, 246, 0.9), 0 0 24px rgba(59, 130, 246, 0.5), 0 0 36px rgba(59, 130, 246, 0.2)",
                  transform: "translateY(-1px)",
                }}
              >
                O
              </span>

              {/* Échos */}
              {animate && (
                <>
                  <span
                    className="absolute inset-0 text-blue-300 font-black z-20"
                    style={{ fontSize: oSize, animation: "pulse 2.5s ease-in-out infinite", transform: "translateY(-1px)" }}
                  >
                    O
                  </span>
                  <span
                    className="absolute inset-0 text-blue-200 font-black z-10"
                    style={{ fontSize: oSize * 1.15, animation: "expandO 3.5s ease-out infinite", transformOrigin: "center", transform: "translateY(-1px)" }}
                  >
                    O
                  </span>
                  <span
                    className="absolute inset-0 text-blue-100 font-black z-0"
                    style={{ fontSize: oSize * 1.3, animation: "fadeEcho 4.5s ease-out infinite", transformOrigin: "center", transform: "translateY(-1px)" }}
                  >
                    O
                  </span>
                </>
              )}
            </span>

            <span>GRAPHE</span>
          </span>
        </div>

        {/* Styles d'animation */}
        <style>{`
          @keyframes expandO {
            0% { transform: scale(1) translateY(-1px); opacity: 0.3; }
            50% { transform: scale(1.1) translateY(-1px); opacity: 0.1; }
            100% { transform: scale(1.3) translateY(-1px); opacity: 0; }
          }
          @keyframes fadeEcho {
            0% { transform: scale(1) translateY(-1px); opacity: 0.15; }
            70% { transform: scale(1.2) translateY(-1px); opacity: 0.05; }
            100% { transform: scale(1.5) translateY(-1px); opacity: 0; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PsychographeLogo;