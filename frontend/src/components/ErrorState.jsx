/**
 * ErrorState.jsx — Gestisce i fallimenti di rete o di formato
 *
 * Props:
 *   - message: string — Il messaggio di errore da mostrare
 *   - onRetry: () => void — callback per riprovare
 */
export default function ErrorState({ message, onRetry }) {
  return (
    <section className="w-full max-w-2xl text-center fade-in-up">
      <div className="bg-white rounded-2xl shadow-md p-12 border border-red-200">
        {/* Icona errore */}
        <svg
          className="mx-auto w-14 h-14 text-red-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <p className="text-lg font-bold text-red-700 mb-2">Errore di comunicazione</p>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="bg-poli-600 hover:bg-poli-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow cursor-pointer"
        >
          ↻ Riprova
        </button>
      </div>
    </section>
  );
}
