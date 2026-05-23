/**
 * LoadingSpinner.jsx — Feedback visivo premium durante l'attesa dell'analisi AI
 */
export default function LoadingSpinner() {
  return (
    <section className="w-full max-w-md text-center fade-in-up">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200/60 shadow-2xl p-12 md:p-14 flex flex-col items-center">
        {/* Futuristic Spinner */}
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          {/* Outer breathing ring */}
          <div className="absolute inset-0 rounded-full border-4 border-poli-100/60 animate-pulse" />
          
          {/* Inner spinning element */}
          <svg
            className="spinner absolute w-20 h-20 text-poli-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-10"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
            />
          </svg>
          
          {/* Core flashing node */}
          <div className="w-3.5 h-3.5 bg-gradient-to-tr from-poli-500 to-lime-400 rounded-full shadow shadow-poli-500/50 animate-ping" />
        </div>

        <h3 className="text-xl font-extrabold text-poli-900 tracking-tight">
          Analisi del bando in corso
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mt-3 leading-relaxed">
          L'agente AI sta leggendo il documento, identificando le scadenze ed estraendo i requisiti richiesti...
        </p>

        {/* Pulse status indicator */}
        <div className="mt-8 flex items-center gap-2 bg-poli-50 border border-poli-100/50 px-4 py-2 rounded-2xl text-xs font-semibold text-poli-700">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-poli-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-poli-500"></span>
          </span>
          <span>Elaborazione con LLM attiva</span>
        </div>
      </div>
    </section>
  );
}
