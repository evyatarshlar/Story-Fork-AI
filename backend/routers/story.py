import uuid
import logging
from typing import Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, BackgroundTasks
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from db.database import get_db, SessionLocal
from models.story import Story, StoryNode
from models.job import StoryJob
from schemas.story import (
    CompleteStoryResponse, CompleteStoryNodeResponse, CreateStoryRequest,
    StoryListItemResponse
)
from schemas.job import StoryJobResponse
from core.story_generator import StoryGenerator

router = APIRouter(
    prefix="/stories",
    tags=["stories"]
)

def get_session_id(session_id: Optional[str] = Cookie(None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id


@router.get("", response_model=list[StoryListItemResponse])
def list_stories(
        session_id: str = Depends(get_session_id),
        db: Session = Depends(get_db)
):
    stories = (
        db.query(Story)
        .filter(Story.session_id == session_id)
        .order_by(Story.created_at.desc())
        .all()
    )
    return stories


@router.get("/community", response_model=list[StoryListItemResponse])
def list_community_stories(
        session_id: str = Depends(get_session_id),
        db: Session = Depends(get_db)
):
    stories = (
        db.query(Story)
        .filter(Story.session_id != session_id)
        .order_by(Story.created_at.desc())
        .limit(20)
        .all()
    )
    return stories


@router.post("/create", response_model=StoryJobResponse)
def create_story(
        request: CreateStoryRequest,
        background_tasks: BackgroundTasks,
        response: Response,
        session_id: str = Depends(get_session_id),
        db: Session = Depends(get_db)
):
    response.set_cookie(key="session_id", value=session_id, httponly=True)

    # Rate limiting: max 8 stories per 24 hours per session
    window_start = datetime.now(timezone.utc) - timedelta(hours=24)
    jobs_in_window = (
        db.query(StoryJob)
        .filter(StoryJob.session_id == session_id)
        .filter(StoryJob.status.in_(["pending", "processing", "completed"]))
        .filter(StoryJob.created_at >= window_start)
        .order_by(StoryJob.created_at.asc())
        .limit(8)
        .all()
    )
    if len(jobs_in_window) >= 8:
        retry_after = (jobs_in_window[0].created_at + timedelta(hours=24)).isoformat()
        raise HTTPException(
            status_code=429,
            detail={"code": "rate_limit_exceeded", "retry_after": retry_after}
        )

    job_id = str(uuid.uuid4())

    job = StoryJob(
        job_id=job_id,
        session_id=session_id,
        theme=request.theme,
        status="pending"
    )
    db.add(job)
    db.commit()

    background_tasks.add_task(
        generate_story_task,
        job_id=job_id,
        theme=request.theme,
        session_id=session_id,
        age=request.age,
        depth=request.depth,
        genre=request.genre,
        tone=request.tone,
        length=request.length,
    )

    return job

def generate_story_task(job_id: str, theme: str, session_id: str,
                         age: int = None, depth: int = 4, genre: str = None,
                         tone: str = None, length: str = None):
    db = SessionLocal()

    try:
        job = db.query(StoryJob).filter(StoryJob.job_id == job_id).first()

        if not job:
            return

        try:
            job.status = "processing"
            db.commit()

            story = StoryGenerator.generate_story(db, session_id, theme,
                                                   age=age, depth=depth, genre=genre,
                                                   tone=tone, length=length)
            job.story_id = story.id

            job.status = "completed"
            job.completed_at = datetime.now()
            db.commit()
        except Exception as e:
            logger.error("Story generation failed for job %s: %s", job_id, e, exc_info=True)
            job.status = "failed"
            job.completed_at = datetime.now()
            job.error = "Story generation failed. Please try again."
            db.commit()
    finally:
        db.close()


@router.get("/{story_id}/complete", response_model=CompleteStoryResponse)
def get_complete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    complete_story = build_complete_story_tree(db, story)
    return complete_story


def build_complete_story_tree(db: Session, story: Story) -> CompleteStoryResponse:
    nodes = db.query(StoryNode).filter(StoryNode.story_id == story.id).all()

    node_dict = {}
    for node in nodes:
        node_response = CompleteStoryNodeResponse(
            id=node.id,
            content=node.content,
            is_ending=node.is_ending,
            is_winning_ending=node.is_winning_ending,
            options=node.options
        )
        node_dict[node.id] = node_response

    root_node = next((node for node in nodes if node.is_root), None)
    if not root_node:
        raise HTTPException(status_code=500, detail="Story root node not found")

    return CompleteStoryResponse(
        id=story.id,
        title= story.title,
        session_id=story.session_id,
        created_at=story.created_at,
        root_node=node_dict[root_node.id],
        all_nodes=node_dict
    )
    pass