---
sidebar_position: 5
title: API Endpoints
---

# API Endpoints

**Base URL**: `https://api.ibnk.xyz`

---

## Health Check

Check API server status.

**`GET /health`**

**Authentication**: Not required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T10:30:00.000Z",
  "uptime": 3600.123
}
```

---

## Pools

### Get All Pools

Retrieve all available liquidity pools.

**`GET /api/v1/pools`**

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `chainId` | number | `84532` | Blockchain network ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "pools": [
      {
        "address": "0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57",
        "name": "AUDM/USDC",
        "chainId": 84532,
        "token0": {
          "address": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
          "symbol": "AUDM",
          "decimals": 6
        },
        "token1": {
          "address": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
          "symbol": "USDC",
          "decimals": 6
        },
        "reserves": {
          "token0": "1000000.000000",
          "token1": "650000.000000"
        },
        "totalSupply": "800000.000000000000000000"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 3,
      "total": 3
    }
  }
}
```

**Example:**
```bash
curl -H "X-API-Key: your_api_key" \
  "https://api.ibnk.xyz/api/v1/pools?chainId=84532"
```

---

### Get Pool Info

Retrieve detailed information for a specific pool.

**`GET /api/v1/pools/:poolAddress`**

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `chainId` | number | `84532` | Blockchain network ID |

**Example:**
```bash
curl -H "X-API-Key: your_api_key" \
  "https://api.ibnk.xyz/api/v1/pools/0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57?chainId=84532"
```

---

## Convert

### Preview Convert

Get expected output amount and exchange rate before executing a conversion.

**`POST /api/v1/convert/preview`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `poolAddress` | string | Yes | Pool contract address |
| `tokenIn` | string | Yes | Input token address |
| `tokenOut` | string | Yes | Output token address |
| `amountIn` | string | Yes | Amount to convert (human-readable) |

**Example Request:**
```json
{
  "chainId": 84532,
  "poolAddress": "0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57",
  "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
  "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
  "amountIn": "100"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amountIn": "100",
    "amountOut": "154.752590",
    "tokenIn": {
      "address": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
      "symbol": "USDC",
      "decimals": 6
    },
    "tokenOut": {
      "address": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
      "symbol": "AUDM",
      "decimals": 6
    },
    "exchangeRate": "1.547526",
    "inverseRate": "0.646193",
    "fee": "0.05%",
    "recommendedMinAmountOut": "154.675212"
  }
}
```

**Response Fields:**
| Field | Description |
|-------|-------------|
| `amountOut` | Expected output amount |
| `exchangeRate` | Rate of tokenIn to tokenOut |
| `inverseRate` | Rate of tokenOut to tokenIn |
| `fee` | Pool fee (0.05% for stablecoins) |
| `recommendedMinAmountOut` | Minimum output with 0.05% tolerance (use for `minAmountOut`) |

---

## Oracle

### Get Oracle Prices

Retrieve real-time prices from Chainlink Oracles.

**`GET /api/v1/oracle/prices/:chainId?`**

**Path Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `chainId` | number | `84532` | Blockchain network ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "chainId": 84532,
    "chainName": "Base Sepolia",
    "prices": {
      "AUDM": {
        "usd": "0.64590000",
        "oracle": "0x650C8A8Bbf129f60B2C5d956078943b306bE95FF",
        "lastUpdate": "2025-11-25T10:30:00.000Z"
      },
      "EURC": {
        "usd": "1.15300000",
        "oracle": "0x5f8D58C41f90487eA440F73c46FD5F55e4F2CFF6",
        "lastUpdate": "2025-11-25T10:30:00.000Z"
      },
      "USDC": {
        "usd": "1.0",
        "oracle": null,
        "lastUpdate": "2025-11-25T10:30:00.000Z"
      }
    },
    "timestamp": "2025-11-25T10:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -H "X-API-Key: your_api_key" \
  "https://api.ibnk.xyz/api/v1/oracle/prices/84532"
```

---

## Approval

Before converting tokens, users must approve the Router contract to spend their tokens.

### Check Approval

Check if approval is needed for a specific amount.

**`POST /api/v1/approval/check`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `tokenAddress` | string | Yes | Token to approve |
| `ownerAddress` | string | Yes | User's wallet address |
| `spenderAddress` | string | Yes | Router contract address |
| `requiredAmount` | string | Yes | Amount needed (human-readable) |

**Response:**
```json
{
  "success": true,
  "data": {
    "needsApproval": true,
    "currentAllowance": "0",
    "requiredAmount": "100"
  }
}
```

---

### Build Approval Transaction

Build an unsigned approval transaction.

**`POST /api/v1/approval/build`**

**Request Body:**
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `chainId` | number | No | `84532` | Network ID |
| `tokenAddress` | string | Yes | - | Token to approve |
| `spenderAddress` | string | Yes | - | Router contract address |
| `amount` | string | Yes | - | Amount to approve |
| `isUnlimited` | boolean | No | `false` | Approve unlimited amount |

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "to": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
      "data": "0x095ea7b3...",
      "value": "0",
      "chainId": 84532,
      "gasLimit": "60000"
    },
    "recommendation": {
      "type": "limited",
      "reason": "Recommended for security"
    }
  }
}
```

