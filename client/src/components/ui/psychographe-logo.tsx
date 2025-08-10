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
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64'
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
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id={`oEcho-${size}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Ondes circulaires d'écho centrées sur 64,40 */}
          {animate && (
            <>
              {/* Première onde circulaire */}
              <circle cx="64" cy="40" r="5" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="2" className="opacity-90">
                <animate attributeName="r" values="5; 35; 5" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9; 0.1; 0.9" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="2; 0.5; 2" dur="3s" repeatCount="indefinite" />
              </circle>
              
              {/* Deuxième onde circulaire */}
              <circle cx="64" cy="40" r="8" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="1.5" className="opacity-70">
                <animate attributeName="r" values="8; 40; 8" dur="4s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7; 0.05; 0.7" dur="4s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.5; 0.3; 1.5" dur="4s" begin="0.8s" repeatCount="indefinite" />
              </circle>
              
              {/* Troisième onde circulaire */}
              <circle cx="64" cy="40" r="12" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="1.2" className="opacity-50">
                <animate attributeName="r" values="12; 45; 12" dur="5s" begin="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5; 0.02; 0.5" dur="5s" begin="1.6s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.2; 0.2; 1.2" dur="5s" begin="1.6s" repeatCount="indefinite" />
              </circle>
              
              {/* Quatrième onde circulaire */}
              <circle cx="64" cy="40" r="15" fill="none" stroke={`url(#oEcho-${size})`} strokeWidth="0.8" className="opacity-30">
                <animate attributeName="r" values="15; 50; 15" dur="6s" begin="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3; 0.01; 0.3" dur="6s" begin="2.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="0.8; 0.1; 0.8" dur="6s" begin="2.4s" repeatCount="indefinite" />
              </circle>
              
              {/* Cercle central pulsant */}
              <circle cx="64" cy="40" r="3" fill={`url(#oEcho-${size})`} className="opacity-80">
                <animate attributeName="r" values="3; 6; 3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8; 0.4; 0.8" dur="2s" repeatCount="indefinite" />
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
                className="text-emerald-400 font-black relative z-30 inline-block"
                style={{
                  fontSize: oSize,
                  textShadow:
                    "0 0 12px rgba(52, 211, 153, 0.9), 0 0 24px rgba(52, 211, 153, 0.5), 0 0 36px rgba(52, 211, 153, 0.2)",
                  transform: "translateY(-1px)",
                }}
              >
                O
              </span>

              {/* Échos */}
              {animate && (
                <>
                  <span
                    className="absolute inset-0 text-emerald-300 font-black z-20"
                    style={{ fontSize: oSize, animation: "pulse 2.5s ease-in-out infinite", transform: "translateY(-1px)" }}
                  >
                    O
                  </span>
                  <span
                    className="absolute inset-0 text-emerald-200 font-black z-10"
                    style={{ fontSize: oSize * 1.15, animation: "expandO 3.5s ease-out infinite", transformOrigin: "center", transform: "translateY(-1px)" }}
                  >
                    O
                  </span>
                  <span
                    className="absolute inset-0 text-emerald-100 font-black z-0"
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