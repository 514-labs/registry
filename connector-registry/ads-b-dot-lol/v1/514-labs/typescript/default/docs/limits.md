# Limits

## Rate Limits

As of the current API documentation, **ADSB.lol does not publish explicit rate limits**. The service is designed to be open and freely accessible.

### Best Practices

- Be respectful of the service and avoid excessive request rates
- Use reasonable polling intervals (e.g., 5-10 seconds minimum for continuous monitoring)
- Consider caching data when appropriate
- Monitor your usage patterns and adjust if needed

## Data Freshness

- Aircraft data is updated in real-time as transponder messages are received
- The `seen` field indicates seconds since the last message from an aircraft
- The `seen_pos` field indicates seconds since position was last updated
- Aircraft typically disappear from the feed after ~60 seconds without updates

## Response Size

- The `/api/data/aircraft` endpoint returns all currently tracked aircraft
- Response sizes vary based on:
  - Number of aircraft in range of the receiver network
  - Time of day
  - Geographic region
- Typical response sizes range from hundreds to thousands of aircraft

## Availability

- The service is provided as-is with no uptime guarantees
- For production applications, consider:
  - Implementing retry logic
  - Fallback mechanisms
  - Local caching

## Future Changes

The ADSB.lol team has indicated that future changes may include:
- Optional API key system for tracking usage
- Potential rate limiting for very high-volume users
- Check the [official documentation](https://api.adsb.lol/docs) for updates

## Data License

All data is provided under the [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1.0/).
