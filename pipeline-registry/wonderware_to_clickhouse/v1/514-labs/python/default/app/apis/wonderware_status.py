from moose_lib import MooseClient, Api
from pydantic import BaseModel, Field
from typing import Optional
import clickhouse_connect
import os
import logging

logger = logging.getLogger(__name__)

# ClickHouse connection helper
def get_clickhouse_client():
    return clickhouse_connect.get_client(
        host=os.getenv("CLICKHOUSE_HOST", "localhost"),
        port=int(os.getenv("CLICKHOUSE_PORT", "18123")),
        username=os.getenv("CLICKHOUSE_USER", "panda"),
        password=os.getenv("CLICKHOUSE_PASSWORD", "pandapass"),
        database=os.getenv("CLICKHOUSE_DB", "local")
    )

# Query Parameters
class WonderwareStatusParams(BaseModel):
    tag_name: Optional[str] = Field(default=None, description="Filter by specific tag name")

# Response Model
class WonderwareStatusResponse(BaseModel):
    total_tags: int
    total_data_points: int
    oldest_data: Optional[str]
    newest_data: Optional[str]
    data_span_days: Optional[float]
    tag_filter: Optional[str]

def run(client: MooseClient, params: WonderwareStatusParams) -> WonderwareStatusResponse:
    """Query ClickHouse for Wonderware pipeline status."""
    ch_client = get_clickhouse_client()

    # Build WHERE clause for filtering
    where_clause = "WHERE 1=1"
    if params.tag_name:
        where_clause += f" AND TagName = '{params.tag_name}'"

    # Query statistics
    stats_query = f"""
        SELECT
            countDistinct(TagName) AS total_tags,
            count() AS total_data_points,
            min(DateTime) AS oldest_data,
            max(DateTime) AS newest_data,
            dateDiff('day', min(DateTime), max(DateTime)) AS data_span_days
        FROM local.WonderwareHistory
        {where_clause}
    """
    result = ch_client.query(stats_query)

    if result.result_rows and len(result.result_rows) > 0:
        row = result.result_rows[0]
        return WonderwareStatusResponse(
            total_tags=row[0],
            total_data_points=row[1],
            oldest_data=str(row[2]) if row[2] else None,
            newest_data=str(row[3]) if row[3] else None,
            data_span_days=row[4] if row[4] else None,
            tag_filter=params.tag_name
        )
    else:
        return WonderwareStatusResponse(
            total_tags=0,
            total_data_points=0,
            oldest_data=None,
            newest_data=None,
            data_span_days=None,
            tag_filter=params.tag_name
        )

# Register API
wonderware_status = Api[WonderwareStatusParams, WonderwareStatusResponse](
    name="wonderware_status",
    query_function=run
)

# CLI support
if __name__ == "__main__":
    import json
    from dotenv import load_dotenv
    load_dotenv()

    mock_client = MooseClient(None)
    params = WonderwareStatusParams()
    result = run(mock_client, params)
    print(json.dumps(result.model_dump(), indent=2))
