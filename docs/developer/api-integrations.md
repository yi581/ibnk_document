---
sidebar_position: 3
title: API Integrations
---

# API Integrations

## Overview

The iBnk API provides a RESTful interface for stablecoin conversions on supported blockchain networks. The API follows a secure transaction flow where private keys never leave your application.

**Base URL**: `https://api.ibnk.xyz`

**Version**: 2.1.0

## Authentication

All API requests require an API key passed in the `X-API-Key` header:

```bash
curl -H "X-API-Key: your_api_key" https://api.ibnk.xyz/api/v1/pools
```

To request an API key, contact: **ying@ibnk.xyz**

## Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Base Sepolia | `84532` | Testnet |
| Arbitrum Sepolia | `421614` | Testnet |

## Transaction Flow

1. **Preview** - Get expected output and exchange rate
2. **Check Approval** - Verify token approval status
3. **Build Transaction** - API generates unsigned transaction
4. **Sign Locally** - Client signs with private key
5. **Broadcast** - API broadcasts and returns results

## Quick Example

### Preview a Conversion

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/convert/preview" \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "poolAddress": "0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
    "amountIn": "100"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amountIn": "100",
    "amountOut": "154.752590",
    "exchangeRate": "1.547526",
    "fee": "0.05%",
    "recommendedMinAmountOut": "154.675212"
  }
}
```

## Main API Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Pools** | `GET /api/v1/pools` | Get available liquidity pools |
| **Convert** | `POST /api/v1/convert/preview` | Preview conversion output |
| **Oracle** | `GET /api/v1/oracle/prices/:chainId` | Get real-time Oracle prices |
| **Approval** | `POST /api/v1/approval/check` | Check token approval status |
| **Approval** | `POST /api/v1/approval/build` | Build approval transaction |
| **Transaction** | `POST /api/v1/transaction/build/convert` | Build convert transaction |
| **Transaction** | `POST /api/v1/transaction/broadcast/convert` | Broadcast with slippage analysis |
| **Faucet** | `POST /api/v1/faucet/build/claim-all` | Claim test tokens |

## Contract Addresses (Base Sepolia)

| Contract | Address |
|----------|---------|
| Router | `0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE` |
| USDC | `0xB209B4f21a233751EEd1C11747b1f06850fE6ca2` |
| AUDM | `0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3` |
| EURC | `0x1e00beAf9Db905e1098A8224fa21E93b260DB7eC` |
| AUDM/USDC Pool | `0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57` |
| Faucet | `0x432a163B26DaB6D5f386d8C4F70032f670686238` |

## Rate Limits

| Limit | Value |
|-------|-------|
| Requests per 15 minutes | 100 |
| Burst limit | 10 requests/second |

## Error Handling

All responses include a `success` field:

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## Next Steps

For complete documentation, see:

- [Quick Start](../api-reference/quickstart) - Complete tutorial
- [Convert Guide](../api-reference/convert-guide) - Step-by-step conversion guide
- [API Endpoints](../api-reference/endpoints) - Full endpoint reference
- [Faucet](../api-reference/faucet) - Get test tokens
- [Reference](../api-reference/reference) - Contract addresses and best practices
