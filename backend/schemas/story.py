from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel


class StoryOptionsSchema(BaseModel):
    text: str
    node_id: Optional[int] = None


class StoryNodeBase(BaseModel):
    content: str
    is_ending: bool = False
    is_winning_ending: bool = False


class CompleteStoryNodeResponse(StoryNodeBase):
    id: int
    options: List[StoryOptionsSchema] = []

    class Config:
        from_attributes = True


class StoryBase(BaseModel):
    title: str
    session_id: Optional[str] = None

    class Config:
        from_attributes = True


class CreateStoryRequest(BaseModel):
    theme: str
    age: Optional[int] = None
    depth: Optional[int] = 4
    genre: Optional[str] = None
    tone: Optional[str] = None
    length: Optional[str] = None  # "short", "medium", "long"


class StoryListItemResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    theme: Optional[str] = None
    genre: Optional[str] = None
    tone: Optional[str] = None
    age: Optional[int] = None
    depth: Optional[int] = None
    length: Optional[str] = None

    class Config:
        from_attributes = True


class CompleteStoryResponse(StoryBase):
    id: int
    created_at: datetime
    root_node: CompleteStoryNodeResponse
    all_nodes: Dict[int, CompleteStoryNodeResponse]

    class Config:
        from_attributes = True