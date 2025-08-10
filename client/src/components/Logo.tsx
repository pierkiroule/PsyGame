import React, { useRef, useLayoutEffect, useState } from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 80, className = "" }) => {
  const textSize = size * 0.15;
  const oSize = size * 0.18;

  // Refs mesure
  const containerRef = useRef<HTMLDivElement>(null);
  const oWrapRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Alignement précis du centre du "O" sur le centre d’onde (64,40) du viewBox 128×80
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
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size * 1.6, height: size }}
    >
      {/* Onde résonnante (center 64,40 dans viewBox 128x80) */}
      <svg
        width={size * 1.6}
        height={size}
        viewBox="0 0 128 80"
        className="absolute inset-0"
        aria-hidden
      >
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

        {/* Cercles d’écho centrés sur 64,40 */}
        <circle cx="64" cy="40" r="8" fill="none" stroke="url(#oEcho)" strokeWidth="1.2" className="opacity-80">
          <animate attributeName="r" values="8; 20; 8" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8; 0.1; 0.8" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="64" cy="40" r="12" fill="none" stroke="url(#oEcho)" strokeWidth="0.8" className="opacity-60">
          <animate attributeName="r" values="12; 28; 12" dur="4s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6; 0.05; 0.6" dur="4s" begin="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="64" cy="40" r="16" fill="none" stroke="url(#oEcho)" strokeWidth="0.5" className="opacity-40">
          <animate attributeName="r" values="16; 40; 16" dur="5s" begin="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4; 0.02; 0.4" dur="5s" begin="1.6s" repeatCount="indefinite" />
        </circle>

        {/* Ondes horizontales */}
        <path d="M 20 40 Q 30 25, 40 40 T 60 40 T 80 40 T 100 40 T 120 40"
              stroke="url(#echoWave)" strokeWidth="3" fill="none" className="opacity-90">
          <animateTransform attributeName="transform" type="translate" values="44,0; 24,0; 44,0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4; 1; 0.4" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M 20 40 Q 30 20, 40 40 T 60 40 T 80 40 T 100 40 T 120 40"
              stroke="url(#echoWave)" strokeWidth="2" fill="none" className="opacity-60">
          <animateTransform attributeName="transform" type="translate" values="44,0; 24,0; 44,0" dur="4s" begin="0.6s" repeatCount="indefinite" />
        </path>
        <path d="M 20 40 Q 30 30, 40 40 T 60 40 T 80 40 T 100 40 T 120 40"
              stroke="url(#echoWave)" strokeWidth="1.5" fill="none" className="opacity-40">
          <animateTransform attributeName="transform" type="translate" values="44,0; 24,0; 44,0" dur="4s" begin="1.2s" repeatCount="indefinite" />
        </path>
        <path d="M 20 40 Q 30 55, 40 40 T 60 40 T 80 40 T 100 40 T 120 40"
              stroke="url(#echoWave)" strokeWidth="1" fill="none" className="opacity-25">
          <animateTransform attributeName="transform" type="translate" values="44,0; 24,0; 44,0" dur="4s" begin="1.8s" repeatCount="indefinite" />
        </path>
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
          </span>

          <span>GRAPHE</span>
        </span>
      </div>

      <style>{`
        @keyframes expandO {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes fadeEcho {
          0% { transform: scale(1); opacity: 0.15; }
          70% { transform: scale(1.2); opacity: 0.05; }
          100% { transform: scale(1.5); opacity: 0; }
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
