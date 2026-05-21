/**
 * api.js — Servizio per la comunicazione con il backend n8n
 *
 * Contiene la costante WEBHOOK_URL (facilmente modificabile)
 * e la funzione per inviare il PDF e parsare la risposta.
 */
import * as pdfjsLib from 'pdfjs-dist';
// ── Import locale del worker tramite Vite (?url) ──
// Questo evita qualsiasi dipendenza da CDN e garantisce sempre la versione corretta
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// ───────────────────────────────────────────────
// COSTANTE: URL del webhook n8n
// ───────────────────────────────────────────────
const WEBHOOK_URL = 'http://localhost:5678/webhook-test/pdf-upload';

// ── Limiti di sicurezza ──
const MAX_FILE_SIZE_MB = 30; // Dimensione massima del file in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const FETCH_TIMEOUT_MS = 120_000; // Timeout fetch: 2 minuti (per latenza LLM)

/**
 * Valida il file prima dell'invio.
 * Controlla estensione, MIME type e dimensione.
 *
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validaFile(file) {
  if (!file) {
    return { valid: false, error: 'Nessun file selezionato.' };
  }

  // Controllo estensione
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Formato non valido. Carica esclusivamente file .pdf.' };
  }

  // Controllo MIME type (protezione aggiuntiva contro file rinominati)
  if (file.type && file.type !== 'application/pdf') {
    return {
      valid: false,
      error: 'Il file non sembra essere un PDF valido (MIME type non corrispondente).',
    };
  }

  // Controllo dimensione
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Il file è troppo grande (${sizeMB} MB). Il limite massimo è ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Controlla se il PDF è protetto da password tentando di aprirlo con pdfjs-dist.
 * Se il file è criptato, pdfjs lancia un PasswordException che intercettiamo.
 *
 * @param {File} file
 * @returns {Promise<void>}
 * @throws {Error} — Se il PDF è protetto da password
 */
async function controllaPdfProtetto(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    // Se arriviamo qui, il PDF si è aperto senza problemi
    pdf.destroy();
  } catch (error) {
    if (error?.name === 'PasswordException') {
      throw new Error(
        'Il PDF è protetto da password. Rimuovi la protezione prima di caricarlo.'
      );
    }
    // Per qualsiasi altro errore di parsing (file corrotto, ecc.)
    throw new Error(
      'Il file PDF sembra essere corrotto o non leggibile. Prova con un altro file.'
    );
  }
}

/**
 * Invia un file PDF al webhook n8n e restituisce i dati estratti.
 * Gestisce in modo robusto il parsing JSON, inclusi array wrapping
 * e campi annidati (output, json).
 *
 * Include:
 *  - Timeout di 2 minuti per evitare spinner infiniti
 *  - Validazione del formato/dimensione
 *  - Controllo PDF protetto da password
 *
 * @param {File} file — Il file PDF da inviare
 * @returns {Promise<{titolo: string, scadenza: string, requisiti: string[]}>}
 * @throws {Error} — In caso di errore di rete, parsing, o dati mancanti
 */
export async function inviaAlBackend(file) {
  // ── Validazione preventiva (sincrona) ──
  const check = validaFile(file);
  if (!check.valid) {
    throw new Error(check.error);
  }

  // ── Controllo PDF protetto da password ──
  await controllaPdfProtetto(file);

  const formData = new FormData();
  formData.append('data', file);

  // Tempo minimo di visualizzazione dello spinner (1.5s)
  const spinnerMinimo = new Promise((r) => setTimeout(r, 1500));

  // ── Timeout: AbortController per evitare attese infinite ──
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const [response] = await Promise.all([
      fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      }),
      spinnerMinimo,
    ]);

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Risposta HTTP non valida: ${response.status}`);
    }

    // ── Leggi la risposta come testo grezzo (utile per gestire errori di parsing) ──
    const testoGrezzo = await response.text();

    // ── Tenta il parsing JSON ──
    let data;
    try {
      data = JSON.parse(testoGrezzo);
    } catch {
      throw new Error(
        'n8n ha risposto ma non in formato JSON valido. ' +
        'Controlla il nodo "Respond to Webhook" e imposta ' +
        '"Respond With" su "JSON". Risposta ricevuta: ' +
        testoGrezzo.substring(0, 200)
      );
    }

    // ── n8n a volte wrappa la risposta in un array ──
    if (Array.isArray(data)) {
      data = data[0] || {};
    }

    // ── Se i dati sono dentro un campo "output" o "json" ──
    if (data.output && typeof data.output === 'object') {
      data = data.output;
    }
    if (data.json && typeof data.json === 'object') {
      data = data.json;
    }

    // ── Validazione finale ──
    if (!data || (!data.titolo && !data.scadenza && !data.requisiti)) {
      throw new Error(
        'Il server ha risposto, ma i campi titolo/scadenza/requisiti ' +
        'non sono presenti. Risposta ricevuta: ' +
        JSON.stringify(data).substring(0, 300)
      );
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    // ── Gestione errore timeout ──
    if (err.name === 'AbortError') {
      throw new Error(
        `Il server non ha risposto entro ${FETCH_TIMEOUT_MS / 1000} secondi. ` +
        'Il workflow n8n potrebbe essere bloccato o il PDF troppo complesso.'
      );
    }
    throw err;
  }
}

/**
 * Normalizza il campo "requisiti" che può arrivare come array o stringa.
 * Pulisce prefissi residui (-, •, numeri) e capitalizza.
 *
 * @param {string|string[]} rawRequisiti
 * @returns {string[]}
 */
export function normalizzaRequisiti(rawRequisiti) {
  let requisiti = [];

  if (Array.isArray(rawRequisiti)) {
    requisiti = rawRequisiti;
  } else if (typeof rawRequisiti === 'string' && rawRequisiti.trim()) {
    requisiti = rawRequisiti
      .split(/\n|;/)
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
  }

  // Pulizia: rimuove prefissi residui e capitalizza
  return requisiti
    .map((r) => r.replace(/^[\s\-–—•*]+/, '').trim())       // trattini e bullet
    .map((r) => r.replace(/^\d+[.):\-]\s*/, '').trim())      // numerazione (1., 2), ecc.)
    .map((r) => r.replace(/^[a-zA-Z][.):\-]\s*/i, '').trim()) // lettere (a., b), C-, ecc.)
    .filter((r) => r.length > 2)
    .map((r) => r.charAt(0).toUpperCase() + r.slice(1));
}
