/**
 * DropZone.jsx — Area Drag & Drop per il caricamento dei file PDF
 *
 * Props:
 *   - onFileSelected: (file: File) => void — callback quando un file valido viene selezionato
 */
import { useState, useRef, useCallback } from 'react';

export default function DropZone({ onFileSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState(false);
  const fileInputRef = useRef(null);

  // ── Validazione: accetta solo PDF ──
  const isPdf = (file) => file && file.name.toLowerCase().endsWith('.pdf');

  // ── Gestione del file selezionato ──
  const handleFile = useCallback(
    (file) => {
      setFileError(false);

      if (!isPdf(file)) {
        setFileError(true);
        return;
      }

      // File valido → notifica il parent
      onFileSelected(file);
    },
    [onFileSelected]
  );

  // ── Handler Drag & Drop ──
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  // ── Handler click e input ──
  const handleClick = () => fileInputRef.current?.click();

  const handleInputChange = (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <section className="w-full max-w-2xl">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone border-2 border-dashed border-gray-300 rounded-2xl bg-white p-12 text-center cursor-pointer hover:border-poli-500 hover:bg-poli-50 shadow-sm ${
          isDragOver ? 'drag-over' : ''
        }`}
      >
        {/* Icona upload */}
        <svg
          className="mx-auto w-16 h-16 text-poli-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
          />
        </svg>
        <p className="text-lg font-semibold text-gray-700">
          Trascina qui il tuo bando in formato PDF
        </p>
        <p className="text-sm text-gray-400 mt-2">
          oppure{' '}
          <span className="text-poli-600 underline">clicca per selezionare</span>
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Sono accettati solo file <strong>.pdf</strong>
        </p>

        {/* Input file nascosto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Alert errore formato file */}
      {fileError && (
        <div className="mt-4 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm font-medium text-center">
          ⚠️ Formato non valido. Carica esclusivamente file <strong>.pdf</strong>.
        </div>
      )}
    </section>
  );
}
