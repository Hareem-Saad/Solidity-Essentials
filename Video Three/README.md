# What I did
- Made a basic ticket buying contract on solidity
- Encorporated Structs, Mappings, Enums, Events, Modifiers, Loops etc
- Wrote tests for all functionality
- Connected and Deoplyed to Ganache
- Made scripts for buying/transfering/withdrawing

# Self note: How to connect to ganache
1. Open ganache copy the rpc server link save it to env file as anything (in this case) GANACHE_URL
2. Write this in hardhat.config.ts under networks
        ganache: {
            url: process.env.GANACHE_URL,
            accounts: [`0x${process.env.PRIVATE_KEY_ONE}`],
        },
3. Get private keys from ganache and save it in .env file
4. run ```npx hardhat run scripts/deploy.ts --network ganache``` to deploy/interact

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
