from moose_lib import OlapTable, OlapConfig
from moose_lib.blocks import MergeTreeEngine
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class WonderwareHistory(BaseModel):
    """Raw sensor data from Wonderware historian (1-second resolution, Delta mode)"""
    DateTime: datetime
    TagName: str
    Value: Optional[float] = None
    VValue: Optional[str] = None
    Quality: Optional[int] = None
    QualityDetail: Optional[int] = None
    OpcQuality: Optional[int] = None
    wwTagKey: Optional[int] = None
    wwRowCount: Optional[int] = None
    wwResolution: Optional[int] = None
    wwEdgeDetection: Optional[str] = None
    wwRetrievalMode: str
    wwTimeDeadband: Optional[float] = None
    wwValueDeadband: Optional[float] = None
    wwTimeZone: Optional[str] = None
    wwVersion: Optional[str] = None
    wwCycleCount: Optional[int] = None
    wwTimeStampRule: Optional[str] = None
    wwInterpolationType: Optional[str] = None
    wwQualityRule: Optional[str] = None
    wwStateCalc: Optional[str] = None
    StateTime: Optional[datetime] = None
    PercentGood: Optional[float] = None
    wwParameters: Optional[str] = None
    StartDateTime: Optional[datetime] = None
    SourceTag: Optional[str] = None
    SourceServer: Optional[str] = None
    wwFilter: Optional[str] = None
    wwValueSelector: Optional[str] = None
    wwMaxStates: Optional[int] = None
    wwOption: Optional[str] = None
    wwExpression: Optional[str] = None
    wwUnit: Optional[str] = None


class WonderwareHistoryAggregated(BaseModel):
    """1-minute aggregated sensor data"""
    TagName: str
    minute_timestamp: datetime
    first_value: Optional[float] = None
    avg_value: Optional[float] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    count: int
    avg_quality: Optional[float] = None
    min_quality: Optional[int] = None


# Create OLAP tables with production-ready configuration
WonderwareHistoryTable = OlapTable[WonderwareHistory](
    "WonderwareHistory",
    OlapConfig(
        order_by_fields=["TagName", "DateTime"],
        partition_by="toYYYYMM(DateTime)",  # Monthly partitioning
        ttl="DateTime + INTERVAL 90 DAY",   # 90-day retention
        engine=MergeTreeEngine()
    )
)

WonderwareHistoryAggregatedTable = OlapTable[WonderwareHistoryAggregated](
    "WonderwareHistoryAggregated",
    OlapConfig(
        order_by_fields=["TagName", "minute_timestamp"],
        partition_by="toYYYYMM(minute_timestamp)",  # Monthly partitioning
        ttl="minute_timestamp + INTERVAL 730 DAY",  # 2-year retention
        engine=MergeTreeEngine()  # Using MergeTree for now, AggregatingMergeTree requires different field types
    )
)
