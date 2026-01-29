from moose_lib import MooseClient, Api
from pydantic import BaseModel, Field
from typing import Optional, List
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
class QvdStatusParams(BaseModel):
    file_name: Optional[str] = Field(default=None, description="Filter by file name")
    status: Optional[str] = Field(default=None, description="Filter by status")
    include_history: bool = Field(default=False, description="Include processing history")
    limit: int = Field(default=50, ge=1, le=500, description="Max files to return")

# Response Models
class SyncSummary(BaseModel):
    total_files: int
    total_syncs_all_time: int
    syncs_today: int
    total_rows_processed: int
    current_failures: int
    currently_processing: int
    last_sync_at: Optional[str]

class FileStatus(BaseModel):
    file_name: str
    table_name: str
    status: str
    row_count: int
    file_size_bytes: int
    processed_at: str
    processing_duration_seconds: Optional[float]
    rows_per_second: Optional[float]
    source_type: str
    error_message: Optional[str]
    history: List[dict] = []

class FailureInfo(BaseModel):
    file_name: str
    table_name: str
    error_message: Optional[str]
    processed_at: str

class QvdStatusResponse(BaseModel):
    summary: SyncSummary
    files: List[FileStatus]
    failures: List[FailureInfo]

def run(client: MooseClient, params: QvdStatusParams) -> QvdStatusResponse:
    """Query ClickHouse for QVD tracking status."""
    ch_client = get_clickhouse_client()

    # Build WHERE clause for filtering
    where_clause = "WHERE 1=1"
    if params.file_name:
        where_clause += f" AND file_name = '{params.file_name}'"
    if params.status:
        where_clause += f" AND status = '{params.status}'"

    # Query summary (from FINAL view for latest state)
    summary_result = ch_client.query("""
        SELECT
            count(DISTINCT file_name) AS total_files,
            countIf(toDate(processed_at) = today()) AS syncs_today,
            sumIf(row_count, status = 'completed') AS total_rows_processed,
            countIf(status = 'failed') AS current_failures,
            countIf(status = 'processing') AS currently_processing,
            max(processed_at) AS last_sync_at
        FROM local.QvdFileTracking FINAL
    """)

    # Total syncs (all history, not FINAL)
    total_syncs = ch_client.query("SELECT count() FROM local.QvdFileTracking")

    summary = SyncSummary(
        total_files=summary_result.result_rows[0][0] if summary_result.result_rows else 0,
        total_syncs_all_time=total_syncs.result_rows[0][0] if total_syncs.result_rows else 0,
        syncs_today=summary_result.result_rows[0][1] if summary_result.result_rows else 0,
        total_rows_processed=summary_result.result_rows[0][2] if summary_result.result_rows else 0,
        current_failures=summary_result.result_rows[0][3] if summary_result.result_rows else 0,
        currently_processing=summary_result.result_rows[0][4] if summary_result.result_rows else 0,
        last_sync_at=str(summary_result.result_rows[0][5]) if summary_result.result_rows and summary_result.result_rows[0][5] else None
    )

    # Query files
    files_query = f"""
        SELECT
            file_name, table_name, status, row_count, file_size,
            processed_at, processing_duration_seconds,
            if(processing_duration_seconds > 0, row_count / processing_duration_seconds, 0),
            source_type, error_message
        FROM local.QvdFileTracking FINAL
        {where_clause}
        ORDER BY processed_at DESC
        LIMIT {params.limit}
    """
    files_result = ch_client.query(files_query)

    files = []
    for row in files_result.result_rows:
        file_status = FileStatus(
            file_name=row[0], table_name=row[1], status=row[2],
            row_count=row[3], file_size_bytes=row[4],
            processed_at=str(row[5]), processing_duration_seconds=row[6],
            rows_per_second=row[7], source_type=row[8],
            error_message=row[9], history=[]
        )

        # Optionally include history
        if params.include_history:
            history_result = ch_client.query(f"""
                SELECT processed_at, status, row_count, processing_duration_seconds, error_message
                FROM local.QvdFileTracking
                WHERE file_name = '{row[0]}'
                ORDER BY processed_at DESC
                LIMIT 20
            """)
            file_status.history = [
                {"processed_at": str(h[0]), "status": h[1], "row_count": h[2],
                 "duration_seconds": h[3], "error": h[4]}
                for h in history_result.result_rows
            ]

        files.append(file_status)

    # Query failures
    failures_result = ch_client.query("""
        SELECT file_name, table_name, error_message, processed_at
        FROM local.QvdFileTracking FINAL
        WHERE status = 'failed'
        ORDER BY processed_at DESC
        LIMIT 20
    """)

    failures = [
        FailureInfo(file_name=row[0], table_name=row[1],
                    error_message=row[2], processed_at=str(row[3]))
        for row in failures_result.result_rows
    ]

    return QvdStatusResponse(summary=summary, files=files, failures=failures)

# Register API
qvd_status = Api[QvdStatusParams, QvdStatusResponse](
    name="qvd_status",
    query_function=run
)

# CLI support
if __name__ == "__main__":
    import json
    from dotenv import load_dotenv
    load_dotenv()

    mock_client = MooseClient(None)
    params = QvdStatusParams()
    result = run(mock_client, params)
    print(json.dumps(result.model_dump(), indent=2))
