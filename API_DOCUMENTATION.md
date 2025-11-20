# IBNK Protocol API 文档

## 📢 重要更新 (2025-11-20)

### 🎉 新功能：数据库 API Key 管理系统

**新增功能**: 现在支持通过 API 动态管理 API Keys！

**主要改进**:
- ✅ 无需重启即可添加/删除用户
- ✅ 实时启用/禁用 API Keys
- ✅ 使用统计和追踪
- ✅ 自动过期管理
- ✅ 完整的管理 API

**安全保障**:
- 🔒 管理端点需要 **Admin Key** 认证
- 🔒 只有管理员可以管理 API Keys
- 🔒 普通用户无法访问管理功能

详见：[管理端点](#管理端点-admin-api)

---

### ✅ Router接口已修复

**问题**: 之前的Router ABI定义错误，导致swap交易失败。

**修复**: Router的`originSwap`函数现在使用正确的签名：
```typescript
// ✅ 正确 (已修复)
function originSwap(
  uint256 originAmount,
  uint256 minTargetAmount,
  address[] path,      // 使用path数组
  uint256 deadline
)

// ❌ 错误 (旧版本)
function originSwap(
  address origin,
  address target,
  uint256 originAmount,
  uint256 minTargetAmount,
  uint256 deadline
)
```

**影响**: 所有使用交易构建端点(`/api/v1/transaction/build/swap`)的应用都将自动使用正确的接口。

**验证**:
- 测试交易: [0x2b8496b6...](https://sepolia.arbiscan.io/tx/0x2b8496b6135f4f4bfb8e16fb5712bb2b1b059a897c4466e1f99d09239b0a114d)
- 状态: ✅ 成功执行

---

## 概述

IBNK Protocol API 提供了与去中心化交易所(DEX)池子交互的RESTful接口。支持查询流动性池信息、预览交易、管理代币授权、获取Oracle价格等功能。

**当前版本**: v1.3 (完整的交易签名传输文档)
**基础URL**: `https://api.ibnk.xyz` (生产环境) 或 `http://localhost:3000` (本地开发)
**最后更新**: 2025-11-20

## 🚀 如何使用此API

本API提供三种使用方式，**无需前端界面即可使用**：

### 方式A: 浏览器 + MetaMask（需要前端）
适用于Web应用集成，需要开发网页前端。

### 方式B: Node.js脚本（✅ 推荐 - 无需前端）
直接通过Node.js脚本调用API，私钥在本地签名，无需任何网页界面。

**示例**:
```javascript
const { ethers } = require('ethers');

// 1. 调用API预览Swap
const preview = await fetch('http://localhost:3000/api/v1/swap/preview', {
  method: 'POST',
  headers: { 'X-API-Key': 'your_api_key', 'Content-Type': 'application/json' },
  body: JSON.stringify({ chainId: 421614, tokenIn: '0x...', tokenOut: '0x...', amountIn: '10' })
});

// 2. 本地签名
const wallet = new ethers.Wallet(privateKey, provider);
const signedTx = await wallet.signTransaction(txData);

// 3. 广播交易
await fetch('http://localhost:3000/api/v1/transaction/broadcast', {
  method: 'POST',
  body: JSON.stringify({ chainId: 421614, signedTransaction: signedTx })
});
```

### 方式C: Python脚本（✅ 推荐 - 无需前端）
使用Python调用API，适合自动化交易脚本。

**示例**:
```python
import requests
from eth_account import Account

# 1. 调用API预览Swap
response = requests.post('http://localhost:3000/api/v1/swap/preview',
    headers={'X-API-Key': 'your_api_key'},
    json={'chainId': 421614, 'tokenIn': '0x...', 'tokenOut': '0x...', 'amountIn': '10'})

# 2. 本地签名
account = Account.from_key(private_key)
signed_tx = account.sign_transaction(tx_data)

# 3. 广播交易
requests.post('http://localhost:3000/api/v1/transaction/broadcast',
    json={'chainId': 421614, 'signedTransaction': signed_tx.rawTransaction.hex()})
```

> 💡 **重要**: 方式B和方式C是推荐的使用方式，**完全不需要开发前端界面**。您可以通过命令行脚本直接使用所有功能。

---

## 🚦 快速入门教程

这是一个完整的端到端教程，展示如何从零开始完成您的第一个 Swap 交易。

### 前置要求

- Node.js 18+ 或 Python 3.8+
- 一个 Base Sepolia 或 Arbitrum Sepolia 测试网钱包
- 钱包中有测试 ETH（用于 gas）和测试代币
- 您的 API Key

### 步骤 1: 安装依赖

**Node.js:**
```bash
npm install ethers node-fetch
```

**Python:**
```bash
pip install web3 requests eth-account
```

### 步骤 2: 查看可用的池子

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "pools": [
      {
        "address": "0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a",
        "name": "AUDM/USDC",
        "chainId": 84532,
        "token0": {
          "address": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
          "symbol": "AUDM",
          "decimals": "6"
        },
        "token1": {
          "address": "0x340Ca64911c2C9E85c994690F805984104e054Fa",
          "symbol": "USDC",
          "decimals": "6"
        }
      }
    ]
  }
}
```

### 步骤 3: 预览 Swap

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/swap/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "poolAddress": "0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a",
    "tokenIn": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "tokenOut": "0x340Ca64911c2C9E85c994690F805984104e054Fa",
    "amountIn": "10"
  }'
```

**响应:**
```json
{
  "success": true,
  "data": {
    "amountIn": "10",
    "amountOut": "6.49675",
    "minimumAmountOut": "6.431782",
    "priceImpact": "0.05%",
    "fee": "0.05%"
  }
}
```

### 步骤 4: 执行完整的 Swap（Node.js 示例）

创建文件 `my-first-swap.js`:

```javascript
const { ethers } = require('ethers');

const API_URL = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key_here';
const PRIVATE_KEY = 'your_private_key_here';
const RPC_URL = 'https://sepolia.base.org';

async function myFirstSwap() {
  console.log('🚀 开始我的第一个 Swap...\n');

  // 1. 创建钱包
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('✅ 钱包地址:', wallet.address);

  // 2. 预览 Swap
  console.log('\n📊 预览 Swap...');
  const previewResponse = await fetch(`${API_URL}/api/v1/swap/preview`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      poolAddress: '0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a',
      tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
      amountIn: '10'
    })
  });
  const preview = await previewResponse.json();
  console.log('✅ 预期输出:', preview.data.amountOut, 'USDC');

  // 3. 检查授权
  console.log('\n🔍 检查授权...');
  const approvalCheckResponse = await fetch(`${API_URL}/api/v1/approval/check`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      tokenAddress: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      ownerAddress: wallet.address,
      spenderAddress: '0x464B3Ad497B558E1BE73a550631CA462632651bc',
      requiredAmount: '10'
    })
  });
  const approvalCheck = await approvalCheckResponse.json();

  // 4. 如果需要授权，执行授权
  if (approvalCheck.data.needsApproval) {
    console.log('⚠️  需要授权...');
    // [授权代码见完整文档的第 13 节]
    console.log('请先完成授权，然后重新运行此脚本');
    return;
  }
  console.log('✅ 授权充足');

  // 5. 构建 Swap 交易
  console.log('\n🔨 构建 Swap 交易...');
  const buildResponse = await fetch(`${API_URL}/api/v1/transaction/build/swap`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      userAddress: wallet.address,
      tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
      amountIn: '10',
      minAmountOut: preview.data.minimumAmountOut
    })
  });
  const txData = await buildResponse.json();
  console.log('✅ 交易已构建');

  // 6. 签名交易
  console.log('\n🔐 签名交易...');
  const nonce = await provider.getTransactionCount(wallet.address, 'pending');
  const tx = {
    to: txData.data.to,
    data: txData.data.data,
    value: txData.data.value,
    chainId: txData.data.chainId,
    gasLimit: txData.data.gasLimit,
    maxFeePerGas: txData.data.maxFeePerGas,
    maxPriorityFeePerGas: txData.data.maxPriorityFeePerGas,
    nonce
  };
  const signedTx = await wallet.signTransaction(tx);
  console.log('✅ 交易已签名');

  // 7. 广播交易
  console.log('\n📡 广播交易...');
  const broadcastResponse = await fetch(`${API_URL}/api/v1/transaction/broadcast`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      signedTransaction: signedTx
    })
  });
  const result = await broadcastResponse.json();
  console.log('✅ 交易已广播！');
  console.log('📝 交易哈希:', result.data.transactionHash);
  console.log('🔗 浏览器:', `https://sepolia.basescan.org/tx/${result.data.transactionHash}`);

  // 8. 等待确认
  console.log('\n⏳ 等待确认...');
  const receipt = await provider.waitForTransaction(result.data.transactionHash);
  console.log('✅ 交易已确认！区块:', receipt.blockNumber);

  console.log('\n🎉 完成！您已成功执行第一个 Swap！');
}

