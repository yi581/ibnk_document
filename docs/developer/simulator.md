---
sidebar_position: 1
title: Simulator
---

# Simulator

## Simulator (Preview Only)

The iBnk API is still under active development.
To help early partners understand the expected response formats, this page provides **sample outputs** only.

:::info
There is **no live simulator** at this stage. A full interactive simulator will be added later in the Sandbox environment once the routing layer is fully exposed.
:::

### Example 1: `/route/find` (Sample Output)

```json
{
  "route_id": "demo_12345",
  "from": "AUDD",
  "to": "SGDS",
  "amount_in": "1000",
  "estimated_out": "896.42",
  "steps": [
    { "type": "swap", "asset": "AUDD" },
    { "type": "bridge", "chain": "Base Sepolia" },
    { "type": "swap", "asset": "SGDS" }
  ]
}
```

### Example 2: `/route/quote` (Sample Output)

```json
{
  "route_id": "demo_12345",
  "chain": "Arbitrum Sepolia",
  "payload": {
    "to": "0x000…123",
    "data": "0xabc123…",
    "value": "0"
  }
}
```

### Example 3: Error Format

```json
{
  "error": "ROUTE_NOT_FOUND",
  "message": "No valid route available."
}
```

### Why Preview Instead of a Full Simulator?

* The API is still in iteration
* Contract deployments on testnets are moving quickly
* Response structure may change during testing
* Keeping a preview page avoids outdated or misleading tools
* Allows partners to understand integration work ahead of time

### When Will the Simulator Be Live?

A simple web-based simulator will be added later, once:

* Sandbox routing stabilises
* /route endpoints are finalized
* First VSEs are fully connected

We will announce availability via Discord/Slack.
