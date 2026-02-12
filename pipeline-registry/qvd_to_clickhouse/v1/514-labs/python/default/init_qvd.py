#!/usr/bin/env python3
"""
QVD Pipeline Initialization Tool

This CLI tool helps initialize and manage the QVD-to-ClickHouse pipeline:
- List available QVD files from any source (local, S3, HTTP, etc.)
- Generate Pydantic models from QVD schema introspection
- Reset tracking state
"""

import argparse
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Add app directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from app.config.qvd_config import QvdConfig
from app.workflows.lib.qvd_reader import QvdReader
from app.utils.qvd_introspection import QvdIntrospector
from app.utils.qvd_model_generator import QvdModelGenerator
from app.utils.clickhouse_file_tracker import ClickHouseFileTracker


def list_files(args):
    """List QVD files from source."""
    print(f"Listing QVD files from: {args.source}")

    # Build storage options
    storage_options = {}
    if args.aws_key:
        storage_options["key"] = args.aws_key
        storage_options["secret"] = args.aws_secret

    reader = QvdReader(storage_options=storage_options)

    try:
        files = reader.list_files(args.source, args.pattern)
        print(f"\nFound {len(files)} QVD files:\n")

        for file_path in files:
            file_name = Path(file_path).stem
            print(f"  - {file_name}")
            if args.verbose:
                try:
                    info = reader.get_file_info(file_path)
                    print(f"    Size: {info.get('size', 0):,} bytes")
                    if info.get('mtime'):
                        print(f"    Modified: {info['mtime']}")
                except Exception as e:
                    print(f"    (Could not read info: {e})")

    except Exception as e:
        print(f"Error listing files: {e}", file=sys.stderr)
        sys.exit(1)


def generate_models(args):
    """Generate Pydantic models from QVD files."""
    print(f"Generating models from: {args.source}")

    # Build storage options
    storage_options = {}
    if args.aws_key:
        storage_options["key"] = args.aws_key
        storage_options["secret"] = args.aws_secret

    reader = QvdReader(storage_options=storage_options)
    introspector = QvdIntrospector(reader, table_prefix=args.table_prefix)
    generator = QvdModelGenerator()

    try:
        # Parse include/exclude lists
        include_files = None
        if args.files:
            include_files = [f.strip() for f in args.files.split(",")]

        exclude_files = None
        if args.exclude:
            exclude_files = [f.strip() for f in args.exclude.split(",")]

        # Introspect files
        print("Introspecting QVD files...")
        metadata_list = introspector.introspect_directory(
            source=args.source,
            pattern=args.pattern,
            include_files=include_files,
            exclude_files=exclude_files
        )

        if not metadata_list:
            print("No QVD files found to process", file=sys.stderr)
            sys.exit(1)

        print(f"Found {len(metadata_list)} files to process\n")

        # Show what will be generated
        for metadata in metadata_list:
            print(f"  {metadata.file_name}")
            print(f"    → Class: {metadata.class_name}")
            print(f"    → Table: {metadata.table_name}")
            print(f"    → Fields: {len(metadata.fields)}")
            print(f"    → Rows: {metadata.row_count:,}")

        # Generate models
        print(f"\nGenerating models to: {args.output}")
        generator.generate_models(
            metadata_list,
            args.output,
            overwrite=args.overwrite
        )

        print("\n✓ Model generation complete!")
        print(f"\nNext steps:")
        print(f"  1. Review generated models in {args.output}")
        print(f"  2. Set QVD_SOURCE environment variable")
        print(f"  3. Run: moose dev")

    except Exception as e:
        print(f"Error generating models: {e}", file=sys.stderr)
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


def reset_state(args):
    """Reset tracking state."""
    tracker = ClickHouseFileTracker()

    # Show current state
    summary = tracker.get_status_summary()
    total = sum(summary.values())

    if total == 0:
        print("No tracking state found")
        return

    print(f"Current state ({total} files tracked):")
    for status, count in summary.items():
        print(f"  {status}: {count}")

    # Show failures if any
    errors = tracker.list_errors()
    if errors:
        print(f"\nFiles with failures:")
        for error in errors[:10]:  # Show first 10
            print(f"  - {Path(error.file_path).name}: {error.error_message}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more")

    # Confirm reset
    if not args.force:
        response = input("\nReset all tracking state (delete all records)? [y/N] ")
        if response.lower() != 'y':
            print("Cancelled")
            return

    tracker.reset_state(force_delete=True)
    print("✓ Tracking state reset")


def main():
    parser = argparse.ArgumentParser(
        description="QVD-to-ClickHouse Pipeline Initialization Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List files from local directory
  python init_qvd.py --list-files --source /path/to/qvd

  # List files from S3
  python init_qvd.py --list-files --source s3://bucket/qvd-files

  # Generate models for all QVD files
  python init_qvd.py --generate-models --source /path/to/qvd

  # Generate models with no table prefix
  python init_qvd.py --generate-models --source /path/to/qvd --table-prefix ""

  # Generate models for specific files only
  python init_qvd.py --generate-models --source s3://bucket/path --files Item,PO

  # Reset tracking state
  python init_qvd.py --reset-state --force
        """
    )

    # Action arguments
    action_group = parser.add_mutually_exclusive_group(required=True)
    action_group.add_argument(
        "--list-files",
        action="store_true",
        help="List available QVD files"
    )
    action_group.add_argument(
        "--generate-models",
        action="store_true",
        help="Generate Pydantic models from QVD schema"
    )
    action_group.add_argument(
        "--reset-state",
        action="store_true",
        help="Reset file tracking state"
    )

    # Common arguments
    parser.add_argument(
        "--source",
        help="Source path or URL (local path, s3://, https://, etc.)"
    )
    parser.add_argument(
        "--pattern",
        default="*.qvd",
        help="File pattern (default: *.qvd)"
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Verbose output"
    )

    # Model generation arguments
    parser.add_argument(
        "--output",
        default="app/ingest/qvd.py",
        help="Output file for generated models (default: app/ingest/qvd.py)"
    )
    parser.add_argument(
        "--files",
        help="Comma-separated list of file names to include (without .qvd)"
    )
    parser.add_argument(
        "--exclude",
        help="Comma-separated list of file names to exclude"
    )
    parser.add_argument(
        "--table-prefix",
        default="Qvd",
        help="Prefix for table names (default: Qvd, use empty string for no prefix)"
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing output file"
    )

    # AWS credentials
    parser.add_argument(
        "--aws-key",
        help="AWS access key ID (or use AWS_ACCESS_KEY_ID env var)"
    )
    parser.add_argument(
        "--aws-secret",
        help="AWS secret access key (or use AWS_SECRET_ACCESS_KEY env var)"
    )

    # State management
    parser.add_argument(
        "--force",
        action="store_true",
        help="Skip confirmation prompts"
    )

    args = parser.parse_args()

    # Load environment variables
    load_dotenv()

    # Use env vars if not provided as args
    if not args.aws_key:
        args.aws_key = os.getenv("AWS_ACCESS_KEY_ID")
        args.aws_secret = os.getenv("AWS_SECRET_ACCESS_KEY")

    # Validate arguments
    if (args.list_files or args.generate_models) and not args.source:
        parser.error("--source is required for --list-files and --generate-models")

    # Execute action
    if args.list_files:
        list_files(args)
    elif args.generate_models:
        generate_models(args)
    elif args.reset_state:
        reset_state(args)


if __name__ == "__main__":
    main()
