from sqlalchemy import Session
from core.config import settings

from lengchain_openai import ChatOpenAI
from lengchain_core import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

drom core.prompts import STORY_PROMPT
from models.story import Story
