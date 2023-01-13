import { ethers } from "hardhat";

async function main() {

  const [owner, acc1] = await ethers.getSigners()

  const ContractSafe = await ethers.getContractFactory("WithdrawPattern");
  const contractSafe = await ContractSafe.deploy();

  const UnsafeContract = await ethers.getContractFactory("UnsafeWithdrawals");
  const unsafeContract = await UnsafeContract.deploy();

  const ContractA = await ethers.getContractFactory("ContractA");
  const contractA = await ContractA.deploy();

  await contractA.deployed();
  await unsafeContract.deployed();
  await contractSafe.deployed();

  console.log(` WithdrawPattern: ${contractSafe.address} \n UnsafeWithdrawals: ${unsafeContract.address} \n ContractA: ${contractA.address}`);

  // console.log("contract without fallback/receive calls unsafeContract");
  // await contractA.callMethodUnsafe(unsafeContract.address, {value: 500000000000000});

  // console.log("another user calls contract after contract without fallback/receive calls unsafeContract -- gives error");
  // try {
  //   await unsafeContract.connect(acc1).becomeRichestUnsafe({value: 500000000000000})
  // } catch (error) {
  //   console.log(error);
  // }

  // console.log("contract without fallback/receive calls safeContract");
  // await contractA.callMethodSafe(contractSafe.address, {value: 500000000000000});

  // console.log("another user calls contract after contract without fallback/receive calls safeContract -- does not gives error");
  // try {
  //   await contractSafe.connect(acc1).becomeRichestSafe({value: 500000000000000})
  // } catch (error) {
  //   console.log(error);
  // }


  // console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
