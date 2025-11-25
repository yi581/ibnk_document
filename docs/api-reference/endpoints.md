---
sidebar_position: 4
title: API Endpoints
---

# API Endpoints

## Health Check

Check the API service status.

**Endpoint**: `GET /health`
**Authentication**: Not required

### Response Example

```json
{
  "status": "ok",
  "timestamp": "2025-11-19T13:32:31.466Z",
  "uptime": 12345.67
}
```

---

## Get All Pools

Retrieve information about all available liquidity pools on the specified chain.

**Endpoint**: `GET /api/v1/pools`
**Authentication**: Required

### Request Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 (Base Sepolia) |

### Response Example

```json
{
  "success": true,
  "data": {
    "pools": [
      {
        "address": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
        "name": "AUDM/USDC",
        "chainId": 421614,
        "token0": {
          "address": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
          "symbol": "AUDM",
          "decimals": "6"
        },
        "token1": {
          "address": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
          "symbol": "USDC",
          "decimals": "6"
        },
        "reserves": {
          "token0": "747333.443648",
          "token1": "586642.125575"
        },
        "totalSupply": "1072202.109688352427630358"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3
    }
  }
}
```

### Example Request

```bash
# Arbitrum Sepolia
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=421614" \
  -H "X-API-Key: your_api_key_here"

# Base Sepolia
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

---

## Get Single Pool

Retrieve detailed information about a specific pool.

**Endpoint**: `GET /api/v1/pools/:poolAddress`
**Authentication**: Required

### Path Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| poolAddress | string | Yes | Liquidity pool contract address |

### Query Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |

### Response Example

```json
{
  "success": true,
  "data": {
    "address": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "name": "AUDM/USDC",
    "chainId": 421614,
    "token0": {
      "address": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
      "symbol": "AUDM",
      "decimals": "6"
    },
    "token1": {
      "address": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
      "symbol": "USDC",
      "decimals": "6"
    },
    "reserves": {
      "token0": "747333.443648",
      "token1": "586642.125575"
    },
    "totalSupply": "1072202.109688352427630358"
  }
}
```

### Example Request

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools/0x51964B217C5477C059667CE3e82cE2e9302B0241?chainId=421614" \
  -H "X-API-Key: your_api_key_here"
```

---

## Swap Preview

Preview a token swap and calculate the expected output amount.

**Endpoint**: `POST /api/v1/swap/preview`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |
| poolAddress | string | Yes | Liquidity pool address |
| tokenIn | string | Yes | Input token address |
| tokenOut | string | Yes | Output token address |
| amountIn | string | Yes | Input amount (human-readable format, e.g., "1000") |

**Important**: `amountIn` uses human-readable format. The API automatically converts based on token decimals. For example, to swap 1000 USDC, pass `"1000"`, not `"1000000000"`.

### Response Example

```json
{
  "success": true,
  "data": {
    "amountIn": "1000",
    "amountOut": "649.675",
    "minimumAmountOut": "643.178250",
    "priceImpact": "0.05%",
    "fee": "0.05%"
  }
}
```

### Response Fields

- `amountIn`: Input amount
- `amountOut`: Expected output amount
- `minimumAmountOut`: Minimum output amount (with 1% slippage protection)
- `priceImpact`: Price impact percentage
- `fee`: Transaction fee percentage

### Example Request

```bash
# Swap 1000 AUDM for USDC (Arbitrum Sepolia)
curl -X POST "https://api.ibnk.xyz/api/v1/swap/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "tokenIn": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "tokenOut": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
    "amountIn": "1000"
  }'

# Reverse: Swap 1000 USDC for AUDM
curl -X POST "https://api.ibnk.xyz/api/v1/swap/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "tokenIn": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
    "tokenOut": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "amountIn": "1000"
  }'
```

---

## Swap Execute

**Execute token swap transactions directly** without requiring manual user signatures.

> **Security Warning**:
> - This endpoint requires a user private key and is **only suitable for testnet environments**
> - **Never use this method in production or on mainnet**
> - Private keys are transmitted via HTTPS and are not stored
> - For production environments, use custodial wallet services or Account Abstraction solutions

