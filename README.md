# MOAR: Multi-platform Open-source Application Registry

![Moar Screenshot](https://ipfs.io/ipfs/QmR26mHPn89GfJypntFx7kLHPofyu7PPTBvCa4JxF5njmS)

## Overview

Moar is a desktop application that enables users to install decentralized application interfaces across various blockchains. 

## Usage

1. [Install IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/)
1. [Download and run Moar](https://gitopia.com/Moar/moar-desktop/releases) from the latest releases.

After launching the app for the first time it will take a few minutes for interfaces to download. You will likely be asked for administrative access twice after launching, this is to setup custom moar domains.

## Key Components

### DAO (Decentralized Autonomous Organization)
To prevent spam, low quality dapps and phishing, Moar uses a DAO to approve new dapps or updates, ensuring that the power to shape the platform lies with the users and contributors.

Currently this is in [a separate repository](https://gitopia.com/Moar/dapp-registry).

### Local Domain Resolver
Moar implements a custom DNS resolver specifically designed to handle Moar domains, thereby providing a reliable method for name resolution within the Moar network. Domains are managed by the DAO and do not expire. 

### InterPlanetary File System (IPFS)

IPFS is used for serving the assets of dapps, ensuring data remains distributed and easily accessible. Dapp updates are included in a governance proposal to the DAO with the CID of the new dapp interface. 

Dapp submissions and updates are charged a fee that is distributed to DAO participants (stakers). This fee helps reduce spam, and generates revenue for maintaining the store.

When a dapp is installed it will be pinned to the users local IPFS node, ensuring it’s always online and can be installed by other users. 

## Context

In 2015, the Ethereum dapps were accessed via a separate web browser called [Mist](https://github.com/ethereum/mist), which provided support for decentralized hosting through IPFS/Swarm, decentralized DNS via Ethereum Name Service (ENS), and a built-in Ethereum wallet. However, due to challenges in maintaining pace with Chromium's security fixes, Mist was deprecated in 2019.

## Implementation
To prioritize user security and choice, Moar takes a different approach. Rather than building on top of Chromium, Moar starts a local web server, giving users the freedom to use their preferred browser. This approach ensures the application remains secure, flexible, and adaptable to users' preferences.

## Development

After cloning this repository run the following commands:

```sh
npm install
npm run electron-dev
```

## License 

GPLv3

## Disclaimer 

MOAR DAO DOES NOT CONTROL, ENDORSE OR ACCEPT RESPONSIBILITY FOR ANY MATERIALS OR SERVICES OFFERED BY THIRD PARTIES ACCESSIBLE THROUGH MOAR. MOAR DAO MAKES NO REPRESENTATIONS OR WARRANTIES WHATSOEVER ABOUT, AND SHALL NOT BE LIABLE FOR, ANY SUCH THIRD PARTIES, THEIR MATERIALS OR SERVICES. ANY DEALINGS THAT YOU MAY HAVE WITH SUCH THIRD PARTIES ARE AT YOUR OWN RISK.