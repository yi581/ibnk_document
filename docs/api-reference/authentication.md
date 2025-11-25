---
sidebar_position: 4
title: Authentication
---

# Authentication

All API requests require an API key passed in the `X-API-Key` header.

```bash
curl -H "X-API-Key: your_api_key" https://api.ibnk.xyz/api/v1/pools
```

## Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes | Your API key for authentication |
| `Content-Type` | Yes (POST) | `application/json` |

## Obtaining an API Key

To request access to the **iBnk Sandbox Environment (Testnet API)**, please contact: **ying@ibnk.xyz**

**Application Information**:
- Your name/company name
- Contact email
- Use case description
- Expected request volume

## Testing API Connection

After obtaining your API Key, test the connection:

```bash
# Test connection (health check, no API Key required)
curl -X GET "https://api.ibnk.xyz/health"

# Test authentication (API Key required)
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "pools": [...],
    "pagination": {...}
  }
}
```

## Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Base Sepolia | `84532` | Testnet |
| Arbitrum Sepolia | `421614` | Testnet |

## Rate Limits

| Limit | Value |
|-------|-------|
| Requests per 15 minutes | 100 |
| Burst limit | 10 requests/second |

Exceeding the limit will return a `429 Too Many Requests` error.
