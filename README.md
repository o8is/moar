# Moar: A Decentralized Dapp Store

<p align="center">
  <img src="./logo.png" />
</p>

## Overview

Moar is a desktop application that enables users to install decentralized application interfaces across various blockchains. 

## Usage

1. [Install IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/)
1. Install and run Moar: 

After cloning this repository run the follow commands:

```sh
npm install
npm run electron-dev
```

## Key Components

### DAO (Decentralized Autonomous Organization)
To prevent spam, low quality dapps and phishing, Moar uses a DAO to approve new dapps or updates, ensuring that the power to shape the platform lies with the users and contributors.

Currently this is in [a separate repository](https://gitopia.com/Moar/dapp-registry).

### Local Domain Resolver
Moar implements a custom DNS resolver specifically designed to handle Moar domains, thereby providing a reliable method for name resolution within the Moar network. Domains are managed by the DAO and do not expire. 

### InterPlanetary File System (IPFS)

IPFS is used for serving the assets of dapps, ensuring data remains distributed and easily accessible. Dapp updates are included in a governance proposal to the DAO with the CID of the new dapp interface. 

Dapp submissions and updates are charged a fee that’s distributed to DAO participants (stakers). This fee helps reduce spam, and generates revenue for maintaining the store. 

When a dapp is installed it will be pinned to the users local IPFS node, ensuring it’s always online and can be installed by other users. 

## Context

In 2015, the Ethereum dapps were accessed via a separate web browser called [Mist](https://github.com/ethereum/mist), which provided support for decentralized hosting through IPFS/Swarm, decentralized DNS via Ethereum Name Service (ENS), and a built-in Ethereum wallet. However, due to challenges in maintaining pace with Chromium's security fixes, Mist was deprecated in 2019.

## Implementation
To prioritize user security and choice, Moar takes a different approach. Rather than building on top of Chromium, Moar starts a local web server, giving users the freedom to use their preferred browser. This approach ensures the application remains secure, flexible, and adaptable to users' preferences.

## Demo

![](https://publish-01.obsidian.md/access/345d3a51a0287d957b349eed203ad9a4/Images/moar.png)