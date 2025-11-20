---
sidebar_position: 6
title: Admin API
---

# Admin API

## Authentication Requirements

**Important**: All admin endpoints require **Admin Key** authentication (not regular API Keys).

```bash
X-Admin-Key: admin_your_admin_key
```

**Security Features**:
- Only administrators with an Admin Key can access these endpoints
- Regular API Key users cannot access admin functions
- Admin Key is configured in server environment variables

## Admin Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/keys` | POST | Create a new API Key |
| `/api/v1/admin/keys` | GET | List all API Keys |
| `/api/v1/admin/keys/:id` | GET | Get single API Key details |
| `/api/v1/admin/keys/:id` | DELETE | Delete an API Key |
| `/api/v1/admin/keys/:id/toggle` | PATCH | Enable/disable an API Key |
| `/api/v1/admin/stats` | GET | View usage statistics |

---

## Create API Key

Create a new API Key (takes effect immediately, no restart required).

**Endpoint**: `POST /api/v1/admin/keys`

**Headers**:
```
X-Admin-Key: admin_your_admin_key
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Username or description",     // Optional
  "description": "Purpose description",  // Optional
  "expiresInDays": 365                  // Optional, expiration in days
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "sk_prod_abc123def456...",
    "name": "Username or description",
    "description": "Purpose description",
    "is_active": true,
    "created_at": "2025-11-20T12:00:00.000Z",
    "last_used_at": null,
    "usage_count": 0,
    "expires_at": "2026-11-20T12:00:00.000Z"
  },
  "message": "API key created successfully"
}
```

**Example**:
```bash
curl -X POST https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend App User 1",
    "description": "Web application access",
    "expiresInDays": 365
  }'
```

---

## List All API Keys

View all created API Keys and their usage statistics.

**Endpoint**: `GET /api/v1/admin/keys`

**Headers**:
```
X-Admin-Key: admin_your_admin_key
```

**Response**:
```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "id": 1,
        "key": "sk_prod_abc123...",
        "name": "User 1",
        "description": "Frontend application",
        "is_active": true,
        "created_at": "2025-11-20T12:00:00.000Z",
        "last_used_at": "2025-11-20T14:30:00.000Z",
        "usage_count": 1523,
        "expires_at": "2026-11-20T12:00:00.000Z"
      },
      {
        "id": 2,
        "key": "sk_prod_xyz789...",
        "name": "User 2",
        "is_active": false,
        "usage_count": 45,
        "last_used_at": "2025-11-19T10:00:00.000Z"
      }
    ],
    "total": 2
  }
}
```

**Example**:
```bash
curl https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_your_admin_key"
```

---

## Get Single API Key

View detailed information for a specific API Key.

**Endpoint**: `GET /api/v1/admin/keys/:id`

**Headers**:
```
X-Admin-Key: admin_your_admin_key
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "sk_prod_abc123...",
    "name": "User 1",
    "is_active": true,
    "usage_count": 1523,
    "last_used_at": "2025-11-20T14:30:00.000Z"
  }
}
```

**Example**:
```bash
curl https://api.ibnk.xyz/api/v1/admin/keys/1 \
  -H "X-Admin-Key: admin_your_admin_key"
```

---

## Delete API Key

Permanently delete an API Key (takes effect immediately).

**Endpoint**: `DELETE /api/v1/admin/keys/:id`

**Headers**:
```
X-Admin-Key: admin_your_admin_key
```

**Response**:
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

**Example**:
```bash
curl -X DELETE https://api.ibnk.xyz/api/v1/admin/keys/1 \
  -H "X-Admin-Key: admin_your_admin_key"
```

---

## Enable/Disable API Key

Temporarily disable or re-enable an API Key (takes effect immediately, no deletion required).

**Endpoint**: `PATCH /api/v1/admin/keys/:id/toggle`

**Headers**:
```
X-Admin-Key: admin_your_admin_key
Content-Type: application/json
```

**Request Body**:
```json
{
  "isActive": false  // true=enable, false=disable
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "sk_prod_abc123...",
    "is_active": false,
    "name": "User 1"
  },
  "message": "API key disabled successfully"
}
```

**Example (Disable)**:
```bash
curl -X PATCH https://api.ibnk.xyz/api/v1/admin/keys/1/toggle \
  -H "X-Admin-Key: admin_your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

**Example (Enable)**:
```bash
curl -X PATCH https://api.ibnk.xyz/api/v1/admin/keys/1/toggle \
  -H "X-Admin-Key: admin_your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{"isActive": true}'
```

---

## View Statistics

View aggregated statistics for all API Keys.

**Endpoint**: `GET /api/v1/admin/stats`

**Headers**:
```
X-Admin-Key: admin_your_admin_key
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total_keys": 20,
    "active_keys": 18,
    "inactive_keys": 2,
    "total_requests": 154230
  }
}
```

**Example**:
```bash
curl https://api.ibnk.xyz/api/v1/admin/stats \
  -H "X-Admin-Key: admin_your_admin_key"
```

---

## Management Workflows

### Scenario 1: Adding a New User

```bash
# 1. Create new API Key
curl -X POST https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_xxx" \
  -H "Content-Type: application/json" \
  -d '{"name": "New User", "expiresInDays": 30}'

# 2. Retrieve the key from the response
# 3. Send it to the user
# 4. Takes effect immediately, no restart required!
```

### Scenario 2: Temporarily Disabling an Abusive User

```bash
# 1. View all keys to find the abusive user's ID
curl https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_xxx"

# 2. Disable the user's key
curl -X PATCH https://api.ibnk.xyz/api/v1/admin/keys/5/toggle \
  -H "X-Admin-Key: admin_xxx" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'

# 3. Takes effect immediately, user cannot continue accessing
```

### Scenario 3: Regular Audit

```bash
# 1. View usage statistics
curl https://api.ibnk.xyz/api/v1/admin/stats \
  -H "X-Admin-Key: admin_xxx"

# 2. View details of all keys
curl https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_xxx"

# 3. Delete long-term inactive keys
curl -X DELETE https://api.ibnk.xyz/api/v1/admin/keys/3 \
  -H "X-Admin-Key: admin_xxx"
```

---

## Security Best Practices

### 1. Protect the Admin Key
- Use a strong random key (at least 32 bytes)
- Do not commit to Git repository
- Configure only in server environment variables
- Rotate regularly

### 2. Access Control
- Grant Admin Key only to trusted administrators
- Use different API Keys for different applications
- Delete keys that are no longer in use promptly

### 3. Monitoring and Auditing
- Regularly review usage statistics
- Monitor for abnormal usage patterns
- Log all administrative operations

### 4. Key Lifecycle Management
- Set expiration times for temporary access
- Regularly review and clean up expired keys
- Use the description field to document the purpose

---
