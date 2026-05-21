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
    return { label: 'Priorità Bassa', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' };
  }

  return null;
}

export default function ResultCard({ data, onReset }) {
  const titolo = data.titolo || 'Titolo non disponibile';
  const scadenza = data.scadenza || 'Data non specificata';
  const requisiti = normalizzaRequisiti(data.requisiti);

  // ── Badge dinamico priorità / scadenza ──
  const badge = useMemo(
    () => calcolaBadge(data.ScadenzaISO, data.priorita),
    [data.ScadenzaISO, data.priorita]
  );

  return (
    <section className="w-full max-w-2xl fade-in-up">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* ── Titolo del documento ── */}
        <div className="bg-poli-900 px-8 py-6">
          <p className="text-poli-200 text-xs uppercase tracking-widest font-semibold mb-1">
            Titolo Documento
          </p>
          <h2 className="text-2xl font-bold text-white leading-snug">{titolo}</h2>
        </div>
        {/* ── Banner: stato inserimento nel DB ── */}
        <div className="px-8 pt-6 pb-2">
          {data.gia_presente ? (
            <div className="flex items-center gap-4 bg-blue-50/80 border border-blue-200/60 rounded-xl px-5 py-3.5 shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-900 font-semibold">Bando già presente</p>
                <p className="text-xs text-blue-700/80 mt-0.5">Nessun nuovo inserimento effettuato nel database.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-emerald-50/80 border border-emerald-200/60 rounded-xl px-5 py-3.5 shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-emerald-900 font-semibold">Nuovo bando archiviato</p>
                <p className="text-xs text-emerald-700/80 mt-0.5">Bando inserito con successo nel database.</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 space-y-8">
          {/* ── Scadenza & Priorità ── */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 overflow-hidden">
            {/* Riga superiore: data di scadenza */}
            <div className="flex items-center gap-3 px-5 py-4">
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
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
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Scadenza</p>
                <p className="text-gray-800 font-semibold text-base">{scadenza}</p>
              </div>
            </div>

            {/* Riga inferiore: badge priorità (solo se presente) */}
            {badge && (
              <div className="border-t border-gray-200 px-5 py-3 flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Stato</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
              </div>
            )}
          </div>

          {/* ── Requisiti Estratti ── */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-3">
              Requisiti Estratti
            </h3>
            <ul className="space-y-2">
              {requisiti.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-gray-700 text-sm"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Pulsante reset ── */}
          <button
            onClick={onReset}
            className="w-full mt-4 bg-poli-600 hover:bg-poli-700 active:bg-poli-800 text-white font-semibold py-3 rounded-xl transition-colors shadow cursor-pointer"
          >
            ↻ Analizza un altro bando
          </button>
        </div>
      </div>
    </section>
  );
}
