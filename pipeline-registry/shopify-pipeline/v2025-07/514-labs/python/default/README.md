# shopify-pipeline (Python)

Python helpers for the `shopify-pipeline` pipeline by `514-labs`.

- One-shot: `scripts/shopify_ingest.py` pulls directly from Shopify and POSTs to Moose ingest.
- Staged pipeline:
  - Extract+Transform → Stage (JSONL): `python scripts/etl_to_stage.py --resource inventory --limit 50`
  - Load from Stage → Moose: `python scripts/load_from_stage.py --resource inventory`
- Lineage: `python scripts/lineage.py` or `python scripts/lineage.py --svg` (requires Node + Mermaid CLI).