---

### Revoke Approval

Build a transaction to revoke token approval.

**`POST /api/v1/approval/revoke`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `tokenAddress` | string | Yes | Token address |
| `spenderAddress` | string | Yes | Spender to revoke |

---

## Transaction

### Build Convert Transaction

Build an unsigned convert (swap) transaction.

**`POST /api/v1/transaction/build/convert`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `userAddress` | string | Yes | User's wallet address |
| `tokenIn` | string | Yes | Input token address |
| `tokenOut` | string | Yes | Output token address |
| `amountIn` | string | Yes | Amount to convert (human-readable) |
| `minAmountOut` | string | Yes | Minimum output (use `recommendedMinAmountOut` from preview) |
| `deadline` | number | No | Unix timestamp (default: now + 5 minutes) |

**Response:**
```json
{
  "success": true,
  "data": {
    "to": "0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE",
    "data": "0x...",
    "value": "0",
    "chainId": 84532,
    "gasLimit": "254664",
    "maxFeePerGas": "1500000000",
    "maxPriorityFeePerGas": "1000000000"
  }
}
```

---

### Broadcast Transaction (Generic)

Broadcast any signed transaction.

**`POST /api/v1/transaction/broadcast`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `signedTransaction` | string | Yes | Signed transaction hex |

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x...",
    "status": "success",
    "blockNumber": 12345678,
    "gasUsed": "212220"
  }
}
```

---

### Broadcast Convert Transaction (with Slippage Analysis)

Broadcast a convert transaction and receive detailed slippage analysis based on Oracle prices.

**`POST /api/v1/transaction/broadcast/convert`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `signedTransaction` | string | Yes | Signed transaction hex |
| `expectedAmountOut` | string | Yes | Expected output from preview |
| `amountIn` | string | Yes | Input amount |
| `tokenIn` | string | Yes | Input token address |
| `tokenOut` | string | Yes | Output token address |

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x04e4413725593915b8afcfe657df675e76b046b6e0500e164b9cc810b76d7681",
    "status": "success",
    "blockNumber": 12345678,
    "gasUsed": "212220",
    "convert": {
      "amountIn": "10",
      "expectedAmountOut": "15.475259",
      "actualAmountOut": "15.475646",
      "oracleAmountOut": "15.483000",
      "fee": {
        "rate": "0.05%",
        "amount": "0.007742"
      },
      "slippage": "-0.0025%",
      "executedRate": "1.547565",
      "oracleRate": "1.548300"
    }
  }
}
```

**Response Fields:**
| Field | Description |
|-------|-------------|
| `oracleAmountOut` | Theoretical output based on Chainlink Oracle price (before fee) |
| `actualAmountOut` | Actual tokens received |
| `fee.rate` | Pool fee rate (fixed 0.05%) |
| `fee.amount` | Fee amount in output token |
| `slippage` | Pure market slippage (excludes fee). Negative = better than Oracle |
| `executedRate` | Actual exchange rate received |
| `oracleRate` | Current Oracle exchange rate |

**Slippage Calculation:**
```
Oracle Theoretical (after fee) = oracleAmountOut × (1 - 0.0005)
Slippage = (Oracle Theoretical after fee - actualAmountOut) / Oracle Theoretical after fee × 100%
```
- Positive slippage = loss (received less than Oracle rate)
- Negative slippage = gain (received better than Oracle rate)

---

### Get Transaction Status

Check the status of a transaction.

**`POST /api/v1/transaction/status`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `transactionHash` | string | Yes | Transaction hash |

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "blockNumber": 12345678,
    "confirmations": 5,
    "gasUsed": "212220"
  }
}
```

---

### Get Nonce

Get the current nonce for an address.

**`GET /api/v1/transaction/nonce/:address`**

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `chainId` | number | `84532` | Network ID |

---

## Faucet (Testnet)

Claim test tokens on testnet networks.

### Get Faucet Info

**`GET /api/v1/faucet/info`**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | Yes | Network ID |
| `userAddress` | string | No | Check claim status for user |

---

### Get Available Tokens

**`GET /api/v1/faucet/tokens`**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | Yes | Network ID |

---

### Build Claim All Transaction

Build a transaction to claim all test tokens.

**`POST /api/v1/faucet/build/claim-all`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | Yes | Network ID |
| `userAddress` | string | Yes | User's wallet address |

**Response:**
```json
{
  "success": true,
  "data": {
    "to": "0x432a163B26DaB6D5f386d8C4F70032f670686238",
    "data": "0x...",
    "value": "0",
    "chainId": 84532,
    "gasLimit": "300000"
  }
}
```
