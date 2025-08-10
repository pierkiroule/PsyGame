import { useState, useRef, useEffect } from 'react';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'error', listener: (event: SpeechRecognitionError) => void): void;
  addEventListener(type: 'start' | 'end', listener: () => void): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const {
    continuous = true,
    interimResults = true,
    lang = 'fr-FR',
    onResult,
    onError
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Vérifier le support du navigateur
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          onResult?.(finalTranscript, true);
        }
        
        setInterimTranscript(interimText);
        if (interimText) {
          onResult?.(interimText, false);
        }
      });

      recognition.addEventListener('error', (event: SpeechRecognitionError) => {
        const errorMessage = getErrorMessage(event.error);
        console.warn('Speech recognition error:', event.error, errorMessage);
        
        // Ne pas traiter l'erreur "aborted" comme une vraie erreur si elle est intentionnelle
        if (event.error !== 'aborted') {
          setError(errorMessage);
          onError?.(errorMessage);
        }
        setIsListening(false);
      });

      recognition.addEventListener('start', () => {
        setIsListening(true);
        setError(null);
      });

      recognition.addEventListener('end', () => {
        setIsListening(false);
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuous, interimResults, lang, onResult, onError]);

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'no-speech':
        return 'Aucune parole détectée. Essayez de parler plus fort.';
      case 'audio-capture':
        return 'Impossible d\'accéder au microphone.';
      case 'not-allowed':
        return 'Permission microphone refusée. Autorisez l\'accès dans les paramètres.';
      case 'network':
        return 'Erreur réseau. Vérifiez votre connexion.';
      case 'language-not-supported':
        return 'Langue non supportée par votre navigateur.';
      case 'service-not-allowed':
        return 'Service de reconnaissance vocale non autorisé.';
      case 'aborted':
        return 'Reconnaissance vocale interrompue. Cliquez à nouveau sur "Parler".';
      default:
        return `Erreur de reconnaissance vocale: ${error}`;
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      // Reset des transcriptions précédentes seulement si pas d'erreur d'interruption
      if (!error?.includes('interrompue')) {
        setTranscript('');
        setInterimTranscript('');
      }
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        const errorMsg = 'Impossible de démarrer la reconnaissance vocale';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
  };

  const abortListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        setIsListening(false);
        setError(null);
      } catch (err) {
        console.warn('Error aborting speech recognition:', err);
      }
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  };

  return {
    transcript,
    interimTranscript,
    finalTranscript: transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    abortListening,
    resetTranscript
  };
};