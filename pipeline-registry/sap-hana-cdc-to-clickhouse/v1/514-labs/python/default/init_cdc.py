import os
import sys


registry_root = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '..', '..')
connector_path = os.path.join(registry_root, 'connector-registry', 'sap-hana-cdc', 'v1', '514-labs', 'python', 'default', 'src')
connector_path = os.path.abspath(connector_path)
sys.path.insert(0, connector_path)
from moose_lib_extras import introspect_hana_database, generate_moose_models, HanaIntrospector
from sap_hana_cdc import SAPHanaConfig, CDCConfig, SAPHanaCDCConnector
import argparse
from dotenv import load_dotenv

MODEL_PATH = "app/ingest/cdc.py"

parser = argparse.ArgumentParser(description="SAP HANA CDC Moose Pipeline Utility")
subparsers = parser.add_subparsers(dest="command", required=True)

    # 'init' sub-command
init_parser = subparsers.add_parser("init", help="Initialize Moose models and pipeline from SAP HANA schema")
# You can add more arguments to 'init' if needed, e.g. output path, schema, etc.
init_parser.add_argument("--schema", type=str, default=None, help="Schema to introspect (default: use config)")
init_parser.add_argument("--tables", type=str, default=None, help="Specific tables to introspect (comma separated)")
init_parser.add_argument("--tables-from-file", type=str, default=None, help="File containing tables to introspect (default: all)")
init_parser.add_argument("--recreate-cdc-tables", action="store_true", default=False, help="Re-create CDC tables and triggers (drops and recreates them)")

def validate_table_args(args):
    if not args.tables and not args.table_from_file:
        parser.error("You must specify either --tables or --table_from_file for the 'init' command.")
init_parser.set_defaults(func=validate_table_args)

args = parser.parse_args()

if args.command == "init":
    # Introspect tables
    table_names = []
    if args.tables:
        table_names = args.tables.split(",")
    elif args.tables_from_file:
        with open(args.tables_from_file, "r") as f:
            table_names = [line.strip() for line in f if line.strip()]

    else:
        parser.error("You must specify either --tables or --tables_from_file for the 'init' command.")
    load_dotenv()
    sap_config = SAPHanaConfig.from_env()
    cdc_config = CDCConfig(
        client_id="sap_hana_cdc_to_clickhouse",
        tables=table_names,
        exclude_tables=[],
        change_types=["INSERT", "UPDATE", "DELETE"],
        change_table_name="cdc_changes",
        change_schema=sap_config.user
    )
    connector = SAPHanaCDCConnector(sap_config=sap_config, cdc_config=cdc_config)
    connector.connect()

    # Get table metadata
    tables_metadata = introspect_hana_database(connector.connection, table_names, args.schema if args.schema else sap_config.schema)

    # Generate Moose models
    generate_moose_models(tables_metadata, MODEL_PATH)
    # It's best to put in place the trigger when we know the tables were found
    connector.init_cdc(args.recreate_cdc_tables)
    print(f"Generated Moose models for {len(tables_metadata)} tables in '{MODEL_PATH}'.")