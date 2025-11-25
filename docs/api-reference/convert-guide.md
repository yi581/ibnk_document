---
sidebar_position: 3
title: Convert Guide
---

# Complete Convert Guide

This guide walks you through the complete process of executing a token conversion, from wallet setup to transaction completion.

**API Base URL**: `https://api.ibnk.xyz`
**Test Network**: Base Sepolia (chainId: 84532)

---

## Overview

The iBnk Convert API follows a secure transaction flow:

1. **Preview** - Get expected output and exchange rate
2. **Approve** - Authorize the Router contract to spend tokens
3. **Build** - API constructs unsigned transaction
4. **Sign** - Client signs locally (private key never leaves your application)
5. **Broadcast** - API broadcasts and returns detailed execution results

---

## Prerequisites

### Get API Key

Contact the iBnk team to obtain an API Key: **ying@ibnk.xyz**

### Install Dependencies

```bash
npm install ethers
```

### Contract Addresses (Base Sepolia)

| Name | Address |
|------|---------|
| USDC | `0xB209B4f21a233751EEd1C11747b1f06850fE6ca2` |
| AUDM | `0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3` |
| EURC | `0x1e00beAf9Db905e1098A8224fa21E93b260DB7eC` |
| Router | `0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE` |
| USDC/AUDM Pool | `0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57` |
| EURC/USDC Pool | `0xd5D220DDF70d6CdD465E3EDD12fc3AB25C31A163` |
| EURC/AUDM Pool | `0x91e50A3d956Ce17661A393Ca6FA9519d441cfbf2` |
| Faucet | `0x432a163B26DaB6D5f386d8C4F70032f670686238` |

---

## Step 1: Create Wallet

### Create New Wallet with Node.js

```javascript
const { ethers } = require('ethers');

// Create new wallet
const wallet = ethers.Wallet.createRandom();

console.log('=== New Wallet Info ===');
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Mnemonic:', wallet.mnemonic.phrase);

// Important: Save your private key and mnemonic securely!
```

### Import Wallet from Private Key

```javascript
const { ethers } = require('ethers');

const PRIVATE_KEY = 'your_private_key';
const RPC_URL = 'https://sepolia.base.org';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log('Wallet Address:', wallet.address);
```

### Get Test ETH

Visit Base Sepolia faucets for test ETH (for gas fees):
- https://www.alchemy.com/faucets/base-sepolia
- https://faucet.quicknode.com/base/sepolia

---

## Step 2: Get Test Tokens

### Using the Faucet API

**Request:**
```bash
curl -X POST "https://api.ibnk.xyz/api/v1/faucet/build/claim-all" \
  -H "X-API-Key: your_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "your_wallet_address"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "to": "0x432a163B26DaB6D5f386d8C4F70032f670686238",
    "data": "0x...",
    "chainId": 84532,
    "gasLimit": "300000"
  }
}
```

### Claim Tokens with Node.js

```javascript
const { ethers } = require('ethers');

const API_BASE = 'https://api.ibnk.xyz';
const API_KEY = 'your_API_KEY';
const PRIVATE_KEY = 'your_private_key';
const RPC_URL = 'https://sepolia.base.org';

async function claimTokens() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // 1. Build claim transaction
  const response = await fetch(`${API_BASE}/api/v1/faucet/build/claim-all`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      userAddress: wallet.address
    })
  });

  const result = await response.json();

  if (!result.success) {
    console.error('Build transaction failed:', result.error);
    return;
  }

  // 2. Send transaction
  const tx = await wallet.sendTransaction({
    to: result.data.to,
    data: result.data.data,
    gasLimit: result.data.gasLimit
  });

  console.log('Transaction sent:', tx.hash);

  // 3. Wait for confirmation
  const receipt = await tx.wait();
  console.log('Transaction confirmed, block:', receipt.blockNumber);
}

claimTokens();
```

---

## Step 3: Preview Conversion

Before executing a conversion, preview to get the expected output amount and recommended minimum.

