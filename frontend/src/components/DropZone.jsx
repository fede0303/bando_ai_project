/**
 * DropZone.jsx — Area Drag & Drop per il caricamento dei file PDF
 *
 * Props:
 *   - onFileSelected: (file: File) => void — callback quando un file valido viene selezionato
 */
import { useState, useRef, useCallback } from 'react';

export default function DropZone({ onFileSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // ── Costanti di validazione ──
  const MAX_FILE_SIZE_MB = 20;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const isPdf = (file) => file && file.name.toLowerCase().endsWith('.pdf');

  // ── Gestione del file selezionato ──
  const handleFile = useCallback(
    (file) => {
      setFileError('');

      if (!isPdf(file)) {
        setFileError('Formato non valido. Carica esclusivamente file .pdf.');
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setFileError(`Il file è troppo grande (${sizeMB} MB). Il limite massimo consentito è di ${MAX_FILE_SIZE_MB} MB.`);
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
      e.target.value = ''; // Permette di riselezionare lo stesso file
    }
  };

  return (
    <section className="w-full max-w-2xl">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone group border-2 border-dashed border-gray-300/80 rounded-3xl bg-white/85 backdrop-blur-md p-10 md:p-14 text-center cursor-pointer hover:border-poli-500 hover:bg-poli-50/40 hover:shadow-xl hover:shadow-poli-500/5 hover:-translate-y-0.5 shadow-md transition-all duration-300 ${
          isDragOver ? 'drag-over' : ''
        }`}
      >
        {/* Icona upload */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-poli-50/80 border border-poli-100/80 flex items-center justify-center text-poli-500 mb-5 group-hover:scale-105 group-hover:bg-poli-100/50 transition-all duration-300 shadow-inner">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        
        <p className="text-lg font-bold text-gray-800 tracking-tight">
          Trascina qui il tuo bando in formato PDF
        </p>
        <p className="text-sm text-gray-400 mt-2 font-medium">
          oppure{' '}
          <span className="text-poli-600 underline font-semibold decoration-2 underline-offset-2 hover:text-poli-700 transition-colors">
            clicca per selezionare
          </span>
        </p>
        
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400/80 font-medium">
          <svg className="w-4 h-4 text-poli-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Solo file PDF (dimensione max 20MB)</span>
        </div>

        {/* Input file nascosto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Alert errore formato o dimensione file */}
      {fileError && (
        <div className="mt-4 bg-red-50/90 border border-red-200 text-red-700 rounded-2xl px-5 py-3.5 text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-sm">
          <span>⚠️</span>
          <span>{fileError}</span>
        </div>
      )}
    </section>
  );
}
