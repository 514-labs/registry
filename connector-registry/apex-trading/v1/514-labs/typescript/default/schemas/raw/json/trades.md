# Trades

Trade execution data from Apex Trading, including price, quantity, fees, and maker/taker information.

## Common Queries

List all trades:
```
No filters needed
```

Filter by symbol:
```
symbol=BTC-USDT
```

Filter by order:
```
orderId=12345
```

Filter by date range:
```
startTime=2024-01-01T00:00:00Z
endTime=2024-01-31T23:59:59Z
```

## API Endpoints

```
GET /api/v3/trades - List trades
GET /api/v3/trades/{id} - Get specific trade
GET /api/v3/trades/history - Get trade history
```

## Fields

- **id**: Unique trade identifier
- **orderId**: Order ID associated with this trade
- **symbol**: Trading pair symbol (e.g., BTC-USDT)
- **side**: Trade side (BUY or SELL)
- **price**: Trade execution price
- **quantity**: Trade quantity
- **fee**: Trading fee
- **feeAsset**: Asset used for fee payment
- **isMaker**: Whether this trade was a maker trade
- **createdAt**: Trade execution timestamp
