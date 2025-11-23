---
sidebar_position: 1
title: API Fees
---

# API Fees

## **Free Tier**

To support early adoption, testing, and partner integrations, iBnk provides a generous free tier:

#### **First 100,000 API calls per month — Free**

This includes:

* Routing queries
* Route discovery
* FX path validation
* Pool information queries
* Swap previews
* Settlement instruction generation
* Transaction building
* Status updates
* Logs and monitoring

There are:

* **No hidden fees**
* **No minimum usage requirements**
* **No contract commitments**

The free tier is designed to allow stablecoin issuers, fintech platforms, custodians, and developers to fully evaluate the infrastructure at zero cost.

***

## **What Counts as an API Call?**

The following classify as one API call:

* `GET /api/v1/pools` — List available liquidity pools
* `GET /api/v1/pools/:address` — Get specific pool details
* `POST /api/v1/swap/preview` — Preview swap output and pricing
* `POST /api/v1/swap/execute` — Execute swap (counts only as a call, not a transaction)
* `POST /api/v1/approval/check` — Check token approval status
* `POST /api/v1/approval/build` — Build approval transaction
* `POST /api/v1/transaction/build/swap` — Build swap transaction
* `POST /api/v1/transaction/broadcast` — Broadcast signed transaction
* `POST /api/v1/transaction/status` — Check transaction status
* `GET /api/v1/oracle/prices` — Retrieve oracle price data
* `POST /api/v1/liquidity/deposit/preview` — Preview liquidity deposit
* `POST /api/v1/liquidity/withdraw/preview` — Preview liquidity withdrawal

The following **do not** count toward usage:

* Documentation browsing
* SDK usage
* Explorer access (on-chain public data)
* Static content delivery

***

## **Why 100,000 Calls?**

Based on internal benchmarks, **100,000 calls per month** comfortably supports:

* Small and mid-scale fintech platforms
* A full proof-of-concept (PoC)
* Sandbox pilots with multiple test scenarios
* Multiple cross-currency routing tests
* Several end-to-end settlement scenarios
* Continuous integration and testing workflows

As an infrastructure layer, iBnk aims to minimize friction and allow partners to onboard and experiment quickly.

***

## **After the Free Tier (Optional)**

Once usage exceeds 100,000 calls per month, additional calls will be billed based on resource consumption.
Pricing will remain:

* **Predictable**
* **Low-cost**
* **Proportional to usage**

A detailed paid tier schedule will be published prior to mainnet launch.

> **Important:**
> All fees apply to **API usage only** — never to settlement amounts, currency values, or FX differences.

***

## **Usage Monitoring**

Track your API usage through:

* `GET /api/v1/admin/stats` — View API key statistics (requires admin authentication)
* Monthly usage reports (available to all API key holders)
* Real-time monitoring dashboard (coming soon)

***

## **Sandbox Environment**

During the Sandbox phase:

* All API calls are **completely free**
* No usage limits enforced
* Full access to all endpoints
* No billing or payment required

The free tier and usage limits will be enforced once we move to Staging and Production environments.

***

## **Pricing Philosophy**

iBnk charges for:

* Computational resources
* Routing calculations
* Network orchestration
* Infrastructure maintenance

iBnk **never** charges for:

* Settlement amounts
* FX spreads or markups
* Transaction values
* Asset custody (non-custodial)

***

## **Enterprise Plans**

For high-volume users and enterprise deployments:

* **Custom API limits** - Tailored to your specific needs
* **Dedicated support** - Priority assistance and SLA guarantees
* **Custom integrations** - Specialized routing and settlement logic
* **Volume discounts** - Reduced rates for large-scale operations

Contact sales@ibnk.xyz for enterprise pricing.

***

## **Frequently Asked Questions**

### How are API calls counted?

Each unique request to a countable endpoint increments your usage by 1, regardless of the response size or complexity.

### What happens when I exceed the free tier?

Currently, once you reach 100,000 calls, you'll need to contact us to discuss paid tier options. We'll never surprise you with unexpected charges.

### Can I upgrade mid-month?

Yes! You can upgrade to a paid tier at any time. Usage resets monthly on the 1st of each month.

### Are there rate limits?

Yes, rate limits apply separately from usage quotas:
- Sandbox: 100 requests/minute
- Staging: 500 requests/minute (when available)
- Production: Custom limits based on tier (when available)

***

## **Questions About Pricing?**

Contact us for enterprise pricing or custom usage plans:

📧 **sales@ibnk.xyz**

For general API questions:

📧 **support@ibnk.xyz**
