import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTooltipProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  show: boolean;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({ 
  steps, 
  onComplete, 
  show 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!show || steps.length === 0) return;

    const targetElement = document.querySelector(steps[currentStep].target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const tooltipPosition = getTooltipPosition(rect, steps[currentStep].position);
      setPosition(tooltipPosition);
    }
  }, [currentStep, show, steps]);

  const getTooltipPosition = (rect: DOMRect, position: string) => {
    const offset = 10;
    switch (position) {
      case 'bottom':
        return { top: rect.bottom + offset, left: rect.left };
      case 'top':
        return { top: rect.top - 120 - offset, left: rect.left };
      case 'right':
        return { top: rect.top, left: rect.right + offset };
      case 'left':
        return { top: rect.top, left: rect.left - 300 - offset };
      default:
        return { top: rect.bottom + offset, left: rect.left };
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!show || steps.length === 0) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-50 w-72 border-emerald-600 bg-slate-900 shadow-xl"
        style={{ 
          top: position.top, 
          left: position.left,
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-emerald-400 text-sm">
              {step.title}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onComplete}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {step.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-emerald-400' 
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={prevStep}
                  className="h-8 px-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                onClick={nextStep}
                className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700"
              >
                {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};