// 运行
myFirstSwap().catch(console.error);
```

**运行:**
```bash
node my-first-swap.js
```

**预期输出:**
```
🚀 开始我的第一个 Swap...

✅ 钱包地址: 0xYour...Address

📊 预览 Swap...
✅ 预期输出: 6.49675 USDC

🔍 检查授权...
✅ 授权充足

🔨 构建 Swap 交易...
✅ 交易已构建

🔐 签名交易...
✅ 交易已签名

📡 广播交易...
✅ 交易已广播！
📝 交易哈希: 0x...
🔗 浏览器: https://sepolia.basescan.org/tx/0x...

⏳ 等待确认...
✅ 交易已确认！区块: 12345678

🎉 完成！您已成功执行第一个 Swap！
```

### 常见问题

**Q: 如何获取测试 ETH？**
A: 使用水龙头：https://www.alchemy.com/faucets/base-sepolia

**Q: 如何获取测试代币（AUDM、USDC）？**
A: 联系 IBNK 团队获取测试代币

**Q: 授权失败怎么办？**
A: 查看完整文档的[第 13 节](#13-构建授权交易)了解如何处理授权

**Q: 交易失败了怎么办？**
A: 查看[故障排除](#-故障排除)章节

### 下一步

恭喜！您已经完成了第一个 Swap。接下来可以：

1. 查看[完整的交易签名传输文档](#交易签名传输端点-transaction-signing-flow)
2. 学习[授权管理](#8-检查代币授权状态)
3. 探索[流动性管理](#6-添加流动性预览)
4. 使用[Oracle 价格](#11-获取oracle价格)
5. 查看[完整的 API 参考](#api-端点)

---

## 支持的区块链

| 链名称 | Chain ID | 网络类型 |
|--------|----------|----------|
| Base Sepolia | 84532 | 测试网 |
| Arbitrum Sepolia | 421614 | 测试网 |

## 认证

所有API请求都需要在HTTP头中包含API密钥：

```http
X-API-Key: your_api_key_here
```

### 获取API密钥

#### 方式 1: 通过管理员获取（推荐）

如果您的组织已有 IBNK API 访问权限，请联系管理员通过管理 API 为您创建密钥：

1. 管理员使用 Admin Key 调用创建 API Key 端点
2. 管理员将生成的 API Key 发送给您
3. 您即可立即使用（无需等待，实时生效）

详见：[管理端点文档](#管理端点-admin-api)

#### 方式 2: 申请新账户

如果您是新用户，请通过以下方式申请：

1. **联系方式**:
   - 邮箱: support@ibnk.xyz
   - Discord: https://discord.gg/ibnk
   - 官网: https://ibnk.xyz

2. **申请信息**:
   - 您的姓名/公司名称
   - 联系邮箱
   - 使用场景说明
   - 预期请求量

3. **审核时间**: 通常 1-2 个工作日

4. **获得密钥**: 审核通过后，我们会将 API Key 发送到您的邮箱

### 测试 API 连接

获得 API Key 后，使用以下简单请求测试连接：

```bash
# 测试连接（健康检查，无需 API Key）
curl -X GET "https://api.ibnk.xyz/health"

# 测试认证（需要 API Key）
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "pools": [...],
    "pagination": {...}
  }
}
```

### 示例请求

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=421614" \
  -H "X-API-Key: your_api_key_here"
```

## 速率限制

- 窗口期: 15分钟 (900,000毫秒)
- 最大请求数: 100次/窗口期

超过限制将返回 `429 Too Many Requests` 错误。

---

## API 端点

### 1. 健康检查

检查API服务状态。

**端点**: `GET /health`
**认证**: 不需要

#### 响应示例

```json
{
  "status": "ok",
  "timestamp": "2025-11-19T13:32:31.466Z",
  "uptime": 12345.67
}
```

---

### 2. 获取所有流动性池

获取指定链上所有可用的流动性池信息。

**端点**: `GET /api/v1/pools`
**认证**: 需要

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 (Base Sepolia) |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "pools": [
      {
        "address": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
        "name": "AUDM/USDC",
        "chainId": 421614,
        "token0": {
          "address": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
          "symbol": "AUDM",
          "decimals": "6"
        },
        "token1": {
          "address": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
          "symbol": "USDC",
          "decimals": "6"
        },
        "reserves": {
          "token0": "747333.443648",
          "token1": "586642.125575"
        },
        "totalSupply": "1072202.109688352427630358"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3
    }
  }
}
```

#### 示例请求

```bash
# Arbitrum Sepolia
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=421614" \
  -H "X-API-Key: your_api_key_here"

# Base Sepolia
curl -X GET "https://api.ibnk.xyz/api/v1/pools?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

---

### 3. 获取单个流动性池详情

获取指定池子的详细信息。

**端点**: `GET /api/v1/pools/:poolAddress`
**认证**: 需要

#### 路径参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| poolAddress | string | 是 | 流动性池合约地址 |

#### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "address": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "name": "AUDM/USDC",
    "chainId": 421614,
    "token0": {
      "address": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
      "symbol": "AUDM",
      "decimals": "6"
    },
    "token1": {
      "address": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
      "symbol": "USDC",
      "decimals": "6"
    },
    "reserves": {
      "token0": "747333.443648",
      "token1": "586642.125575"
    },
    "totalSupply": "1072202.109688352427630358"
  }
}
```

#### 示例请求

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/pools/0x51964B217C5477C059667CE3e82cE2e9302B0241?chainId=421614" \
  -H "X-API-Key: your_api_key_here"
```

---

### 4. 交易预览 (Swap Preview)

预览代币交换，计算预期输出金额。

**端点**: `POST /api/v1/swap/preview`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| poolAddress | string | 是 | 流动性池地址 |
| tokenIn | string | 是 | 输入代币地址 |
| tokenOut | string | 是 | 输出代币地址 |
| amountIn | string | 是 | 输入金额 (人类可读格式，如 "1000") |

