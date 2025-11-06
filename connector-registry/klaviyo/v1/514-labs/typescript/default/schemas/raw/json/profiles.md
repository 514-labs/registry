# Profiles

Profiles represent individual people/contacts in Klaviyo. Each profile can have contact information (email, phone number), custom properties, and can be associated with lists and segments.

## Resource Properties

- **type**: Always `"profile"`
- **id**: Unique identifier for the profile
- **attributes**: Profile data including:
  - `email`: Email address
  - `phone_number`: Phone number in E.164 format
  - `external_id`: Your external system identifier
  - `first_name`, `last_name`: Name fields
  - `organization`, `title`: Professional information
  - `image`: Profile image URL
  - `created`, `updated`: Timestamps
  - `properties`: Custom properties (any additional data)

## Common Queries

### List all profiles
```
GET /api/profiles/
```

### Filter by email
```
GET /api/profiles/?filter[email]=user@example.com
```

### Filter by phone number
```
GET /api/profiles/?filter[phone_number]=+1234567890
```

### Filter by IDs (comma-separated)
```
GET /api/profiles/?filter[ids]=id1,id2,id3
```

### Get specific profile
```
GET /api/profiles/{id}
```

## Pagination

Profiles use cursor-based pagination:
- `page[size]`: Number of items per page (max 100)
- `page[cursor]`: Cursor for next page (from response `links.next`)

## API Endpoint

```
GET /api/profiles/
GET /api/profiles/{id}
```

## References

- [Klaviyo Profiles API Documentation](https://developers.klaviyo.com/en/reference/get_profiles)
