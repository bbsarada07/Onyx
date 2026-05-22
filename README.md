# 🌌 ONYX: High-Fidelity FinTech Orchestration Workspace

Onyx is a next-generation, high-fidelity FinTech orchestration workspace designed to ingest unstructured compliance data, monitor institutional risk variables dynamically, and execute complex workflows through automated, multi-agent AI node networks. 

Built with a high-performance **FastAPI** backend and a responsive, immersive **React/Vite/TypeScript** core engine utilizing **Framer Motion** and **Tailwind CSS**, Onyx bridges the gap between raw regulatory chaos and executive action.

---

## 🏗️ 1. System Architecture

The Onyx system architecture layout is engineered as a fully decoupled, full-stack framework. It isolates client-side domain verification states from headless automated agent execution contexts over highly secure production nodes.

```text
                              +-----------------------+
                              |   1. BROWSER CLIENT   |
                              +-----------------------+
                                          |
                 Caches Active Authorization String Token (Local Storage)
                                          |
                                          v
           +--------------------------------------------------------------+
           |              2. VERCEL HOSTING EDGE PORTS                    |
           |                                                              |
           |   Reads 'onyx_user_role' context variable on window mounting. |
           |   Dynamically filters layout workspace viewport containers:  |
           |   - Compliance Officer Portal                                |
           |   - Chief Risk Officer Portal                                |
           |   - System Admin Portal                                      |
           +--------------------------------------------------------------+
                                          |
                                          | Outbound HTTPS Request
                                          | Pass Selected Asset URL Payload
                                          v
           +--------------------------------------------------------------+
           |              3. RENDER CORE CLOUD INFRASTRUCTURE             |
           |                         (FastAPI Hub)                        |
           |                                                              |
           |   /api/assets/manifest  <--> Spits active sandboxed file trees|
           |   /api/generate-maps    <--> Triggers multi-agent task loops  |
           |   /api/stream-logs      <--> Pipes raw sys.stdout to client   |
           +--------------------------------------------------------------+
                                          |
                         Spins up Worker Subprocess Networks
                                          |
                                          v
                               +---------------------+
                               |  4. AUTONOMOUS CORE |
                               |    (CrewAI Cluster) |
                               +---------------------+

```

---

### 🛰️ Core Infrastructure Lifecycle Hooks
1. **RBAC State Serialization:** The user selects an access level at the Access Gateway gateway. The submission controller writes an explicit authorization key (`onyx_user_role`) into the browser's persistent `localStorage` database layer.
2. **Deterministic UI Rendering:** On router transition, the Vercel client scans the client browser memory context *before* the first UI render loop paints. This eliminates hydration flicker and forces the application frame to inject matching widget modules.
3. **Stream-Driven Back-End Pipelining:** When the processing action button fires, the client passes the active target file string parameter straight down to Render via query path metrics. FastAPI catches the query, executes our automated `CrewAI` worker loop, and feeds live console tracking lines (`sys.stdout`) back up to the frontend UI through an event stream handler.

---

## 📂 2. Project Architecture

This is the codebase tree hierarchy mapping our full-stack monorepo structural organization. This setup keeps our layout modules cleanly separated, completely independent, and scale-ready.

```text
Onyx/
│
├── frontend/                          # Vercel Production Deployment Workspace
│   ├── public/                        # Static Branding SVG Assets & Base Media
│   └── src/
│       ├── components/
│       │   └── LoginGate.tsx          # Access Gateway, Cryptographic Handshake Interface
│       ├── pages/
│       │   └── Dashboard.tsx          # Master Responsive Router View & RBAC Guard Wrapper
│       ├── App.tsx                    # System Engine Initialization & Global Mode Context
│       ├── index.css                  # Tailwind Setup & Custom Monospace Console Grid Rules
│       └── main.tsx                   # Main Production Client DOM Mount Pointer
│
├── backend/                           # Render Production Cloud Instance Framework
│   ├── assets/                        # Sandboxed File Ingestion Environment Directories
│   │   ├── audit_logs/                # Pended verification logs (signed_audit_trail.pdf)
│   │   ├── procurement_tenders/       # Staged mock asset proposal structures (.pdf)
│   │   └── regulatory_mandates/       # Live target regulation circular records (.pdf)
│   │
│   ├── generate_assets.py             # Autonomous Programmatic ReportLab PDF Data-Seeding Controller
│   ├── main.py                        # FastAPI Gateway, CORS Protocols, Live Execution Route Trees
│   ├── requirements.txt               # Lightweight Optimized Python Cloud Build Dependency List
│   └── runtime.txt                    # Targeted Server Platform Version Specification (Python 3.11)
│
└── README.md                          # Comprehensive Engineering Solution Manual Guide
```

