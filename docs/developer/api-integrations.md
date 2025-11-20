---
sidebar_position: 3
title: API Integrations
---

# API Integrations

## Overview

The iBnk API provides a RESTful interface for interacting with the Stablecoin FX Layer. You can query routes, preview swaps, manage token approvals, and execute settlements—all through simple HTTP requests.

**Current Version**: v1.3
**Base URL**: `https://api.ibnk.xyz` (Production) or `http://localhost:3000` (Local Development)
**Environment**: Sandbox (Testnet Only)

:::info
The API is currently in **Sandbox mode**. All operations use testnet tokens and networks. No real value is involved.
:::

***

## Authentication

All API requests require an **API Key** passed via the `X-API-Key` header.

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools" \
  -H "X-API-Key: your_api_key_here"
```

### How to Get an API Key

To receive a Sandbox API key:

📧 Email: **ying@ibnk.xyz**

You will receive:
- Your API key
- Testnet chain information
- Discord/Slack invite for support

***

## Integration Methods

You can integrate with the iBnk API using three methods—**no frontend required**:

### Method A: Node.js Scripts (✅ Recommended)

Call the API directly from Node.js scripts. Sign transactions locally with your private key.

**Example:**

```javascript
const { ethers } = require('ethers');

// 1. Preview swap
const preview = await fetch('https://api.ibnk.xyz/api/v1/swap/preview', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    tokenIn: '0x...',
    tokenOut: '0x...',
    amountIn: '10'
  })
});

// 2. Sign transaction locally
const wallet = new ethers.Wallet(privateKey, provider);
const signedTx = await wallet.signTransaction(txData);

// 3. Broadcast transaction
await fetch('https://api.ibnk.xyz/api/v1/transaction/broadcast', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    signedTransaction: signedTx
  })
});
```

### Method B: Python Scripts

Use Python for automated settlement and integration scripts.

**Example:**

```python
import requests
from eth_account import Account

# Preview swap
response = requests.post(
    'https://api.ibnk.xyz/api/v1/swap/preview',
    headers={'X-API-Key': 'your_api_key'},
    json={
        'chainId': 421614,
        'tokenIn': '0x...',
        'tokenOut': '0x...',
        'amountIn': '10'
    }
)

# Sign and broadcast
tx_data = response.json()
signed_tx = Account.sign_transaction(tx_data, private_key)
```

### Method C: Browser + MetaMask

Build a web frontend with MetaMask integration for user-facing applications.

***

## Quick Start

### 1. Get Available Pools

```bash
GET /api/v1/pools?chainId=421614
```

**Response:**

```json
{
  "pools": [
    {
      "address": "0x123...",
      "token0": "USDC",
      "token1": "AUDD",
      "reserve0": "1000000",
      "reserve1": "1350000"
    }
  ]
}
```

### 2. Preview a Swap

```bash
POST /api/v1/swap/preview
Content-Type: application/json

{
  "chainId": 421614,
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "amountIn": "100"
}
```

**Response:**

```json
{
  "amountOut": "134.5",
  "priceImpact": "0.5%",
  "route": ["USDC", "AUDD"]
}
```

### 3. Check Token Approval

```bash
POST /api/v1/approval/check
Content-Type: application/json

{
  "chainId": 421614,
  "owner": "0xYourAddress",
  "token": "0xTokenAddress",
  "spender": "0xRouterAddress"
}
```

### 4. Build Transaction

```bash
POST /api/v1/transaction/build/swap
Content-Type: application/json

{
  "chainId": 421614,
  "from": "0xYourAddress",
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "amountIn": "100"
}
```

**Response:**

```json
{
  "to": "0xRouterAddress",
  "data": "0x...",
  "value": "0",
  "gasLimit": "200000"
}
```

### 5. Broadcast Signed Transaction

```bash
POST /api/v1/transaction/broadcast
Content-Type: application/json

{
  "chainId": 421614,
  "signedTransaction": "0x..."
}
```

***

## Supported Testnets

iBnk currently operates on the following EVM testnets:

- **Ethereum Sepolia**
- **Base Sepolia**
- **Arbitrum Sepolia**
- **Polygon Amoy**

***

## Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/pools` | GET | List all available liquidity pools |
| `/api/v1/pools/:address` | GET | Get specific pool details |
| `/api/v1/swap/preview` | POST | Preview swap output and price impact |
| `/api/v1/approval/check` | POST | Check token approval status |
| `/api/v1/approval/build` | POST | Build approval transaction |
| `/api/v1/transaction/build/swap` | POST | Build swap transaction |
| `/api/v1/transaction/broadcast` | POST | Broadcast signed transaction |
| `/api/v1/transaction/status` | POST | Check transaction status |

***

## Complete API Documentation

For the full API reference including all endpoints, parameters, and examples:

→ [View Full API Documentation](/api-reference/overview)

***

## Support

Need help integrating?

- **Email**: ying@ibnk.xyz
- **Discord/Slack**: Available to Sandbox partners
- **Documentation**: [Support Center](/support)

***

## Next Steps

1. **Get your API key** by emailing ying@ibnk.xyz
2. **Review the testnet chains** in [EVM Chain](/developer/evm-chain)
3. **Start testing** with the Sandbox environment
4. **Join the community** for updates and support
