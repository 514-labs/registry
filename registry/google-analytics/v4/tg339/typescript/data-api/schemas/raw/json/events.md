# Raw events (JSON)

Represents upstream Google Analytics event payloads as received from the API.

- `event_name`: GA event name (e.g., `session_start`, `page_view`).
- `event_params`: Bag of event parameters as provided by GA.
- `user_id`: Optional user identifier.
- `timestamp`: RFC 3339 timestamp when the event occurred.

This file accompanies `events.schema.json` for a programmatic definition.
