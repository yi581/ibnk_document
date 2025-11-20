---
sidebar_position: 3
title: Authentication
---

# Authentication & Setup

## Supported Blockchains

| Chain Name | Chain ID | Network Type |
|------------|----------|--------------|
| Base Sepolia | 84532 | Testnet |
| Arbitrum Sepolia | 421614 | Testnet |

## Authentication

All API requests require an API key to be included in the HTTP headers:

```http
X-API-Key: your_api_key_here
```

### Obtaining an API Key

#### Option 1: Request from Administrator (Recommended)

If your organization already has access to the IBNK API, contact your administrator to create a key through the Admin API:

1. Administrator uses the Admin Key to call the Create API Key endpoint
2. Administrator sends the generated API Key to you
3. You can use it immediately (no waiting required, takes effect in real-time)

See: [Admin Endpoints Documentation](#管理端点-admin-api)

#### Option 2: Apply for New Account

If you are a new user, apply through the following channels:

1. **Contact Information**:
   - Email: support@ibnk.xyz
   - Discord: https://discord.gg/ibnk
   - Website: https://ibnk.xyz

2. **Application Information**:
   - Your name/company name
   - Contact email
   - Use case description
   - Expected request volume

3. **Review Time**: Typically 1-2 business days

4. **Receive Key**: After approval, we will send the API Key to your email

### Testing API Connection

After obtaining your API Key, test the connection using the following simple request:

```bash
# Test connection (health check, no API Key required)
curl -X GET "https://api.ibnk.xyz/health"

# Test authentication (API Key required)
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "pools": [...],
    "pagination": {...}
  }
}
```

### Example Request

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=421614" \
  -H "X-API-Key: your_api_key_here"
```

## Rate Limiting

- Window Period: 15 minutes (900,000 milliseconds)
- Maximum Requests: 100 requests/window period

Exceeding the limit will return a `429 Too Many Requests` error.
