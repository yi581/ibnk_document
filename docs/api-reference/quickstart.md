---
sidebar_position: 2
title: Quick Start
---

# Quick Start Tutorial

This is a complete end-to-end tutorial demonstrating how to complete your first Swap transaction from scratch.

## Prerequisites

- Node.js 18+ or Python 3.8+
- A Base Sepolia or Arbitrum Sepolia testnet wallet
- Test ETH (for gas) and test tokens in your wallet
- Your API Key

## Step 1: Install Dependencies

**Node.js:**
```bash
npm install ethers node-fetch
```

**Python:**
```bash
pip install web3 requests eth-account
```

## Step 2: View Available Pools

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "pools": [
      {
        "address": "0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a",
        "name": "AUDM/USDC",
        "chainId": 84532,
        "token0": {
          "address": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
          "symbol": "AUDM",
          "decimals": "6"
        },
        "token1": {
          "address": "0x340Ca64911c2C9E85c994690F805984104e054Fa",
          "symbol": "USDC",
          "decimals": "6"
        }
      }
    ]
  }
}
```

## Step 3: Preview Swap

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/swap/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "poolAddress": "0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a",
    "tokenIn": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "tokenOut": "0x340Ca64911c2C9E85c994690F805984104e054Fa",
    "amountIn": "10"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amountIn": "10",
    "amountOut": "6.49675",
    "minimumAmountOut": "6.431782",
    "priceImpact": "0.05%",
    "fee": "0.05%"
  }
}
```

## Step 4: Execute Complete Swap (Node.js Example)

Create a file `my-first-swap.js`:

```javascript
const { ethers } = require('ethers');

const API_URL = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key_here';
const PRIVATE_KEY = 'your_private_key_here';
const RPC_URL = 'https://sepolia.base.org';

async function myFirstSwap() {
  console.log('🚀 Starting my first Swap...\n');

  // 1. Create wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('✅ Wallet address:', wallet.address);

  // 2. Preview Swap
  console.log('\n📊 Previewing Swap...');
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
  console.log('✅ Expected output:', preview.data.amountOut, 'USDC');

  // 3. Check approval
  console.log('\n🔍 Checking approval...');
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

  // 4. If approval needed, execute approval
  if (approvalCheck.data.needsApproval) {
    console.log('⚠️  Approval needed...');
    // [See Section 13 of the full documentation for approval code]
    console.log('Please complete approval first, then run this script again');
    return;
  }
  console.log('✅ Sufficient approval');

  // 5. Build Swap transaction
  console.log('\n🔨 Building Swap transaction...');
  const buildResponse = await fetch(`${API_URL}/api/v1/transaction/build/swap`, {
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
  const txData = await buildResponse.json();
  console.log('✅ Transaction built');

  // 6. Sign transaction
  console.log('\n🔐 Signing transaction...');
  const nonce = await provider.getTransactionCount(wallet.address, 'pending');
  const tx = {
    to: txData.data.to,
    data: txData.data.data,
    value: txData.data.value,
    chainId: txData.data.chainId,
    gasLimit: txData.data.gasLimit,
    maxFeePerGas: txData.data.maxFeePerGas,
    maxPriorityFeePerGas: txData.data.maxPriorityFeePerGas,
    nonce
  };
  const signedTx = await wallet.signTransaction(tx);
  console.log('✅ Transaction signed');

  // 7. Broadcast transaction
  console.log('\n📡 Broadcasting transaction...');
  const broadcastResponse = await fetch(`${API_URL}/api/v1/transaction/broadcast`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      signedTransaction: signedTx
    })
  });
  const result = await broadcastResponse.json();
  console.log('✅ Transaction broadcast!');
  console.log('📝 Transaction hash:', result.data.transactionHash);
  console.log('🔗 Explorer:', `https://sepolia.basescan.org/tx/${result.data.transactionHash}`);

  // 8. Wait for confirmation
  console.log('\n⏳ Waiting for confirmation...');
  const receipt = await provider.waitForTransaction(result.data.transactionHash);
  console.log('✅ Transaction confirmed! Block:', receipt.blockNumber);

  console.log('\n🎉 Complete! You have successfully executed your first Swap!');
}

// Run
myFirstSwap().catch(console.error);
```

**Run:**
```bash
node my-first-swap.js
```

**Expected Output:**
```
🚀 Starting my first Swap...

✅ Wallet address: 0xYour...Address

📊 Previewing Swap...
✅ Expected output: 6.49675 USDC

🔍 Checking approval...
✅ Sufficient approval

🔨 Building Swap transaction...
✅ Transaction built

🔐 Signing transaction...
✅ Transaction signed

📡 Broadcasting transaction...
✅ Transaction broadcast!
📝 Transaction hash: 0x...
🔗 Explorer: https://sepolia.basescan.org/tx/0x...

⏳ Waiting for confirmation...
✅ Transaction confirmed! Block: 12345678

🎉 Complete! You have successfully executed your first Swap!
```

## Frequently Asked Questions

**Q: How do I get test ETH?**
A: Use the faucet: https://www.alchemy.com/faucets/base-sepolia

**Q: How do I get test tokens (AUDM, USDC)?**
A: Contact the IBNK team to obtain test tokens

**Q: What if approval fails?**
A: See [Section 13](#13-构建授权交易) of the full documentation to learn how to handle approvals

**Q: What if the transaction fails?**
A: Check the [Troubleshooting](#-故障排除) section

## Next Steps

Congratulations! You have completed your first Swap. Next, you can:

1. Review the [complete transaction signing flow documentation](#交易签名传输端点-transaction-signing-flow)
2. Learn about [approval management](#8-检查代币授权状态)
3. Explore [liquidity management](#6-添加流动性预览)
4. Use [Oracle pricing](#11-获取oracle价格)
5. Check the [complete API reference](#api-端点)
