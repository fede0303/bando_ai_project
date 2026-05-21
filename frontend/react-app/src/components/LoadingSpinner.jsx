/**
 * LoadingSpinner.jsx — Feedback visivo durante l'attesa della chiamata API
 */
export default function LoadingSpinner() {
  return (
    <section className="w-full max-w-2xl text-center">
      <div className="bg-white rounded-2xl shadow-md p-16">
        <svg
          className="spinner mx-auto w-16 h-16 text-poli-600 mb-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-xl font-bold text-poli-800">Analisi del bando in corso</p>
        <p className="text-sm text-gray-400 mt-3">
          Questo processo può richiedere qualche secondo.
        </p>
      </div>
    </section>
  );
}
