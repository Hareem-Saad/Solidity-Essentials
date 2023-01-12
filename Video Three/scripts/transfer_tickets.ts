import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("BookTicket");
  const contract = Contract.attach("0x9fF0486c577492ff3A09bCE09ee1D6A5842E397C");

  //To call function from a different address
  // Connect to the project network
  let provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL)

  // Load the wallet to deploy the contract with
  let wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY_TWO}`, provider);

  const to = '0x6A2aA4Cd187C5A45c7c7c04b5c238bbE39E4060d'

  // console.log(await provider.getBalance(wallet.address));
  
  const result =  await contract.connect(wallet).transferTickets(0, to);

  //check if change in ownership was successful
  console.log((await contract.connect(wallet).tickets(0)).owner === to);
  
  await result.wait();

  console.log("Result: ", result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});