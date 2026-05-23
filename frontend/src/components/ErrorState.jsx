/**
 * ErrorState.jsx — Gestisce i fallimenti di rete o di formato con stile premium
 *
 * Props:
 *   - message: string — Il messaggio di errore da mostrare
 *   - onRetry: () => void — callback per riprovare
 */
export default function ErrorState({ message, onRetry }) {
  return (
    <section className="w-full max-w-md text-center fade-in-up">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-red-200/80 shadow-2xl p-10 md:p-12 flex flex-col items-center">
        {/* Modern Error Icon Frame */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-6 shadow-sm">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-extrabold text-red-800 tracking-tight">Errore di comunicazione</h3>
        <p className="text-sm text-gray-500 mt-2.5 mb-6 leading-relaxed max-w-xs">{message}</p>
        
        <button
          onClick={onRetry}
          className="group w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-md shadow-red-600/10 hover:shadow-lg hover:shadow-red-600/20 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 duration-200"
        >
          <svg
            className="w-4 h-4 shrink-0 transition-transform duration-500 group-hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Riprova caricamento
        </button>
      </div>
    </section>
  );
}
