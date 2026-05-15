# 🌑 Onyx - Autonomous FinTech Compliance Engine

> An enterprise-grade, multi-agent AI system designed to instantly translate dense regulatory circulars into Measurable Action Points (MAPs) with automated department routing.

---

##  Overview

Financial institutions and banks struggle to keep up with rapidly changing regulatory mandates (such as RBI or SEBI circulars). Extracting actionable tasks, assigning them to the correct internal departments, and tracking compliance is typically a manual, slow, and highly error-prone process.

**Onyx** solves this by deploying specialized AI agents (a Virtual Regulatory Analyst and a Virtual COO) to ingest complex regulatory text. It instantly translates these documents into structured data, assigns confidence scores, and automatically routes tasks to specific departments via a sleek, high-fidelity dashboard.

---

##  Core Features

* **Multi-Agent Orchestration:** Utilizes CrewAI to manage specialized agents that read, interpret, and format complex compliance data.
* **Dynamic Data Routing:** Automatically categorizes tasks into specific departments (IT Security, Risk, Legal, Operations).
* **Confidence Scoring:** Provides an AI-generated confidence metric for every extracted mandate.
* **Enterprise-Grade UI:** Features a highly polished, adaptive dark/light mode dashboard inspired by strict minimalist design principles (Vercel/Linear aesthetic).
* **Business-Ready Export:** Allows users to instantly download processed compliance reports as CSV files.

---

##  Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS (Strict minimalist, border-driven aesthetic)
* Lucide React (Icons)

**Backend:**
* Python 3.11+
* FastAPI & Uvicorn (High-performance API server)
* CrewAI (Agentic framework)
* Langchain & Groq API (`llama-3.3-70b-versatile` model)
* Pydantic (Data validation)

---

##  Getting Started

Follow these steps to run Onyx locally on your machine.

### Prerequisites
* Node.js installed
* Python 3.11 or higher installed
* A valid Groq API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/onyx.git](https://github.com/your-username/onyx.git)
cd onyx
```

---

## 2. Backend Setup
Open a terminal in the root directory and start the Python server:

## Navigate to the backend folder
```
cd backend
```

## Create and activate a virtual environment
```
python -m venv venv
source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
```

## Install dependencies
```
pip install fastapi uvicorn crewai langchain-groq python-dotenv pydantic
```

##  Set up your environment variables
 1. Create a .env file in the backend folder and add:
 2. GROQ_API_KEY=your_actual_api_key_here

## Run the server
```
uvicorn main:app --reload
```

## The backend should now be running on http://127.0.0.1:8000.

---

## 3. Frontend Setup
```
Open a new terminal in the root directory (onyx) while leaving the backend running:
```

## Install Node dependencies
```
npm install
```

## Start the development server
```
npm run dev
```
The frontend should now be running on http://localhost:5173.

---

##  Usage

1. Open the local frontend URL in your browser.

2. Ensure the backend terminal displays Application startup complete.

3. Click the Process Regulatory Mandate button on the central hub.

4. Watch the simulated agent terminal cycle through its processing states.

5. Review the generated Measurable Action Point (MAP) cards.

6. Export the data to CSV using the utility button.

---

## Security Note

This project uses .env files to store sensitive API keys. The .gitignore file is configured to prevent these from being uploaded to GitHub. Never commit your GROQ_API_KEY to public repositories.

---

***

### Final Tweaks:

* Make sure you replace `https://github.com/your-username/onyx.git` under step 1 with your actual GitHub repository URL once you create it. 
* Once you commit this file, GitHub will automatically format it into a beautiful landing page for your project!

---
