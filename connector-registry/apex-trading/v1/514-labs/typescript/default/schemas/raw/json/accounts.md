# Accounts

Account information from Apex Trading, including balances, equity, and margin details.

## Common Queries

Get all accounts:
```
No filters needed
```

Get account balance:
```
Use the getBalance() method for current balance information
```

## API Endpoints

```
GET /api/v3/accounts - List all accounts
GET /api/v3/accounts/{id} - Get specific account
GET /api/v3/account/balance - Get account balance
```

## Fields

- **id**: Unique account identifier
- **userId**: User ID associated with the account
- **balance**: Total account balance
- **availableBalance**: Available balance for trading
- **lockedBalance**: Balance locked in open orders
- **equity**: Account equity
- **totalMargin**: Total margin used
- **freeMargin**: Free margin available
- **unrealizedPnl**: Unrealized profit and loss
- **createdAt**: Account creation timestamp
- **updatedAt**: Account last update timestamp
