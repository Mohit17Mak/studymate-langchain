import uuid
from typing import Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from llm import get_llm
from coach.session import CoachingSession


app = FastAPI(
    title="PromptForge API",
    description="Adaptive prompt engineering coaching API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


llm = get_llm()

sessions: Dict[str, CoachingSession] = {}


class SessionResponse(BaseModel):
    session_id: str


class AnalyzeRequest(BaseModel):
    session_id: str
    prompt: str = Field(
        min_length=1,
        max_length=10000,
    )


class EvaluateRequest(BaseModel):
    session_id: str
    original_prompt: str = Field(
        min_length=1,
        max_length=10000,
    )
    revised_prompt: str = Field(
        min_length=1,
        max_length=10000,
    )


class ChallengeRequest(BaseModel):
    session_id: str


def get_session(session_id: str) -> CoachingSession:
    session = sessions.get(session_id)

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    return session


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "PromptForge API",
    }


@app.post(
    "/sessions",
    response_model=SessionResponse,
)
def create_session():
    session_id = str(uuid.uuid4())

    sessions[session_id] = CoachingSession(
        llm
    )

    return SessionResponse(
        session_id=session_id
    )


@app.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    del sessions[session_id]

    return {
        "message": "Session deleted."
    }


@app.post("/analyze")
def analyze_prompt(request: AnalyzeRequest):
    session = get_session(
        request.session_id
    )

    try:
        analysis = session.analyze(
            request.prompt
        )

        return {
            "analysis": analysis.model_dump()
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Prompt analysis failed: "
                f"{type(error).__name__}"
            ),
        )


@app.post("/evaluate")
def evaluate_prompt(request: EvaluateRequest):
    session = get_session(
        request.session_id
    )

    try:
        evaluation = session.evaluate(
            original_prompt=request.original_prompt,
            revised_prompt=request.revised_prompt,
        )

        return {
            "evaluation": evaluation.model_dump(),
            "profile": session.get_profile(),
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Prompt evaluation failed: "
                f"{type(error).__name__}"
            ),
        )


@app.post("/challenge")
def next_challenge(request: ChallengeRequest):
    session = get_session(
        request.session_id
    )

    try:
        challenge = session.next_challenge()

        return {
            "challenge": challenge.model_dump(),
            "profile": session.get_profile(),
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Challenge generation failed: "
                f"{type(error).__name__}"
            ),
        )


@app.get("/profile/{session_id}")
def get_profile(session_id: str):
    session = get_session(session_id)

    return {
        "profile": session.get_profile()
    }