**重要**: `amountIn` 使用人类可读格式，API会自动根据代币精度转换。例如，交换1000 USDC，传入 `"1000"`，而不是 `"1000000000"`。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "amountIn": "1000",
    "amountOut": "649.675",
    "minimumAmountOut": "643.178250",
    "priceImpact": "0.05%",
    "fee": "0.05%"
  }
}
```

#### 响应字段说明

- `amountIn`: 输入金额
- `amountOut`: 预期输出金额
- `minimumAmountOut`: 最小输出金额（考虑1%滑点保护）
- `priceImpact`: 价格影响百分比
- `fee`: 交易手续费百分比

#### 示例请求

```bash
# 1000 AUDM 换 USDC (Arbitrum Sepolia)
curl -X POST "https://api.ibnk.xyz/api/v1/swap/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "tokenIn": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "tokenOut": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
    "amountIn": "1000"
  }'

# 反向: 1000 USDC 换 AUDM
curl -X POST "https://api.ibnk.xyz/api/v1/swap/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "tokenIn": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
    "tokenOut": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "amountIn": "1000"
  }'
```

---

### 5. 执行交易 (Swap Execute) 🔥

**直接执行代币交换交易**，无需用户手动签名。

> ⚠️ **安全警告**:
> - 此端点需要用户私钥，**仅适用于测试网环境**
> - **绝对不要在生产环境或主网使用此方式**
> - 私钥通过HTTPS传输且不会被存储
> - 建议生产环境使用托管钱包或Account Abstraction方案

**端点**: `POST /api/v1/swap/execute`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| privateKey | string | 是 | 用户私钥（⚠️ 仅测试网） |
| tokenIn | string | 是 | 输入代币地址 |
| tokenOut | string | 是 | 输出代币地址 |
| amountIn | string | 是 | 输入金额 (人类可读格式) |
| minAmountOut | string | 是 | 最小输出金额（滑点保护） |
| deadline | number | 否 | 交易截止时间(Unix时间戳)，默认5分钟 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "transactionHash": "0x1234567890abcdef...",
    "amountIn": "1000",
    "amountOut": "649.675",
    "gasUsed": "125000",
    "status": "success"
  }
}
```

#### 响应字段说明

- `transactionHash`: 区块链交易哈希
- `amountIn`: 实际输入金额
- `amountOut`: 实际输出金额
- `gasUsed`: 消耗的Gas数量
- `status`: 交易状态 (`success` 或 `failed`)

#### 示例请求

```bash
# 执行 10 AUDM -> USDC 交易
curl -X POST "https://api.ibnk.xyz/api/v1/swap/execute" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "privateKey": "0xYourPrivateKey",
    "tokenIn": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "tokenOut": "0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51",
    "amountIn": "10",
    "minAmountOut": "6.43"
  }'
```

#### 完整工作流程示例

```javascript
// 1. 预览交易
const preview = await fetch('/api/v1/swap/preview', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    poolAddress: '0x51964B217C5477C059667CE3e82cE2e9302B0241',
    tokenIn: '0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
    tokenOut: '0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
    amountIn: '10'
  })
}).then(r => r.json());

console.log(`预览: ${preview.data.amountOut} USDC`);

// 2. 执行交易
const execute = await fetch('/api/v1/swap/execute', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    privateKey: process.env.PRIVATE_KEY, // 从环境变量读取
    tokenIn: '0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
    tokenOut: '0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
    amountIn: '10',
    minAmountOut: preview.data.minimumAmountOut
  })
}).then(r => r.json());

console.log(`交易成功! Hash: ${execute.data.transactionHash}`);
console.log(`区块浏览器: https://sepolia.arbiscan.io/tx/${execute.data.transactionHash}`);
```

#### 安全建议

1. **测试网环境**
   - ✅ 可以使用私钥方式
   - 私钥来自测试网钱包
   - 代币没有实际价值

2. **生产环境（主网）**
   - ❌ 不要使用私钥方式
   - ✅ 使用托管钱包服务
   - ✅ 使用Account Abstraction
   - ✅ 使用签名服务（用户签名，API广播）

3. **私钥管理**
   - 使用环境变量存储
   - 通过HTTPS传输
   - 不要在日志中记录
   - 不要提交到代码仓库

---

### 6. 添加流动性预览

预览添加流动性所需的代币数量。

**端点**: `POST /api/v1/liquidity/deposit/preview`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| poolAddress | string | 是 | 流动性池地址 |
| desiredLPAmount | string | 是 | 期望获得的LP代币数量 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "lpAmount": "1000000000000000000",
    "token0Amount": "500.123456",
    "token1Amount": "350.987654"
  }
}
```

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/liquidity/deposit/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "desiredLPAmount": "1000000000000000000"
  }'
```

---

### 7. 移除流动性预览

预览移除流动性将获得的代币数量。

**端点**: `POST /api/v1/liquidity/withdraw/preview`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| poolAddress | string | 是 | 流动性池地址 |
| lpAmount | string | 是 | 要移除的LP代币数量 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "token0Amount": "82210032.901265",
    "token1Amount": "46575531.047883"
  }
}
```

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/liquidity/withdraw/preview" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "poolAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "lpAmount": "100000000000000000"
  }'
```

---

### 8. 检查代币授权状态

检查用户是否已授权足够的代币额度给合约。

**端点**: `POST /api/v1/approval/check`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| tokenAddress | string | 是 | 代币合约地址 |
| ownerAddress | string | 是 | 代币持有者地址 |
| spenderAddress | string | 是 | 被授权的合约地址 |
| requiredAmount | string | 是 | 需要的授权额度 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "isApproved": false,
    "currentAllowance": "89301.400652",
    "requiredAmount": "1000",
    "needsApproval": true
  }
}
```

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/approval/check" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "ownerAddress": "0xYourWalletAddress",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "requiredAmount": "1000"
  }'
```

---

### 9. 构建授权交易

生成代币授权交易的原始数据，用户可使用钱包签名并发送。

**端点**: `POST /api/v1/approval/build`
**认证**: 需要

> **💡 注意**:
> - 此端点提供授权建议（recommendation），适合需要智能授权策略的场景
> - 如果你需要完整的 EIP-1559 交易数据（包含 gas 参数），请使用 `/api/v1/transaction/build/approve`（见第 13 节）
> - 两个端点都支持相同的授权功能，选择适合你需求的即可

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| tokenAddress | string | 是 | 代币合约地址 |
| spenderAddress | string | 是 | 被授权的合约地址 |
| amount | string | 是 | 授权额度 |
| isUnlimited | boolean | 否 | 是否无限授权，默认false |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "transaction": {
      "to": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
      "data": "0x095ea7b3000000000000000000000000...",
      "value": "0"
    },
    "recommendation": {
      "strategy": "exact",
      "description": "精确批准所需金额，最大化安全性",
      "amount": "1000"
    }
  }
}
```

#### 授权策略说明

API会根据金额推荐不同的授权策略：

- **小额 (< 100)**: `double` - 批准双倍金额，减少频繁授权
- **中额 (100-10000)**: `exact` - 精确批准，最大化安全性
- **大额 (> 10000)**: `unlimited` - 无限授权，便利但需谨慎

#### 示例请求

```bash
# 精确授权
curl -X POST "https://api.ibnk.xyz/api/v1/approval/build" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "amount": "1000",
    "isUnlimited": false
  }'

# 无限授权
curl -X POST "https://api.ibnk.xyz/api/v1/approval/build" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241",
    "amount": "1000",
    "isUnlimited": true
  }'
```

---

### 10. 撤销授权

生成撤销代币授权的交易数据（将授权额度设为0）。

