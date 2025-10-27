# Raw JSON Schemas

This directory contains raw JSON schemas from the source API.

## Organization

Schemas can be organized in nested folders for better structure:
- `endpoints/` - API endpoint request/response schemas
- `types/` - Shared type definitions
- `events/` - Event or webhook payloads
- Or any logical grouping that makes sense for your connector

## Example Structure

```
json/
├── endpoints/
│   ├── users.schema.json
│   └── users.md
├── types/
│   ├── User.schema.json
│   └── User.md
└── events.schema.json
```
