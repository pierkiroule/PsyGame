import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface VoiceInputSimpleProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const VoiceInputSimple: React.FC<VoiceInputSimpleProps> = ({
  value,
  onChange,
  placeholder = "Cliquez sur le micro et parlez...",
  className = "",
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Vérifier le support du navigateur
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'fr-FR';

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          const newValue = value ? `${value} ${finalTranscript}`.trim() : finalTranscript;
          onChange(newValue);
          setTranscript(finalTranscript);
        }
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'aborted') {
          setError(`Erreur: ${event.error}`);
        }
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setError(null);
      try {
        recognition.start();
      } catch (err) {
        setError('Impossible de démarrer la reconnaissance vocale');
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const clearError = () => {
    setError(null);
  };

  if (!isSupported) {
    return (
      <div className={clsx("flex items-center gap-2 text-slate-400 text-sm", className)}>
        <VolumeX className="w-4 h-4" />
        <span>Reconnaissance vocale non supportée</span>
      </div>
    );
  }

  return (
    <div className={clsx("space-y-3", className)}>
      {/* Contrôles vocaux */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isListening ? "destructive" : "secondary"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          disabled={disabled}
          className={clsx(
            "flex items-center gap-2 transition-all duration-300",
            isListening && "animate-pulse bg-red-600 hover:bg-red-700"
          )}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Arrêter
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Parler
            </>
          )}
        </Button>

        {isListening && (
          <Badge variant="secondary" className="animate-pulse">
            <Volume2 className="w-3 h-3 mr-1" />
            Écoute en cours...
          </Badge>
        )}
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="text-red-400 text-sm bg-red-950/20 border border-red-800/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-300 hover:text-red-200"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Aide */}
      {!isListening && !error && (
        <div className="text-slate-400 text-xs">
          💡 {placeholder}
        </div>
      )}
    </div>
  );
};

export default VoiceInputSimple;