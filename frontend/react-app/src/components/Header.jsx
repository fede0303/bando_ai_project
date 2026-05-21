/**
 * Header.jsx — Intestazione fissa dell'applicazione
 */
export default function Header() {
  return (
    <header className="bg-poli-900 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
        {/* Icona università */}
        <svg
          className="w-8 h-8 text-poli-200 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3L1 9l11 6 9-4.91V17M4 11.09V17a1 1 0 00.4.8l7.2 4.8a1 1 0 001.2 0l7.2-4.8A1 1 0 0020 17v-5.91"
          />
        </svg>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            AI Bando Monitor – Politecnico
          </h1>
          <p className="text-poli-200 text-sm mt-0.5">
            Monitoraggio intelligente di atti e scadenze
          </p>
        </div>
      </div>
    </header>
  );
}
