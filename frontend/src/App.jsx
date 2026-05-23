/**
 * App.jsx — Componente principale che orchestra lo stato dell'applicazione
 *
 * Stati possibili:
 *   - 'idle'    → Mostra DropZone
 *   - 'loading' → Mostra LoadingSpinner
 *   - 'success' → Mostra ResultCard con i dati
 *   - 'error'   → Mostra ErrorState con il messaggio
 */
import { useState, useCallback } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import ErrorState from './components/ErrorState';
import { inviaAlBackend } from './services/api';

export default function App() {
  // ── Stato globale dell'applicazione ──
  const [appState, setAppState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // ── Gestione del file selezionato ──
  const handleFileSelected = useCallback(async (file) => {
    setAppState('loading');
    setErrorMessage('');

    try {
      const data = await inviaAlBackend(file);
      setResultData(data);
      setAppState('success');
    } catch (err) {
      console.error('Errore durante il caricamento o elaborazione:', err);
      // Mostriamo direttamente l'errore generato (che sia di validazione, timeout o rete)
      setErrorMessage(err.message);
      setAppState('error');
    }
  }, []);

  // ── Reset allo stato iniziale ──
  const handleReset = useCallback(() => {
    setAppState('idle');
    setResultData(null);
    setErrorMessage('');
  }, []);

  return (
    <div className="relative min-h-screen bg-poli-50 bg-dot-grid font-sans text-gray-800 flex flex-col overflow-hidden">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-[10%] left-[-15%] w-[45vw] h-[45vw] min-w-[300px] min-h-[300px] rounded-full bg-lime-500/10 blur-[100px] animate-glow-soft pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-15%] w-[45vw] h-[45vw] min-w-[300px] min-h-[300px] rounded-full bg-poli-500/12 blur-[100px] animate-glow-soft pointer-events-none" style={{ animationDelay: '-5s' }} />

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 md:py-16 relative z-10">
        {appState === 'idle' && (
          <div className="w-full max-w-2xl flex flex-col items-center fade-in-up">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-poli-100 shadow-sm text-poli-700 text-[11px] font-bold uppercase tracking-wider mb-5">
              <span className="w-2 h-2 rounded-full bg-poli-500 shrink-0" />
              Estrazione & Archiviazione Automatizzata
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-poli-900 tracking-tight text-center max-w-xl mb-4 leading-[1.2]">
              Analisi dei bandi con{' '}
              <span className="bg-gradient-to-b from-poli-500 to-poli-800 bg-clip-text text-transparent inline-block">
                Intelligenza Artificiale
              </span>
            </h2>
            <p className="text-gray-500 text-center max-w-lg mb-8 text-sm md:text-base leading-relaxed">
              Carica un documento o atto ufficiale del Dipartimento Dicatech in formato PDF. L'agente AI identificherà requisiti, scadenze e li registrerà nel database.
            </p>
            
            <DropZone onFileSelected={handleFileSelected} />
          </div>
        )}
        
        {appState === 'loading' && <LoadingSpinner />}
        
        {appState === 'success' && resultData && (
          <ResultCard data={resultData} onReset={handleReset} />
        )}
        
        {appState === 'error' && (
          <ErrorState message={errorMessage} onRetry={handleReset} />
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-200/20 backdrop-blur-sm relative z-10">
        © 2026 Politecnico (Dicatech) — Progetto Agente AI | Monitoraggio Bandi
      </footer>
    </div>
  );
}
