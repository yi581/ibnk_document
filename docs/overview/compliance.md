---
sidebar_position: 3
title: Compliance & Risk Controls
---

# Compliance & Risk Controls

## iBnk operates two environments: Sandbox (testnet) and production (mainnet)

To support safe adoption, we operate in two distinct modes:

* **Sandbox / Testnet:** open access, no KYC, simulated liquidity, non-real assets
* **Mainnet / Production:** restricted access, VSE-only settlement, regulated stablecoins

**This ensures innovation happens safely, while real value movement is performed under strict compliance rules.**

## 1. iBnk is a technology layer, not a financial service provider

iBnk operates as a **Composable Stablecoin FX Layer**, offering technical orchestration for regulated stablecoins.
We do **not** engage in any regulated financial activities, including:

* No stablecoin issuance
* No custody or holding of user assets
* No FX dealing or remittance
* No OTC services or market making
* No merchant acquiring or payment processing
* No consumer-facing financial products

iBnk functions purely as a **non-custodial orchestration layer** that provides path selection, compliance modules, and auditable settlement instructions.

***

## 2. Verified Settlement Endpoints (VSEs) must complete KYC/KYB

iBnk only works with **Verified Settlement Endpoints (VSEs)** —
entities or individuals who have completed the required identity and compliance checks.

VSE requirements:

* Must pass KYC/KYB
* Must use self-custodial or enterprise wallets
* Can only settle regulated, fiat-backed stablecoins
* Cannot custody client funds on behalf of others

Anyone — individuals, businesses, fintechs, wallets — can become a VSE,
as long as they meet the compliance requirements.

***

## 3. iBnk does not set prices or provide FX execution

iBnk is **not** a price-maker and does not conduct FX trades.
All FX information comes from:

* compliant on-chain oracles
* publicly verifiable mint/redeem rules
* regulated price references
* executable settlement paths determined by logic, not discretion

iBnk's role is to **compute and validate an executable path**,
not to offer conversion, spreads, or liquidity provision.

This maintains a clear regulatory boundary from FX dealing.

***

## 4. Settlement is fully non-custodial

iBnk never receives, holds, or transfers any assets.
All settlement occurs directly between:

* the VSE's wallet
* the enterprise user's wallet
* the stablecoin issuer's mint/redeem mechanism

iBnk only generates **settlement instructions**,
ensuring complete operational and regulatory separation from asset flow.

***

## 5. Only regulated fiat-backed stablecoins are supported

iBnk exclusively supports stablecoins that meet:

* full fiat reserves
* regulated issuance frameworks
* transparent mint/redeem rules
* periodic audits
* use of compliance-friendly blockchains

We do **not** support:

* algorithmic stablecoins
* unregulated or unaudited tokens
* synthetic, fractional, or opaque reserves
* high-risk or non-compliant chains

This guarantees the FX Layer operates within a safe, traceable, regulated environment.

***

## 6. API usage is not a financial service

iBnk charges for:

* computation
* routing
* orchestration
* monitoring
* audit logs

We **never** charge based on FX volume or spreads.
There are:

* no dealer fees
* no remittance fees
* no price-taking
* no flow-dependent commissions

This preserves iBnk's status as a **technology provider**, not a regulated financial intermediary.

***
