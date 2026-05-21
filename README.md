# Bando AI

Sistema di automazione per la gestione e l'analisi di documenti PDF, costruito su un'architettura a microservizi orchestrata da n8n con interfaccia utente in React.

## Panoramica

Il progetto nasce dall'esigenza di automatizzare l'analisi documentale nell'ambito dei bandi pubblici. L'infrastruttura si compone di quattro servizi containerizzati che collaborano tramite una rete Docker interna, affiancati da un'applicazione frontend indipendente.

### Architettura

```text
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
│                                                         │
│  ┌───────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │    n8n    │───│  n8n-runner  │   │    MongoDB     │  │
│  │  :5678    │   │  (Python/JS) │   │    :27017      │  │
│  └───────────┘   └──────────────┘   └────────────────┘  │
│                                      ┌────────────────┐  │
│                                      │ Mongo Express  │  │
│                                      │    :8081       │  │
│                                      └────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 Frontend React  :5173                    │
└─────────────────────────────────────────────────────────┘
```

| Servizio | Tecnologia | Ruolo |
|----------|------------|-------|
| **n8n** | n8nio/n8n | Orchestratore dei workflow. Espone l'interfaccia visuale sulla porta 5678 e un broker interno sulla porta 5679 per la comunicazione con il Task Runner. |
| **n8n-runner** | n8nio/runners | Ambiente di esecuzione isolato per il codice Python e JavaScript definito nei nodi Code di n8n. Le policy di sicurezza (moduli consentiti) sono gestite tramite un file JSON dedicato, montato in sola lettura. |
| **MongoDB** | mongo | Database NoSQL per la persistenza dei dati applicativi. I dati risiedono su un volume Docker e sopravvivono al riavvio dei container. |
| **Mongo Express** | mongo-express | Interfaccia web di amministrazione del database, accessibile sulla porta 8081. Utile in fase di sviluppo e debug. |
| **Frontend** | React + Vite | Interfaccia utente. Gira in locale sulla porta 5173 durante lo sviluppo. |

### Struttura del repository

```text
bando-ai-project/
├── docker-compose.yml            # Definizione dell'infrastruttura
├── n8n-task-runners.json         # Policy di esecuzione del Task Runner
├── frontend/                     # Applicazione React
│   ├── src/
│   ├── package.json
│   └── ...
├── .env.example                  # Template delle variabili d'ambiente
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

Le credenziali di accesso ai servizi non sono versionate per ragioni di sicurezza. Il repository include un file template (`.env.example`) che va duplicato e compilato con i valori concordati internamente.

```bash
cp .env.example .env
```

Aprire il file `.env` appena creato e inserire i valori reali per ciascuna variabile. Il file è già presente nel `.gitignore` e non verrà mai incluso nei commit.

Le variabili richieste sono:

| Variabile | Descrizione |
|-----------|-------------|
| `N8N_RUNNERS_AUTH_TOKEN` | Token di autenticazione condiviso tra il server n8n e il Task Runner. Può essere una stringa alfanumerica a scelta. |
| `MONGO_ROOT_USERNAME` | Nome utente dell'amministratore MongoDB. |
| `MONGO_ROOT_PASSWORD` | Password dell'amministratore MongoDB. |
| `ME_BASICAUTH_USERNAME` | Nome utente per l'accesso a Mongo Express. |
| `ME_BASICAUTH_PASSWORD` | Password per l'accesso a Mongo Express. |

### 3. Avviare l'infrastruttura

Assicurarsi che Docker Desktop sia in esecuzione, quindi lanciare:

```bash
docker compose up -d
```

Al primo avvio il download delle immagini potrebbe richiedere alcuni minuti. Il flag `-d` esegue i container in background.

### 4. Avviare il frontend

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

Se dopo un `git pull` risultano modifiche al file `docker-compose.yml` o al file `.env`, è necessario riavviare i container affinché le nuove configurazioni vengano applicate:

```bash
docker compose up -d
```

Docker riconosce automaticamente quali container necessitano di essere ricreati e lascia invariati quelli non interessati dalle modifiche.

---

## Note sulla sicurezza

- **Il file `.env` non deve mai essere incluso in un commit.** Contiene le credenziali di accesso ai servizi. Il `.gitignore` ne impedisce il tracciamento, ma è responsabilità di ciascun collaboratore verificare che non venga aggiunto manualmente.

- **Le policy di esecuzione del codice Python** sono definite nel file `n8n-task-runners.json`, che viene montato in sola lettura nel container del Task Runner. L'architettura di n8n prevede che queste policy vengano lette esclusivamente da file e non da variabili d'ambiente, in modo da garantire un confine di sicurezza indipendente dal container. Qualsiasi modifica a questo file (ad esempio l'aggiunta di moduli nella allowlist) va concordata con il team.

- **Il `docker-compose.yml` non contiene credenziali in chiaro.** Tutti i valori sensibili sono referenziati tramite variabili d'ambiente (`${VARIABILE}`) e risolti a runtime dal file `.env` locale.

---

## Tecnologie utilizzate

| Componente | Tecnologia | Versione |
|------------|------------|----------|
| Orchestrazione workflow | [n8n](https://n8n.io/) | latest |
| Task Runner | [n8n runners](https://docs.n8n.io/hosting/configuration/task-runners/) | latest |
| Database | [MongoDB](https://www.mongodb.com/) | latest |
| Admin DB | [Mongo Express](https://github.com/mongo-express/mongo-express) | latest |
| Frontend | [React](https://react.dev/) + [Vite](https://vitejs.dev/) | — |
| Containerizzazione | [Docker Compose](https://docs.docker.com/compose/) | v2 |
