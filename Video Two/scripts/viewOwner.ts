import { ethers } from "hardhat";
import { Lock, Lock__factory } from "../typechain-types";

async function main() {
  const Lock:Lock__factory = await ethers.getContractFactory("Lock");
  const lock:Lock = await Lock.attach("0xc797E6385cc37c1F8895f1bF589BF2ec9541EeFD");

  console.log("address: ", lock.address);

  const result =  await lock.owner()
  
  console.log("Result: ", result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