**Endpoint**: `POST /api/v1/swap/execute`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |
| privateKey | string | Yes | User private key (testnet only) |
| tokenIn | string | Yes | Input token address |
| tokenOut | string | Yes | Output token address |
| amountIn | string | Yes | Input amount (human-readable format) |
| minAmountOut | string | Yes | Minimum output amount (slippage protection) |
| deadline | number | No | Transaction deadline (Unix timestamp), defaults to 5 minutes |

### Response Example

```json
{
  "success": true,
  "data": {
    "transactionHash": "0x1234567890abcdef...",
    "amountIn": "1000",
    "amountOut": "649.675",
    "gasUsed": "125000",
    "status": "success"
  }
}
```

### Response Fields

- `transactionHash`: Blockchain transaction hash
- `amountIn`: Actual input amount
- `amountOut`: Actual output amount
- `gasUsed`: Gas consumed
- `status`: Transaction status (`success` or `failed`)

### Example Request

```bash
# Execute 10 AUDM -> USDC swap
curl -X POST "https://api.ibnk.xyz/api/v1/swap/execute" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "privateKey": "0xYourPrivateKey",
    "tokenIn": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "tokenOut": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
    "amountIn": "10",
    "minAmountOut": "6.43"
  }'
```

### Complete Workflow Example

```javascript
// 1. Preview the swap
const preview = await fetch('/api/v1/swap/preview', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    poolAddress: '0x51964B217C5477C059667CE3e82cE2e9302B0241',
    tokenIn: '0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
    tokenOut: '0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
    amountIn: '10'
  })
}).then(r => r.json());

console.log(`Preview: ${preview.data.amountOut} USDC`);

// 2. Execute the swap
const execute = await fetch('/api/v1/swap/execute', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    privateKey: process.env.PRIVATE_KEY, // Read from environment variable
    tokenIn: '0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
    tokenOut: '0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
    amountIn: '10',
    minAmountOut: preview.data.minimumAmountOut
  })
}).then(r => r.json());

console.log(`Swap successful! Hash: ${execute.data.transactionHash}`);
console.log(`Block explorer: https://sepolia.arbiscan.io/tx/${execute.data.transactionHash}`);
```

### Security Recommendations

1. **Testnet Environment**
   - Can use private key method
   - Private keys from testnet wallets
   - Tokens have no real value

2. **Production Environment (Mainnet)**
   - Do not use private key method
   - Use custodial wallet services
   - Use Account Abstraction
   - Use signing services (user signs, API broadcasts)

3. **Private Key Management**
   - Store in environment variables
   - Transmit via HTTPS
   - Do not log in application logs
   - Do not commit to code repositories

---

## Add Liquidity Preview

Preview the token amounts required to add liquidity.

**Endpoint**: `POST /api/v1/liquidity/deposit/preview`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |
| poolAddress | string | Yes | Liquidity pool address |
| desiredLPAmount | string | Yes | Desired LP token amount to receive |

### Response Example

```json
{
  "success": true,
  "data": {
    "lpAmount": "1000000000000000000",
    "token0Amount": "500.123456",
    "token1Amount": "350.987654"
  }
}
```

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/liquidity/deposit/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "desiredLPAmount": "1000000000000000000"
  }'
```

---

## Remove Liquidity Preview

Preview the token amounts that will be received when removing liquidity.

**Endpoint**: `POST /api/v1/liquidity/withdraw/preview`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |
| poolAddress | string | Yes | Liquidity pool address |
| lpAmount | string | Yes | LP token amount to remove |

### Response Example

```json
{
  "success": true,
  "data": {
    "token0Amount": "82210032.901265",
    "token1Amount": "46575531.047883"
  }
}
```

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/liquidity/withdraw/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "lpAmount": "100000000000000000"
  }'
