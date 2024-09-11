import { useState, useEffect } from 'react';

interface ChordsModalProps {
  'client:load'?: boolean;
}

export default function ChordsModal(props: ChordsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chords, setChords] = useState<string | null>(null);

  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      setIsOpen(event.detail.isOpen);
      setChords(event.detail.chords);
    };

    window.addEventListener('openChordsModal' as any, handleCustomEvent);

    return () => {
      window.removeEventListener('openChordsModal' as any, handleCustomEvent);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Acordes</h2>
        {chords ? (
          <pre className="whitespace-pre-wrap">{chords}</pre>
        ) : (
          <p>Los acordes no están disponibles para este himno.</p>
        )}
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
