---
sidebar_position: 6
title: Transaction Signing
---

# Transaction Signing Flow

These endpoints implement a **secure client-side signing pattern** where private keys never leave the user's device.

## Workflow

1. **Preview** - Get expected output and exchange rate
2. **Check Approval** - Verify token approval status
3. **Build Transaction** - API generates unsigned transaction data
4. **Local Signing** - Client signs locally using private key
5. **Broadcast Transaction** - Send signed transaction to blockchain

---

## Build Convert Transaction

Generate unsigned transaction data for a token conversion.

**Endpoint**: `POST /api/v1/transaction/build/convert`

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |
| userAddress | string | Yes | User wallet address |
| tokenIn | string | Yes | Input token address |
| tokenOut | string | Yes | Output token address |
| amountIn | string | Yes | Input amount (human-readable format) |
| minAmountOut | string | Yes | Minimum output amount (use `recommendedMinAmountOut` from preview) |
| deadline | number | No | Transaction deadline (Unix timestamp), defaults to now + 5 minutes |

### Response Example

```json
{
  "success": true,
  "data": {
    "to": "0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE",
    "data": "0x8f0c8...",
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
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
    "amountIn": "10",
    "minAmountOut": "15.467521"
  }'
```

---

## Broadcast Transaction

Broadcast a client-signed transaction to the blockchain.

**Endpoint**: `POST /api/v1/transaction/broadcast`

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |
| signedTransaction | string | Yes | Signed transaction (hex format) |

### Response Example

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

## Broadcast Convert Transaction

Broadcast a convert transaction and receive detailed slippage analysis.

**Endpoint**: `POST /api/v1/transaction/broadcast/convert`

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |
| signedTransaction | string | Yes | Signed transaction (hex format) |
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

---

## Query Transaction Status

Query the current status of a broadcasted transaction.

**Endpoint**: `POST /api/v1/transaction/status`

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |
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

### Status Values

- `pending`: Transaction submitted, awaiting inclusion in a block
- `success`: Transaction successfully confirmed
- `failed`: Transaction failed (reverted)

---

## Get User Nonce

Retrieve the current nonce for a user address.

**Endpoint**: `GET /api/v1/transaction/nonce/:address`

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |

### Response Example

```json
{
  "success": true,
  "data": {
    "nonce": 42
  }
}
```

---

## Complete Example

Complete signing workflow using ethers.js:

```javascript
const { ethers } = require('ethers');

const API_URL = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key';
const RPC_URL = 'https://sepolia.base.org';
const PRIVATE_KEY = 'your_private_key';
const CHAIN_ID = 84532;

// Contract addresses (Base Sepolia)
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
  const res = await fetch(API_URL + endpoint, options);
  return res.json();
}

async function executeConvert() {
  // 1. Create wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('Wallet address:', wallet.address);

  // 2. Preview conversion
  const preview = await api('/api/v1/convert/preview', 'POST', {
    chainId: CHAIN_ID,
    poolAddress: POOL,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: '10'
  });

  if (!preview.success) throw new Error(preview.error);
  console.log('Expected output:', preview.data.amountOut, 'AUDM');

  // 3. Check approval
  const approval = await api('/api/v1/approval/check', 'POST', {
    chainId: CHAIN_ID,
    tokenAddress: USDC,
    ownerAddress: wallet.address,
    spenderAddress: ROUTER,
    requiredAmount: '10'
  });

  // 4. Handle approval if needed
  if (approval.data.needsApproval) {
    console.log('Approval needed...');

    const approveRes = await api('/api/v1/approval/build', 'POST', {
      chainId: CHAIN_ID,
      tokenAddress: USDC,
      spenderAddress: ROUTER,
      amount: '10',
      isUnlimited: true
    });

    const approveTx = await wallet.sendTransaction({
      to: approveRes.data.transaction.to,
      data: approveRes.data.transaction.data,
      gasLimit: approveRes.data.transaction.gasLimit
    });

    console.log('Approval tx:', approveTx.hash);
    await approveTx.wait();
    console.log('Approval confirmed!');
  }

  // 5. Build convert transaction
  const buildRes = await api('/api/v1/transaction/build/convert', 'POST', {
    chainId: CHAIN_ID,
    userAddress: wallet.address,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: '10',
    minAmountOut: preview.data.recommendedMinAmountOut
  });

  if (!buildRes.success) throw new Error(buildRes.error);

  // 6. Sign transaction locally
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

  console.log('Transaction signed');

  // 7. Broadcast with slippage analysis
  const broadcastRes = await api('/api/v1/transaction/broadcast/convert', 'POST', {
    chainId: CHAIN_ID,
    signedTransaction: signedTx,
    expectedAmountOut: preview.data.amountOut,
    amountIn: '10',
    tokenIn: USDC,
    tokenOut: AUDM
  });

  if (!broadcastRes.success) throw new Error(broadcastRes.error);

  // 8. Display results
  console.log('\n========== RESULT ==========');
  console.log('Transaction:', broadcastRes.data.transactionHash);
  console.log('Status:', broadcastRes.data.status);

  if (broadcastRes.data.convert) {
    const c = broadcastRes.data.convert;
    console.log('Input:', c.amountIn, 'USDC');
    console.log('Output:', c.actualAmountOut, 'AUDM');
    console.log('Slippage:', c.slippage);
    console.log('Fee:', c.fee.rate, '(', c.fee.amount, 'AUDM)');
  }

  return broadcastRes.data.transactionHash;
}

// Execute
executeConvert()
  .then(hash => {
    console.log('\nConversion complete!');
    console.log(`Explorer: https://sepolia.basescan.org/tx/${hash}`);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```
