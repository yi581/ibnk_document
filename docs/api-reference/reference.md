---
sidebar_position: 7
title: Reference
---

# Reference

## Error Handling

### Error Response Format

All error responses follow a unified format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "message": "Detailed description"
}
```

### Common Error Codes

| HTTP Status Code | Error Code | Description |
|-----------------|-----------|-------------|
| 400 | INVALID_PARAMETERS | Invalid request parameters |
| 401 | MISSING_API_KEY | Missing API key |
| 401 | INVALID_API_KEY | Invalid API key |
| 404 | NOT_FOUND | Resource not found |
| 429 | RATE_LIMIT_EXCEEDED | Rate limit exceeded |
| 500 | INTERNAL_ERROR | Internal server error |

### Error Examples

```json
// Missing API Key
{
  "success": false,
  "error": "API Key Required",
  "message": "Please provide an API Key in X-API-Key header",
  "code": "MISSING_API_KEY"
}

// Parameter validation failed
{
  "success": false,
  "error": "\"amountIn\" is required"
}

// Blockchain error
{
  "success": false,
  "error": "execution reverted: \"Curve/swap-convergence-failed\""
}
```

---

## Token Address Reference

### Arbitrum Sepolia (ChainId: 421614)

| Token | Address | Decimals |
|-------|---------|----------|
| AUDM | `0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe` | 6 |
| USDC | `0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51` | 6 |
| EURC | `0x33a07F7298CEFfea8314aD6fC2f80BD86Fb1Ee1B` | 6 |

**Liquidity Pool Addresses**:
- AUDM/USDC: `0x51964B217C5477C059667CE3e82cE2e9302B0241`
- EURC/USDC: `0x883581889b9352CcC63e457C71dAFFbB20Ee5fb9`
- EURC/AUDM: `0x8D6970eB52Ca7FA2CC07517B2936ab3DF9F479c0`

### Base Sepolia (ChainId: 84532)

| Token | Address | Decimals |
|-------|---------|----------|
| AUDM | `0xbe8bCb2E781214F3403Cc85327d2173642A0BD86` | 6 |
| USDC | `0x340Ca64911c2C9E85c994690F805984104e054Fa` | 6 |
| EURC | `0x69567Ab34CE8EB13A837d40B2714d569d0b51a37` | 6 |

**Liquidity Pool Addresses**:
- AUDM/USDC: `0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a`
- EURC/USDC: `0xaf16e2eAA39057911876d40f9BfDd3E97A086c6e`
- EURC/AUDM: `0x8F6a4B1BC072b58e55fC6C46cCbdCAb0e6224F15`

---

## Best Practices

### 1. Amount Format

All amount parameters use **human-readable format**, the API automatically handles precision conversion:

```javascript
// ✅ Correct
{ "amountIn": "1000" }

// ❌ Wrong (do not use wei values)
{ "amountIn": "1000000000" }
```

### 2. Error Handling

Always check the `success` field:

```javascript
const response = await fetch('/api/v1/swap/preview', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
});

const data = await response.json();

if (data.success) {
  // Handle successful response
  console.log('Output amount:', data.data.amountOut);
} else {
  // Handle error
  console.error('Error:', data.error);
}
```

### 3. Chain Selection Recommendations

- **Arbitrum Sepolia**: Recommended, more liquidity available (747k+ AUDM)
- **Base Sepolia**: Less liquidity (24k AUDM), suitable for small-scale testing

### 4. Slippage Protection

The `minimumAmountOut` returned by Swap preview already includes 1% slippage protection. Use this value as the minimum output amount when executing the actual transaction:

```javascript
const preview = await getSwapPreview();
const minOutput = preview.minimumAmountOut; // Already includes 1% slippage
```

### 5. Approval Management

Always check and handle approvals before executing transactions:

```javascript
// 1. Check approval status
const approvalStatus = await checkApproval({
  tokenAddress: '0x...',
  ownerAddress: userAddress,
  spenderAddress: poolAddress,
  requiredAmount: '1000'
});

// 2. If approval is needed, build approval transaction
if (approvalStatus.needsApproval) {
  const approvalTx = await buildApprovalTransaction({
    tokenAddress: '0x...',
    spenderAddress: poolAddress,
    amount: '1000'
  });

  // 3. User signs and sends approval transaction
  await wallet.sendTransaction(approvalTx.transaction);
}

// 4. Execute actual transaction
```

---

## Changelog

### v1.3.0 (2025-11-20)

- **Complete Transaction Signing Flow Documentation** - Important Update!
  - ✅ Added comprehensive documentation for 5 transaction endpoints
    - `/api/v1/transaction/build/swap` - Build Swap transaction
    - `/api/v1/transaction/build/approve` - Build approval transaction
    - `/api/v1/transaction/broadcast` - Broadcast signed transaction
    - `/api/v1/transaction/status` - Query transaction status
    - `/api/v1/transaction/nonce/:address` - Get user nonce
  - ✅ Added complete end-to-end signing flow example code
  - ✅ Detailed parameter descriptions and response formats
  - ✅ Security best practices and workflow documentation
- **Real Test Case Updates**
  - ✅ Added Base Sepolia successful test case
    - Transaction hash: 0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79
    - 10 AUDM → 6.49675 USDC
    - Gas efficiency: 66% (209,728 / 317,966)
  - ✅ Complete 6-step signing flow demonstration
  - ✅ Real API call examples and response data
- Documentation Structure Optimization
  - ✅ Transaction signing endpoints organized as independent section
  - ✅ Clearer endpoint numbering and categorization
  - ✅ Enhanced code examples and comments

### v1.2.0 (2025-11-20)

- **Database API Key Management System** - Major Upgrade!
  - ✅ Dynamic add/remove API Keys (no service restart required)
  - ✅ Real-time enable/disable functionality
  - ✅ Usage statistics and tracking (usage_count, last_used_at)
  - ✅ Automatic expiration management (configurable expiresInDays)
  - ✅ Complete management API (6 endpoints)
  - ✅ Admin Key authentication protection
  - ✅ Automatic fallback to environment variables when database unavailable
- Updated API documentation with complete management endpoint descriptions
- Security enhancement: Management functions restricted to administrator access only

### v1.1.0 (2025-11-20)

- ✅ **Fixed Router Interface** - Using correct `originSwap` signature (path array)
- ✅ Fixed Token decimals handling (using separate decimals for tokenIn and tokenOut)
- ✅ Verified Swap functionality working properly
- ✅ Added success cases and troubleshooting documentation
- Test transaction: [0x2b8496b6...](https://sepolia.arbiscan.io/tx/0x2b8496b6135f4f4bfb8e16fb5712bb2b1b059a897c4466e1f99d09239b0a114d)

### v1.0.0 (2025-11-19)

- Initial release
- Support for Base Sepolia and Arbitrum Sepolia testnets
- Pool query, Swap preview, liquidity management, approval management, Oracle pricing features
- API Key authentication and rate limiting implementation

---

**Last Updated**: November 20, 2025
**Version**: 1.3.0
