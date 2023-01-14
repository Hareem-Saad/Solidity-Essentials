import { ethers } from "hardhat";

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("Linearization");
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`function getNum output: ${await contract.getNum()}`);
  console.log(`function getNumTest output: ${await contract.getNumTest()}`);

  console.log(`deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
