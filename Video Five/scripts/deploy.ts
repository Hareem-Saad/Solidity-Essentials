import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("BookTicket");
  const contract = await Contract.deploy();

  await contract.deployed();

  const ContractCaller = await ethers.getContractFactory("Caller");
  const contractCaller = await ContractCaller.deploy(contract.address);

  await contractCaller.deployed();

  const ContractConstant = await ethers.getContractFactory("Constant");
  const contractConstant = await ContractConstant.deploy();

  await contractConstant.deployed();

  console.log(`Tickets deployed to ${contract.address} || Caller deployed to ${contractCaller.address} || Constant deployed to ${contractConstant.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
