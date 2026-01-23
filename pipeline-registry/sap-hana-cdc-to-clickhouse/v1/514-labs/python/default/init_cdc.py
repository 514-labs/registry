import argparse
import logging
from dotenv import load_dotenv
from app.utils.sap_hana_introspection import introspect_hana_database
from app.utils.moose_model_generator import generate_moose_models, MooseModelConfig
from sap_hana_cdc import SAPHanaCDCConfig, SAPHanaCDCConnector

MODEL_PATH = "app/ingest/cdc.py"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

parser = argparse.ArgumentParser(description="SAP HANA CDC Moose Pipeline Utility")
# You can add more arguments to 'init' if needed, e.g. output path, schema, etc.
parser.add_argument("--tables", type=str, default=None, help="Specific tables to introspect (comma separated)")
parser.add_argument("--tables-from-file", type=str, default=None, help="File containing tables to introspect (default: all)")
parser.add_argument("--recreate-cdc-tables", action="store_true", default=False, help="Re-create CDC tables and triggers (drops and recreates them)")
parser.add_argument("--recreate-moose-models", action="store_true", default=False, help="Only generate Moose models, do not initialize CDC tables/triggers")
parser.add_argument("--reset-cdc-status", action="store_true", default=False, help="Reset CDC status for all tables")
parser.add_argument("--init-cdc", action="store_true", default=False, help="Initialize CDC tables and triggers")
parser.add_argument("--drop-cdc", action="store_true", default=False, help="Drop CDC tables and triggers")

def validate_table_args(args):
    if not args.tables and not args.tables_from_file:
        parser.error("You must specify either --tables or --tables-from-file for the 'init' command.")
parser.set_defaults(func=validate_table_args)

args = parser.parse_args()

load_dotenv()
config = SAPHanaCDCConfig.from_env()
print(config)

# Introspect tables
table_names = []
if args.tables:
    table_names = args.tables.split(",")
elif args.tables_from_file:
    with open(args.tables_from_file, "r") as f:
        table_names = [line.strip() for line in f if line.strip()]
elif config.tables:
    table_names = config.tables
else:
    parser.error("You must specify either --tables or --tables_from_file or use SAP_HANA_TABLES for the 'init' command.")

load_dotenv()
connector = SAPHanaCDCConnector.build_from_config(config=config)

if args.recreate_moose_models:
    tables_metadata = introspect_hana_database(
        connector.connection,
        table_names,
        config.source_schema,
        include_views=True
    )

    config = MooseModelConfig(
        force_all_fields_nullable=True
    )

    generate_moose_models(tables_metadata, MODEL_PATH, config)
    print(f"Generated Moose models for {len(tables_metadata)} tables/views in '{MODEL_PATH}'.")

if args.recreate_cdc_tables:
    print("Dropping existing CDC infrastructure...")
    connector.cleanup_cdc_infrastructure()
    print("Recreating CDC infrastructure...")
    connector.init_cdc()
    print(f"Recreated CDC tables and triggers.")
elif args.init_cdc:
    connector.init_cdc()
    print(f"Initialized CDC tables and triggers.")

if args.drop_cdc:
    connector.cleanup_cdc_infrastructure()
    print(f"Dropped CDC tables and triggers.")
elif args.reset_cdc_status:
    connector.reset_cdc_status()
    print(f"Reset CDC status for all tables.")
elif not (args.recreate_moose_models or args.init_cdc or args.recreate_cdc_tables):
        parser.error("You must specify either --recreate-moose-models or --recreate-cdc-tables or --init-cdc")