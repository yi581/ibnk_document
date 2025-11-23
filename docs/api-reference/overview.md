---
sidebar_position: 1
title: Overview
---

# API Overview

## 📢 Important Updates (2025-11-20)

### 🎉 New Feature: Database API Key Management System

**New Capability**: API Keys can now be dynamically managed through the API!

**Key Improvements**:
- ✅ Add/remove users without restart
- ✅ Enable/disable API Keys in real-time
- ✅ Usage statistics and tracking
- ✅ Automatic expiration management
- ✅ Complete management API

**Security Measures**:
- 🔒 Management endpoints require **Admin Key** authentication
- 🔒 Only administrators can manage API Keys
- 🔒 Regular users cannot access management functions

For details, see: [Admin Endpoints](#admin-endpoints-admin-api)

---

### ✅ Router Interface Fixed

**Issue**: The previous Router ABI definition was incorrect, causing swap transaction failures.

**Fix**: The Router's `originSwap` function now uses the correct signature:
```typescript
// ✅ Correct (Fixed)
function originSwap(
  uint256 originAmount,
  uint256 minTargetAmount,
  address[] path,      // Uses path array
  uint256 deadline
)

// ❌ Incorrect (Old version)
function originSwap(
  address origin,
  address target,
  uint256 originAmount,
  uint256 minTargetAmount,
  uint256 deadline
)
```

**Impact**: All applications using the transaction build endpoint (`/api/v1/transaction/build/swap`) will automatically use the correct interface.

**Verification**:
- Test transaction: [0x2b8496b6...](https://sepolia.arbiscan.io/tx/0x2b8496b6135f4f4bfb8e16fb5712bb2b1b059a897c4466e1f99d09239b0a114d)
- Status: ✅ Successfully executed

---

## Overview

The iBnk API offers a RESTful interface for accessing verified liquidity sources and executing routing of fiat-backed stablecoin FX. It supports liquidity queries, FX route previews, token approvals, oracle price retrieval, and more.

**Current Version**: v1.3 (Complete transaction signature transmission documentation)
**Base URL**: `https://api.ibnk.xyz` (production) or `http://localhost:3000` (local development)
**Last Updated**: 2025-11-20

## 🚀 How to Use This API

This API offers three usage methods, **no frontend interface required**:

### Method A: Browser + MetaMask (Requires Frontend)
Suitable for web application integration, requires developing a web frontend.

### Method B: Node.js Scripts (✅ Recommended - No Frontend Required)
Call the API directly through Node.js scripts, with private keys signed locally, no web interface needed.

**Example**:
```javascript
const { ethers } = require('ethers');

// 1. Call API to preview swap
const preview = await fetch('http://localhost:3000/api/v1/swap/preview', {
  method: 'POST',
  headers: { 'X-API-Key': 'your_api_key', 'Content-Type': 'application/json' },
  body: JSON.stringify({ chainId: 421614, tokenIn: '0x...', tokenOut: '0x...', amountIn: '10' })
});

// 2. Sign locally
const wallet = new ethers.Wallet(privateKey, provider);
const signedTx = await wallet.signTransaction(txData);

// 3. Broadcast transaction
await fetch('http://localhost:3000/api/v1/transaction/broadcast', {
  method: 'POST',
  body: JSON.stringify({ chainId: 421614, signedTransaction: signedTx })
});
```

### Method C: Python Scripts (✅ Recommended - No Frontend Required)
Use Python to call the API, suitable for automated settlement and integration scripts.

**Example**:
```python
import requests
from eth_account import Account

# 1. Call API to preview swap
response = requests.post('http://localhost:3000/api/v1/swap/preview',
    headers={'X-API-Key': 'your_api_key'},
    json={'chainId': 421614, 'tokenIn': '0x...', 'tokenOut': '0x...', 'amountIn': '10'})

# 2. Sign locally
account = Account.from_key(private_key)
signed_tx = account.sign_transaction(tx_data)

# 3. Broadcast transaction
requests.post('http://localhost:3000/api/v1/transaction/broadcast',
    json={'chainId': 421614, 'signedTransaction': signed_tx.rawTransaction.hex()})
```

> 💡 **Important**: Methods B and C are the recommended approaches, **completely eliminating the need for frontend development**. You can use all features directly through command-line scripts.
