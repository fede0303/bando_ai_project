/**
 * ResultCard.jsx — Mostra i risultati dell'analisi AI del bando
 *
 * Props:
 *   - data: { titolo, scadenza, requisiti, ScadenzaISO?, priorita? }
 *   - onReset: () => void — callback per analizzare un altro bando
 */
import { useMemo } from 'react';
import { normalizzaRequisiti } from '../services/api';

/**
 * Calcola il badge di stato/priorità con logica sequenziale:
 *   1. Se ScadenzaISO è nel passato → grigio "Scaduto"
 *   2. priorita "Alta"  → rosso
 *   3. priorita "Media" → arancione
 *   4. priorita "Bassa" → verde
 */
function calcolaBadge(scadenzaISO, priorita) {
  const p = (priorita || '').trim().toLowerCase();

  // 1. Controllo scadenza (priorità massima): se la data è passata o la priorità è esplicitamente "scaduto"
  let isScaduto = false;
  if (scadenzaISO) {
    const d = new Date(scadenzaISO);
    if (!isNaN(d.getTime()) && d < new Date()) {
      isScaduto = true;
    }
  }
  if (p === 'scaduto') {
    isScaduto = true;
  }

  if (isScaduto) {
    return { label: 'Scaduto', dot: 'bg-gray-500', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
  }

  // 2–4. Priorità (solo se non scaduto)
  if (p === 'alta' || p === 'urgente') {
    return { label: 'Priorità Alta', dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' };
  }
  if (p === 'media') {
    return { label: 'Priorità Media', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' };
  }
  if (p === 'bassa') {
    return { label: 'Priorità Bassa', dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' };
  }

  return null;
}

export default function ResultCard({ data, onReset }) {
  const titolo = data.titolo || 'Titolo non disponibile';
  
  // Determina e formatta la data di scadenza
  const scadenzaRaw = data.ScadenzaISO || data.scadenza;
  let scadenza = 'Data non specificata';
  
  if (scadenzaRaw) {
    const d = new Date(scadenzaRaw);
    if (!isNaN(d.getTime())) {
      // Gestisce il parsing corretto per date semplici YYYY-MM-DD senza timezone shift
      const matchSoloData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(scadenzaRaw).trim());
      if (matchSoloData) {
        const year = parseInt(matchSoloData[1], 10);
        const month = parseInt(matchSoloData[2], 10) - 1;
        const day = parseInt(matchSoloData[3], 10);
        const localDate = new Date(year, month, day);
        scadenza = localDate.toLocaleDateString('it-IT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } else {
        const haOra = String(scadenzaRaw).includes('T') || String(scadenzaRaw).includes(':');
        scadenza = d.toLocaleString('it-IT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          ...(haOra ? { hour: '2-digit', minute: '2-digit' } : {})
        });
      }
    } else {
      scadenza = scadenzaRaw;
    }
  }

  const requisiti = normalizzaRequisiti(data.requisiti);

  // ── Badge dinamico priorità / scadenza ──
  const badge = useMemo(
    () => calcolaBadge(data.ScadenzaISO, data.priorita),
    [data.ScadenzaISO, data.priorita]
  );

  return (
    <section className="w-full max-w-2xl fade-in-up">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/60 shadow-2xl overflow-hidden">
        {/* ── Titolo del documento con gradiente ── */}
        <div className="bg-gradient-to-r from-poli-900 to-poli-800 px-8 py-7 relative overflow-hidden">
          {/* Subtle design element */}
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
          
          <p className="text-poli-200 text-[10px] uppercase tracking-widest font-bold mb-1.5">
            Analisi Completata — Titolo Documento
          </p>
          <h2 className="text-xl md:text-2xl font-extrabold text-white leading-snug drop-shadow-sm">{titolo}</h2>
        </div>

        {/* ── Banner: stato inserimento nel DB ── */}
        <div className="px-8 pt-6 pb-1">
          {data.gia_presente ? (
            <div className="flex items-center gap-4 bg-blue-50/70 border border-blue-200/50 rounded-2xl px-5 py-3.5 shadow-sm">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-100/80 text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Stato Database</p>
                <p className="text-sm text-blue-900 font-semibold mt-0.5">Bando già archiviato nel sistema</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-emerald-50/70 border border-emerald-200/50 rounded-2xl px-5 py-3.5 shadow-sm">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Stato Database</p>
                <p className="text-sm text-emerald-900 font-semibold mt-0.5">Nuovo bando archiviato con successo</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 pt-4 space-y-6">
          {/* ── Scadenza & Priorità ── */}
          <div className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Riga superiore: data di scadenza */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm shrink-0">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Scadenza Bando</p>
                <p className="text-gray-800 font-bold text-base mt-0.5">{scadenza}</p>
              </div>
            </div>

            {/* Riga inferiore: badge priorità (solo se presente) */}
            {badge && (
              <div className="flex items-center gap-3 sm:border-l sm:border-gray-200 sm:pl-6">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Stato Priorità</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border} shadow-sm`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Requisiti Estratti ── */}
          {requisiti.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-poli-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Requisiti di Partecipazione
              </h3>
              <ul className="space-y-2.5">
                {requisiti.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 bg-gray-50/40 border border-gray-100 rounded-2xl px-5 py-4 text-gray-700 text-sm hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Pulsante reset ── */}
          <button
            onClick={onReset}
            className="group w-full mt-4 bg-poli-600 hover:bg-poli-700 active:bg-poli-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-poli-600/10 hover:shadow-lg hover:shadow-poli-600/20 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 duration-200"
          >
            <svg
              className="w-5 h-5 shrink-0 transition-transform duration-500 group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Analizza un altro bando
          </button>
        </div>
      </div>
    </section>
  );
}