---

## 🚀 The Winning Edge: Advanced Architecture & Core Features

Unlike static presentation prototypes, Onyx features a fully dynamic execution loop divided into three specialized, role-gated domain portal workspaces.

### 1. 🛡️ Compliance Intelligence Hub (Compliance Officer)
- **Dynamic Ingestion Staging Area:** An interactive, professional file-selection matrix that pulls active unparsed regulatory assets natively from the cloud backend.
- **Drag & Drop Simulation Widget:** A visual bounding container allowing files to be dragged directly into the runtime context, auto-assigning unique tracking IDs (e.g., `MANDATE-CUSTOM-991`).
- **Live Cloud Trace Streaming Ticker:** Replaces hardcoded loading flags with a real-time terminal stream (`EventSource` pipeline) that strips ANSI escapes, sanitizes thread logs, and highlights live agent reasoning loops (`sys.stdout`) directly from the server.
- **Compliance Action Items Grid:** Translates processed inputs into data-dense action points (MAPs) categorized by department with custom confidence matching filters and live CSV exporting utility.

### 2. 📊 Enterprise Risk Control Hub (Chief Risk Officer)
- **Interactive 4x4 Visual Threat Matrix:** A coordinate grid mapping Probability vs. Impact across 16 critical risk vectors. Clicking cells dynamically isolates, pulls down, and analyzes localized threat data.
- **Cryptographic Level-5 Access Verification:** An emergency authorization modal that pushes crypto-signed ledger approval blocks into distributed API gateways, freezing queues and generating unique validation hashes (e.g., `0x8A2B...`).
- **Real-Time Systemic Risk Telemetry:** Displays automated systemic risk scorebars, active warning tallies, and audit ledger tracking cards linking directly to signed cloud trails.

### 3. ⚙️ Node Sandbox Controller (System Admin)
- **Active Hardware Resource Sliders:** Live fluctuating visual gauges detailing CPU core loads and isolated context memory allotments (simulating 8x redundant cloud thread pools).
- **Network Socket Telemetry Grid:** Monitored tracking array for distributed international gateway nodes (APAC-1, EMEA-2, AMER-1) displaying active routing statuses and real-time socket latency metrics.
- **Mock Environment Asset Seeding:** A controller that programmatically triggers backend script routines to cleanly initialize, reset, or wipe staging directory structures across cloud storage targets.

---

## 📂 Programmatic Demo Assets Architecture

Onyx features an automated automation controller (`generate_assets.py`) that utilizes `reportlab` to compile high-fidelity, text-dense corporate artifact templates natively inside the backend architecture. This ensures our AI pipelines have realistic, data-dense structures to process.

```text
Onyx/
└── backend/
    ├── generate_assets.py              # Automated Asset Engine Controller
    └── assets/
        ├── regulatory_mandates/       # Targets for AI Multi-Agent Processing
        │   ├── mandate_alpha_2026.pdf  # Global Data Compliance Mandate (GDCM v4.2)
        │   └── mandate_beta_2026.pdf   # Financial Transparency Framework Directive (FTFD-2026)
        ├── procurement_tenders/       # Targets for Compliance Ingestion
        │   ├── tender_supply_091.pdf   # Government Logistics & Supply Chain Procurement Tender
        │   └── tender_infra_092.pdf    # Autonomous Systems Infrastructure Architecture Proposal
        └── audit_logs/                # Targets for CRO Verification Modules
            └── signed_audit_trail.pdf  # System Integration Audit Log & Verification Trail
```

---

## 🌐 Production Deployments & Public Cloud Links

Our complete, full-stack environment has been optimized and compiled live across separate distributed production node clusters.

