/**
 * Header.jsx — Intestazione fissa e premium dell'applicazione
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-poli-900/95 border-b border-poli-800/80 shadow-md">
      {/* Accent thin glowing line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-poli-500 via-lime-400 to-emerald-500 opacity-90" />
      
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
        {/* Icona università / AI Logo */}
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-poli-800 via-poli-700 to-poli-600 border border-poli-600/30 shadow-inner shrink-0">
          <svg
            className="w-6 h-6 text-white drop-shadow-sm"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
          </svg>
        </div>

        {/* Brand info and Status Pill */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>AI Bando</span>
                <span className="bg-gradient-to-r from-lime-400 to-emerald-300 bg-clip-text text-transparent font-semibold">Monitor</span>
              </h1>
              <span className="bg-poli-800/80 text-poli-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-poli-700/50">
                Dicatech
              </span>
            </div>
            <p className="text-poli-200/70 text-xs mt-1 font-light tracking-wide max-w-md hidden sm:block">
              Analisi intelligente, estrazione scadenze e archiviazione dei bandi del Dipartimento Dicatech
            </p>
          </div>
          
          {/* Active status pill */}
          <div className="flex items-center gap-2 bg-poli-950/70 border border-poli-800/50 rounded-full px-3.5 py-1.5 self-start md:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              AI Agent Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
