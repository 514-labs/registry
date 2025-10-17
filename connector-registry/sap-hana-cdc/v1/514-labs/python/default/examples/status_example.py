#!/usr/bin/env python3
"""
Example script demonstrating the get_status function for SAP HANA CDC Connector.
"""

import sys
import os
from dotenv import load_dotenv

# Add the src directory to the path so we can import the connector
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from sap_hana_cdc import SAPHanaCDCConnector, SAPHanaCDCConfig

def main():
    """Demonstrate the get_status function."""
    load_dotenv()
    
    # Create connector
    config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
    connector = SAPHanaCDCConnector.build_from_config(config)
    
    # Get client ID from environment or use default
    client_id = os.getenv("SAP_HANA_CLIENT_ID", "default_client")
    
    print(f"Getting CDC status for client: {client_id}")
    print("-" * 50)
    
    try:
        # Get status
        status = connector.get_status(client_id)
        
        print(f"Total entries in CDC change table: {status['total_entries']}")
        print(f"Lag in seconds: {status['lag_seconds']}")
        print(f"Max timestamp: {status['max_timestamp']}")
        print(f"Last client update: {status['last_client_update']}")
        
    except Exception as e:
        print(f"Error getting status: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
