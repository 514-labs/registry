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

# New, clearer flag names
parser.add_argument("--init-all", action="store_true", default=False, help="Generate models and create database triggers (does both --generate-models and --create-database-triggers)")
parser.add_argument("--generate-models", action="store_true", default=False, help="Generate Moose models from SAP HANA table schemas")
parser.add_argument("--create-database-triggers", action="store_true", default=False, help="Create CDC tables and triggers in SAP HANA database")

# Existing flags (maintained for backwards compatibility)
parser.add_argument("--recreate-cdc-tables", action="store_true", default=False, help="Re-create CDC tables and triggers (drops and recreates them)")
parser.add_argument("--recreate-moose-models", action="store_true", default=False, help="[DEPRECATED] Use --generate-models instead")
parser.add_argument("--init-cdc", action="store_true", default=False, help="[DEPRECATED] Use --create-database-triggers instead")
parser.add_argument("--reset-cdc-status", action="store_true", default=False, help="Reset CDC status for all tables")
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

# Handle deprecated flags with warnings
if args.recreate_moose_models:
    logger.warning("⚠️  --recreate-moose-models is deprecated. Use --generate-models instead.")
    args.generate_models = True

if args.init_cdc:
    logger.warning("⚠️  --init-cdc is deprecated. Use --create-database-triggers instead.")
    args.create_database_triggers = True

# Handle --init-all flag
if args.init_all:
    logger.info("Running full initialization: generating models and creating database triggers...")
    args.generate_models = True
    args.create_database_triggers = True

# Generate Moose models
if args.generate_models:
    logger.info("Generating Moose models from SAP HANA table schemas...")
    tables_metadata = introspect_hana_database(
        connector.connection,
        table_names,
        config.source_schema,
        include_views=True
    )

    model_config = MooseModelConfig(
        force_all_fields_nullable=True
    )

    generate_moose_models(tables_metadata, MODEL_PATH, model_config)
    print(f"✅ Generated Moose models for {len(tables_metadata)} tables/views in '{MODEL_PATH}'.")

# Create or recreate CDC infrastructure
if args.recreate_cdc_tables:
    logger.info("Dropping existing CDC infrastructure...")
    connector.cleanup_cdc_infrastructure()
    logger.info("Recreating CDC infrastructure...")
    connector.init_cdc()
    print(f"✅ Recreated CDC tables and triggers.")
elif args.create_database_triggers:
    logger.info("Creating CDC tables and triggers in SAP HANA...")
    connector.init_cdc()
    print(f"✅ Initialized CDC tables and triggers.")

# Other operations
if args.drop_cdc:
    logger.info("Dropping CDC infrastructure...")
    connector.cleanup_cdc_infrastructure()
    print(f"✅ Dropped CDC tables and triggers.")
elif args.reset_cdc_status:
    logger.info("Resetting CDC status...")
    connector.reset_cdc_status()
    print(f"✅ Reset CDC status for all tables.")
elif not (args.generate_models or args.create_database_triggers or args.recreate_cdc_tables or args.init_all):
    parser.error("You must specify one of: --init-all, --generate-models, --create-database-triggers, or --recreate-cdc-tables")