import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-gas-reporter'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import dotenv from "dotenv";
dotenv.config()


const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  // defaultNetwork: "goerli",
  networks: {
    hardhat: {
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.FIRST_PRIVATE_KEY}`],
    },
  },
}

export default config