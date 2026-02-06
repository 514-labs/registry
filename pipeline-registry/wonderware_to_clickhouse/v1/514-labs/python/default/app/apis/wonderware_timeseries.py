"""
Analytics API: Query Wonderware time-series data

Endpoint: GET /analytics/wonderware_timeseries
Returns: Time-series data for specified tags

Grafana-compatible with:
- Time range parameters (from/to timestamps)
- Multiple tag selection
- Aggregation level (raw/1min)
- Optional gap filling

Example:
  GET /analytics/wonderware_timeseries?
    tags=TEMP_001,PRESSURE_001&
    from=1706284800000&
    to=1706371200000&
    aggregation=1min&
    fill_gaps=true
"""

from moose_lib import Api, MooseClient
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class QueryParams(BaseModel):
    tags: str = Field(
        default="",
        description="Comma-separated list of tag names"
    )
    start_ts: int = Field(
        default=int((datetime.now() - timedelta(hours=1)).timestamp() * 1000),
        description="Start timestamp (Unix milliseconds, Grafana format)"
    )
    end_ts: int = Field(
        default=int(datetime.now().timestamp() * 1000),
        description="End timestamp (Unix milliseconds, Grafana format)"
    )
    aggregation: Optional[str] = Field(
        default="raw",
        description="Aggregation level: 'raw' or '1min'"
    )
    fill_gaps: Optional[bool] = Field(
        default=False,
        description="Fill missing time intervals (only for aggregated data)"
    )
    max_data_points: Optional[int] = Field(
        default=10000,
        description="Maximum number of data points to return"
    )


class DataPoint(BaseModel):
    """A single datapoint in [value, timestamp] format for Grafana"""
    value: Optional[float]
    timestamp: int

    class Config:
        # Allow arbitrary types for serialization
        arbitrary_types_allowed = True


class TimeSeries(BaseModel):
    """A time series for a single tag"""
    target: str
    datapoints: List[List]  # List of [value, timestamp] pairs


class ResponseData(BaseModel):
    """Response containing multiple time series"""
    series: List[TimeSeries]


def run(client: MooseClient, params: QueryParams) -> ResponseData:
    """
    Returns time-series data for specified tags.

    Returns format compatible with Grafana:
    [
      {
        "target": "TAG_NAME",
        "datapoints": [[value, timestamp_ms], [value, timestamp_ms], ...]
      }
    ]
    """

    # Convert from Grafana milliseconds to seconds (same pattern as sensor_data.py)
    start_ts = int(params.start_ts / 1000)
    end_ts = int(params.end_ts / 1000)

    # Parse timestamps for ClickHouse
    from_dt = datetime.fromtimestamp(start_ts)
    to_dt = datetime.fromtimestamp(end_ts)

    # Parse tag list
    tag_list = [tag.strip() for tag in params.tags.split(',') if tag.strip()]

    if not tag_list:
        return {"error": "No tags specified"}

    logger.info(
        f"Querying {len(tag_list)} tags from {from_dt} to {to_dt}, "
        f"aggregation={params.aggregation}, fill_gaps={params.fill_gaps}, "
        f"start_ts={start_ts}, end_ts={end_ts}"
    )

    if params.aggregation == "1min":
        return query_aggregated(
            client, tag_list, from_dt, to_dt,
            params.fill_gaps, params.max_data_points
        )
    else:
        return query_raw(
            client, tag_list, from_dt, to_dt, params.max_data_points
        )


def query_raw(client: MooseClient, tags: List[str], from_dt: datetime, to_dt: datetime, max_points: int):
    """Query raw 1-second data."""

    # Build tag filter
    tag_filter = "(" + " OR ".join([f"TagName = '{tag}'" for tag in tags]) + ")"

    query = f"""
    SELECT
        TagName AS target,
        toUnixTimestamp(DateTime) * 1000 AS time,
        Value AS value
    FROM WonderwareHistory
    WHERE DateTime >= toDateTime('{from_dt.strftime('%Y-%m-%d %H:%M:%S')}')
      AND DateTime <= toDateTime('{to_dt.strftime('%Y-%m-%d %H:%M:%S')}')
      AND {tag_filter}
      AND Value IS NOT NULL
    ORDER BY DateTime ASC
    LIMIT {max_points}
    """

    result = client.query.execute(query, {})

    # Transform to Grafana format
    return transform_to_grafana_format(result)


def query_aggregated(client: MooseClient, tags: List[str], from_dt: datetime, to_dt: datetime, fill_gaps: bool, max_points: int):
    """Query 1-minute aggregated data."""

    # Build tag filter
    tag_filter = "(" + " OR ".join([f"TagName = '{tag}'" for tag in tags]) + ")"

    # Base query
    query = f"""
    SELECT
        TagName AS target,
        toUnixTimestamp(minute_timestamp) * 1000 AS time,
        avg_value AS value
    FROM WonderwareHistoryAggregated
    WHERE minute_timestamp >= toDateTime('{from_dt.strftime('%Y-%m-%d %H:%M:%S')}')
      AND minute_timestamp <= toDateTime('{to_dt.strftime('%Y-%m-%d %H:%M:%S')}')
      AND {tag_filter}
    ORDER BY minute_timestamp ASC
    """

    # Add WITH FILL for gap filling
    if fill_gaps:
        query += f"""
        WITH FILL
            FROM toDateTime('{from_dt.strftime('%Y-%m-%d %H:%M:%S')}')
            TO toDateTime('{to_dt.strftime('%Y-%m-%d %H:%M:%S')}')
            STEP INTERVAL 1 MINUTE
        """

    query += f" LIMIT {max_points}"

    result = client.query.execute(query, {})

    # Transform to Grafana format
    return transform_to_grafana_format(result)


def transform_to_grafana_format(query_result) -> ResponseData:
    """
    Transform query result to Grafana JSON format.

    Input: List of rows with 'target', 'time', 'value'
    Output: ResponseData with list of time series
    """

    # Group by target (tag name)
    series_dict = {}

    for row in query_result:
        target = row.get('target')
        time = row.get('time')
        value = row.get('value')

        if target not in series_dict:
            series_dict[target] = {
                "target": target,
                "datapoints": []
            }

        # Grafana expects [value, timestamp] format
        series_dict[target]["datapoints"].append([value, time])

    # Convert to ResponseData
    series_list = [TimeSeries(**s) for s in series_dict.values()]
    return ResponseData(series=series_list)


# CRITICAL: Api instantiation required for data_model_v2
wonderware_timeseries_api = Api[QueryParams, ResponseData](
    name="wonderware_timeseries",
    query_function=run
)
