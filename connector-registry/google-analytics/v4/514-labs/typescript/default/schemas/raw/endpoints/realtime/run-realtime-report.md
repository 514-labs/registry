# Run Realtime Report

Returns real-time event data for periods ranging from the present moment to 30 minutes ago.

## Endpoint

`POST /v1beta/properties/{propertyId}:runRealtimeReport`

## Use Cases

- Monitor current site traffic
- Track active users right now
- View live conversions and events
- Real-time dashboard displays

## Realtime Dimensions

- `country` - User's country
- `city` - User's city
- `deviceCategory` - Device type
- `unifiedScreenName` - Screen or page name
- `platform` - Platform (web, iOS, Android)

## Realtime Metrics

- `activeUsers` - Users active right now
- `screenPageViews` - Current page/screen views
- `conversions` - Live conversion events
- `eventCount` - Total events happening now

## Example

```typescript
const realtime = await conn.realtime.runRealtimeReport(propertyId, {
  dimensions: [{ name: 'country' }],
  metrics: [{ name: 'activeUsers' }],
  limit: 10
})
```
