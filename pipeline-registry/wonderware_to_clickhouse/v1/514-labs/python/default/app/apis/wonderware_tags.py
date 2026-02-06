"""
Analytics API: Get list of available Wonderware tags

Endpoint: GET /analytics/wonderware_tags
Returns: List of tag names with metadata

Example:
  GET /analytics/wonderware_tags?search=TEMP
"""

from moose_lib import Api, MooseClient
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class QueryParams(BaseModel):
    search: Optional[str] = Field(
        default="",
        description="Filter tags by name (case-insensitive substring match)"
    )
    limit: Optional[int] = Field(
        default=100,
        description="Maximum number of tags to return"
    )


class TagMetadata(BaseModel):
    TagName: str
    data_points: int
    first_seen: datetime
    last_seen: datetime
    avg_value: Optional[float]
    min_value: Optional[float]
    max_value: Optional[float]


class ResponseData(BaseModel):
    tags: List[TagMetadata]


def run(client: MooseClient, params: QueryParams) -> ResponseData:
    """
    Returns list of available Wonderware tags with metadata.
    Used by Grafana for tag selection dropdowns.
    """

    query = """
    SELECT
        TagName,
        count(*) AS data_points,
        min(DateTime) AS first_seen,
        max(DateTime) AS last_seen,
        avg(Value) AS avg_value,
        min(Value) AS min_value,
        max(Value) AS max_value
    FROM WonderwareHistory
    WHERE 1=1
    """

    if params.search:
        query += f" AND lower(TagName) LIKE lower('%{params.search}%')"

    query += f"""
    GROUP BY TagName
    ORDER BY data_points DESC
    LIMIT {params.limit}
    """

    logger.info(f"Fetching tags with search='{params.search}', limit={params.limit}")

    result = client.query.execute(query, {
        "search": params.search,
        "limit": params.limit
    })

    tags = [TagMetadata(**row) for row in result]
    return ResponseData(tags=tags)


# CRITICAL: Api instantiation required for data_model_v2
wonderware_tags_api = Api[QueryParams, ResponseData](
    name="wonderware_tags",
    query_function=run
)
