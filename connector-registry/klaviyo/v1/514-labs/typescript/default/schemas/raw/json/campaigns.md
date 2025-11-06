# Campaigns

Campaigns represent email marketing campaigns in Klaviyo. They contain information about the campaign status, target audiences, send strategy, and tracking options.

## Resource Properties

- **type**: Always `"campaign"`
- **id**: Unique identifier for the campaign
- **attributes**: Campaign data including:
  - `name`: Name of the campaign (required)
  - `status`: Current status (draft, scheduled, sending, sent, canceled)
  - `archived`: Whether the campaign is archived
  - `audiences`: Target audiences (included and excluded)
  - `send_strategy`: Send scheduling configuration
  - `tracking_options`: Click and open tracking settings
  - `created_at`, `updated_at`: Timestamps
  - `scheduled_at`: When scheduled to send
  - `send_time`: When actually sent

## Common Queries

### List all campaigns
```
GET /api/campaigns/
```

### Filter by IDs (comma-separated)
```
GET /api/campaigns/?filter[ids]=id1,id2,id3
```

### Get specific campaign
```
GET /api/campaigns/{id}
```

## Pagination

Campaigns use cursor-based pagination:
- `page[size]`: Number of items per page (max 100)
- `page[cursor]`: Cursor for next page (from response `links.next`)

## API Endpoint

```
GET /api/campaigns/
GET /api/campaigns/{id}
```

## Campaign Status Values

- **draft**: Campaign is being created/edited
- **scheduled**: Campaign is scheduled to send
- **sending**: Campaign is currently sending
- **sent**: Campaign has been sent
- **canceled**: Campaign was canceled

## References

- [Klaviyo Campaigns API Documentation](https://developers.klaviyo.com/en/reference/get_campaigns)
