---
sidebar_position: 1
title: Verified Settlement Endpoints
---

# Verified Settlement Endpoints

## **Verified Settlement Endpoints (VSE)**

A Verified Settlement Endpoint (VSE) is any wallet, system, or integration point that can **send or receive** stablecoins during a settlement flow.

VSEs are **non-custodial**.
iBnk does not hold funds — each VSE manages its own assets.

example：

```actionscript-3
Client → iBnk API → Routing Engine → Sender VSE → Receiver VSE (testnet)
```

***

### Why VSEs Matter

VSEs are the key participants in the iBnk routing layer.
They represent:

* **liquidity sources** (testnet stage)
* **settlement destinations**
* **participants in early user testing**
* **partners helping validate routing behaviour**

***During Sandbox, anyone can join as a VSE as long as they can sign transactions.***

***No KYC/KYB is required during Sandbox.***

***This allows developers、fintech teams、and early testers to participate freely.***

***

### What VSEs Can Do in Sandbox

* receive settlement payloads
* simulate cross-stablecoin flows
* act as a liquidity participant
* test routing logic
* provide feedback on UX/API
* help shape how iBnk handles multi-endpoint routing

These interactions happen on **testnets only**.

***

### VSE Status Checks

The iBnk API allows integrators to check whether a VSE is available:

```
GET /vse/status?vse_id=xxxx
```

This simply confirms:

* endpoint reachable
* wallet active
* ready for simulated settlement

No value movement, no real liquidity involved.

***

### Transition to Staging

Once iBnk moves to Staging, VSEs will require：

* identity verification（KYC/KYB）
* risk checks
* endpoint documentation
* more stable liquidity requirements
* adherence to compliance frameworks

But **Sandbox VSEs will be prioritised** for early access.

***

### Transition to Production

Production VSEs will represent：

* regulated fintechs
* stablecoin issuers
* financial institutions
* payments companies
* enterprise endpoints

Only verified and compliant actors can settle flows in Production.

***

### Benefits for Early VSEs（Sandbox Rewards）

Early VSEs receive:

* priority onboarding to future stages
* visibility into routing architecture
* early influence on product design
* eligibility for future incentive programs
* private updates via Discord/Slack

Early feedback shapes the final product.
