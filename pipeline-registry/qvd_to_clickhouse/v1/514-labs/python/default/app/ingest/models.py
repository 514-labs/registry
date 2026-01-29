# Base models for QVD pipeline
# This file contains any shared base classes or utilities

from pydantic import BaseModel
from typing import Optional


class QvdBaseModel(BaseModel):
    """Base model for QVD-derived Pydantic models."""

    class Config:
        # Allow population by field name or alias
        populate_by_name = True
        # Validate on assignment
        validate_assignment = True
