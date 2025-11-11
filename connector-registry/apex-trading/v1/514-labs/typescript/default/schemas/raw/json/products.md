# Products

Product/trading pair information from Apex Trading, including trading rules, precision, and status.

## Common Queries

List all products:
```
No filters needed
```

Filter by symbol:
```
symbol=BTC-USDT
```

Filter by status:
```
status=TRADING
```

## API Endpoints

```
GET /api/v3/products - List products
GET /api/v3/products/{symbol} - Get specific product
GET /api/v3/ticker?symbol={symbol} - Get ticker for product
GET /api/v3/depth?symbol={symbol} - Get order book for product
GET /api/v3/trades?symbol={symbol} - Get recent trades for product
```

## Fields

- **id**: Unique product identifier
- **symbol**: Trading pair symbol (e.g., BTC-USDT)
- **baseAsset**: Base asset (e.g., BTC)
- **quoteAsset**: Quote asset (e.g., USDT)
- **status**: Product trading status (TRADING, HALT, BREAK)
- **baseAssetPrecision**: Base asset precision (decimal places)
- **quoteAssetPrecision**: Quote asset precision (decimal places)
- **minPrice**: Minimum allowed price
- **maxPrice**: Maximum allowed price
- **tickSize**: Price tick size
- **minQuantity**: Minimum order quantity
- **maxQuantity**: Maximum order quantity
- **stepSize**: Quantity step size
- **minNotional**: Minimum notional value (price * quantity)