**端点**: `POST /api/v1/approval/revoke`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| tokenAddress | string | 是 | 代币合约地址 |
| spenderAddress | string | 是 | 被授权的合约地址 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "to": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "data": "0x095ea7b3000000000000000000000000...",
    "value": "0"
  }
}
```

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/approval/revoke" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 421614,
    "tokenAddress": "0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe",
    "spenderAddress": "0x51964B217C5477C059667CE3e82cE2e9302B0241"
  }'
```

---

### 11. 获取Oracle价格

获取所有代币的当前价格（以美元计价）。

**端点**: `GET /api/v1/oracle/prices`
**认证**: 需要

#### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "prices": {
      "AUDM": {
        "usd": "0.650237",
        "oracle": "0x2e8Cd7798F16a8F66c35a180031B16b428Cc3CAF",
        "lastUpdate": "2025-11-19T13:32:31.466Z"
      },
      "EURC": {
        "usd": "1.084567",
        "oracle": "0x64eb507A065F7464516207383Ab4eAA248e281B3",
        "lastUpdate": "2025-11-19T13:32:31.466Z"
      },
      "USDC": {
        "usd": "1.0",
        "oracle": null,
        "lastUpdate": "2025-11-19T13:32:31.466Z"
      }
    },
    "timestamp": "2025-11-19T13:32:31.466Z"
  }
}
```

#### 示例请求

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/oracle/prices?chainId=421614" \
  -H "X-API-Key: your_api_key_here"
```

---

## 交易签名传输端点 (Transaction Signing Flow)

这些端点实现了**安全的客户端签名模式**，私钥永远不会离开用户设备。

### 工作流程

1. **构建交易** → API 生成未签名交易数据
2. **本地签名** → 客户端使用私钥在本地签名
3. **广播交易** → 将已签名交易发送到区块链
4. **查询状态** → 跟踪交易确认状态

### 12. 构建 Swap 交易

生成 Swap 交易的未签名数据，用户在本地签名后广播。

**端点**: `POST /api/v1/transaction/build/swap`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| userAddress | string | 是 | 用户钱包地址 |
| tokenIn | string | 是 | 输入代币地址 |
| tokenOut | string | 是 | 输出代币地址 |
| amountIn | string | 是 | 输入金额 (人类可读格式) |
| minAmountOut | string | 是 | 最小输出金额（滑点保护） |
| deadline | number | 否 | 交易截止时间(Unix时间戳秒)，默认当前时间+5分钟 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "to": "0x464B3Ad497B558E1BE73a550631CA462632651bc",
    "data": "0x8f0c8...",
    "value": "0",
    "chainId": 84532,
    "gasLimit": "317966",
    "maxFeePerGas": "1068026",
    "maxPriorityFeePerGas": "1000000"
  }
}
```

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/build/swap" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress",
    "tokenIn": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "tokenOut": "0x340Ca64911c2C9E85c994690F805984104e054Fa",
    "amountIn": "10",
    "minAmountOut": "6.43"
  }'
```

---

### 13. 构建授权交易

生成代币授权交易的未签名数据。

**端点**: `POST /api/v1/transaction/build/approve`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| userAddress | string | 是 | 用户钱包地址 |
| tokenAddress | string | 是 | 代币合约地址 |
| spenderAddress | string | 是 | 被授权的合约地址（Router） |
| amount | string | 是 | 授权额度 |
| isUnlimited | boolean | 否 | 是否无限授权，默认false |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "to": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "data": "0x095ea7b3...",
    "value": "0",
    "chainId": 84532,
    "gasLimit": "55963",
    "maxFeePerGas": "1068026",
    "maxPriorityFeePerGas": "1000000"
  }
}
```

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/build/approve" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "userAddress": "0xYourWalletAddress",
    "tokenAddress": "0xbe8bCb2E781214F3403Cc85327d2173642A0BD86",
    "spenderAddress": "0x464B3Ad497B558E1BE73a550631CA462632651bc",
    "amount": "10000",
    "isUnlimited": false
  }'
```

---

### 14. 广播已签名交易

将客户端签名的交易广播到区块链。

**端点**: `POST /api/v1/transaction/broadcast`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| signedTransaction | string | 是 | 已签名的交易（hex格式） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "transactionHash": "0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79",
    "status": "pending",
    "blockNumber": null,
    "confirmations": 0
  }
}
```

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/broadcast" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "signedTransaction": "0x02f8..."
  }'
```

---

### 15. 查询交易状态

查询已广播交易的当前状态和确认数。

**端点**: `POST /api/v1/transaction/status`
**认证**: 需要

#### 请求体参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |
| transactionHash | string | 是 | 交易哈希 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "status": "success",
    "blockNumber": 33904774,
    "confirmations": 16,
    "gasUsed": "209728"
  }
}
```

#### 状态说明

- `pending`: 交易已提交，等待打包
- `success`: 交易成功确认
- `failed`: 交易失败（revert）

#### 示例请求

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/transaction/status" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "transactionHash": "0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79"
  }'
```

---

### 16. 获取用户 Nonce

获取用户地址的当前 nonce 值，用于构建交易。

**端点**: `GET /api/v1/transaction/nonce/:address`
**认证**: 需要

#### 路径参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| address | string | 是 | 用户钱包地址 |

#### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| chainId | number | 否 | 链ID，默认84532 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "nonce": 42
  }
}
```

#### 示例请求

```bash
curl -X GET "https://api.ibnk.xyz/api/v1/transaction/nonce/0xYourWalletAddress?chainId=84532" \
  -H "X-API-Key: your_api_key_here"
```

---

### 完整签名传输示例

以下是使用 ethers.js 实现完整签名流程的示例：

```javascript
const { ethers } = require('ethers');

