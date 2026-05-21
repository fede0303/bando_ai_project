# Bando AI Project

Piattaforma di automazione basata su n8n con frontend React per la gestione e analisi di documenti PDF.

## Architettura

```
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

## Prerequisiti

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

## Setup rapido

### 1. Clona il repository

```bash
git clone https://github.com/TUO-USERNAME/bando-ai-project.git
cd bando-ai-project
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env
# Modifica .env con le tue credenziali
```

### 3. Avvia l'infrastruttura Docker

```bash
docker compose up -d
```

### 4. Avvia il frontend

```bash
cd frontend
npm install
npm run dev
```

## Servizi e porte

| Servizio       | URL                          | Descrizione                     |
|----------------|------------------------------|---------------------------------|
| n8n            | http://localhost:5678        | Interfaccia workflow            |
| Mongo Express  | http://localhost:8081        | Gestione database               |
| Frontend React | http://localhost:5173        | Interfaccia utente              |

## Struttura del progetto

```
bando-ai-project/
├── docker-compose.yml          # Infrastruttura (n8n, MongoDB, runner)
├── n8n-task-runners.json       # Policy di sicurezza del runner Python
├── frontend/                   # App React
│   ├── src/
│   ├── package.json
│   └── ...
├── .env.example                # Template variabili d'ambiente
├── .gitignore                  # File esclusi da Git
└── README.md                   # Questa documentazione
```

## Collaborazione

### Workflow Git

1. Crea un branch per la tua feature: `git checkout -b feature/nome-feature`
2. Fai le modifiche e committale: `git add . && git commit -m "descrizione"`
3. Pusha il branch: `git push origin feature/nome-feature`
4. Apri una Pull Request su GitHub per la revisione

### Regole importanti

- **Non committare mai** il file `.env` (contiene le password)
- **Non modificare** `n8n-task-runners.json` senza avvisare il team
- Dopo ogni modifica al `docker-compose.yml`, riavvia con `docker compose down && docker compose up -d`
