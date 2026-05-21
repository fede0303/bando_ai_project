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
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {appState === 'idle' && <DropZone onFileSelected={handleFileSelected} />}
        {appState === 'loading' && <LoadingSpinner />}
        {appState === 'success' && resultData && (
          <ResultCard data={resultData} onReset={handleReset} />
        )}
        {appState === 'error' && (
          <ErrorState message={errorMessage} onRetry={handleReset} />
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-4">
        © 2026 Politecnico — Progetto Agente AI | Monitoraggio Bandi
      </footer>
    </div>
  );
}