const API_URL = 'https://api.ibnk.xyz';
const API_KEY = 'your_api_key';
const RPC_URL = 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function executeSwap() {
  // 1. 创建钱包
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log('钱包地址:', wallet.address);

  // 2. 预览 Swap
  const previewResponse = await fetch(`${API_URL}/api/v1/swap/preview`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      poolAddress: '0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a',
      tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
      amountIn: '10'
    })
  });
  const preview = await previewResponse.json();
  console.log('预期输出:', preview.data.amountOut, 'USDC');

  // 3. 检查授权
  const approvalCheckResponse = await fetch(`${API_URL}/api/v1/approval/check`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      tokenAddress: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      ownerAddress: wallet.address,
      spenderAddress: '0x464B3Ad497B558E1BE73a550631CA462632651bc',
      requiredAmount: '10'
    })
  });
  const approvalCheck = await approvalCheckResponse.json();

  // 4. 如果需要授权，执行授权交易
  if (approvalCheck.data.needsApproval) {
    console.log('需要授权，构建授权交易...');

    // 4a. 构建授权交易
    const buildApproveResponse = await fetch(`${API_URL}/api/v1/transaction/build/approve`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chainId: 84532,
        userAddress: wallet.address,
        tokenAddress: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
        spenderAddress: '0x464B3Ad497B558E1BE73a550631CA462632651bc',
        amount: '10000',
        isUnlimited: false
      })
    });
    const approveTxData = await buildApproveResponse.json();

    // 4b. 本地签名授权交易
    const approveNonce = await provider.getTransactionCount(wallet.address, 'pending');
    const approveTx = {
      to: approveTxData.data.to,
      data: approveTxData.data.data,
      value: approveTxData.data.value,
      chainId: approveTxData.data.chainId,
      gasLimit: approveTxData.data.gasLimit,
      maxFeePerGas: approveTxData.data.maxFeePerGas,
      maxPriorityFeePerGas: approveTxData.data.maxPriorityFeePerGas,
      nonce: approveNonce
    };

    const signedApproveTx = await wallet.signTransaction(approveTx);

    // 4c. 广播授权交易
    const broadcastApproveResponse = await fetch(`${API_URL}/api/v1/transaction/broadcast`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chainId: 84532,
        signedTransaction: signedApproveTx
      })
    });
    const approveResult = await broadcastApproveResponse.json();
    console.log('授权交易哈希:', approveResult.data.transactionHash);

    // 4d. 等待授权交易确认
    await provider.waitForTransaction(approveResult.data.transactionHash);
    console.log('授权已确认');
  }

  // 5. 构建 Swap 交易
  const buildSwapResponse = await fetch(`${API_URL}/api/v1/transaction/build/swap`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      userAddress: wallet.address,
      tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
      tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
      amountIn: '10',
      minAmountOut: preview.data.minimumAmountOut
    })
  });
  const swapTxData = await buildSwapResponse.json();

  // 6. 本地签名 Swap 交易
  const swapNonce = await provider.getTransactionCount(wallet.address, 'pending');
  const swapTx = {
    to: swapTxData.data.to,
    data: swapTxData.data.data,
    value: swapTxData.data.value,
    chainId: swapTxData.data.chainId,
    gasLimit: swapTxData.data.gasLimit,
    maxFeePerGas: swapTxData.data.maxFeePerGas,
    maxPriorityFeePerGas: swapTxData.data.maxPriorityFeePerGas,
    nonce: swapNonce
  };

  const signedSwapTx = await wallet.signTransaction(swapTx);

  // 7. 广播 Swap 交易
  const broadcastSwapResponse = await fetch(`${API_URL}/api/v1/transaction/broadcast`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      signedTransaction: signedSwapTx
    })
  });
  const swapResult = await broadcastSwapResponse.json();
  console.log('Swap 交易哈希:', swapResult.data.transactionHash);

  // 8. 等待 Swap 交易确认
  const receipt = await provider.waitForTransaction(swapResult.data.transactionHash);
  console.log('Swap 已确认！区块:', receipt.blockNumber);

  // 9. 查询最终状态
  const statusResponse = await fetch(`${API_URL}/api/v1/transaction/status`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chainId: 84532,
      transactionHash: swapResult.data.transactionHash
    })
  });
  const status = await statusResponse.json();
  console.log('交易状态:', status.data.status);
  console.log('Gas 使用:', status.data.gasUsed);

  return swapResult.data.transactionHash;
}

// 运行
executeSwap()
  .then(hash => {
    console.log('\n✅ Swap 完成！');
    console.log(`浏览器: https://sepolia.basescan.org/tx/${hash}`);
  })
  .catch(error => {
    console.error('❌ 错误:', error.message);
  });
```

---

## 错误处理

### 错误响应格式

所有错误响应都遵循统一格式：

```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE",
  "message": "详细说明"
}
```

### 常见错误代码

| HTTP状态码 | 错误代码 | 说明 |
|-----------|---------|------|
| 400 | INVALID_PARAMETERS | 请求参数无效 |
| 401 | MISSING_API_KEY | 缺少API密钥 |
| 401 | INVALID_API_KEY | API密钥无效 |
| 404 | NOT_FOUND | 资源不存在 |
| 429 | RATE_LIMIT_EXCEEDED | 超过速率限制 |
| 500 | INTERNAL_ERROR | 服务器内部错误 |

### 错误示例

```json
// 缺少API Key
{
  "success": false,
  "error": "API Key Required",
  "message": "Please provide an API Key in X-API-Key header",
  "code": "MISSING_API_KEY"
}

// 参数验证失败
{
  "success": false,
  "error": "\"amountIn\" is required"
}

// 区块链错误
{
  "success": false,
  "error": "execution reverted: \"Curve/swap-convergence-failed\""
}
```

---

## 代币地址参考

### Arbitrum Sepolia (ChainId: 421614)

| 代币 | 地址 | 精度 |
|------|------|------|
| AUDM | `0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe` | 6 |
| USDC | `0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51` | 6 |
| EURC | `0x33a07F7298CEFfea8314aD6fC2f80BD86Fb1Ee1B` | 6 |

**流动性池地址**:
- AUDM/USDC: `0x51964B217C5477C059667CE3e82cE2e9302B0241`
- EURC/USDC: `0x883581889b9352CcC63e457C71dAFFbB20Ee5fb9`
- EURC/AUDM: `0x8D6970eB52Ca7FA2CC07517B2936ab3DF9F479c0`

### Base Sepolia (ChainId: 84532)

| 代币 | 地址 | 精度 |
|------|------|------|
| AUDM | `0xbe8bCb2E781214F3403Cc85327d2173642A0BD86` | 6 |
| USDC | `0x340Ca64911c2C9E85c994690F805984104e054Fa` | 6 |
| EURC | `0x69567Ab34CE8EB13A837d40B2714d569d0b51a37` | 6 |

**流动性池地址**:
- AUDM/USDC: `0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a`
- EURC/USDC: `0xaf16e2eAA39057911876d40f9BfDd3E97A086c6e`
- EURC/AUDM: `0x8F6a4B1BC072b58e55fC6C46cCbdCAb0e6224F15`

---

## 最佳实践

### 1. 金额格式

所有金额参数使用**人类可读格式**，API会自动处理精度转换：

```javascript
// ✅ 正确
{ "amountIn": "1000" }

// ❌ 错误 (不要使用wei值)
{ "amountIn": "1000000000" }
```

### 2. 错误处理

始终检查 `success` 字段：

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
  // 处理成功响应
  console.log('输出金额:', data.data.amountOut);
} else {
  // 处理错误
  console.error('错误:', data.error);
}
```

### 3. 链选择建议

- **Arbitrum Sepolia**: 推荐使用，流动性更充足（747k+ AUDM）
- **Base Sepolia**: 流动性较少（24k AUDM），适合小额测试

### 4. 滑点保护

Swap预览返回的 `minimumAmountOut` 已包含1%滑点保护。实际交易时使用此值作为最小输出金额：

```javascript
const preview = await getSwapPreview();
const minOutput = preview.minimumAmountOut; // 已包含1%滑点
```

### 5. 授权管理

在执行交易前，始终先检查并处理授权：

```javascript
// 1. 检查授权状态
const approvalStatus = await checkApproval({
  tokenAddress: '0x...',
  ownerAddress: userAddress,
  spenderAddress: poolAddress,
  requiredAmount: '1000'
});

// 2. 如果需要授权，构建授权交易
if (approvalStatus.needsApproval) {
  const approvalTx = await buildApprovalTransaction({
    tokenAddress: '0x...',
    spenderAddress: poolAddress,
    amount: '1000'
  });

  // 3. 用户签名并发送授权交易
  await wallet.sendTransaction(approvalTx.transaction);
}

// 4. 执行实际交易
```

---

## SDK 集成示例

### JavaScript/TypeScript

