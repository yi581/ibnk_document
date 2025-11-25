# iBnk Convert 完整操作指南

本指南将带你从零开始，完成一笔完整的代币兑换交易。

**API 基础地址**: `https://api.ibnk.xyz`
**测试网络**: Base Sepolia (chainId: 84532)

---

## 目录

1. [准备工作](#1-准备工作)
2. [创建钱包](#2-创建钱包)
3. [获取测试代币](#3-获取测试代币)
4. [预览兑换](#4-预览兑换)
5. [检查授权](#5-检查授权)
6. [构建交易](#6-构建交易)
7. [本地签名](#7-本地签名)
8. [广播交易](#8-广播交易)
9. [完整代码示例](#9-完整代码示例)

---

## 1. 准备工作

### 1.1 获取 API Key

联系 iBnk 团队获取 API Key，格式如：`sk_prod_xxxxxxxxxx`

### 1.2 安装依赖

```bash
npm install ethers
```

### 1.3 合约地址 (Base Sepolia)

| 名称 | 地址 |
|------|------|
| USDC | `0xB209B4f21a233751EEd1C11747b1f06850fE6ca2` |
| AUDM | `0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3` |
| EURC | `0x1e00beAf9Db905e1098A8224fa21E93b260DB7eC` |
| Router | `0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE` |
| USDC/AUDM Pool | `0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57` |

---

## 2. 创建钱包

### 2.1 使用 Node.js 创建新钱包

```javascript
const { ethers } = require('ethers');

// 创建新钱包
const wallet = ethers.Wallet.createRandom();

console.log('=== 新钱包信息 ===');
console.log('地址:', wallet.address);
console.log('私钥:', wallet.privateKey);
console.log('助记词:', wallet.mnemonic.phrase);

// ⚠️ 重要：请安全保存私钥和助记词！
```

### 2.2 从私钥导入钱包

```javascript
const { ethers } = require('ethers');

const PRIVATE_KEY = '你的私钥';
const RPC_URL = 'https://sepolia.base.org';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log('钱包地址:', wallet.address);
```

### 2.3 获取测试 ETH

访问 Base Sepolia 水龙头获取测试 ETH（用于支付 Gas）：
- https://www.alchemy.com/faucets/base-sepolia
- https://faucet.quicknode.com/base/sepolia

---

## 3. 获取测试代币

### 3.1 使用 Postman

**请求：**
```
POST https://api.ibnk.xyz/api/v1/faucet/build/claim-all
Headers:
  X-API-Key: 你的API_KEY
  Content-Type: application/json

Body:
{
  "chainId": 84532,
  "userAddress": "你的钱包地址"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "to": "0x432a163B26DaB6D5f386d8C4F70032f670686238",
    "data": "0x...",
    "chainId": 84532,
    "gasLimit": "300000"
  }
}
```

### 3.2 使用 Node.js 领取代币

```javascript
const { ethers } = require('ethers');

const API_BASE = 'https://api.ibnk.xyz';
const API_KEY = '你的API_KEY';
const PRIVATE_KEY = '你的私钥';
const RPC_URL = 'https://sepolia.base.org';

async function claimTokens() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // 1. 构建领取交易
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
    console.error('构建交易失败:', result.error);
    return;
  }

  // 2. 发送交易
  const tx = await wallet.sendTransaction({
    to: result.data.to,
    data: result.data.data,
    gasLimit: result.data.gasLimit
  });

  console.log('交易已发送:', tx.hash);

  // 3. 等待确认
  const receipt = await tx.wait();
  console.log('交易已确认，区块:', receipt.blockNumber);
}

claimTokens();
```

---

## 4. 预览兑换

在执行兑换前，先预览获取预期输出金额和推荐的最小输出。

### 4.1 使用 Postman

**请求：**
```
POST https://api.ibnk.xyz/api/v1/convert/preview
Headers:
  X-API-Key: 你的API_KEY
  Content-Type: application/json

Body:
{
  "chainId": 84532,
  "poolAddress": "0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57",
  "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
  "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
  "amountIn": "10"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "amountIn": "10",
    "amountOut": "15.475259",
    "tokenIn": {
      "address": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
      "symbol": "USDC",
      "decimals": 6
    },
    "tokenOut": {
      "address": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
      "symbol": "AUDM",
      "decimals": 6
    },
    "exchangeRate": "1.547526",
    "inverseRate": "0.646193",
    "fee": "0.05%",
    "recommendedMinAmountOut": "15.467521"
  }
}
```

### 4.2 使用 curl

```bash
curl -X POST "https://api.ibnk.xyz/api/v1/convert/preview" \
  -H "X-API-Key: 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "poolAddress": "0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57",
    "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
    "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
    "amountIn": "10"
  }'
```

---

## 5. 检查授权

在兑换前，需要授权 Router 合约使用你的代币。

### 5.1 检查当前授权状态

**Postman 请求：**
```
POST https://api.ibnk.xyz/api/v1/approval/check
Headers:
  X-API-Key: 你的API_KEY
  Content-Type: application/json

Body:
{
  "chainId": 84532,
  "tokenAddress": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
  "ownerAddress": "你的钱包地址",
  "spenderAddress": "0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE",
  "requiredAmount": "10"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "needsApproval": true,
    "currentAllowance": "0",
    "requiredAmount": "10"
  }
}
```

### 5.2 构建授权交易（如果需要）

**Postman 请求：**
```
POST https://api.ibnk.xyz/api/v1/approval/build
Headers:
  X-API-Key: 你的API_KEY
  Content-Type: application/json

Body:
{
  "chainId": 84532,
  "tokenAddress": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
  "spenderAddress": "0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE",
  "amount": "1000000",
  "isUnlimited": true
}
```

### 5.3 使用 Node.js 处理授权

```javascript
async function handleApproval(wallet, tokenAddress, amount) {
  // 检查授权
  const checkRes = await fetch(`${API_BASE}/api/v1/approval/check`, {
    method: 'POST',
    headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chainId: 84532,
      tokenAddress: tokenAddress,
      ownerAddress: wallet.address,
      spenderAddress: '0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE',
      requiredAmount: amount
    })
  });

  const checkData = await checkRes.json();

  if (checkData.data.needsApproval) {
    console.log('需要授权，构建授权交易...');

    // 构建授权交易
    const buildRes = await fetch(`${API_BASE}/api/v1/approval/build`, {
      method: 'POST',
      headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chainId: 84532,
        tokenAddress: tokenAddress,
        spenderAddress: '0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE',
        amount: amount,
        isUnlimited: true
      })
    });

    const buildData = await buildRes.json();

    // 发送授权交易
    const tx = await wallet.sendTransaction({
      to: buildData.data.transaction.to,
      data: buildData.data.transaction.data,
      gasLimit: buildData.data.transaction.gasLimit
    });

    console.log('授权交易已发送:', tx.hash);
    await tx.wait();
    console.log('授权完成!');
  } else {
    console.log('已有足够授权');
  }
}
```

---

## 6. 构建交易

### 6.1 使用 Postman 构建 Convert 交易

**请求：**
```
POST https://api.ibnk.xyz/api/v1/transaction/build/convert
Headers:
  X-API-Key: 你的API_KEY
  Content-Type: application/json

Body:
{
  "chainId": 84532,
  "userAddress": "你的钱包地址",
  "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
  "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3",
  "amountIn": "10",
  "minAmountOut": "15.467521"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "to": "0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE",
    "data": "0x...",
    "value": "0",
    "chainId": 84532,
    "gasLimit": "254664",
    "maxFeePerGas": "1500000007",
    "maxPriorityFeePerGas": "1500000000"
  }
}
```

---

## 7. 本地签名

**重要**: 私钥永远不会发送到 API，签名在本地完成。

### 7.1 使用 Node.js 签名

```javascript
async function signTransaction(wallet, txData) {
  const provider = wallet.provider;

  // 获取当前 nonce
  const nonce = await provider.getTransactionCount(wallet.address);

  // 构建完整交易对象
  const transaction = {
    to: txData.to,
    data: txData.data,
    value: txData.value || '0',
    gasLimit: txData.gasLimit,
    maxFeePerGas: txData.maxFeePerGas,
    maxPriorityFeePerGas: txData.maxPriorityFeePerGas,
    nonce: nonce,
    chainId: 84532,
    type: 2  // EIP-1559 交易
  };

  // 本地签名
  const signedTx = await wallet.signTransaction(transaction);

  console.log('签名完成，签名交易:', signedTx);
  return signedTx;
}
```

---

## 8. 广播交易

### 8.1 使用 Postman 广播

**请求：**
```
POST https://api.ibnk.xyz/api/v1/transaction/broadcast/convert
Headers:
  X-API-Key: 你的API_KEY
  Content-Type: application/json

Body:
{
  "chainId": 84532,
  "signedTransaction": "0x已签名的交易数据...",
  "expectedAmountOut": "15.475259",
  "amountIn": "10",
  "tokenIn": "0xB209B4f21a233751EEd1C11747b1f06850fE6ca2",
  "tokenOut": "0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x...",
    "status": "success",
    "blockNumber": 34137446,
    "gasUsed": "212220",
    "convert": {
      "amountIn": "10",
      "expectedAmountOut": "15.475259",
      "actualAmountOut": "15.475646",
      "oracleAmountOut": "15.483000",
      "fee": {
        "rate": "0.05%",
        "amount": "0.007742"
      },
      "slippage": "-0.0025%",
      "executedRate": "1.547565",
      "oracleRate": "1.548300"
    }
  }
}
```

### 8.2 响应字段说明

| 字段 | 说明 |
|------|------|
| `actualAmountOut` | 实际收到的代币数量 |
| `oracleAmountOut` | 基于 Oracle 价格的理论输出 |
| `fee.rate` | 手续费率 (0.05%) |
| `fee.amount` | 手续费金额 |
| `slippage` | 纯市场滑点（负数表示获得比 Oracle 价格更好的汇率） |

---

## 9. 完整代码示例

```javascript
const { ethers } = require('ethers');

// ========== 配置 ==========
const API_BASE = 'https://api.ibnk.xyz';
const API_KEY = '你的API_KEY';
const PRIVATE_KEY = '你的私钥';
const RPC_URL = 'https://sepolia.base.org';
const CHAIN_ID = 84532;

// 代币地址
const USDC = '0xB209B4f21a233751EEd1C11747b1f06850fE6ca2';
const AUDM = '0xb5dC8d3fcFd2277f2C6ae87e766732c00A7EfbF3';
const POOL = '0xEd1FAF5Ed63dA5b47CBc44f7696E701cb613bB57';
const ROUTER = '0x9647B25aFf27F1c36f77dFec2560a8696B59dbdE';

// ========== API 辅助函数 ==========
async function api(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(API_BASE + endpoint, options);
  return response.json();
}

// ========== 主流程 ==========
async function main() {
  // 1. 初始化钱包
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('钱包地址:', wallet.address);

  // 2. 检查余额
  const ethBalance = await provider.getBalance(wallet.address);
  console.log('ETH 余额:', ethers.formatEther(ethBalance));

  // 3. 预览兑换
  console.log('\n--- 步骤 1: 预览兑换 ---');
  const preview = await api('/api/v1/convert/preview', 'POST', {
    chainId: CHAIN_ID,
    poolAddress: POOL,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: '10'
  });

  if (!preview.success) {
    console.error('预览失败:', preview.error);
    return;
  }

  console.log('预期获得:', preview.data.amountOut, 'AUDM');
  console.log('汇率:', preview.data.exchangeRate);
  console.log('推荐最小输出:', preview.data.recommendedMinAmountOut);

  // 4. 检查授权
  console.log('\n--- 步骤 2: 检查授权 ---');
  const approval = await api('/api/v1/approval/check', 'POST', {
    chainId: CHAIN_ID,
    tokenAddress: USDC,
    ownerAddress: wallet.address,
    spenderAddress: ROUTER,
    requiredAmount: '10'
  });

  if (approval.data.needsApproval) {
    console.log('需要授权，构建授权交易...');

    const approveRes = await api('/api/v1/approval/build', 'POST', {
      chainId: CHAIN_ID,
      tokenAddress: USDC,
      spenderAddress: ROUTER,
      amount: '1000000',
      isUnlimited: true
    });

    const approveTx = await wallet.sendTransaction({
      to: approveRes.data.transaction.to,
      data: approveRes.data.transaction.data,
      gasLimit: approveRes.data.transaction.gasLimit
    });

    console.log('授权交易:', approveTx.hash);
    await approveTx.wait();
    console.log('授权完成!');
  } else {
    console.log('已有授权');
  }

  // 5. 构建交易
  console.log('\n--- 步骤 3: 构建交易 ---');
  const buildRes = await api('/api/v1/transaction/build/convert', 'POST', {
    chainId: CHAIN_ID,
    userAddress: wallet.address,
    tokenIn: USDC,
    tokenOut: AUDM,
    amountIn: '10',
    minAmountOut: preview.data.recommendedMinAmountOut
  });

  if (!buildRes.success) {
    console.error('构建失败:', buildRes.error);
    return;
  }

  console.log('交易数据已构建');

  // 6. 本地签名
  console.log('\n--- 步骤 4: 本地签名 ---');
  const nonce = await provider.getTransactionCount(wallet.address);
  const signedTx = await wallet.signTransaction({
    to: buildRes.data.to,
    data: buildRes.data.data,
    value: buildRes.data.value || '0',
    gasLimit: buildRes.data.gasLimit,
    maxFeePerGas: buildRes.data.maxFeePerGas,
    maxPriorityFeePerGas: buildRes.data.maxPriorityFeePerGas,
    nonce: nonce,
    chainId: CHAIN_ID,
    type: 2
  });

  console.log('签名完成');

  // 7. 广播交易
  console.log('\n--- 步骤 5: 广播交易 ---');
  const broadcastRes = await api('/api/v1/transaction/broadcast/convert', 'POST', {
    chainId: CHAIN_ID,
    signedTransaction: signedTx,
    expectedAmountOut: preview.data.amountOut,
    amountIn: '10',
    tokenIn: USDC,
    tokenOut: AUDM
  });

  // 8. 显示结果
  console.log('\n========== 交易结果 ==========');
  console.log(JSON.stringify(broadcastRes, null, 2));

  if (broadcastRes.success) {
    const c = broadcastRes.data.convert;
    console.log('\n--- 交易摘要 ---');
    console.log('交易哈希:', broadcastRes.data.transactionHash);
    console.log('输入:', c.amountIn, 'USDC');
    console.log('实际获得:', c.actualAmountOut, 'AUDM');
    console.log('手续费:', c.fee.rate, '(', c.fee.amount, 'AUDM)');
    console.log('市场滑点:', c.slippage);
  }
}

main().catch(console.error);
```

---

## 常见问题

### Q: 为什么滑点是负数？
**A:** 负数滑点表示你获得的汇率比 Oracle 报价更好，这是有利的情况。

### Q: 如何选择 minAmountOut？
**A:** 使用预览 API 返回的 `recommendedMinAmountOut`，它已包含 0.05% 的容忍度。

### Q: 交易失败怎么办？
**A:** 检查：
1. ETH 余额是否足够支付 Gas
2. 代币余额是否足够
3. 授权是否完成
4. Oracle 价格是否过期

---

*文档版本: 2.1.1 | 更新日期: 2025-11-25*
