---
sidebar_position: 8
title: Faucet
---

# Faucet (Testnet)

Claim test tokens (USDC, AUDM, EURC) on testnet networks. The faucet allows developers to obtain test tokens for testing conversions.

## Faucet Contract Addresses

| Network | Address |
|---------|---------|
| Base Sepolia | `0x432a163B26DaB6D5f386d8C4F70032f670686238` |
| Arbitrum Sepolia | `0x0eb211d75a7b77034dE6913E80A0e8D88C422a41` |

---

## Getting Test ETH (for Gas)

Before claiming tokens, you need test ETH to pay for gas fees:

- **Base Sepolia**: https://www.alchemy.com/faucets/base-sepolia
- **Base Sepolia**: https://faucet.quicknode.com/base/sepolia
- **Arbitrum Sepolia**: https://www.alchemy.com/faucets/arbitrum-sepolia

---

## API Endpoints

### Get Faucet Info

Get faucet status and user claim information.

**`GET /api/v1/faucet/info`**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | Yes | Network ID (84532 or 421614) |
| `userAddress` | string | No | Check claim status for specific user |

**Example:**
```bash
curl -X GET "https://api.ibnk.xyz/api/v1/faucet/info?chainId=84532&userAddress=0xYourAddress" \
  -H "X-API-Key: your_api_key"
```

---

### Get Available Tokens

Get list of tokens available from the faucet.

**`GET /api/v1/faucet/tokens`**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | Yes | Network ID |

**Example:**
```bash
curl -X GET "https://api.ibnk.xyz/api/v1/faucet/tokens?chainId=84532" \
  -H "X-API-Key: your_api_key"
```

---

### Build Claim All Transaction

Build a transaction to claim all available test tokens (USDC, AUDM, EURC).

**`POST /api/v1/faucet/build/claim-all`**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | number | Yes | Network ID |
| `userAddress` | string | Yes | User's wallet address |

**Example Request:**
```bash
curl -X POST "https://api.ibnk.xyz/api/v1/faucet/build/claim-all" \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress"
  }'
```

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

## Complete Example (Node.js)

```javascript
const { ethers } = require('ethers');

const API_BASE = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key';
const PRIVATE_KEY = 'your_private_key';
const RPC_URL = 'https://sepolia.base.org';

async function claimTestTokens() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log('Wallet Address:', wallet.address);

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

  console.log('Transaction built successfully');

  // 2. Send transaction
  const tx = await wallet.sendTransaction({
    to: result.data.to,
    data: result.data.data,
    gasLimit: result.data.gasLimit
  });

  console.log('Transaction sent:', tx.hash);

  // 3. Wait for confirmation
  const receipt = await tx.wait();
  console.log('Transaction confirmed!');
  console.log('Block:', receipt.blockNumber);
  console.log('Explorer:', `https://sepolia.basescan.org/tx/${tx.hash}`);
}

claimTestTokens().catch(console.error);
```

---

## Troubleshooting

### Common Errors

| Error | Description | Solution |
|-------|-------------|----------|
| Insufficient ETH | Not enough ETH for gas | Get test ETH from faucet links above |
| Already claimed | User has already claimed recently | Wait for cooldown period |
| Invalid address | Invalid wallet address format | Check address format |

### Tips

1. **Get ETH first** - You need test ETH to pay for gas before claiming tokens
2. **One claim per period** - There may be a cooldown between claims
3. **Check balance** - After claiming, verify your token balances using a block explorer
