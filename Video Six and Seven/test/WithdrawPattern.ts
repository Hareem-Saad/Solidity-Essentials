import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, acc1, acc2] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("WithdrawPattern");
    const contract = await Contract.deploy();

    const UnsafeContract = await ethers.getContractFactory("UnsafeWithdrawals");
    const unsafeContract = await UnsafeContract.deploy();

    const ContractA = await ethers.getContractFactory("ContractA");
    const contractA = await ContractA.deploy();

    console.log(` WithdrawPattern: ${contract.address} \n UnsafeWithdrawals: ${unsafeContract.address} \n ContractA: ${contractA.address}`);

    return { contract, contractA, owner, acc1, acc2, unsafeContract };
  }

  describe("unsafeContract", function () {
    it("Should block access if a contract without fallback/receive calls it", async function () {
      const { contract, unsafeContract, contractA, acc1} = await loadFixture(deployOneYearLockFixture);

      await contractA.callMethodUnsafe(unsafeContract.address, {value: 500000000000000})
      expect(await unsafeContract.connect(acc1).becomeRichestUnsafe({value: 500000000000000})).to.be.revertedWithoutReason;
    });
  });

  describe("safeContract", function () {
    it("Should not block access if a contract without fallback/receive calls it", async function () {
      const { contract, unsafeContract, contractA, acc1} = await loadFixture(deployOneYearLockFixture);

      await contractA.callMethodSafe(contract.address, {value: 500000000000000})
      expect(await unsafeContract.connect(acc1).becomeRichestUnsafe({value: 500000000000000})).not.to.be.reverted;
    });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
