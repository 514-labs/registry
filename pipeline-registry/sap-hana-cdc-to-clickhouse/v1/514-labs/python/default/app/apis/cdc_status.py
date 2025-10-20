# This file is where you can define your API templates for consuming your data
# The implementation has been moved to FastAPI routes in main.py

from moose_lib import MooseClient, Api, MooseCache, Query, and_
from sap_hana_cdc import SAPHanaCDCConnector
from pydantic import BaseModel, Field
from typing import Optional
import logging
import argparse
import sys
import json

from datetime import datetime, timezone
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)

# Query params are defined as Pydantic models and are validated automatically
class QueryParams(BaseModel):
    client_id: Optional[str] = Field(
        default=None,
        description="Client ID to get CDC status for. If not provided, uses the connector's default client_id"
    )

class QueryResult(BaseModel):
    total_entries: int
    lag_seconds: int
    max_timestamp: Optional[str] = None
    last_client_update: Optional[str] = None
    
def run(client: MooseClient, params: QueryParams):
    """Get CDC status for a specific client.
    
    Args:
        client: MooseClient instance
        params: Query parameters containing optional client_id
        
    Returns:
        QueryResult: CDC status information
    """
    try:
        connector = SAPHanaCDCConnector.build_from_env()
        
        # Use provided client_id or fall back to connector's default
        client_id = params.client_id or connector.config.client_id
        
        if not client_id:
            raise ValueError("No client_id provided and connector has no default client_id")
        
        status_data = connector.get_status(client_id)
        return QueryResult(**status_data)
        
    except Exception as e:
        logger.error(f"Error getting CDC status: {e}")
        raise


cdc_status = Api[QueryParams, QueryResult](name="cdc_status", query_function=run)

if __name__ == "__main__":
    import json
    mock_client = MooseClient(None)
    params = QueryParams()
    result = run(mock_client, params)
    print(json.dumps(result.model_dump(), indent=2))