**Request:**
```bash
curl -X POST "https://api.ibnk.xyz/api/v1/convert/preview" \
  -H "X-API-Key: your_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "poolAddress": "0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
    "amountIn": "10"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amountIn": "10",
    "amountOut": "15.475259",
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
    "recommendedMinAmountOut": "15.467521"
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
| `recommendedMinAmountOut` | Minimum output with 0.05% tolerance (use for `minAmountOut`) |

---

## Step 4: Check Approval

Before converting, you need to approve the Router contract to spend your tokens.

### Check Current Approval Status

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/approval/check" \
  -H "X-API-Key: your_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "tokenAddress": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "ownerAddress": "your_wallet_address",
    "spenderAddress": "0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE",
    "requiredAmount": "10"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "needsApproval": true,
    "currentAllowance": "0",
    "requiredAmount": "10"
  }
}
```

### Build Approval Transaction (if needed)

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/approval/build" \
  -H "X-API-Key: your_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "tokenAddress": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "spenderAddress": "0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE",
    "amount": "1000000",
    "isUnlimited": true
  }'
```

---

## Step 5: Build Transaction

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/build/convert" \
  -H "X-API-Key: your_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "your_wallet_address",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
    "amountIn": "10",
    "minAmountOut": "15.467521"
  }'
```

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
    "maxFeePerGas": "1500000007",
    "maxPriorityFeePerGas": "1500000000"
  }
}
```

---

## Step 6: Sign Locally

**Important**: Your private key is NEVER sent to the API. Signing happens locally.

```javascript
async function signTransaction(wallet, txData) {
  const provider = wallet.provider;

  // Get current nonce
  const nonce = await provider.getTransactionCount(wallet.address);

  // Build complete transaction object
  const transaction = {
    to: txData.to,
    data: txData.data,
    value: txData.value || '0',
    gasLimit: txData.gasLimit,
    maxFeePerGas: txData.maxFeePerGas,
    maxPriorityFeePerGas: txData.maxPriorityFeePerGas,
    nonce: nonce,
    chainId: 84532,
    type: 2  // EIP-1559 transaction
  };

  // Sign locally
  const signedTx = await wallet.signTransaction(transaction);
  return signedTx;
}
```

---

## Step 7: Broadcast Transaction

### Broadcast with Slippage Analysis

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/broadcast/convert" \
  -H "X-API-Key: your_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "signedTransaction": "0xsigned_transaction_data...",
    "expectedAmountOut": "15.475259",
    "amountIn": "10",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x...",
    "status": "success",
    "blockNumber": 34137446,
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
| `actualAmountOut` | Actual tokens received |
| `oracleAmountOut` | Theoretical output based on Oracle price (before fee) |
| `fee.rate` | Fee rate (0.05%) |
| `fee.amount` | Fee amount in output token |
| `slippage` | Pure market slippage (negative = better rate than Oracle) |
| `executedRate` | Actual exchange rate received |
| `oracleRate` | Current Oracle exchange rate |

### Slippage Calculation

```
Oracle Theoretical (after fee) = oracleAmountOut * (1 - 0.0005)
Slippage = (Oracle Theoretical after fee - actualAmountOut) / Oracle Theoretical after fee * 100%
```

- **Positive slippage** = loss (received less than Oracle rate)
- **Negative slippage** = gain (received better than Oracle rate)

---

## Complete Code Example

```javascript
const { ethers } = require('ethers');

// ========== Configuration ==========
const API_BASE = 'https://api.ibnk.xyz';
const API_KEY = 'your_API_KEY';
const PRIVATE_KEY = 'your_private_key';
const RPC_URL = 'https://sepolia.base.org';
const CHAIN_ID = 84532;

// Token addresses
const USDC = '0xB209B4f21a233751EEd1C11747b1f06850fE6ca2';
const AUDM = '0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3';
const POOL = '0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57';
const ROUTER = '0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE';

// ========== API Helper Function ==========
async function api(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(API_BASE + endpoint, options);
  return response.json();
}

