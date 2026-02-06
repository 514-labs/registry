"""Data models for Wonderware connector."""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class TagInfo:
    """Information about a Wonderware tag."""
    name: str
    tag_type: int
    tag_key: Optional[int] = None


@dataclass
class HistoryRow:
    """Historical data row from Wonderware History view."""
    DateTime: datetime
    TagName: str
    Value: Optional[float]
    VValue: Optional[str]
    Quality: Optional[int]
    QualityDetail: Optional[str]
    OpcQuality: Optional[int]
    wwTagKey: Optional[int]
    wwRowCount: Optional[int]
    wwResolution: Optional[int]
    wwEdgeDetection: Optional[int]
    wwRetrievalMode: Optional[str]
    wwTimeDeadband: Optional[float]
    wwValueDeadband: Optional[float]
    wwTimeZone: Optional[str]
    wwVersion: Optional[str]
    wwCycleCount: Optional[int]
    wwTimeStampRule: Optional[str]
    wwInterpolationType: Optional[str]
    wwQualityRule: Optional[str]
    wwStateCalc: Optional[str]
    StateTime: Optional[float]
    PercentGood: Optional[float]
    wwParameters: Optional[str]
    StartDateTime: Optional[datetime]
    SourceTag: Optional[str]
    SourceServer: Optional[str]
    wwFilter: Optional[str]
    wwValueSelector: Optional[str]
    wwMaxStates: Optional[int]
    wwOption: Optional[str]
    wwExpression: Optional[str]
    wwUnit: Optional[str]


@dataclass
class ConnectorStatus:
    """Status information for the Wonderware connector."""
    connected: bool
    host: str
    database: str
    tag_count: Optional[int]
    last_check: datetime
    error: Optional[str] = None
