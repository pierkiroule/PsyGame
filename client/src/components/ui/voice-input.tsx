import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { clsx } from 'clsx';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  placeholder = "Cliquez sur le micro et parlez...",
  className = "",
  disabled = false,
  onTranscriptUpdate
}) => {
  const [showTranscript, setShowTranscript] = useState(false);

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    abortListening,
    resetTranscript
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'fr-FR',
    onResult: (text, isFinal) => {
      onTranscriptUpdate?.(text, isFinal);
      if (isFinal) {
        // Ajouter le texte final au champ de saisie
        const newValue = value ? `${value} ${text}`.trim() : text;
        onChange(newValue);
      }
    },
    onError: (errorMsg) => {
      console.error('Erreur reconnaissance vocale:', errorMsg);
    }
  });

  useEffect(() => {
    if (transcript) {
      setShowTranscript(true);
    }
  }, [transcript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setShowTranscript(true);
    }
  };

  const handleClearTranscript = () => {
    resetTranscript();
    setShowTranscript(false);
  };

  const handleForceStop = () => {
    if (isListening) {
      abortListening?.();
    }
  };

  if (!isSupported) {
    return (
      <div className={clsx("flex items-center gap-2 text-slate-400 text-sm", className)}>
        <VolumeX className="w-4 h-4" />
        <span>Reconnaissance vocale non supportée par votre navigateur</span>
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
          onClick={handleToggleListening}
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

        {(transcript || interimTranscript) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearTranscript}
            className="text-slate-400 hover:text-slate-200"
          >
            Effacer
          </Button>
        )}

        {isListening && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleForceStop}
            className="text-orange-400 hover:text-orange-200"
          >
            Forcer l'arrêt
          </Button>
        )}
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="text-red-400 text-sm bg-red-950/20 border border-red-800/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium mb-1">Erreur de reconnaissance vocale</div>
              <div className="text-xs">{error}</div>
            </div>
            {error.includes('interrompue') && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Ne pas redémarrer automatiquement, laisser l'utilisateur le faire manuellement
                  resetTranscript();
                  setTimeout(() => startListening(), 200);
                }}
                className="text-red-300 hover:text-red-200 hover:bg-red-900/30"
              >
                Réessayer
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Transcription en temps réel */}
      {showTranscript && (transcript || interimTranscript) && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-xs font-medium">Transcription</span>
            <Badge variant="outline">
              {isListening ? 'En cours...' : 'Terminé'}
            </Badge>
          </div>
          
          <div className="text-slate-200 leading-relaxed">
            {transcript && (
              <span className="text-white">{transcript}</span>
            )}
            {interimTranscript && (
              <span className="text-slate-400 italic"> {interimTranscript}</span>
            )}
          </div>
          
          {transcript && !isListening && (
            <div className="text-xs text-slate-400 mt-2">
              Texte ajouté automatiquement au champ de saisie
            </div>
          )}
        </div>
      )}

      {/* Conseils d'utilisation */}
      {!isListening && !transcript && (
        <div className="text-slate-400 text-xs">
          💡 {placeholder}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;