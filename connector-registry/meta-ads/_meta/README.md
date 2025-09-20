# Meta Ads Connector

Extract campaign data, ad sets, ads, and insights from Meta Ads (Facebook Ads) using the Facebook Graph API.

## Features

- **Campaigns**: List, get, and stream campaign data
- **Ad Sets**: Access ad set information and targeting details
- **Ads**: Retrieve individual ad data and creative information
- **Insights**: Get performance metrics and analytics data
- **Streaming Support**: Efficient pagination for large datasets
- **Rate Limiting**: Built-in rate limiting to respect API limits

## Authentication

This connector uses Bearer token authentication with Facebook Graph API access tokens.

## API Coverage

This connector supports the following Facebook Graph API endpoints:

- `/act_{ad_account_id}/campaigns`
- `/act_{ad_account_id}/adsets`
- `/act_{ad_account_id}/ads`
- `/{object_id}/insights`

For more information, see the [Facebook Graph API documentation](https://developers.facebook.com/docs/graph-api/).