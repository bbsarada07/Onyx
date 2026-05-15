import os
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew, Process, LLM

# Load keys from the .env right next to this file
load_dotenv()

app = FastAPI(title="Onyx Backend")

# Mandatory for Antigravity frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the NEW active Groq model
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
def generate_maps():
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
        description="Analyze the RBI circular Ref: RBI/2026/77 and list 3 key tasks.",
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