```javascript
class IBNKProtocolAPI {
  constructor(apiKey, baseUrl = 'https://api.ibnk.xyz') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return response.json();
  }

  // 获取所有池子
  async getPools(chainId = 421614) {
    return this.request('GET', `/api/v1/pools?chainId=${chainId}`);
  }

  // Swap预览
  async previewSwap(params) {
    return this.request('POST', '/api/v1/swap/preview', params);
  }

  // 检查授权
  async checkApproval(params) {
    return this.request('POST', '/api/v1/approval/check', params);
  }

  // 获取价格
  async getPrices(chainId = 421614) {
    return this.request('GET', `/api/v1/oracle/prices?chainId=${chainId}`);
  }
}

// 使用示例
const api = new IBNKProtocolAPI('your_api_key');

// 预览1000 AUDM换USDC
const preview = await api.previewSwap({
  chainId: 421614,
  poolAddress: '0x51964B217C5477C059667CE3e82cE2e9302B0241',
  tokenIn: '0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
  tokenOut: '0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
  amountIn: '1000'
});

console.log(`1000 AUDM = ${preview.data.amountOut} USDC`);
```

### Python

```python
import requests

class IBNKProtocolAPI:
    def __init__(self, api_key, base_url='https://api.ibnk.xyz'):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'X-API-Key': api_key})

    def get_pools(self, chain_id=421614):
        url = f"{self.base_url}/api/v1/pools"
        params = {'chainId': chain_id}
        response = self.session.get(url, params=params)
        return response.json()

    def preview_swap(self, chain_id, pool_address, token_in, token_out, amount_in):
        url = f"{self.base_url}/api/v1/swap/preview"
        data = {
            'chainId': chain_id,
            'poolAddress': pool_address,
            'tokenIn': token_in,
            'tokenOut': token_out,
            'amountIn': amount_in
        }
        response = self.session.post(url, json=data)
        return response.json()

    def get_prices(self, chain_id=421614):
        url = f"{self.base_url}/api/v1/oracle/prices"
        params = {'chainId': chain_id}
        response = self.session.get(url, params=params)
        return response.json()

# 使用示例
api = IBNKProtocolAPI('your_api_key')

# 预览交易
preview = api.preview_swap(
    chain_id=421614,
    pool_address='0x51964B217C5477C059667CE3e82cE2e9302B0241',
    token_in='0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
    token_out='0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
    amount_in='1000'
)

print(f"1000 AUDM = {preview['data']['amountOut']} USDC")
```

---

## ✅ 成功案例

### Swap交易成功案例

以下是通过API成功执行的真实交易案例：

#### 案例1: Base Sepolia 完整签名传输流程

