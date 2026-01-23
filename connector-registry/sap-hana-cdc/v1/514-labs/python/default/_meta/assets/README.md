# Assets

This directory contains visual assets for the SAP HANA CDC connector.

## Logo

A logo file should be placed here (e.g., `logo.png` or `logo.svg`) to represent the connector in registry listings and documentation.

### Recommended Specifications

- **Format**: PNG or SVG
- **Size**: 512x512px (PNG) or scalable (SVG)
- **Background**: Transparent
- **Style**: Should represent SAP HANA or CDC functionality

### Usage

Once added, update the `avatarUrlOverride` field in `connector.json` to reference the logo:

```json
{
  "avatarUrlOverride": "https://raw.githubusercontent.com/514-labs/registry/main/connector-registry/sap-hana-cdc/v1/514-labs/python/default/_meta/assets/logo.png"
}
```
