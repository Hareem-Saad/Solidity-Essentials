# Hardhat Commands

    npm init


To initialise npm



      npm install --save-dev hardhat


Install hardhat



     npx hardhat


     npm install --save-dev "hardhat@^2.12.5" "@nomicfoundation/hardhat-toolbox@^2.0.0"

 
Create hardhat file and download libraries



    npx hardhat compile


Compile the contracts



      npx hardhat test --network hardhat
      npx hardhat test


Run test script


    npx hardhat run scripts/deploy.js


Run deploy.js this will return you the address of the deployed contract



    npx hardhat node


On another terminal run this code to produce a local blockchain giving you 10 accounts.
Use ^C or Ctrl+C to exit blockchain.

     npx hardhat run scripts/deploy.js --network localhost

Going back to the previous terminal, running this will deploy the contract and give the details on the npx hardhat node terminal.

    npm i dotenv


To install .env functionality


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
