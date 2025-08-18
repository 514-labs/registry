from __future__ import annotations
import json
import os
import sys
from pathlib import Path
import subprocess

this_dir = Path(__file__).resolve().parent
provider_meta_dir = (this_dir / '..' / '..' / '..' / '_meta').resolve()
assets_dir = provider_meta_dir / 'assets'
pipeline_json_path = provider_meta_dir / 'pipeline.json'
mmd_path = assets_dir / 'lineage.mmd'
svg_path = assets_dir / 'lineage.svg'

SHAPES = {
    'source': '([%LABEL%])',
    'transform': '{{%LABEL%}}',
    'system': '[(%LABEL%)]',
    'destination': '[(%LABEL%)]',
}

def shape_for(kind: str) -> str:
    return SHAPES.get(kind, '[(%LABEL%)]')

def label_for_destination(dest: dict | None) -> str:
    if not dest:
        return 'Destination'
    parts = [dest.get('system') or 'dest']
    if dest.get('database'):
        parts.append(dest['database'])
    if dest.get('table'):
        parts[-1] = f"{parts[-1]}.{dest['table']}"
    return ' '.join(parts)

def derive_from_spec(spec: dict) -> dict:
    nodes: list[dict] = []
    edges: list[dict] = []
    source_id = 'source'
    source_label = (
        spec.get('source', {}).get('connector', {}).get('name')
        or spec.get('source', {}).get('type')
        or 'source'
    )
    nodes.append({'id': source_id, 'kind': 'source', 'label': source_label})

    system_ids: list[str] = []
    for i, sys in enumerate(spec.get('systems') or []):
        _id = sys.get('id') or f'system_{i+1}'
        nodes.append({'id': _id, 'kind': 'system', 'label': sys.get('label') or sys.get('type') or _id})
        system_ids.append(_id)

    transform_ids: list[str] = []
    for i, t in enumerate(spec.get('transformations') or []):
        _id = t.get('id') or f'transform_{i+1}'
        nodes.append({'id': _id, 'kind': 'transform', 'label': t.get('label') or t.get('type') or _id})
        transform_ids.append(_id)

    dest_id = 'dest'
    nodes.append({'id': dest_id, 'kind': 'destination', 'label': label_for_destination(spec.get('destination'))})

    prev = source_id
    for nxt in [*system_ids, *transform_ids, dest_id]:
        edges.append({'from': prev, 'to': nxt})
        prev = nxt

    return {'nodes': nodes, 'edges': edges}

def to_mermaid(lineage: dict) -> str:
    lines: list[str] = ['flowchart TD']
    for n in lineage.get('nodes', []):
        shape = shape_for(n.get('kind'))
        label = (n.get('label') or n.get('id')).replace('\n', ' ')
        lines.append(f"  {n['id']}{shape.replace('%LABEL%', label)}")
    for e in lineage.get('edges', []):
        lbl = f"|{e.get('label')}| " if e.get('label') else ''
        lines.append(f"  {e['from']} -->{lbl} {e['to']}")
    return '\n'.join(lines) + '\n'

def main() -> None:
    assets_dir.mkdir(parents=True, exist_ok=True)
    spec = json.loads(pipeline_json_path.read_text('utf-8'))
    lineage = spec.get('lineage') if (spec.get('lineage') or {}).get('nodes') else derive_from_spec(spec)
    mermaid = to_mermaid(lineage)
    mmd_path.write_text(mermaid, 'utf-8')
    if '--svg' in sys.argv:
        try:
            subprocess.run(['npx', '-y', '-p', '@mermaid-js/mermaid-cli', 'mmdc', '-i', str(mmd_path), '-o', str(svg_path)], check=False)
        except Exception:
            pass
    print('Wrote', mmd_path, 'and SVG' if svg_path.exists() else '')

if __name__ == '__main__':
    main()
