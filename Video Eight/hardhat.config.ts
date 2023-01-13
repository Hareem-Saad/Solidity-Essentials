import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-gas-reporter'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import dotenv from "dotenv";
dotenv.config()


const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
    },
    ganache: {
      url: process.env.GANACHE_URL,
      accounts: [`0x${process.env.PRIVATE_KEY_ONE}`],
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.GOERLI_PRIVATE_KEY}`],
    },
  },
}


export default config