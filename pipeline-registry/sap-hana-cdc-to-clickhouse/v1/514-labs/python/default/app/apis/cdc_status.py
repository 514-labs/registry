# This file is where you can define your API templates for consuming your data
# The implementation has been moved to FastAPI routes in main.py

from moose_lib import MooseClient, Api, MooseCache, Query, and_
from sap_hana_cdc import SAPHanaCDCConnector
from pydantic import BaseModel, Field
from typing import Optional, Literal

from datetime import datetime, timezone
from dotenv import load_dotenv
load_dotenv()
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
    total_entries: int
    lag_seconds: int
    max_timestamp: Optional[str] = None
    last_client_update: Optional[str] = None
    
def run(client: MooseClient, params: QueryParams):

    connector = SAPHanaCDCConnector.build_from_env()
    return QueryResult(**connector.get_status(connector.config.client_id))


cdc_status = Api[QueryParams, QueryResult](name="cdc_status", query_function=run)