```

---

## Check Approval

Check whether the user has approved sufficient token allowance for a contract.

**Endpoint**: `POST /api/v1/approval/check`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |
| tokenAddress | string | Yes | Token contract address |
| ownerAddress | string | Yes | Token holder address |
| spenderAddress | string | Yes | Authorized contract address |
| requiredAmount | string | Yes | Required approval amount |

### Response Example

```json
{
  "success": true,
  "data": {
    "isApproved": false,
    "currentAllowance": "89301.400652",
    "requiredAmount": "1000",
    "needsApproval": true
  }
}
```

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/approval/check" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "ownerAddress": "0xYourWalletAddress",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "requiredAmount": "1000"
  }'
```

---

## Build Approval

Generate raw transaction data for token approval that users can sign and send using their wallet.

**Endpoint**: `POST /api/v1/approval/build`
**Authentication**: Required

> **Note**:
> - This endpoint provides approval recommendations, suitable for scenarios requiring smart approval strategies
> - If you need complete EIP-1559 transaction data (including gas parameters), use `/api/v1/transaction/build/approve` (see Section 13)
> - Both endpoints support the same approval functionality; choose the one that fits your needs

### Request Body Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |
| tokenAddress | string | Yes | Token contract address |
| spenderAddress | string | Yes | Authorized contract address |
| amount | string | Yes | Approval amount |
| isUnlimited | boolean | No | Whether to approve unlimited amount, defaults to false |

### Response Example

```json
{
  "success": true,
  "data": {
    "transaction": {
      "to": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
      "data": "0x095ea7b3000000000000000000000000...",
      "value": "0"
    },
    "recommendation": {
      "strategy": "exact",
      "description": "Approve exact amount required, maximizing security",
      "amount": "1000"
    }
  }
}
```

### Approval Strategy Explanation

The API recommends different approval strategies based on the amount:

- **Small amounts (< 100)**: `double` - Approve double the amount to reduce frequent approvals
- **Medium amounts (100-10000)**: `exact` - Approve exact amount, maximizing security
- **Large amounts (> 10000)**: `unlimited` - Unlimited approval, convenient but use with caution

### Example Request

```bash
# Exact approval
curl -X POST "https://api.ibnk.xyz/api/v1/approval/build" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "amount": "1000",
    "isUnlimited": false
  }'

# Unlimited approval
curl -X POST "https://api.ibnk.xyz/api/v1/approval/build" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "amount": "1000",
    "isUnlimited": true
  }'
```

---

## Revoke Approval

Generate transaction data to revoke token approval (set allowance to 0).

**Endpoint**: `POST /api/v1/approval/revoke`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |
| tokenAddress | string | Yes | Token contract address |
| spenderAddress | string | Yes | Authorized contract address |

### Response Example

```json
{
  "success": true,
  "data": {
    "to": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "data": "0x095ea7b3000000000000000000000000...",
    "value": "0"
  }
}
```

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/approval/revoke" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241"
  }'
```

---

## Oracle Prices

Get current prices for all tokens (denominated in USD).

**Endpoint**: `GET /api/v1/oracle/prices`
**Authentication**: Required

### Query Parameters

| Parameter | Type | Required | Description |
|------|------|------|------|
| chainId | number | No | Chain ID, defaults to 84532 |

### Response Example

```json
{
  "success": true,
  "data": {
    "prices": {
      "AUDM": {
        "usd": "0.650237",
        "oracle": "0x2e8Cd7798F16a8F66c35a180031B16b428Cc3CAF",
        "lastUpdate": "2025-11-19T13:32:31.466Z"
      },
      "EURC": {
        "usd": "1.084567",
        "oracle": "0x64eb507A065F7464516207383Ab4eAA248e281B3",
        "lastUpdate": "2025-11-19T13:32:31.466Z"
      },
      "USDC": {
        "usd": "1.0",
        "oracle": null,
        "lastUpdate": "2025-11-19T13:32:31.466Z"
      }
    },
    "timestamp": "2025-11-19T13:32:31.466Z"
  }
}
```

### Example Request

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/oracle/prices?chainId=421614" \
  -H "X-API-Key: your_api_key_here"
```

---

## Convert Preview

Preview a token conversion and get expected output amount with exchange rate.

