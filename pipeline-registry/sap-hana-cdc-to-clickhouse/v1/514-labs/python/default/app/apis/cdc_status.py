# This file is where you can define your API templates for consuming your data
# The implementation has been moved to FastAPI routes in main.py

from moose_lib import MooseClient, Api, MooseCache, Query, and_
from pydantic import BaseModel, Field
from typing import Optional, Literal

from datetime import datetime, timezone

# Query params are defined as Pydantic models and are validated automatically
class QueryParams(BaseModel):
    order_by: Optional[Literal["total_rows", "rows_with_text", "max_text_length", "total_text_length"]] = Field(
        default="total_rows",
        description="Must be one of: total_rows, rows_with_text, max_text_length, total_text_length"
    )
    limit: Optional[int] = Field(
        default=5,
        gt=0,
        le=100,
        description="Must be between 1 and 100"
    )
    start_day: Optional[int] = Field(
        default=1,
        gt=0,
        le=31,
        description="Must be between 1 and 31"
    )
    end_day: Optional[int] = Field(
        default=31,
        gt=0,
        le=31,
        description="Must be between 1 and 31"
    )

class QueryResult(BaseModel):
    last_processed_timestamp: str
    last_processed_change_id: int
    lag: int
    
    
def run(client: MooseClient, params: QueryParams):
    # Connect to SAP
    # Fetch the last processed timestamp and change id
    # Calculate the lag
    # Return the result
    return QueryResult(
        last_processed_timestamp=datetime.now().isoformat(),
        last_processed_change_id=1000,
        lag=1000
    )


cdc_status = Api[QueryParams, QueryResult](name="cdc_status", query_function=run)
