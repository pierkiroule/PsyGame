import React, { useState } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Button } from './button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
  label?: string;
  required?: boolean;
}

export const VoiceTextInput: React.FC<VoiceTextInputProps> = ({
  value,
  onChange,
  placeholder = "Tapez votre réponse...",
  className,
  multiline = false,
  rows = 4,
  label,
  required = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  React.useEffect(() => {
    // Vérifier le support du navigateur
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.continuous = true;
    newRecognition.interimResults = true;
    newRecognition.lang = 'fr-FR';

    let finalTranscript = '';
    let interimTranscript = '';

    newRecognition.onstart = () => {
      setIsListening(true);
    };

    newRecognition.onresult = (event: any) => {
      finalTranscript = '';
      interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Mettre à jour la valeur avec le transcript final
      if (finalTranscript) {
        const currentValue = value || '';
        const newValue = currentValue + finalTranscript;
        onChange(newValue.trim());
      }
    };

    newRecognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsListening(false);
    };

    newRecognition.onend = () => {
      setIsListening(false);
    };

    setRecognition(newRecognition);

    return () => {
      if (newRecognition) {
        newRecognition.stop();
      }
    };
  }, [value, onChange]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const inputProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      onChange(e.target.value),
    placeholder,
    className: cn(
      "pr-12", // Espace pour le bouton vocal
      className
    )
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {multiline ? (
          <Textarea
            {...inputProps}
            rows={rows}
          />
        ) : (
          <Input {...inputProps} />
        )}
        
        {isSupported && (
          <Button
            type="button"
            size="sm"
            variant={isListening ? "default" : "ghost"}
            className={cn(
              "absolute right-2 h-8 w-8 p-0",
              multiline ? "top-2" : "top-1",
              isListening && "bg-red-600 hover:bg-red-700 text-white"
            )}
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      {isListening && (
        <div className="text-xs text-blue-400 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Écoute en cours... Parlez maintenant
        </div>
      )}
      
      {!isSupported && (
        <div className="text-xs text-amber-400">
          Reconnaissance vocale non disponible dans ce navigateur
        </div>
      )}
    </div>
  );
};