**交易详情**:
- 链: Base Sepolia (84532)
- 交易对: 10 AUDM → 6.49675 USDC
- 交易哈希: [0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79](https://sepolia.basescan.org/tx/0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79)
- Gas 估算: 317,966
- Gas 实际使用: 209,728 (66% 效率)
- 价格影响: 0.05%
- 手续费: 0.05%
- 确认区块: 33904774
- 状态: ✅ 成功

**实现流程**:
```javascript
// 完整的签名传输流程
// 1. 预览 Swap - 获取预期输出和最小输出
const preview = await fetch('https://api.ibnk.xyz/api/v1/swap/preview', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_prod_87bc599ef905e1c7f8daa1e31e4fc77a8240002b',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 84532,
    poolAddress: '0x875BFCc05e2227E38C8de637Abf0C94A2DAEAE7a',
    tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
    tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
    amountIn: '10'
  })
});
// 输出: 6.49675 USDC, 最小: 6.431782 USDC

// 2. 检查授权 - 验证是否需要授权
const approvalCheck = await fetch('https://api.ibnk.xyz/api/v1/approval/check', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_prod_87bc599ef905e1c7f8daa1e31e4fc77a8240002b',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 84532,
    tokenAddress: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
    ownerAddress: '0xFB53167B01f1c9247801a670C92eBbf5768Ca32B',
    spenderAddress: '0x464B3Ad497B558E1BE73a550631CA462632651bc',
    requiredAmount: '10'
  })
});
// 结果: 已有授权，跳过授权步骤

// 3. 构建 Swap 交易 - 获取未签名交易数据
const buildResult = await fetch('https://api.ibnk.xyz/api/v1/transaction/build/swap', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_prod_87bc599ef905e1c7f8daa1e31e4fc77a8240002b',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 84532,
    userAddress: '0xFB53167B01f1c9247801a670C92eBbf5768Ca32B',
    tokenIn: '0xbe8bCb2E781214F3403Cc85327d2173642A0BD86',
    tokenOut: '0x340Ca64911c2C9E85c994690F805984104e054Fa',
    amountIn: '10',
    minAmountOut: '6.431782'
  })
});

// 4. 本地签名 - 使用 ethers.js 在客户端签名
const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
const wallet = new ethers.Wallet(privateKey, provider);
const nonce = await provider.getTransactionCount(wallet.address, 'pending');

const tx = {
  to: buildResult.data.to,
  data: buildResult.data.data,
  value: buildResult.data.value,
  chainId: buildResult.data.chainId,
  gasLimit: buildResult.data.gasLimit,
  maxFeePerGas: buildResult.data.maxFeePerGas,
  maxPriorityFeePerGas: buildResult.data.maxPriorityFeePerGas,
  nonce
};

const signedTx = await wallet.signTransaction(tx);

// 5. 广播交易 - 将已签名交易提交到链上
const broadcastResult = await fetch('https://api.ibnk.xyz/api/v1/transaction/broadcast', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_prod_87bc599ef905e1c7f8daa1e31e4fc77a8240002b',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 84532,
    signedTransaction: signedTx
  })
});
// 结果: 交易哈希 0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79

// 6. 查询状态 - 确认交易成功
const statusResult = await fetch('https://api.ibnk.xyz/api/v1/transaction/status', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_prod_87bc599ef905e1c7f8daa1e31e4fc77a8240002b',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 84532,
    transactionHash: '0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79'
  })
});
// 结果: status=success, blockNumber=33904774, gasUsed=209728
```

**关键要点**:
- ✅ 使用正确的 Router 接口（path 数组）
- ✅ 私钥仅在本地签名，永不发送到服务器
- ✅ Gas 估算准确且有安全边际（实际使用 66%）
- ✅ 滑点保护生效（minimumAmountOut: 6.431782）
- ✅ 授权检查避免不必要的授权交易
- ✅ 完整的错误处理和状态追踪

---

#### 案例2: Arbitrum Sepolia Swap

**交易详情**:
- 链: Arbitrum Sepolia (421614)
- 交易对: 1 AUDM → 0.649684 USDC
- 交易哈希: [0x2b8496b6135f4f4bfb8e16fb5712bb2b1b059a897c4466e1f99d09239b0a114d](https://sepolia.arbiscan.io/tx/0x2b8496b6135f4f4bfb8e16fb5712bb2b1b059a897c4466e1f99d09239b0a114d)
- Gas消耗: 209,718
- 状态: ✅ 成功

**实现流程**:
```javascript
// 1. 预览交易
const preview = await fetch('http://localhost:3000/api/v1/swap/preview', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_test_dev123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    poolAddress: '0x51964B217C5477C059667CE3e82cE2e9302B0241',
    tokenIn: '0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
    tokenOut: '0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
    amountIn: '1'
  })
});

// 2. 构建交易
const buildResult = await fetch('http://localhost:3000/api/v1/transaction/build/swap', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_test_dev123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    userAddress: '0xFB53167B01f1c9247801a670C92eBbf5768Ca32B',
    tokenIn: '0x5d2Cc73f18eD0ff564f87c26842f8E2f00f6eEEe',
    tokenOut: '0x0911372aaB79EDd1e61F06c6F2b1a7eF342B6D51',
    amountIn: '1',
    minAmountOut: '0.643178'
  })
});

// 3. 本地签名（使用ethers.js）
const wallet = new ethers.Wallet(privateKey, provider);
const signedTx = await wallet.signTransaction(buildResult.data);

// 4. 广播交易
const broadcastResult = await fetch('http://localhost:3000/api/v1/transaction/broadcast', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_test_dev123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chainId: 421614,
    signedTransaction: signedTx
  })
});

// 结果: 交易成功! ✅
console.log('交易哈希:', broadcastResult.data.transactionHash);
```

**关键要点**:
- ✅ 使用正确的Router接口（path数组）
- ✅ 私钥仅在本地签名，不发送到API
- ✅ Gas估算准确（实际消耗209,718）
- ✅ 滑点保护生效（minAmountOut: 0.643178）

---

## 🔧 故障排除

### 常见问题

#### 1. Swap交易失败：`execution reverted`

**症状**: 交易被区块链接受但revert（status=0）

**可能原因**:
- ❌ 使用了错误的Router接口（旧版本）
- ❌ Token未批准
- ❌ 滑点保护过严
- ❌ deadline已过期

**解决方案**:
```javascript
// ✅ 确保使用最新的API（v1.1+）
// API会自动使用正确的Router接口

// ✅ 检查Token批准
const audm = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
const allowance = await audm.allowance(userAddress, routerAddress);
if (allowance < amount) {
  // 需要先批准
  await audm.approve(routerAddress, ethers.MaxUint256);
}

// ✅ 适当的滑点保护（1-5%）
const minAmountOut = expectedOut * 0.99; // 1% slippage

// ✅ 设置合理的deadline（5分钟）
const deadline = Math.floor(Date.now() / 1000) + 300;
```

#### 2. API返回401错误

**症状**: `{ "error": "Invalid API Key" }`

**解决方案**:
```bash
# 确保API Key在请求头中正确设置
curl -X GET "http://localhost:3000/api/v1/pools" \
  -H "X-API-Key: sk_test_dev123"  # 正确的header名称
```

#### 3. Gas估算失败

**症状**: `Error building transaction: execution reverted`

**可能原因**:
- Token未批准给Router合约
- 余额不足

**解决方案**:
```javascript
// 1. 检查余额
const balance = await tokenContract.balanceOf(userAddress);
console.log('余额:', ethers.formatUnits(balance, decimals));

// 2. 检查批准
const allowance = await tokenContract.allowance(userAddress, routerAddress);
console.log('批准额度:', ethers.formatUnits(allowance, decimals));

// 3. 如果需要，先批准
if (allowance < amountInWei) {
  const tx = await tokenContract.approve(routerAddress, ethers.MaxUint256);
  await tx.wait();
}
```

#### 4. 签名失败

**症状**: 签名过程出错

**原因**: 取决于你的使用方式：

**方式A: 浏览器 + MetaMask**（需要前端）
```javascript
// MetaMask签名
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const tx = await signer.sendTransaction(txData);
```

**方式B: Node.js脚本**（**不需要前端**）✅ 推荐
```javascript
// 本地签名（私钥在环境变量中）
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// 确保交易对象格式正确（EIP-1559）
const tx = {
  to: buildResult.data.to,
  data: buildResult.data.data,
  value: BigInt(buildResult.data.value || '0'),
  chainId: buildResult.data.chainId,
  nonce: nonce,
  gasLimit: BigInt(buildResult.data.gasLimit),
  maxFeePerGas: BigInt(buildResult.data.maxFeePerGas || '0'),
  maxPriorityFeePerGas: BigInt(buildResult.data.maxPriorityFeePerGas || '0'),
  type: 2,
};

const signedTx = await wallet.signTransaction(tx);
```

**方式C: Python脚本**（**不需要前端**）✅ 推荐
```python
# 本地签名（私钥在环境变量中）
from eth_account import Account
import os

private_key = os.getenv('PRIVATE_KEY')
account = Account.from_key(private_key)

# 签名交易
signed_tx = account.sign_transaction(transaction)
```

### 调试技巧

#### 1. 启用详细日志

```javascript
// 在调用API前后添加日志
console.log('请求参数:', requestBody);
const response = await fetch(url, options);
console.log('响应状态:', response.status);
const data = await response.json();
console.log('响应数据:', data);
```

#### 2. 使用Arbiscan查看交易

```bash
# Arbitrum Sepolia
https://sepolia.arbiscan.io/tx/YOUR_TX_HASH

# Base Sepolia
https://sepolia.basescan.org/tx/YOUR_TX_HASH
```

#### 3. 测试网水龙头

获取测试代币:
- Arbitrum Sepolia: https://faucet.quicknode.com/arbitrum/sepolia
- Base Sepolia: https://faucet.quicknode.com/base/sepolia

---

## 管理端点 (Admin API)

### 🔒 认证要求

**重要**: 所有管理端点需要 **Admin Key** 认证（不是普通的 API Key）。

```bash
X-Admin-Key: admin_你的管理员密钥
```

**安全保障**:
- ✅ 只有拥有 Admin Key 的管理员可以访问
- ✅ 普通 API Key 用户无法访问管理功能
- ✅ Admin Key 在服务器环境变量中配置

### 管理端点列表

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/admin/keys` | POST | 创建新的 API Key |
| `/api/v1/admin/keys` | GET | 列出所有 API Keys |
| `/api/v1/admin/keys/:id` | GET | 获取单个 API Key 详情 |
| `/api/v1/admin/keys/:id` | DELETE | 删除 API Key |
| `/api/v1/admin/keys/:id/toggle` | PATCH | 启用/禁用 API Key |
| `/api/v1/admin/stats` | GET | 查看使用统计 |

---

### 1. 创建 API Key

创建新的 API Key（立即生效，无需重启）。

**端点**: `POST /api/v1/admin/keys`

**请求头**:
```
X-Admin-Key: admin_你的管理员密钥
Content-Type: application/json
```

**请求体**:
```json
{
  "name": "用户名或描述",           // 可选
  "description": "用途说明",        // 可选
  "expiresInDays": 365             // 可选，过期天数
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "sk_prod_abc123def456...",
    "name": "用户名或描述",
    "description": "用途说明",
    "is_active": true,
    "created_at": "2025-11-20T12:00:00.000Z",
    "last_used_at": null,
    "usage_count": 0,
    "expires_at": "2026-11-20T12:00:00.000Z"
  },
  "message": "API key created successfully"
}
```

**示例**:
```bash
curl -X POST https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_你的管理员密钥" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "前端应用用户1",
    "description": "Web应用访问",
    "expiresInDays": 365
  }'
```

---

### 2. 列出所有 API Keys

查看所有已创建的 API Keys 及其使用情况。

**端点**: `GET /api/v1/admin/keys`

**请求头**:
```
X-Admin-Key: admin_你的管理员密钥
```

**响应**:
```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "id": 1,
        "key": "sk_prod_abc123...",
        "name": "用户1",
        "description": "前端应用",
        "is_active": true,
        "created_at": "2025-11-20T12:00:00.000Z",
        "last_used_at": "2025-11-20T14:30:00.000Z",
        "usage_count": 1523,
        "expires_at": "2026-11-20T12:00:00.000Z"
      },
      {
        "id": 2,
        "key": "sk_prod_xyz789...",
        "name": "用户2",
        "is_active": false,
        "usage_count": 45,
        "last_used_at": "2025-11-19T10:00:00.000Z"
      }
    ],
    "total": 2
  }
}
```

**示例**:
```bash
curl https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_你的管理员密钥"
```

---

### 3. 获取单个 API Key

查看特定 API Key 的详细信息。

**端点**: `GET /api/v1/admin/keys/:id`

**请求头**:
```
X-Admin-Key: admin_你的管理员密钥
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "sk_prod_abc123...",
    "name": "用户1",
    "is_active": true,
    "usage_count": 1523,
    "last_used_at": "2025-11-20T14:30:00.000Z"
  }
}
```

**示例**:
```bash
curl https://api.ibnk.xyz/api/v1/admin/keys/1 \
  -H "X-Admin-Key: admin_你的管理员密钥"
