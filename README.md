# Bando AI

Sistema di automazione per la gestione e l'analisi di documenti PDF, costruito su un'architettura a microservizi orchestrata da n8n con interfaccia utente in React.

## Panoramica

Il progetto nasce dall'esigenza di automatizzare l'analisi documentale nell'ambito dei bandi pubblici. L'infrastruttura si compone di quattro servizi containerizzati che collaborano tramite una rete Docker interna, affiancati da un'applicazione frontend indipendente.

Il frontend è configurato specificamente per il monitoraggio e l'estrazione dei bandi ufficiali del **Dipartimento Dicatech** (Dipartimento di Ingegneria Civile, Ambientale, del Territorio, Edile e di Chimica) del Politecnico, supportando il caricamento e la validazione di documenti PDF con una dimensione massima di **20 MB**.

### Architettura

```text
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                       │
│                                                         │
│  ┌───────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │    n8n    │───│  n8n-runner  │   │    MongoDB     │  │
│  │  :5678    │   │  (Python/JS) │   │    :27017      │  │
│  └───────────┘   └──────────────┘   └────────────────┘  │
│                                      ┌────────────────┐ │
│                                      │ Mongo Express  │ │
│                                      │    :8081       │ │
│                                      └────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 Frontend React  :5173                   │
└─────────────────────────────────────────────────────────┘
```

| Servizio | Tecnologia | Ruolo |
|----------|------------|-------|
| **n8n** | n8nio/n8n | Orchestratore dei workflow. Espone l'interfaccia visuale sulla porta 5678 e un broker interno sulla porta 5679 per la comunicazione con il Task Runner. |
| **n8n-runner** | Custom (da `Dockerfile.runner`) | Ambiente di esecuzione isolato per il codice Python e JavaScript dei nodi Code di n8n. Estende l'immagine base `n8nio/runners` con la libreria `pdfplumber` pre-installata. Le policy di sicurezza (moduli consentiti) sono gestite tramite un file JSON dedicato, montato in sola lettura. |
| **MongoDB** | mongo | Database NoSQL per la persistenza dei dati applicativi. I dati risiedono su un volume Docker e sopravvivono al riavvio dei container. |
| **Mongo Express** | mongo-express | Interfaccia web di amministrazione del database, accessibile sulla porta 8081. Utile in fase di sviluppo e debug. |
| **Frontend** | React + Vite + Tailwind CSS v4 | Interfaccia utente. Gira in locale sulla porta 5173 durante lo sviluppo. Usa `pdfjs-dist` per la validazione client-side dei PDF (password, corruzione) prima dell'invio. |

### Struttura del repository

```text
bando-ai-project/
├── docker-compose.yml            # Definizione dell'infrastruttura
├── Dockerfile.runner             # Build custom del Task Runner (aggiunge pdfplumber)
├── n8n-task-runners.json         # Policy di esecuzione del Task Runner
├── workflow_v5.json              # Workflow n8n da importare (versione corrente)
├── workflow_v4.json              # Versione precedente del workflow (archivio)
├── frontend/                     # Applicazione React
│   ├── src/
│   │   ├── components/           # Header, DropZone, ResultCard, LoadingSpinner, ErrorState
│   │   ├── services/api.js       # Logica di comunicazione con il webhook n8n
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example              # Template variabile VITE_API_URL (da copiare in .env)
│   ├── package.json
│   └── vite.config.js
├── .env.example                  # Template variabili d'ambiente Docker
├── .gitignore
└── README.md
```

---

## Requisiti

Prima di procedere, verificare di avere installato:

- **Git** — [download](https://git-scm.com/downloads)
- **Docker Desktop** — [download](https://www.docker.com/products/docker-desktop/) (deve essere in esecuzione)
- **Node.js v18+** (LTS) — [download](https://nodejs.org/)

---

## Installazione

### 1. Clonare il repository

```bash
git clone https://github.com/fede0303/bando-ai-project.git
cd bando-ai-project
```

### 2. Configurare le variabili d'ambiente

Il progetto utilizza **due file `.env`** separati: uno per l'infrastruttura Docker e uno per il frontend.

#### 2a. Variabili Docker (nella cartella principale)

```bash
cp .env.example .env
```

Aprire il file `.env` appena creato e inserire i valori reali per ciascuna variabile:

| Variabile | Descrizione |
|-----------|-------------|
| `N8N_RUNNERS_AUTH_TOKEN` | Token di autenticazione condiviso tra il server n8n e il Task Runner. Può essere una stringa alfanumerica a scelta. |
| `MONGO_ROOT_USERNAME` | Nome utente dell'amministratore MongoDB. |
| `MONGO_ROOT_PASSWORD` | Password dell'amministratore MongoDB. |
| `ME_BASICAUTH_USERNAME` | Nome utente per l'accesso a Mongo Express. |
| `ME_BASICAUTH_PASSWORD` | Password per l'accesso a Mongo Express. |

#### 2b. Variabili frontend (nella cartella `frontend/`)

```bash
cp frontend/.env.example frontend/.env
```

Il file pre-compilato punta già al webhook corretto per lo sviluppo locale. Modificarlo solo se si usa un URL diverso:

| Variabile | Descrizione |
|-----------|-------------|
| `VITE_API_URL` | URL del webhook n8n che riceve i PDF. In sviluppo: `http://localhost:5678/webhook-test/pdf-upload`. In produzione (workflow attivato): `http://localhost:5678/webhook/pdf-upload`. |

> **Nota:** I file `.env` sono nel `.gitignore` e non verranno mai inclusi nei commit.

### 3. Avviare l'infrastruttura Docker

Assicurarsi che Docker Desktop sia in esecuzione, quindi lanciare:

```bash
docker compose up -d
```

Al primo avvio Docker costruirà l'immagine custom del runner (`Dockerfile.runner`) e scaricherà le immagini degli altri servizi. Questo potrebbe richiedere alcuni minuti. Il flag `-d` esegue i container in background.

### 4. Importare il workflow in n8n

> **Questo passaggio è indispensabile.** Senza il workflow, n8n non sa come elaborare i PDF inviati dal frontend.

1. Aprire n8n nel browser: **http://localhost:5678**
2. Al primo accesso verrà chiesto di creare un account (locale, non richiede email reale).
3. Una volta dentro, cliccare sul menu in alto a sinistra → **"Workflows"**.
4. Cliccare su **"Import from File"** (o l'icona di importazione).
5. Selezionare il file **`workflow_v5.json`** dalla cartella principale del progetto.
6. Il workflow viene importato. Per poterlo usare con il frontend in modalità sviluppo:
   - Aprire il workflow.
   - Cliccare sul nodo **"Webhook"** per aprire il pannello di test.
   - Tenere aperto n8n durante i test (il webhook-test è attivo solo con l'editor aperto).

> Per l'uso in produzione, attivare il workflow con il toggle in alto a destra e usare `VITE_API_URL=http://localhost:5678/webhook/pdf-upload` nel file `frontend/.env`.

### 5. Avviare il frontend

```bash
cd frontend
npm install
npm run dev
```

`npm install` è necessario solo al primo avvio o quando vengono aggiornate le dipendenze.

---

## Accesso ai servizi

Una volta completata l'installazione:

| Servizio | URL | Note |
|----------|-----|------|
| Frontend | http://localhost:5173 | Interfaccia utente |
| n8n | http://localhost:5678 | Editor dei workflow |
| Mongo Express | http://localhost:8081 | Credenziali: vedi file `.env` |

---

## Spegnimento

Per terminare l'esecuzione dei servizi:

1. Arrestare il frontend con `Ctrl + C` nel terminale in cui è attivo.
2. Arrestare i container Docker dalla cartella principale del progetto:

```bash
docker compose down
```

I dati del database sono persistenti e non vengono persi allo spegnimento.

---

## Collaborazione

### Flusso di lavoro Git

Il ramo `main` è protetto: non va mai modificato direttamente. Per ogni intervento — nuova funzionalità, correzione, modifica infrastrutturale — si opera su un ramo dedicato.

```bash
# Aggiornare il ramo principale
git checkout main
git pull

# Creare un ramo di lavoro
git checkout -b feature/descrizione-intervento
```

Al termine del lavoro, salvare e inviare le modifiche:

```bash
git add .
git commit -m "Descrizione sintetica dell'intervento"
git push origin feature/descrizione-intervento
```

Su GitHub, aprire una **Pull Request** verso `main`. Il merge avviene dopo la revisione da parte di almeno un altro membro del team.

### Aggiornamento dell'infrastruttura Docker

Se dopo un `git pull` risultano modifiche al file `docker-compose.yml`, al `Dockerfile.runner` o al file `.env`, è necessario riavviare i container (e, se necessario, ricostruire le immagini):

```bash
docker compose up -d --build
```

Docker riconosce automaticamente quali container necessitano di essere ricreati e lascia invariati quelli non interessati dalle modifiche.

---

## Note sulla sicurezza

- **I file `.env` non devono mai essere inclusi in un commit.** Contengono le credenziali di accesso ai servizi. Il `.gitignore` ne impedisce il tracciamento, ma è responsabilità di ciascun collaboratore verificare che non vengano aggiunti manualmente. Questo vale sia per `.env` nella root che per `frontend/.env`.

- **Le policy di esecuzione del codice Python** sono definite nel file `n8n-task-runners.json`, che viene montato in sola lettura nel container del Task Runner. L'architettura di n8n prevede che queste policy vengano lette esclusivamente da file e non da variabili d'ambiente, in modo da garantire un confine di sicurezza indipendente dal container. Qualsiasi modifica a questo file (ad esempio l'aggiunta di moduli nella allowlist) va concordata con il team.

- **Il `docker-compose.yml` non contiene credenziali in chiaro.** Tutti i valori sensibili sono referenziati tramite variabili d'ambiente (`${VARIABILE}`) e risolti a runtime dal file `.env` locale.

---

## Tecnologie utilizzate

| Componente | Tecnologia | Versione |
|------------|------------|----------|
| Orchestrazione workflow | [n8n](https://n8n.io/) | latest |
| Task Runner | [n8n runners](https://docs.n8n.io/hosting/configuration/task-runners/) + pdfplumber | latest |
| Database | [MongoDB](https://www.mongodb.com/) | latest |
| Admin DB | [Mongo Express](https://github.com/mongo-express/mongo-express) | latest |
| Frontend framework | [React](https://react.dev/) + [Vite](https://vitejs.dev/) | v19 / v8 |
| Stile UI | [Tailwind CSS](https://tailwindcss.com/) | v4 |
| Validazione PDF client | [pdfjs-dist](https://github.com/mozilla/pdf.js) | v5 |
| Containerizzazione | [Docker Compose](https://docs.docker.com/compose/) | v2 |