Frontend Application Client (Vercel): https://onyx-neardrop.vercel.app?_vercel_share=GbgKdCYX8PFjGVbvXGoKWd7VzMKAnfMV

Core Multi-Agent Server Node (Render): https://onyx-1-kf9l.onrender.com/docs#/

---

## 🛠️ Technical Stack & Dependencies

### Frontend Client

Framework: React 18, Vite, TypeScript

Animations: Framer Motion (AnimatePresence, physics motion paths)

Styling: Tailwind CSS (Custom high-fidelity grids, neon typography accents)

Icons: Lucide React

### Backend Cloud Server

Core Framework: Python 3.11, FastAPI, Uvicorn

AI Orchestration Framework: CrewAI, LiteLLM

Asset Compilation: ReportLab PDF Engine

---

## 🛠️ Part 1: How to Clone and Setup the Project Locally

Run these steps in order to download the codebase and initialize the environmental dependencies for both the frontend client and the backend server.

1. Clone the GitHub Repository
Open your computer's terminal (or Git Bash) in your desired workspace directory and pull down the project:

Bash
```
git clone https://github.com/bbsarada07/Onyx.git
cd Onyx
```
2. Initialize the Backend Core (Python/FastAPI)
3. 
To prevent your Python global environment from getting cluttered with conflicting package versions, initialize a localized virtual environment:

Bash
### Navigate to the backend directory
```
cd backend
```

### Create a clean virtual environment
```
python -m venv venv
```

### Activate the virtual environment
#### On Windows (Command Prompt):
```
venv\Scripts\activate
```
### On Mac/Linux:
```
source venv/bin/activate
```

### Install the dependencies compiled in requirements.txt
```
pip install -r requirements.txt
```

### Run the local programmatic data-seeding engine to build your initial PDF files
```
python generate_assets.py
```

## 3. Initialize the Frontend Core (React/Vite/TypeScript)
Open a new, second terminal window (leaving your backend setup terminal open), navigate to the project root, and initialize your node modules:

Bash
### Navigate to the frontend directory from the project root
```
cd frontend
```

### Install all package dependencies (Framer Motion, Lucide icons, etc.)
```
npm install
```

## 🔄 Part 2: The Core Development Workflow (How to Continue)

To build your project effectively, test features, and deploy safely to production without running into caching or environment variable breaks, strictly follow this three-phase workflow:

## Phase A: Local Sandbox Testing Execution Loop
Always verify your code logic works locally before pushing code blocks up to your cloud providers.

Fire up your Headless Backend: In your active Python virtual environment terminal, start your local server loop:

Bash
```
uvicorn main:app --reload --port 8000
```
Fire up your Frontend Client: In your node package terminal, run your local compiler:

Bash
```
npm run dev
```
Open your browser to http://localhost:5173 to interact with your dashboard layout locally. The client will talk to your local backend at http://127.0.0.1:8000.

## Phase B: Feature Expansion Code Implementation
When you need to make updates, add features, or adjust layouts:

Complete your modifications in Antigravity or your local code editor workspace.

If you change a frontend layout or component, verify that standard layout compilation succeeds without TypeScript type check warnings (npm run build).

## Phase C: Production Deployment Serialization
Once your changes look perfect on your local screen, ship the code changes to your cloud networks:

Upload your code modifications to GitHub:

Bash
```
git add .
git commit -m "refactor: optimize dynamic portal synchronization and compact layout dimensions"
git push origin main
```
Let Vercel Update Your Public UI: Vercel automatically watches your repository. Within 60 seconds of your git push, your frontend updates will be fully deployed to your public client link worldwide.

Trigger cache flush on Render (If backend files were changed): If you updated any Python logic or agent scripts, open your Render Dashboard web panel, locate your service node Onyx-1, click Manual Deploy, and choose Clear Build Cache & Deploy to completely refresh your cloud sqlite database.

---
##  Hackathon Submission
- **Event**: SuRaksha Cyber Hackathon 2.0
- **Theme**: Agentic Regulatory Intelligence & Compliance
Build an Agentic system that monitors regulatory changes, translates them into "Measurable Action Points" (MAPs), assigns them to the correct bank departments, and autonomously validates completion.
- **Dev Post / Project ID**: Zenthra

---

## Licence

MIT Licence — free to use, modify, and distribute with attribution.
