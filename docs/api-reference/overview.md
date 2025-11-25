---
sidebar_position: 1
title: Overview
---

# API Overview

The iBnk Protocol API provides a seamless interface for stablecoin conversions on supported blockchain networks. This page provides general information about the iBnk API Service.

**Version**: 2.1.0
**Base URL**: `https://api.ibnk.xyz`
**Last Updated**: 2025-11-25

To request access to the **iBnk Sandbox Environment (Testnet API)**,
please contact: **ying@ibnk.xyz**

---

## Transaction Flow

The API follows a secure transaction flow:

1. **API builds unsigned transactions** - Private keys never leave your application
2. **Client signs locally** - Using wallet libraries like ethers.js or web3.js
3. **API broadcasts signed transactions** - Returns detailed execution results including slippage analysis

---

## Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Base Sepolia | `84532` | Testnet |
| Arbitrum Sepolia | `421614` | Testnet |

---

## Rate Limits

| Limit | Value |
|-------|-------|
| Requests per 15 minutes | 100 |
| Burst limit | 10 requests/second |

---

## Contract Addresses

### Base Sepolia (chainId: 84532)

| Contract | Address |
|----------|---------|
| Router | `0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE` |
| Zap | `0xb41C8c97299964aa79b611a5Ec288F25850Cf2ca` |
| Factory | `0xeFA9493E856a449cAe87a9fF2B740B331201d785` |
| USDC | `0xB209B4f21a233751EEd1C11747b1f06850fE6ca2` |
| AUDM | `0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3` |
| EURC | `0x1e00beAf9Db905e1098A8224fa21E93b260DB7eC` |
| AUDM/USDC Pool | `0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57` |
| EURC/USDC Pool | `0xd5D220DDF70d6CdD465E3EDD12fc3AB25C31A163` |
| EURC/AUDM Pool | `0x91e50A3d956Ce17661A393Ca6FA9519d441cfbf2` |
| Faucet | `0x432a163B26DaB6D5f386d8C4F70032f670686238` |

### Arbitrum Sepolia (chainId: 421614)

| Contract | Address |
|----------|---------|
| Router | `0xbE26A3B762a5F7eAd86731E63d60f359e382cdaC` |
| Zap | `0x14ba424AbEA6cF9e32a61376DD80Fb84793DBd20` |
| Factory | `0xa6cEa2B641600343F01849fc580802bebEd2f71B` |
| USDC | `0x9311cA9F222ba12575099383498e7348eF39b3A7` |
| AUDM | `0xf36a31074aDdD28dAd8d9C21C834cc6d1f569831` |
| EURC | `0x284B49f8463Ee7e0d709C430f29AD0104506C392` |
| AUDM/USDC Pool | `0x186eD80ecDD8dFcb108D19Ac22Bc3C256CfF633a` |
| EURC/USDC Pool | `0xb02E45e4E479faFAC2C0A75EDbc48E8659c9b274` |
| EURC/AUDM Pool | `0xF3A8f6EeBb8b45887700A87692f5Ae605D44c3cD` |
| Faucet | `0x0eb211d75a7b77034dE6913E80A0e0D88C422a41` |