// ========== Main Flow ==========
async function main() {
  // 1. Initialize wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('Wallet Address:', wallet.address);

  // 2. Check balance
  const ethBalance = await provider.getBalance(wallet.address);
  console.log('ETH Balance:', ethers.formatEther(ethBalance));

  // 3. Preview conversion
  console.log('\n--- Step 1: Preview Conversion ---');
  const preview = await api('/api/v1/convert/preview', 'POST', {
    chainId: CHAIN_ID,
    poolAddress: POOL,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: '10'
  });

  if (!preview.success) {
    console.error('Preview failed:', preview.error);
    return;
  }

  console.log('Expected output:', preview.data.amountOut, 'AUDM');
  console.log('Exchange rate:', preview.data.exchangeRate);
  console.log('Recommended min output:', preview.data.recommendedMinAmountOut);

  // 4. Check approval
  console.log('\n--- Step 2: Check Approval ---');
  const approval = await api('/api/v1/approval/check', 'POST', {
    chainId: CHAIN_ID,
    tokenAddress: USDC,
    ownerAddress: wallet.address,
    spenderAddress: ROUTER,
    requiredAmount: '10'
  });

  if (approval.data.needsApproval) {
    console.log('Approval needed, building approval transaction...');

    const approveRes = await api('/api/v1/approval/build', 'POST', {
      chainId: CHAIN_ID,
      tokenAddress: USDC,
      spenderAddress: ROUTER,
      amount: '1000000',
      isUnlimited: true
    });

    const approveTx = await wallet.sendTransaction({
      to: approveRes.data.transaction.to,
      data: approveRes.data.transaction.data,
      gasLimit: approveRes.data.transaction.gasLimit
    });

    console.log('Approval transaction:', approveTx.hash);
    await approveTx.wait();
    console.log('Approval complete!');
  } else {
    console.log('Already approved');
  }

  // 5. Build transaction
  console.log('\n--- Step 3: Build Transaction ---');
  const buildRes = await api('/api/v1/transaction/build/convert', 'POST', {
    chainId: CHAIN_ID,
    userAddress: wallet.address,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: '10',
    minAmountOut: preview.data.recommendedMinAmountOut
  });

  if (!buildRes.success) {
    console.error('Build failed:', buildRes.error);
    return;
  }

  console.log('Transaction data built');

  // 6. Sign locally
  console.log('\n--- Step 4: Sign Locally ---');
  const nonce = await provider.getTransactionCount(wallet.address);
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

  console.log('Signing complete');

  // 7. Broadcast transaction
  console.log('\n--- Step 5: Broadcast Transaction ---');
  const broadcastRes = await api('/api/v1/transaction/broadcast/convert', 'POST', {
    chainId: CHAIN_ID,
    signedTransaction: signedTx,
    expectedAmountOut: preview.data.amountOut,
    amountIn: '10',
    tokenIn: USDC,
    tokenOut: AUDM
  });

  // 8. Display results
  console.log('\n========== Transaction Result ==========');
  console.log(JSON.stringify(broadcastRes, null, 2));

  if (broadcastRes.success) {
    const c = broadcastRes.data.convert;
    console.log('\n--- Transaction Summary ---');
    console.log('Transaction Hash:', broadcastRes.data.transactionHash);
    console.log('Input:', c.amountIn, 'USDC');
    console.log('Actual Received:', c.actualAmountOut, 'AUDM');
    console.log('Fee:', c.fee.rate, '(', c.fee.amount, 'AUDM)');
    console.log('Market Slippage:', c.slippage);
  }
}

main().catch(console.error);
```

---

## FAQ

### Why is slippage negative?

Negative slippage means you received a better rate than the Oracle price. This is favorable for you.

### How to choose minAmountOut?

Use `recommendedMinAmountOut` from the preview API response. It includes a 0.05% tolerance to protect against minor price fluctuations.

### What if the transaction fails?

Check the following:
1. **Sufficient ETH balance** - Ensure you have enough ETH to pay for gas
2. **Sufficient token balance** - Verify you have the tokens you want to convert
3. **Approval completed** - Make sure the Router contract is approved to spend your tokens
4. **Oracle price not stale** - Oracle prices expire after 1 hour

### Common Error Codes

| Error | Description |
|-------|-------------|
| `iBnk/stale-price` | Oracle price is stale (>1 hour old) |
| `iBnk/above-max-origin` | Amount exceeds pool limits |
| `iBnk/below-min-target` | Output below minimum threshold |

---

## Next Steps

- Review the [API Endpoints](./endpoints) documentation for all available endpoints
- Learn about [Transaction Signing](./transaction-signing) for advanced signing scenarios
- Check the [API Reference](./reference) for complete details
