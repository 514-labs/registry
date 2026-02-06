import datetime
from moose_lib import MooseClient
from pydantic import BaseModel, Field
from typing import Optional, Required
import logging

logger = logging.getLogger(__name__)

# Query params are defined as Pydantic models and are validated automatically
class QueryParams(BaseModel):
    machine: Optional[str] = Field(
        default="",
    )
    sensor_type: Optional[str] = Field(
        default="",
    )
    machine_type: Optional[str] = Field(
        default="",
    )
    start_ts: Optional[int] = Field(
        default=int((datetime.datetime.now() - datetime.timedelta(hours=1)).timestamp()),
    )
    end_ts: Optional[int] = Field(
        default=int(datetime.datetime.now().timestamp()),
    )
    
## The run function is where you can define your API logic
def run(client: MooseClient, params: QueryParams):
    
    start_ts = int(params.start_ts / 1000)
    end_ts = int(params.end_ts / 1000)
    machine = params.machine
    sensor_type = params.sensor_type
    machine_type = params.machine_type

    query = f"""
    SELECT 
        timestamp,
        value,
    FROM MachineData_0_0 
    WHERE timestamp >= '{start_ts}'
    AND timestamp <= '{end_ts}'
    """
    if params.machine:
        query += f" AND machine = '{machine}'"

    if params.sensor_type:
        query += f" AND sensor_type = '{sensor_type}'"

    if params.machine_type:
        query += f" AND machine_type = '{machine_type}'"

    query += """
    ORDER BY timestamp DESC
    """    
    print(query)
    return client.query.execute(query, {
        "start_ts": start_ts, 
        "end_ts": end_ts, 
        "machine": machine, 
        "sensor_type": sensor_type,
        "machine_type": machine_type
    })