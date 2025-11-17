# Apex Trading (Registry)

This is the top-level registry entry for the Apex Trading connector.

Apex Trading is a comprehensive ERP platform for the cannabis and hemp industry, providing inventory management, batch tracking, buyer management, and more.

## Features

- Inventory and batch management
- Buyer and brand tracking
- Product catalog management
- Contact log management
- Deal flow management
- Document management

## Versions

- **v1**: Current stable version

## Implementations

See implementations under `apex/v1/{author}/` for language-specific connectors:
- TypeScript implementation by 514-labs: `apex/v1/514-labs/typescript/default`

## API Reference

- Base URL: `https://app.apextrading.com/api`
- Authentication: Bearer token
- Rate Limit: 15 requests/second
- Pagination: Page-based (per_page, max 500)

## Resources

The Apex API provides access to:
- Batches (v2 API)
- Brands
- Buyers
- Buyer Contact Logs
- Buyer Stages
- Products
- Cannabinoids
- Container Types
- Cultivars
- And many more...

