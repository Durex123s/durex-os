import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import clsx from 'clsx';

// L'API Web Speech n'est pas standardisée partout (bon support Chrome/Edge,
// limité sur Firefox/Safari) — on détecte la disponibilité et on masque le
// bouton proprement si absente plutôt que d'afficher une fonctionnalité cassée.
export function VoiceInputButton({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(
    () => Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  );
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!supported) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [onResult, supported]);

  if (!supported) return null;

  const toggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={clsx(
        'p-2.5 rounded-lg border transition-colors shrink-0',
        listening ? 'bg-danger/15 border-danger text-danger animate-pulse' : 'border-base-600 text-muted hover:text-white'
      )}
      aria-label={listening ? "Arrêter l'écoute" : 'Parler à l\'assistant'}
      title={listening ? "Arrêter l'écoute" : 'Entrée vocale'}
    >
      {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}
