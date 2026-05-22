import os
import json
import sys
import queue
import threading
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew, Process, LLM

# Setup active SSE subscribers
log_subscribers = []
subscribers_lock = threading.Lock()

class LogStreamInterceptor:
    def __init__(self, original_stdout):
        self.original_stdout = original_stdout

    def write(self, message):
        self.original_stdout.write(message)
        self.original_stdout.flush()
        if message.strip():
            # Broadcast to all active SSE subscribers
            with subscribers_lock:
                for q in log_subscribers:
                    try:
                        q.put_nowait(message.strip())
                    except Exception:
                        pass

    def flush(self):
        self.original_stdout.flush()

    def isatty(self):
        return self.original_stdout.isatty()

# Install standard output interceptor
sys.stdout = LogStreamInterceptor(sys.stdout)

# Load keys from the .env right next to this file
load_dotenv()

app = FastAPI(title="Onyx Backend")

# Initialize assets directory and mount StaticFiles
script_dir = os.path.dirname(os.path.abspath(__file__))
assets_dir = os.path.join(script_dir, "assets")
if not os.path.exists(assets_dir):
    os.makedirs(assets_dir)

app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# Mandatory for Antigravity frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Onyx Intelligence Engine
onyx_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

# Data Structures
class MAP(BaseModel):
    map_id: str = Field(description="Unique task ID")
    task_description: str = Field(description="Actionable step")
    confidence_score: int = Field(description="0-100 score")
    assigned_department: str = Field(description="IT Security, Legal, Operations, or Risk")

class MAPCollection(BaseModel):
    action_points: List[MAP]

@app.get("/api/generate-maps")
def generate_maps(document_id: str = None):
    doc_ref = document_id or "RBI/2026/77"
    doc_title = "Regulatory Mandate"
    
    # Try to load manifest to get more details if available
    script_dir = os.path.dirname(os.path.abspath(__file__))
    manifest_path = os.path.join(script_dir, "assets", "assets_manifest.json")
    if document_id and os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            if document_id in manifest:
                doc_title = manifest[document_id].get("title", doc_title)
        except Exception:
            pass

    # 1. Agents
    analyst = Agent(
        role="Senior Regulatory Analyst",
        goal="Extract actionable mandates from RBI text.",
        backstory="Expert in Indian banking compliance.",
        llm=onyx_llm,
        verbose=True
    )
    
    orchestrator = Agent(
        role="Compliance Orchestrator",
        goal="Route tasks to departments in JSON format.",
        backstory="COO of a major bank.",
        llm=onyx_llm,
        verbose=True
    )

    # 2. Tasks
    t1 = Task(
        description=f"Analyze the regulatory circular Ref: {doc_ref} ({doc_title}) and list 3 key compliance action items.",
        expected_output="A list of 3 mandates.",
        agent=analyst
    )

    t2 = Task(
        description="Format into MAPs. Departments MUST be: 'IT Security', 'Legal', 'Operations', or 'Risk'.",
        expected_output="JSON MAPCollection.",
        agent=orchestrator,
        output_pydantic=MAPCollection
    )

    # 3. Execution
    crew = Crew(agents=[analyst, orchestrator], tasks=[t1, t2], verbose=True)
    result = crew.kickoff()
    return result.pydantic.model_dump()

@app.get("/api/stream-logs")
def stream_logs():
    import asyncio
    
    q = queue.Queue()
    with subscribers_lock:
        log_subscribers.append(q)
        
    async def event_generator():
        try:
            while True:
                # Poll the queue to send messages to client
                while not q.empty():
                    log_line = q.get_nowait()
                    # SSE event format: "data: message\n\n"
                    yield f"data: {log_line}\n\n"
                await asyncio.sleep(0.05)
        except asyncio.CancelledError:
            pass
        finally:
            with subscribers_lock:
                if q in log_subscribers:
                    log_subscribers.remove(q)
                    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/api/assets/manifest")
def get_assets_manifest():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    manifest_path = os.path.join(script_dir, "assets", "assets_manifest.json")
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": f"Failed to read manifest: {str(e)}"})
    return JSONResponse(status_code=404, content={"error": "Manifest file not found. Please seed the environment."})

@app.post("/api/assets/seed")
def seed_assets():
    try:
        import sys
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        import generate_assets
        import importlib
        importlib.reload(generate_assets)
        generate_assets.main()
        return {"status": "success", "message": "Demo PDF assets environment seeded successfully."}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Failed to seed assets: {str(e)}"})