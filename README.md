<p align="center">
  <img src="frontend/public/intelliflow-icon.svg" alt="Intelliflow logo" width="96" />
</p>

<h1 align="center">Intelliflow</h1>

<h3 align="center">A visual workflow automation studio</h3>

<p align="center">
  Drag nodes onto a canvas, wire them together, and watch your automations run live.<br/>
  Rust engine &middot; React editor &middot; AI-ready &middot; warm by design.
</p>

<p align="center">
  <b>Final Year Project</b> &middot; Sai Preet Palam &middot; Vismay S &middot; Sneha P &middot; Sadiya Rehman
</p>

---

## Contents

- [About the project](#about-the-project)
- [Features](#features)
- [The team and who does what](#the-team-and-who-does-what)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Running it in VS Code](#running-it-in-vs-code)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Design system](#design-system)
- [Configuration](#configuration)
- [API](#api)
- [Built-in nodes](#built-in-nodes)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Acknowledgements and license](#acknowledgements-and-license)

## About the project

**Intelliflow** is a self-hosted platform for building automations visually.
Instead of writing glue code, you place **nodes** (an HTTP endpoint, a database
query, an LLM call, a WhatsApp message...) on a canvas and connect their ports.
Intelliflow validates the graph, schedules it, runs it and streams every step
back to the editor in real time.

Typical uses:

- **API back-ends without code** - receive a webhook, transform the JSON, store it, reply.
- **AI pipelines** - split documents, embed them, search a vector store, answer with an LLM.
- **Business automations** - CRM updates, SMS / WhatsApp notifications, human hand-off.
- **IoT and data jobs** - MQTT ingestion, CSV processing, batching and aggregation on a timer.

## Features

| | |
|---|---|
| **Visual editor** | Drag-and-drop canvas, searchable node palette, smart config panels, live execution log |
| **Fast engine** | Written in Rust on the Tokio async runtime; flows are DAGs executed in parallel |
| **39 built-in nodes** | HTTP, webhooks, cron, logic, databases, MQTT, CSV, 12 AI nodes, Twilio, WhatsApp, CRM |
| **Secure by default** | JWT + argon2 login, AES-256-GCM credential vault, API rate limiting, outbound egress policy |
| **Extensible** | WebAssembly plugins run in a sandbox with CPU, memory and time limits |
| **Lightweight** | One binary with the editor built in; SQLite out of the box, PostgreSQL optional |

## The team and who does what

Intelliflow is split into four areas so each member owns a clear part of the
system end to end.

| Member | Role | Owns | Main responsibilities |
|---|---|---|---|
| **Sai Preet Palam** | Project Lead & Workflow Engine | `crates/intelliflow-core`, `bins/intelliflow-cli` | Overall architecture and integration; the flow engine (DAG validation, topological scheduling, parallel execution); built-in node framework; the `intelliflow` command-line app; coordinating releases and demos |
| **Vismay S** | Backend API & Security | `crates/intelliflow-api` | REST API (Axum) and real-time WebSocket events; user accounts with JWT + argon2; rate limiting; webhook/hook security; credential vault endpoints; API error handling |
| **Sneha P** | Frontend & UI/UX Design | `frontend/` | The React visual editor (React Flow, Zustand, Tailwind); the Intelliflow warm design system, logo and branding; node palette, config panels and execution log; sign-in, dashboard and vault screens |
| **Sadiya Rehman** | Data, Plugins & Quality | `crates/intelliflow-storage`, `crates/intelliflow-runtime`, tests, docs | SQLite / PostgreSQL storage and migrations; the WebAssembly plugin sandbox; unit and integration tests; Docker deployment; project documentation and this README |

Shared by everyone: code reviews, testing their own module, and the final report and presentation.

## Tech stack

| Layer | Technology |
|---|---|
| Engine and server | Rust 1.91+, Tokio, Axum 0.8, Tower |
| Storage | SQLite (default), PostgreSQL, via sqlx |
| Plugins | WebAssembly (wasmtime) |
| Security | JWT, argon2, AES-256-GCM |
| Frontend | React 19, TypeScript, Vite, React Flow, Zustand, Zod, Tailwind CSS |
| Tooling | Cargo, npm, Biome, Vitest, Docker, GitHub Actions |

## Getting started

**Requirements:** [Rust](https://rustup.rs/) 1.91+ and [Node.js](https://nodejs.org/) 22+ (with `npm`).

```bash
# 1. Install the frontend dependencies and build the editor
npm --prefix frontend ci
npm --prefix frontend run build

# 2. Build and start Intelliflow with the editor built in
cargo run --features embed-ui --bin intelliflow -- serve
```

Open **http://localhost:7700**, click **Create one** on the sign-in page to make
an account, and start building flows.

The first build takes a few minutes; later runs are much faster. Data (the
SQLite database, keys and plugins) is stored in the `data/` folder.

### Desktop mode

Running the binary without a subcommand starts it in desktop mode: it listens
on `127.0.0.1` only, keeps data in your user folder and opens the browser for
you.

```bash
cargo build --release --features embed-ui
./target/release/intelliflow          # Windows: target\release\intelliflow.exe
```

### With Docker

```bash
cp .env.example .env          # set Z8_JWT_SECRET and POSTGRES_PASSWORD
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

## Running it in VS Code

1. **File → Open Folder** and choose the project folder.
2. Recommended extensions: **rust-analyzer** and **Biome**.
3. Open a terminal with <kbd>Ctrl</kbd> + <kbd>`</kbd>.

**Option A - one terminal (simplest):**

```powershell
cargo run --features embed-ui --bin intelliflow -- serve
```

Open http://127.0.0.1:7700. After changing frontend code, rebuild it with
`npm --prefix frontend run build` and restart.

**Option B - two terminals (best while developing):**

```powershell
# Terminal 1 - backend API on port 7700
cargo run --bin intelliflow -- serve

# Terminal 2 - editor with hot reload on port 5173
cd frontend
npm run dev
```

Open http://localhost:5173. Frontend changes appear as soon as you save.

Stop either one with <kbd>Ctrl</kbd> + <kbd>C</kbd>.

## Project structure

```
intelliflow/
├── crates/
│   ├── intelliflow-core      # Workflow engine, DAG validation, scheduler, 39 nodes  (Sai Preet)
│   ├── intelliflow-api       # REST + WebSocket server, auth, rate limiting          (Vismay)
│   ├── intelliflow-storage   # SQLite / PostgreSQL persistence, credential vault     (Sadiya)
│   └── intelliflow-runtime   # WebAssembly plugin sandbox                            (Sadiya)
├── bins/
│   └── intelliflow-cli       # The `intelliflow` command-line app                    (Sai Preet)
├── frontend/                 # React + TypeScript visual editor                      (Sneha)
│   ├── src/features/         # Auth, dashboard, editor canvas, panels, vault
│   ├── src/components/       # Shared UI (BrandMark, dialogs, code editor)
│   ├── src/stores/           # Zustand state
│   └── src/lib/              # Node definitions, schemas, styles
├── deploy/                   # Nginx config and server setup
└── Cargo.toml                # Rust workspace
```

> Settings keep the `Z8_` prefix (e.g. `Z8_PORT`) and the database file is
> still `z8run.db`, so existing data and `.env` files keep working.

## How it works

1. A **flow** is a directed acyclic graph (DAG) of nodes connected by typed ports.
2. Each **node** receives a message, does its job, and sends results to its outputs.
3. The **scheduler** validates the graph (no cycles) and orders it topologically so independent branches run in parallel.
4. **Plugins** run inside a WebAssembly sandbox with no network, file system or clock access.
5. The **editor** receives execution events live over a WebSocket, only for flows its user owns.

## Design system

The Intelliflow UI uses a warm palette defined in
[`frontend/tailwind.config.ts`](frontend/tailwind.config.ts):

| Token | Colour | Used for |
|---|---|---|
| `ember-500` | `#EC6622` | Brand accent, primary buttons, focus rings |
| `saffron-400` | `#F9C04A` | Gradient highlight, secondary accent |
| `slate-950` | `#18120E` | App background (warm espresso) |
| `slate-900` | `#241B16` | Cards, panels, nodes |
| `slate-400` | `#AE957D` | Muted text |
| `canvas` | `#140F0C` | Flow canvas background |

Node categories also have warm colours: olive for inputs, ember for processing,
saffron for outputs, raspberry for logic, copper for data, coral for AI. The
`slate` scale is redefined as warm cocoa neutrals, so every surface in the app
follows the theme. Headings use a serif display face (Georgia), and body text
uses Inter or the system UI font.

## Configuration

Settings are read from environment variables, then `.env` in the working
directory, then `<data dir>/z8run.env` written by `intelliflow init`.

| Variable | Default | Description |
|---|---|---|
| `Z8_PORT` | `7700` | HTTP/WebSocket port |
| `Z8_BIND` | `0.0.0.0` (`127.0.0.1` in desktop mode) | Bind address |
| `Z8_DATA_DIR` | `./data` | Data directory (database, keys, plugins) |
| `Z8_DB_URL` | SQLite auto | Database URL (`sqlite://` or `postgres://`) |
| `Z8_LOG_LEVEL` | `info` | Log level (trace, debug, info, warn, error) |
| `Z8_JWT_SECRET` | generated | JWT signing secret. **Required** for PostgreSQL |
| `Z8_VAULT_SECRET` | generated | Encryption key for the credential vault |
| `Z8_CORS_ORIGINS` | permissive | Allowed origins; set it in production |
| `Z8_NO_BROWSER` | - | Set to `1` so desktop mode doesn't open the browser |

See [`.env.example`](.env.example) for rate limits, egress policy and node limits.

### CLI

```bash
intelliflow                       # Desktop mode
intelliflow serve [-p 8080]       # Server mode
intelliflow init                  # Choose the database and port
intelliflow migrate               # Run database migrations
intelliflow plugin list|install|remove|scan
intelliflow validate flow.json    # Validate a flow file
intelliflow info                  # Version and system information
```

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/info` | Server information |
| `GET` | `/api/v1/flows` | List flows |
| `POST` | `/api/v1/flows` | Create a flow |
| `GET` | `/api/v1/flows/{id}` | Get a flow |
| `DELETE` | `/api/v1/flows/{id}` | Delete a flow |
| `POST` | `/api/v1/flows/{id}/start` | Deploy / run a flow |
| `POST` | `/api/v1/flows/{id}/stop` | Stop a flow |

Live events: `ws://localhost:7700/ws/engine` (JSON messages such as
`flow_started`, `node_completed` and `flow_stopped`), authenticated with the
session cookie.

## Built-in nodes

| Category | Nodes |
|---|---|
| **Input / Trigger** | HTTP In, Timer, Webhook (HMAC-SHA256), Webhook Trigger, Cron Trigger |
| **Process** | Function, JSON Transform, HTTP Request, Filter |
| **Output** | Debug, HTTP Response |
| **Logic / Control** | Switch, Delay, If/Else, Loop |
| **Data** | Database (PostgreSQL, MySQL, SQLite), MQTT, CSV, Aggregator, Batch, Mapper |
| **Security** | Sanitize |
| **AI** | LLM, Embeddings, Classifier, Prompt Template, Text Splitter, Vector Store, Structured Output, Summarizer, AI Agent, Image Gen, Speech-to-Text, Text-to-Speech |
| **Integration** | Twilio, WhatsApp, CRM (HubSpot / Salesforce), Conversation Memory, Human Handoff |

## Testing

```bash
cargo test --all                    # Rust unit + integration tests
cargo clippy --all-targets -- -D warnings
npm --prefix frontend test          # Frontend tests (Vitest)
npm --prefix frontend run check     # Frontend lint + format (Biome)
```

Or run everything the way CI does with `make ci` (needs `make`).

## Roadmap

- [x] Workflow engine with DAG validation and parallel scheduling
- [x] REST API, WebSocket events, JWT authentication, rate limiting
- [x] Visual editor with node search, config panels and execution log
- [x] Credential vault, flow import/export, WASM plugins
- [x] Intelliflow branding and warm design system
- [ ] Undo/redo in the editor
- [ ] Flow duplication and templates
- [ ] Light theme
- [ ] Usage dashboard with execution statistics

## Acknowledgements and license

Intelliflow is built on top of the open-source
[**z8run**](https://github.com/z8run/z8run) flow engine, which provides the
engine, API and editor foundations this project extends and rebrands. We thank
its authors.

z8run is dual-licensed under [Apache 2.0](LICENSE-APACHE) and [MIT](LICENSE),
and Intelliflow keeps those licenses and their copyright notices.

---

<p align="center">
  Made with care by <b>Sai Preet Palam</b>, <b>Vismay S</b>, <b>Sneha P</b> and <b>Sadiya Rehman</b>.
</p>
