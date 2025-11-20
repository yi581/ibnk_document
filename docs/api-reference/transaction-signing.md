---
sidebar_position: 5
title: Transaction Signing
---

# Transaction Signing Flow

These endpoints implement a **secure client-side signing pattern** where private keys never leave the user's device.

## Workflow

1. **Build Transaction** → API generates unsigned transaction data
2. **Local Signing** → Client signs locally using private key
3. **Broadcast Transaction** → Send signed transaction to blockchain
4. **Query Status** → Track transaction confirmation status

## Build Swap Transaction

Generate unsigned transaction data for a swap. Users sign locally and then broadcast.

**Endpoint**: `POST /api/v1/transaction/build/swap`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |
| userAddress | string | Yes | User wallet address |
| tokenIn | string | Yes | Input token address |
| tokenOut | string | Yes | Output token address |
| amountIn | string | Yes | Input amount (human-readable format) |
| minAmountOut | string | Yes | Minimum output amount (slippage protection) |
| deadline | number | No | Transaction deadline (Unix timestamp in seconds), defaults to current time + 5 minutes |

### Response Example

```json
{
  "success": true,
  "data": {
    "to": "0x464B3Ad497B558E1BE73a550631CA462632651bc",
    "data": "0x8f0c8...",
    "value": "0",
    "chainId": 84532,
    "gasLimit": "317966",
    "maxFeePerGas": "1068026",
    "maxPriorityFeePerGas": "1000000"
  }
}
```

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/build/swap" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress",
    "tokenIn": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "tokenOut": "0x340Ca64911c2C9E85c994690F805984104e054Fa",
    "amountIn": "10",
    "minAmountOut": "6.43"
  }'
```

---

## Build Approve Transaction

Generate unsigned transaction data for token approval.

**Endpoint**: `POST /api/v1/transaction/build/approve`
**Authentication**: Required

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| chainId | number | No | Chain ID, defaults to 84532 |
| userAddress | string | Yes | User wallet address |
| tokenAddress | string | Yes | Token contract address |
| spenderAddress | string | Yes | Authorized contract address (Router) |
| amount | string | Yes | Approval amount |
| isUnlimited | boolean | No | Whether to grant unlimited approval, defaults to false |

### Response Example

```json
{
  "success": true,
  "data": {
    "to": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "data": "0x095ea7b3...",
    "value": "0",
    "chainId": 84532,
    "gasLimit": "55963",
    "maxFeePerGas": "1068026",
    "maxPriorityFeePerGas": "1000000"
  }
}
```

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/build/approve" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress",
    "tokenAddress": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "spenderAddress": "0x464B3Ad497B558E1BE73a550631CA462632651bc",
    "amount": "10000",
    "isUnlimited": false
  }'
```

---

## Broadcast Transaction

Broadcast a client-signed transaction to the blockchain.

**Endpoint**: `POST /api/v1/transaction/broadcast`
**Authentication**: Required

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
    "transactionHash": "0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79",
    "status": "pending",
    "blockNumber": null,
    "confirmations": 0
  }
}
```

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/broadcast" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "signedTransaction": "0x02f8..."
  }'
```

---

## Query Transaction Status

Query the current status and confirmation count of a broadcasted transaction.

**Endpoint**: `POST /api/v1/transaction/status`
**Authentication**: Required

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
    "blockNumber": 33904774,
    "confirmations": 16,
    "gasUsed": "209728"
  }
}
```

### Status Descriptions

- `pending`: Transaction submitted, awaiting inclusion in a block
- `success`: Transaction successfully confirmed
- `failed`: Transaction failed (reverted)

### Example Request

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/status" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "transactionHash": "0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79"
  }'
```

---

## Get User Nonce

Retrieve the current nonce value for a user address, used for constructing transactions.

**Endpoint**: `GET /api/v1/transaction/nonce/:address`
**Authentication**: Required

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | User wallet address |

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

### Example Request

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/transaction/nonce/0xYourWalletAddress?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

---

## Complete Example

The following example demonstrates a complete signing workflow implementation using ethers.js:

