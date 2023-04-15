---
layout: post
title: dapp 智能合约 solidity初使用
date: 2023-04-14 15:10:30 +0300
description: 学习了解dapp（去中心化应用）的开发过程
img: 2023-04-14/dapp.jpg
tags: [dapp, 以太坊, 智能合约, solidity]
---

**本文为网络资料收集与个人理解的产物，不保证正确性。**

接着昨天的区块链，认识一下以太坊。以太坊是一个去中心化的开源的有智能合约功能的公共区块链平台。以太币是以太坊的原生加密货币。截至 2021 年 12 月，以太币是市值第二高的加密货币，仅次于比特币。以太坊是使用最多的区块链。
[点击这里查看以太坊的官方介绍](https://ethereum.org/zh/developers/docs/)

作为使用最多的区块链，有很多的 dapp 构建在其之上，[点击这里查看以太坊对 dapp 的描述](https://ethereum.org/zh/developers/docs/dapps/)。

> dapp 可以用任何语言编写（就像是一个 app）。它有前端代码和用户界面，能调用其后端。 此外，它的前端可以托管在去中心化存储上。

以往的应用一般由：**前端代码和用户界面 + 后端（java/go/nodejs 等）+ 数据库（mysql）** 构成。（暂不考虑前后端不分离）
而 dapp 也很相似：**前端代码和用户界面 + 智能合约 + 区块链**。  
dapp 在前端代码中引入指定的库，传入合约 address 与 ABI（Application Binary Interface），即可与合约进行对话。

> 智能合约是一种在以太坊网络上的计算机程序，它严格按照事先编写的代码来运行。 智能合约一旦部署到以太坊网络中，就无法更改。 Dapps 可以是去中心化的，就是由于它们受智能合约的既定逻辑控制，而不是个人或公司。 这也意味着你需要非常仔细地设计合约，并进行全面测试。[点击这里查看以太坊对智能合约的描述](https://ethereum.org/zh/developers/docs/smart-contracts/)

而智能合约常用 Solidity、Vyper 等语言进行开发。
Solidity 是一种合约导向式语言，被应用于各种不同的区块链平台。[点击此处查看 solidity 官网](https://docs.soliditylang.org/en/v0.8.19/)。
对该语言的学习我是在`cryptozombies`上跟练的，有兴趣的点击[这里](https://cryptozombies.io/zh/course)查看。

在进行该语言的练习时，我感觉到无比的亲切，和 typescript 极为相似。唯一一点不适是，实例化一个结构体时，这种写法反直觉，可能是拿这个和 ts 的 interface 做对比了吧。点击[这里](https://github.com/mmmml-zhao/cryoto-zombues)可以查看对应的代码。

```solidity
  struct Zombie {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
    uint16 winCount;
    uint16 lossCount;
  }

  Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)
```

通过这些天的学习，从区块链，到加密货币，到智能合约，到以太坊，到 dapp。对区块链相关整体有了一定的概念，也大概能理解大佬同事们将要从事的是什么事业，感觉很不错啊。接下来要完成`cryptozombies`平台的课程，看看学习学习一些具体的操作。
