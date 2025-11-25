---
sidebar_position: 2
title: Quick Start
---

# Quick Start

This tutorial demonstrates how to complete your first token conversion from scratch.

## Prerequisites

- Node.js 18+
- A Base Sepolia testnet wallet
- Test ETH (for gas) and test tokens
- Your API Key

## Step 1: Install Dependencies

```bash
npm install ethers
```

## Step 2: View Available Pools

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key"
```

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
        }
      }
    ]
  }
}
```

## Step 3: Preview Conversion

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/convert/preview" \
  -H "X-API-Key: your_api_key" \
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
    "exchangeRate": "1.547526",
    "fee": "0.05%",
    "recommendedMinAmountOut": "15.467521"
  }
}
```

## Step 4: Complete Conversion (Node.js)

Create a file `my-first-convert.js`:

```javascript
const { ethers } = require('ethers');

const API_URL = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key';
const PRIVATE_KEY = 'your_private_key';
const RPC_URL = 'https://sepolia.base.org';
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

async function myFirstConvert() {
  console.log('Starting first conversion...\n');

  // 1. Create wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('Wallet address:', wallet.address);

  // 2. Preview conversion
  console.log('\n--- Step 1: Preview ---');
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

  // 3. Check approval
  console.log('\n--- Step 2: Check Approval ---');
  const approval = await api('/api/v1/approval/check', 'POST', {
    chainId: CHAIN_ID,
    tokenAddress: USDC,
    ownerAddress: wallet.address,
    spenderAddress: ROUTER,
    requiredAmount: '10'
  });

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
  } else {
    console.log('Already approved');
  }

  // 4. Build convert transaction
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
  console.log('Transaction built');

  // 5. Sign transaction locally
  console.log('\n--- Step 4: Sign ---');
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

  // 6. Broadcast transaction
  console.log('\n--- Step 5: Broadcast ---');
  const broadcastRes = await api('/api/v1/transaction/broadcast/convert', 'POST', {
    chainId: CHAIN_ID,
    signedTransaction: signedTx,
    expectedAmountOut: preview.data.amountOut,
    amountIn: '10',
    tokenIn: USDC,
    tokenOut: AUDM
  });

  if (!broadcastRes.success) {
    console.error('Broadcast failed:', broadcastRes.error);
    return;
  }

  // 7. Display results
  console.log('\n========== RESULT ==========');
  console.log('Transaction:', broadcastRes.data.transactionHash);
  console.log('Status:', broadcastRes.data.status);

  if (broadcastRes.data.convert) {
    const c = broadcastRes.data.convert;
    console.log('Input:', c.amountIn, 'USDC');
    console.log('Output:', c.actualAmountOut, 'AUDM');
    console.log('Slippage:', c.slippage);
  }

  console.log('\nExplorer:', `https://sepolia.basescan.org/tx/${broadcastRes.data.transactionHash}`);
  console.log('\nConversion complete!');
}

myFirstConvert().catch(console.error);
```

**Run:**
```bash
node my-first-convert.js
```

## FAQ

**Q: How do I get test ETH?**
A: Use the faucet: https://www.alchemy.com/faucets/base-sepolia

**Q: How do I get test tokens (AUDM, USDC)?**
A: Use the Faucet API endpoint. See [Convert Guide](./convert-guide) for details.

**Q: What if the transaction fails?**
A: Check:
1. Sufficient ETH balance for gas
2. Sufficient token balance
3. Approval completed
4. Oracle price not stale

## Next Steps

- Read the [Convert Guide](./convert-guide) for detailed step-by-step instructions
- Review the [API Endpoints](./endpoints) documentation
- Check the [Reference](./reference) for contract addresses and best practices
