# Orders

Order data from Apex Trading, including order details, status, and execution information.

## Common Queries

List all orders:
```
No filters needed
```

Filter by symbol:
```
symbol=BTC-USDT
```

Filter by status:
```
status=NEW
status=FILLED
```

Filter by side:
```
side=BUY
side=SELL
```

Filter by date range:
```
startTime=2024-01-01T00:00:00Z
endTime=2024-01-31T23:59:59Z
```

## API Endpoints

```
GET /api/v3/orders - List orders
GET /api/v3/orders/{id} - Get specific order
POST /api/v3/orders - Create new order
DELETE /api/v3/orders/{id} - Cancel order
DELETE /api/v3/orders - Cancel all orders (optionally filtered by symbol)
```

## Fields

- **id**: Unique order identifier
- **clientOrderId**: Client-specified order identifier
- **accountId**: Account ID
- **symbol**: Trading pair symbol (e.g., BTC-USDT)
- **side**: Order side (BUY or SELL)
- **type**: Order type (LIMIT, MARKET, STOP_LIMIT, STOP_MARKET)
- **price**: Order price (for limit orders)
- **quantity**: Order quantity
- **filledQuantity**: Quantity filled
- **status**: Order status (NEW, PARTIALLY_FILLED, FILLED, CANCELED, REJECTED, EXPIRED)
- **timeInForce**: Time in force (GTC, IOC, FOK)
- **createdAt**: Order creation timestamp
- **updatedAt**: Order last update timestamp