```

---

### 4. 删除 API Key

永久删除一个 API Key（立即生效）。

**端点**: `DELETE /api/v1/admin/keys/:id`

**请求头**:
```
X-Admin-Key: admin_你的管理员密钥
```

**响应**:
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

**示例**:
```bash
curl -X DELETE https://api.ibnk.xyz/api/v1/admin/keys/1 \
  -H "X-Admin-Key: admin_你的管理员密钥"
```

---

### 5. 启用/禁用 API Key

临时禁用或重新启用一个 API Key（立即生效，无需删除）。

**端点**: `PATCH /api/v1/admin/keys/:id/toggle`

**请求头**:
```
X-Admin-Key: admin_你的管理员密钥
Content-Type: application/json
```

**请求体**:
```json
{
  "isActive": false  // true=启用, false=禁用
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "sk_prod_abc123...",
    "is_active": false,
    "name": "用户1"
  },
  "message": "API key disabled successfully"
}
```

**示例（禁用）**:
```bash
curl -X PATCH https://api.ibnk.xyz/api/v1/admin/keys/1/toggle \
  -H "X-Admin-Key: admin_你的管理员密钥" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

**示例（启用）**:
```bash
curl -X PATCH https://api.ibnk.xyz/api/v1/admin/keys/1/toggle \
  -H "X-Admin-Key: admin_你的管理员密钥" \
  -H "Content-Type: application/json" \
  -d '{"isActive": true}'
```

---

### 6. 查看统计信息

查看所有 API Keys 的汇总统计。

**端点**: `GET /api/v1/admin/stats`

**请求头**:
```
X-Admin-Key: admin_你的管理员密钥
```

**响应**:
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

**示例**:
```bash
curl https://api.ibnk.xyz/api/v1/admin/stats \
  -H "X-Admin-Key: admin_你的管理员密钥"
```

---

### 管理工作流示例

#### 场景 1：添加新用户

```bash
# 1. 创建新 API Key
curl -X POST https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_xxx" \
  -H "Content-Type: application/json" \
  -d '{"name": "新用户", "expiresInDays": 30}'

# 2. 获取响应中的 key
# 3. 发送给用户
# 4. ✅ 立即生效，无需重启！
```

#### 场景 2：临时禁用滥用用户

```bash
# 1. 查看所有 keys，找到滥用用户的 ID
curl https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_xxx"

# 2. 禁用该用户的 key
curl -X PATCH https://api.ibnk.xyz/api/v1/admin/keys/5/toggle \
  -H "X-Admin-Key: admin_xxx" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'

# 3. ✅ 立即生效，用户无法继续访问
```

#### 场景 3：定期审计

```bash
# 1. 查看使用统计
curl https://api.ibnk.xyz/api/v1/admin/stats \
  -H "X-Admin-Key: admin_xxx"

# 2. 查看所有 keys 的详情
curl https://api.ibnk.xyz/api/v1/admin/keys \
  -H "X-Admin-Key: admin_xxx"

# 3. 删除长期不活跃的 keys
curl -X DELETE https://api.ibnk.xyz/api/v1/admin/keys/3 \
  -H "X-Admin-Key: admin_xxx"
```

---

### 安全最佳实践

1. **保护 Admin Key**
   - 使用强随机密钥（至少 32 字节）
   - 不要提交到 Git 仓库
   - 只在服务器环境变量中配置
   - 定期更换

2. **访问控制**
   - Admin Key 只给信任的管理员
   - 不同应用使用不同的 API Key
   - 及时删除不再使用的 keys

3. **监控与审计**
   - 定期查看使用统计
   - 监控异常使用模式
   - 记录所有管理操作

4. **Key 生命周期管理**
   - 为临时访问设置过期时间
   - 定期审查并清理过期 keys
   - 使用描述字段标记用途

---

## 支持与联系

- **文档**: https://docs.ibnk.xyz
- **API状态**: https://status.ibnk.xyz
- **技术支持**: support@ibnk.xyz
- **Discord**: https://discord.gg/ibnk
- **测试报告**: 查看`FINAL_TEST_REPORT.md`获取完整测试结果

---

## 更新日志

### v1.3.0 (2025-11-20)

- 📚 **完整的交易签名传输文档** - 重要更新！
  - ✅ 新增 5 个交易端点的完整文档
    - `/api/v1/transaction/build/swap` - 构建 Swap 交易
    - `/api/v1/transaction/build/approve` - 构建授权交易
    - `/api/v1/transaction/broadcast` - 广播已签名交易
    - `/api/v1/transaction/status` - 查询交易状态
    - `/api/v1/transaction/nonce/:address` - 获取用户 nonce
  - ✅ 添加完整的端到端签名传输示例代码
  - ✅ 详细的参数说明和响应格式
  - ✅ 安全最佳实践和工作流程说明
- 🎉 **真实测试案例更新**
  - ✅ 添加 Base Sepolia 成功测试案例
    - 交易哈希: 0xfbf119aef1e4e451c6009aa4ba0721bb8f81126a3fe0293c69fed75e1549fc79
    - 10 AUDM → 6.49675 USDC
    - Gas 效率: 66% (209,728 / 317,966)
  - ✅ 完整的 6 步签名传输流程展示
  - ✅ 真实的 API 调用示例和响应数据
- 📖 文档结构优化
  - ✅ 将交易签名端点独立成章节
  - ✅ 更清晰的端点编号和分类
  - ✅ 增强的代码示例和注释

### v1.2.0 (2025-11-20)

- 🎉 **数据库 API Key 管理系统** - 重大升级！
  - ✅ 动态添加/删除 API Keys（无需重启服务）
  - ✅ 实时启用/禁用功能
  - ✅ 使用统计和追踪（usage_count, last_used_at）
  - ✅ 自动过期管理（可设置 expiresInDays）
  - ✅ 完整的管理 API（6个端点）
  - ✅ Admin Key 认证保护
  - ✅ 数据库不可用时自动回退到环境变量
- 📚 更新 API 文档，添加完整的管理端点说明
- 🔒 安全增强：管理功能仅限管理员访问

### v1.1.0 (2025-11-20)

- ✅ **修复Router接口** - 使用正确的`originSwap`签名（path数组）
- ✅ 修复Token decimals处理（分别使用tokenIn和tokenOut的decimals）
- ✅ 验证Swap功能完全正常工作
- ✅ 添加成功案例和故障排除文档
- 测试交易: [0x2b8496b6...](https://sepolia.arbiscan.io/tx/0x2b8496b6135f4f4bfb8e16fb5712bb2b1b059a897c4466e1f99d09239b0a114d)

### v1.0.0 (2025-11-19)

- 初始版本发布
- 支持Base Sepolia和Arbitrum Sepolia测试网
- 提供池子查询、Swap预览、流动性管理、授权管理、Oracle价格等功能
- 实现API Key认证和速率限制

---

**最后更新**: 2025年11月20日
**版本**: 1.3.0
