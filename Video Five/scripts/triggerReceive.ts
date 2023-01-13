import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config()

async function main() {
  const Contract = await ethers.getContractFactory("Caller");
  const contract = Contract.attach("0x6d47Da165e8bbf02Cf207F97149772D1c852EA14");

  //To call function from a different address
  // Connect to the project network
  let provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL)

  // Load the wallet to deploy the contract with
  let wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY_TWO}`, provider);

  // console.log(await provider.getBalance(wallet.address));
  
  const result =  await contract.connect(wallet).callReceiveUsingCall({value: 100000000000000})
  
  await result.wait();

  console.log("Result: ", result);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});