# iBnk Protocol API Documentation

**Version**: 2.1.0
**Base URL**: `https://api.ibnk.xyz`
**Last Updated**: 2025-11-25

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Supported Networks](#supported-networks)
4. [API Endpoints](#api-endpoints)
   - [Health Check](#health-check)
   - [Pools](#pools)
   - [Convert](#convert)
   - [Oracle](#oracle)
   - [Approval](#approval)
   - [Transaction](#transaction)
   - [Faucet (Testnet)](#faucet-testnet)
5. [Complete Integration Example](#complete-integration-example)
6. [Error Handling](#error-handling)
7. [Rate Limits](#rate-limits)
8. [Contract Addresses](#contract-addresses)

---

## Overview

The iBnk Protocol API provides a seamless interface for stablecoin conversions on supported blockchain networks. The API follows a secure transaction flow where:

1. **API builds unsigned transactions** - Private keys never leave your application
2. **Client signs locally** - Using wallet libraries like ethers.js or web3.js
3. **API broadcasts signed transactions** - Returns detailed execution results including slippage analysis

### Key Features

- Real-time exchange rates via Chainlink Oracles
- Low slippage stablecoin conversions (< 0.05%)
- Multi-chain support (Base Sepolia, Arbitrum Sepolia)
- Comprehensive slippage analysis based on Oracle prices

---

## Authentication

All API requests require an API key passed in the `X-API-Key` header.

```bash
curl -H "X-API-Key: your_api_key" https://api.ibnk.xyz/api/v1/pools
```

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes | Your API key for authentication |
| `Content-Type` | Yes (POST) | `application/json` |

---

## Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Base Sepolia | `84532` | Testnet |
| Arbitrum Sepolia | `421614` | Testnet |

---

## API Endpoints

### Health Check

Check API server status.

#### `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T10:30:00.000Z",
  "uptime": 3600.123
}
```

---

### Pools

#### Get All Pools

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

#### Get Pool Info

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

### Convert

#### Preview Convert

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

### Oracle

#### Get Oracle Prices

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

---

### Approval

Before converting tokens, users must approve the Router contract to spend their tokens.

#### Check Approval

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

#### Build Approval Transaction

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

#### Revoke Approval

Build a transaction to revoke token approval.

**`POST /api/v1/approval/revoke`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | No | Network ID (default: `84532`) |
| `tokenAddress` | string | Yes | Token address |
| `spenderAddress` | string | Yes | Spender to revoke |

---

### Transaction

#### Build Convert Transaction

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

#### Broadcast Transaction (Generic)

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

#### Broadcast Convert Transaction (with Slippage Analysis)

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

**Response Fields Explained:**
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

#### Get Transaction Status

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

#### Get Nonce

Get the current nonce for an address.

**`GET /api/v1/transaction/nonce/:address`**

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `chainId` | number | `84532` | Network ID |

---

### Faucet (Testnet)

Claim test tokens on testnet networks.

#### Get Faucet Info

**`GET /api/v1/faucet/info`**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | Yes | Network ID |
| `userAddress` | string | No | Check claim status for user |

#### Get Available Tokens

**`GET /api/v1/faucet/tokens`**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | Yes | Network ID |

#### Build Claim All Transaction

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

---

## Complete Integration Example

Here's a complete example of performing a token conversion using JavaScript/ethers.js:

```javascript
const { ethers } = require('ethers');

const API_BASE = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key';
const CHAIN_ID = 84532;

// Token addresses (Base Sepolia)
const USDC = '0xB209B4f21a233751EEd1C11747b1f06850fE6ca2';
const AUDM = '0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3';
const POOL = '0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57';
const ROUTER = '0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE';

async function api(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(API_BASE + endpoint, options);
  return res.json();
}

async function convertTokens(wallet, amountIn) {
  // Step 1: Preview the conversion
  console.log('Step 1: Preview conversion...');
  const preview = await api('/api/v1/convert/preview', 'POST', {
    chainId: CHAIN_ID,
    poolAddress: POOL,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: amountIn
  });

  if (!preview.success) throw new Error(preview.error);

  console.log(`Expected output: ${preview.data.amountOut} AUDM`);
  console.log(`Exchange rate: ${preview.data.exchangeRate}`);

  // Step 2: Check and handle approval
  console.log('\nStep 2: Check approval...');
  const approval = await api('/api/v1/approval/check', 'POST', {
    chainId: CHAIN_ID,
    tokenAddress: USDC,
    ownerAddress: wallet.address,
    spenderAddress: ROUTER,
    requiredAmount: amountIn
  });

  if (approval.data.needsApproval) {
    console.log('Approval needed, building approval transaction...');
    const approveRes = await api('/api/v1/approval/build', 'POST', {
      chainId: CHAIN_ID,
      tokenAddress: USDC,
      spenderAddress: ROUTER,
      amount: amountIn,
      isUnlimited: true
    });

    const approveTx = await wallet.sendTransaction({
      to: approveRes.data.transaction.to,
      data: approveRes.data.transaction.data,
      gasLimit: approveRes.data.transaction.gasLimit
    });

    console.log(`Approval tx: ${approveTx.hash}`);
    await approveTx.wait();
    console.log('Approval confirmed!');
  }

  // Step 3: Build convert transaction
  console.log('\nStep 3: Build convert transaction...');
  const buildRes = await api('/api/v1/transaction/build/convert', 'POST', {
    chainId: CHAIN_ID,
    userAddress: wallet.address,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: amountIn,
    minAmountOut: preview.data.recommendedMinAmountOut
  });

  if (!buildRes.success) throw new Error(buildRes.error);

  // Step 4: Sign transaction locally
  console.log('\nStep 4: Sign transaction...');
  const nonce = await wallet.getNonce();
  const signedTx = await wallet.signTransaction({
    to: buildRes.data.to,
    data: buildRes.data.data,
    value: buildRes.data.value || '0',
    gasLimit: buildRes.data.gasLimit,
    maxFeePerGas: buildRes.data.maxFeePerGas,
    maxPriorityFeePerGas: buildRes.data.maxPriorityFeePerGas,
    nonce: nonce,
    chainId: CHAIN_ID,
    type: 2
  });

  // Step 5: Broadcast and get slippage analysis
  console.log('\nStep 5: Broadcast transaction...');
  const broadcastRes = await api('/api/v1/transaction/broadcast/convert', 'POST', {
    chainId: CHAIN_ID,
    signedTransaction: signedTx,
    expectedAmountOut: preview.data.amountOut,
    amountIn: amountIn,
    tokenIn: USDC,
    tokenOut: AUDM
  });

  if (!broadcastRes.success) throw new Error(broadcastRes.error);

  // Step 6: Display results
  console.log('\n========== CONVERSION RESULT ==========');
  console.log(`Transaction: ${broadcastRes.data.transactionHash}`);
  console.log(`Status: ${broadcastRes.data.status}`);
  console.log(`Gas Used: ${broadcastRes.data.gasUsed}`);

  if (broadcastRes.data.convert) {
    const c = broadcastRes.data.convert;
    console.log('\n--- Transaction Analysis ---');
    console.log(`Input: ${c.amountIn} USDC`);
    console.log(`Oracle Theoretical: ${c.oracleAmountOut} AUDM`);
    console.log(`Actual Received: ${c.actualAmountOut} AUDM`);
    console.log(`\n--- Fee ---`);
    console.log(`Fee Rate: ${c.fee.rate}`);
    console.log(`Fee Amount: ${c.fee.amount} AUDM`);
    console.log(`\n--- Slippage ---`);
    console.log(`Market Slippage: ${c.slippage}`);
  }

  return broadcastRes.data;
}

// Usage
async function main() {
  const provider = new ethers.JsonRpcProvider('https://base-sepolia.g.alchemy.com/v2/YOUR_KEY');
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

  await convertTokens(wallet, '10'); // Convert 10 USDC to AUDM
}

main().catch(console.error);
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Error Codes

| HTTP Status | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Endpoint not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Server error |

### Contract Errors

| Error | Description |
|-------|-------------|
| `iBnk/stale-price` | Oracle price is stale (>1 hour old) |
| `iBnk/above-max-origin` | Amount exceeds pool limits |
| `iBnk/below-min-target` | Output below minimum threshold |

---

## Rate Limits

| Limit | Value |
|-------|-------|
| Requests per 15 minutes | 100 |
| Burst limit | 10 requests/second |

---

## Contract Addresses

### Base Sepolia (chainId: 84532)

| Contract | Address |
|----------|---------|
| Router | `0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE` |
| Zap | `0xb41C8c97299964aa79b611a5Ec288F25850Cf2ca` |
| Factory | `0xeFA9493E856a449cAe87a9fF2B740B331201d785` |
| USDC | `0xB209B4f21a233751EEd1C11747b1f06850fE6ca2` |
| AUDM | `0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3` |
| EURC | `0x1e00beAf9Db905e1098A8224fa21E93b260DB7eC` |
| AUDM/USDC Pool | `0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57` |
| EURC/USDC Pool | `0xd5D220DDF70d6CdD465E3EDD12fc3AB25C31A163` |
| EURC/AUDM Pool | `0x91e50A3d956Ce17661A393Ca6FA9519d441cfbf2` |
| Faucet | `0x432a163B26DaB6D5f386d8C4F70032f670686238` |

### Arbitrum Sepolia (chainId: 421614)

| Contract | Address |
|----------|---------|
| Router | `0xbE26A3B762a5F7eAd86731E63d60f359e382cdaC` |
| Zap | `0x14ba424AbEA6cF9e32a61376DD80Fb84793DBd20` |
| Factory | `0xa6cEa2B641600343F01849fc580802bebEd2f71B` |
| USDC | `0x9311cA9F222ba12575099383498e7348eF39b3A7` |
| AUDM | `0xf36a31074aDdD28dAd8d9C21C834cc6d1f569831` |
| EURC | `0x284B49f8463Ee7e0d709C430f29AD0104506C392` |
| AUDM/USDC Pool | `0x186eD80ecDD8dFcb108D19Ac22Bc3C256CfF633a` |
| EURC/USDC Pool | `0xb02E45e4E479faFAC2C0A75EDbc48E8659c9b274` |
| EURC/AUDM Pool | `0xF3A8f6EeBb8b45887700A87692f5Ae605D44c3cD` |
| Faucet | `0x0eb211d75a7b77034dE6913E80A0e8D88C422a41` |

---

## Support

For API support or to request an API key, please contact:

- **Email**: support@ibnk.xyz
- **GitHub**: https://github.com/ibnk-protocol

---

*Documentation Version: 2.1.0 | Last Updated: 2025-11-25*
