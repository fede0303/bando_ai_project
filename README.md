# 🚀 Bando AI Project

Benvenuto nel progetto Bando AI! Questo repository contiene una **piattaforma di automazione basata su n8n con frontend React**, progettata per la gestione e l'analisi intelligente di documenti PDF.

---

## 🏗️ Architettura del Progetto

Il progetto è diviso in due macro-aree: l'infrastruttura backend (eseguita interamente tramite Docker) e l'interfaccia utente frontend.

```text
┌─────────────────────────────────────────────────────┐
│                  Docker Compose                     │
│                                                     │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │   n8n    │──│ n8n-runner │  │    MongoDB       │ │ 
│  │ :5678    │  │ (Python/JS)│  │    :27017        │ │
│  └──────────┘  └────────────┘  └──────────────────┘ │
│                                 ┌──────────────────┐│
│                                 │  Mongo Express   ││
│                                 │  :8081           ││
│                                 └──────────────────┘│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Frontend React (:5173)                             │
└─────────────────────────────────────────────────────┘
```

### Struttura delle Cartelle

```text
bando-ai-project/
├── docker-compose.yml          # Infrastruttura (n8n, MongoDB, runner)
├── n8n-task-runners.json       # Policy di sicurezza del runner Python
├── frontend/                   # App React (UI)
│   ├── src/
│   ├── package.json
│   └── ...
├── .env.example                # Template per le password
├── .gitignore                  # File e cartelle esclusi da Git
└── README.md                   # Questo documento
```

---

## 📚 Guida al Setup (Per il Team)

Questa sezione è una guida passo-passo pensata per farti configurare e avviare il progetto sul tuo computer nel minor tempo possibile e senza errori.

### 🛑 Prerequisiti: Cosa devi avere installato PRIMA di iniziare

Se non hai questi programmi installati, il progetto non funzionerà. Assicurati di averli:

1. **[Git](https://git-scm.com/downloads)**: Per scaricare il codice e gestire le versioni.
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: Deve essere installato e **avviato** (l'icona della balena deve essere visibile e attiva nel tuo sistema).
3. **[Node.js](https://nodejs.org/it/download/)**: Scarica la versione "LTS" (raccomandata). Serve per avviare il frontend.

### Step 1: Scarica il codice
Apri il terminale (o il Prompt dei comandi su Windows) e lancia:
```bash
git clone https://github.com/fede0303/bando-ai-project.git
cd bando-ai-project
```

### Step 2: Configura le password e le chiavi segrete
Per motivi di sicurezza, le password non sono salvate su GitHub. Abbiamo preparato un file di esempio chiamato `.env.example`.

1. Trova il file `.env.example` nella cartella principale del progetto.
2. **Copia** quel file e rinominalo in `.env` (assicurati che ci sia il punto all'inizio e non ci siano estensioni nascoste).
   *Da terminale puoi fare:* `cp .env.example .env` (su Mac/Linux)
3. Apri il file `.env` che hai appena creato con un editor di testo e compila le variabili inserendo le password concordate con il team.
4. **Salva il file**. Git ignorerà automaticamente questo file, quindi i tuoi segreti sono al sicuro.

### Step 3: Avvia il Backend (Docker)
Assicurati che Docker Desktop sia aperto e funzionante, poi dal terminale, nella cartella principale (`bando-ai-project`), scrivi:
```bash
docker compose up -d
```
*Cosa fa questo comando?* Scarica tutto il necessario, crea il database e avvia l'orchestratore n8n. La prima volta potrebbe impiegare qualche minuto. Il `-d` significa che continuerà a girare in background in modo da lasciarti usare il terminale.

### Step 4: Avvia il Frontend (React)
Ora dobbiamo accendere l'interfaccia grafica. Spostati nella cartella del frontend e installa le librerie necessarie:
```bash
cd frontend
npm install
npm run dev
```
*Cosa fa questo comando?* `npm install` scarica tutte le dipendenze di React (va fatto solo la prima volta o se cambiano). `npm run dev` avvia il sito web.

🎉 **Finito! Il progetto è ora in esecuzione.**

---

## 🌐 Dove trovo i servizi avviati?

Una volta avviato tutto, puoi aprire il tuo browser e visitare questi link:

| Cosa cerchi? | Dove cliccare / URL | Credenziali di accesso |
|---|---|---|
| **L'App Web Frontend** | [http://localhost:5173](http://localhost:5173) | Nessuna per ora |
| **Pannello di n8n (Workflow)** | [http://localhost:5678](http://localhost:5678) | Se richieste, vedi config n8n |
| **Pannello Database (Mongo Express)** | [http://localhost:8081](http://localhost:8081) | Utente: `admin` / Password: *(vedi file .env)* |

---

## ⏸️ Come spegnere il progetto a fine giornata

Per non sprecare risorse del tuo computer, quando finisci di lavorare spegni tutto:

1. **Spegni il frontend**: Vai nel terminale dove hai lanciato `npm run dev` e premi `Ctrl + C`.
2. **Spegni Docker**: Torna nella cartella principale del progetto (`cd ..`) e scrivi:
   ```bash
   docker compose down
   ```
   *(Tranquillo, i dati salvati nel database non andranno persi, sono al sicuro in un volume dedicato!)*

---

## 🤝 Regole per lavorare in Team (Flusso Git)

Per evitare di sovrascriverci il lavoro a vicenda o rompere l'applicazione principale, usiamo questo semplice metodo:

1. **Mai lavorare sul ramo `main`**: Prima di iniziare a modificare qualcosa, scarica gli ultimi aggiornamenti e crea un tuo ramo di lavoro:
   ```bash
   git checkout main
   git pull
   git checkout -b nome-del-tuo-ramo
   # (es: git checkout -b fix-bottone-login)
   ```

2. **Salva il tuo lavoro regolarmente**:
   ```bash
   git add .
   git commit -m "Descrivi in modo chiaro cosa hai modificato"
   ```

3. **Invia il tuo lavoro su GitHub**:
   ```bash
   git push origin nome-del-tuo-ramo
   ```

4. **Chiedi di unire le modifiche**: Vai su GitHub e apri una "Pull Request" (PR). Qualcun altro del team la controllerà e la unirà al ramo `main`.

---

## ⚠️ Regole D'Oro (da non infrangere mai)

* 🔴 **MAI E POI MAI** inviare il file `.env` su GitHub. Se lo fai, le password del database diventano pubbliche. (Il file `.gitignore` dovrebbe già proteggerti, ma fai sempre attenzione).
* 🔴 Se modifichi il file `docker-compose.yml`, avvisa il team! Affinché le modifiche abbiano effetto, dovrai eseguire di nuovo `docker compose down` e poi `docker compose up -d`.
* 🔴 I permessi di quali moduli Python il server può eseguire sono decisi nel file `n8n-task-runners.json`. Non aggiungere librerie a caso in quel file senza consultare il team, per questioni di sicurezza.
