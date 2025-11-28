#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Dict, Iterable

import requests


def iter_jsonl(path: Path) -> Iterable[Dict]:
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            yield json.loads(line)


def moose_ingest(model: str, rows: Iterable[Dict], concurrency: int) -> int:
    from concurrent.futures import ThreadPoolExecutor, as_completed

    base_url = os.getenv("MOOSE_BASE_URL", "http://localhost:4000")
    url = f"{base_url}/ingest/{model}"
    timeout_seconds = int(os.getenv("MOOSE_INGEST_TIMEOUT", "10"))
    total_ingested = 0
    session = requests.Session()

    def send_row(row: Dict) -> int:
        r = session.post(url, json=row, timeout=timeout_seconds)
        r.raise_for_status()
        return 1

    rows_list = list(rows)
    if not rows_list:
        return 0

    with ThreadPoolExecutor(max_workers=max(1, concurrency)) as executor:
        futures = [executor.submit(send_row, row) for row in rows_list]
        for fut in as_completed(futures):
            try:
                total_ingested += fut.result()
            except Exception as e:
                print("warn: failed to ingest row:", e)

    return total_ingested


def main() -> int:
    parser = argparse.ArgumentParser(description="Load staged JSONL into Moose ingest")
    parser.add_argument("--resource", choices=["inventory", "orders", "customers"], default="inventory")
    parser.add_argument("--in", dest="inp", default=None, help="Input JSONL path; defaults to data/stage/{resource}.jsonl")
    parser.add_argument("--model", default=None, help="Override the ingest model")
    parser.add_argument("--concurrency", type=int, default=int(os.getenv("MOOSE_INGEST_CONCURRENCY", "4")))
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent
    default_in = base_dir.parent / "data" / "stage" / f"{args.resource}.jsonl"
    in_path = Path(args.inp) if args.inp else default_in
    if not in_path.exists():
        raise SystemExit(f"Input not found: {in_path}")

    if args.model is None:
        args.model = {
            "inventory": "shopify_inventory_levels",
            "orders": "shopify_orders",
            "customers": "shopify_customers",
        }.get(args.resource, "shopify_inventory_levels")

    ingested = moose_ingest(args.model, iter_jsonl(in_path), args.concurrency)
    print(f"Ingested {ingested} rows to model {args.model}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


