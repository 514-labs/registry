from moose_lib import MooseClient
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

class QueryParams(BaseModel):
    pass

## The run function is where you can define your API logic
def run(client: MooseClient, params: QueryParams):
    
    query = f"""
    SELECT 
        DISTINCT machine
    FROM MachineData_0_0 
    ORDER BY machine ASC
    """    
    return client.query.execute(query, params)