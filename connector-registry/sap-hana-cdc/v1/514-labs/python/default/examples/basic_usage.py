import os
import sys
import time
from dotenv import load_dotenv
sys.path.append(os.path.dirname(__file__) + "/../src")
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    handlers=[logging.StreamHandler()]
)

# Handle missing dependencies gracefully
from sap_hana_cdc import SAPHanaCDCConnector

# Example configuration
load_dotenv()

# Create connector using the new factory method
connector = SAPHanaCDCConnector.build_from_env()

#connector.infrastructure.cleanup_cdc_infrastructure()
# connector.init_cdc()

# print("Newly added tables:")
# tables = connector.get_newly_added_tables()
# print(f"Found {len(tables)} new tables")
# for table in tables:
#     #print(f"New table {table} has {len(list(connector.reader.get_all_table_rows(table)))} rows")
#     connector.set_table_status_active(table)

print("Listening for changes...")
while True:
    changes = connector.get_changes(limit=1)

    if changes.changes:
        since_ts = changes.changes[-1].event_timestamp
        print("\n\n")
        print(f"Found {len(changes.changes)} changes:")
        for change in changes.changes:
            print(f"Table: {change.table_name}")
            print(f"Type: {change.trigger_type}")
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
        time.sleep(1)


        