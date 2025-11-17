# Lists

Lists are groups of profiles used for targeting and segmentation in Klaviyo. Lists allow you to organize contacts into specific audiences for email campaigns and automation.

## Resource Properties

- **type**: Always `"list"`
- **id**: Unique identifier for the list
- **attributes**: List data including:
  - `name`: Name of the list (required)
  - `created`: When the list was created
  - `updated`: When the list was last updated

## Common Queries

### List all lists
```
GET /api/lists/
```

### Get specific list
```
GET /api/lists/{id}
```

## Pagination

Lists use cursor-based pagination:
- `page[size]`: Number of items per page (max 100)
- `page[cursor]`: Cursor for next page (from response `links.next`)

## API Endpoint

```
GET /api/lists/
GET /api/lists/{id}
```

## References

- [Klaviyo Lists API Documentation](https://developers.klaviyo.com/en/reference/get_lists)
