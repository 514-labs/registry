import os
import sys
from dotenv import load_dotenv
sys.path.append(os.path.dirname(__file__) + "/../src")

# Handle missing dependencies gracefully
from sap_hana_cdc import SAPHanaCDCConnector, SAPHanaConfig, CDCConfig

# Example configuration
load_dotenv(".env")
sap_config = SAPHanaConfig(
    host=os.getenv("SAP_HANA_HOST"),
    port=int(os.getenv("SAP_HANA_PORT", 30015)),
    user=os.getenv("SAP_HANA_USERNAME"),
    password=os.getenv("SAP_HANA_PASSWORD"),
    schema=os.getenv("SAP_HANA_SCHEMA")
)

cdc_config = CDCConfig(
    client_id="sap_hana_cdc_client_001",  # Unique client identifier
    tables=["EKKO", "MARA"],  # Monitor specific tables
    exclude_tables=[],  # No exclusions
    change_types=["INSERT", "UPDATE", "DELETE"],
    change_table_name="cdc_changes",
    change_schema=os.getenv("SAP_HANA_USERNAME")  # Use same schema as SAP HANA config
)


# Create connector
connector = SAPHanaCDCConnector(sap_config, cdc_config)
connector.connect()
connector.init_cdc()
since_ts = 0
while True:
    changes = connector.get_changes(limit=1)

    if changes.changes:
        since_ts = changes.changes[-1].event_timestamp
        print("\n\n")
        print(f"Found {len(changes.changes)} changes:")
        for change in changes.changes:
            print(f"Table: {change.table_name}")
            print(f"Type: {change.change_type}")
            print(f"Timestamp: {change.event_timestamp}")
            print(f"Event ID: {change.event_id}")
            # if hasattr(change, 'new_values') and change.new_values:
            #     print(f"New values: {change.new_values}")
            # if hasattr(change, 'old_values') and change.old_values:
            #     print(f"Old values: {change.old_values}")
            print("-" * 40)
        connector.update_client_status(changes.changes[-1])
    else:
        print("No changes found")
        break

connector.disconnect()