**Endpoint**: `POST /api/v1/convert/preview`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |
| poolAddress | string | Yes | Liquidity pool address |
| tokenIn | string | Yes | Input token address |
| tokenOut | string | Yes | Output token address |
| amountIn | string | Yes | Amount to convert (human-readable format) |

### Response Example

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

### Response Fields

| Field | Description |
|-------|-------------|
| `amountOut` | Expected output amount |
| `exchangeRate` | Rate of tokenIn to tokenOut |
| `inverseRate` | Rate of tokenOut to tokenIn |
| `fee` | Pool fee (0.05% for stablecoins) |
| `recommendedMinAmountOut` | Minimum output with 0.05% tolerance |

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/convert/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "poolAddress": "0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
    "amountIn": "100"
  }'
```

---

## Build Convert Transaction

Build an unsigned convert (swap) transaction.

**Endpoint**: `POST /api/v1/transaction/build/convert`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Network ID (default: 84532) |
| userAddress | string | Yes | User's wallet address |
| tokenIn | string | Yes | Input token address |
| tokenOut | string | Yes | Output token address |
| amountIn | string | Yes | Amount to convert (human-readable) |
| minAmountOut | string | Yes | Minimum output (use `recommendedMinAmountOut` from preview) |
| deadline | number | No | Unix timestamp (default: now + 5 minutes) |

### Response Example

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

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/build/convert" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
    "amountIn": "100",
    "minAmountOut": "154.675212"
  }'
```

---

## Broadcast Convert Transaction

Broadcast a convert transaction and receive detailed slippage analysis based on Oracle prices.

**Endpoint**: `POST /api/v1/transaction/broadcast/convert`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Network ID (default: 84532) |
| signedTransaction | string | Yes | Signed transaction hex |
| expectedAmountOut | string | Yes | Expected output from preview |
| amountIn | string | Yes | Input amount |
| tokenIn | string | Yes | Input token address |
| tokenOut | string | Yes | Output token address |

### Response Example

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

### Response Fields Explained

| Field | Description |
|-------|-------------|
| `oracleAmountOut` | Theoretical output based on Chainlink Oracle price (before fee) |
| `actualAmountOut` | Actual tokens received |
| `fee.rate` | Pool fee rate (fixed 0.05%) |
| `fee.amount` | Fee amount in output token |
| `slippage` | Pure market slippage (excludes fee). Negative = better than Oracle |
| `executedRate` | Actual exchange rate received |
| `oracleRate` | Current Oracle exchange rate |

### Slippage Calculation

```
Oracle Theoretical (after fee) = oracleAmountOut × (1 - 0.0005)
Slippage = (Oracle Theoretical after fee - actualAmountOut) / Oracle Theoretical after fee × 100%
```

- **Positive slippage** = loss (received less than Oracle rate)
- **Negative slippage** = gain (received better than Oracle rate)

---

## Faucet (Testnet)

Claim test tokens on testnet networks.

### Get Faucet Info

**Endpoint**: `GET /api/v1/faucet/info`
**Authentication**: Required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | Yes | Network ID |
| userAddress | string | No | Check claim status for user |

---

### Get Available Tokens

**Endpoint**: `GET /api/v1/faucet/tokens`
**Authentication**: Required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | Yes | Network ID |

---

### Build Claim All Transaction

Build a transaction to claim all test tokens.

**Endpoint**: `POST /api/v1/faucet/build/claim-all`
**Authentication**: Required

#### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | Yes | Network ID |
| userAddress | string | Yes | User's wallet address |

#### Response Example

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

#### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/faucet/build/claim-all" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress"
  }'
```

---

## Transaction Status

Check the status of a transaction.

**Endpoint**: `POST /api/v1/transaction/status`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Network ID (default: 84532) |
| transactionHash | string | Yes | Transaction hash |

### Response Example

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

## Get Nonce

Get the current nonce for an address.

**Endpoint**: `GET /api/v1/transaction/nonce/:address`
**Authentication**: Required

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| chainId | number | 84532 | Network ID |

### Example Request

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/transaction/nonce/0xYourWalletAddress?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```