```javascript
const { ethers } = require('ethers');

const API_URL = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key';
const RPC_URL = 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function executeSwap() {
  // 1. Create wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log('Wallet address:', wallet.address);

  // 2. Preview swap
  const previewResponse = await fetch(`${API_URL}/api/v1/swap/preview`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      poolAddress: '0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a',
      tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
      amountIn: '10'
    })
  });
  const preview = await previewResponse.json();
  console.log('Expected output:', preview.data.amountOut, 'USDC');

  // 3. Check approval
  const approvalCheckResponse = await fetch(`${API_URL}/api/v1/approval/check`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      tokenAddress: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      ownerAddress: wallet.address,
      spenderAddress: '0x464B3Ad497B558E1BE73a550631CA462632651bc',
      requiredAmount: '10'
    })
  });
  const approvalCheck = await approvalCheckResponse.json();

  // 4. If approval is needed, execute approval transaction
  if (approvalCheck.data.needsApproval) {
    console.log('Approval needed, building approval transaction...');

    // 4a. Build approval transaction
    const buildApproveResponse = await fetch(`${API_URL}/api/v1/transaction/build/approve`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chainId: 84532,
        userAddress: wallet.address,
        tokenAddress: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
        spenderAddress: '0x464B3Ad497B558E1BE73a550631CA462632651bc',
        amount: '10000',
        isUnlimited: false
      })
    });
    const approveTxData = await buildApproveResponse.json();

    // 4b. Sign approval transaction locally
    const approveNonce = await provider.getTransactionCount(wallet.address, 'pending');
    const approveTx = {
      to: approveTxData.data.to,
      data: approveTxData.data.data,
      value: approveTxData.data.value,
      chainId: approveTxData.data.chainId,
      gasLimit: approveTxData.data.gasLimit,
      maxFeePerGas: approveTxData.data.maxFeePerGas,
      maxPriorityFeePerGas: approveTxData.data.maxPriorityFeePerGas,
      nonce: approveNonce
    };

    const signedApproveTx = await wallet.signTransaction(approveTx);

    // 4c. Broadcast approval transaction
    const broadcastApproveResponse = await fetch(`${API_URL}/api/v1/transaction/broadcast`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chainId: 84532,
        signedTransaction: signedApproveTx
      })
    });
    const approveResult = await broadcastApproveResponse.json();
    console.log('Approval transaction hash:', approveResult.data.transactionHash);

    // 4d. Wait for approval transaction confirmation
    await provider.waitForTransaction(approveResult.data.transactionHash);
    console.log('Approval confirmed');
  }

  // 5. Build swap transaction
  const buildSwapResponse = await fetch(`${API_URL}/api/v1/transaction/build/swap`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      userAddress: wallet.address,
      tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
      amountIn: '10',
      minAmountOut: preview.data.minimumAmountOut
    })
  });
  const swapTxData = await buildSwapResponse.json();

  // 6. Sign swap transaction locally
  const swapNonce = await provider.getTransactionCount(wallet.address, 'pending');
  const swapTx = {
    to: swapTxData.data.to,
    data: swapTxData.data.data,
    value: swapTxData.data.value,
    chainId: swapTxData.data.chainId,
    gasLimit: swapTxData.data.gasLimit,
    maxFeePerGas: swapTxData.data.maxFeePerGas,
    maxPriorityFeePerGas: swapTxData.data.maxPriorityFeePerGas,
    nonce: swapNonce
  };

  const signedSwapTx = await wallet.signTransaction(swapTx);

  // 7. Broadcast swap transaction
  const broadcastSwapResponse = await fetch(`${API_URL}/api/v1/transaction/broadcast`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      signedTransaction: signedSwapTx
    })
  });
  const swapResult = await broadcastSwapResponse.json();
  console.log('Swap transaction hash:', swapResult.data.transactionHash);

  // 8. Wait for swap transaction confirmation
  const receipt = await provider.waitForTransaction(swapResult.data.transactionHash);
  console.log('Swap confirmed! Block:', receipt.blockNumber);

  // 9. Query final status
  const statusResponse = await fetch(`${API_URL}/api/v1/transaction/status`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      transactionHash: swapResult.data.transactionHash
    })
  });
  const status = await statusResponse.json();
  console.log('Transaction status:', status.data.status);
  console.log('Gas used:', status.data.gasUsed);

  return swapResult.data.transactionHash;
}

// Execute
executeSwap()
  .then(hash => {
    console.log('\n✅ Swap completed!');
    console.log(`Explorer: https://sepolia.basescan.org/tx/${hash}`);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });
```
