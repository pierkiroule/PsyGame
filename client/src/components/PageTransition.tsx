import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  trigger?: string; // URL ou identifiant pour déclencher la transition
}

export const PageTransition = ({ children, trigger }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(children);

  useEffect(() => {
    // Fondu de sortie
    setIsVisible(false);
    
    // Attendre la fin de la transition de sortie
    const timer = setTimeout(() => {
      setContent(children);
      setIsVisible(true);
    }, 150); // Durée courte pour une transition fluide

    return () => clearTimeout(timer);
  }, [trigger, children]);

  useEffect(() => {
    // Montage initial
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {content}
    </div>
  );
};

// Hook pour gérer les transitions de page avec wouter
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => {
    setIsTransitioning(true);
    // Auto-reset après la durée de transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return {
    isTransitioning,
    startTransition,
    transitionClass: isTransitioning ? 'opacity-0' : 'opacity-100'
  };
};