import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { School, School__factory } from "../typechain-types";

describe("School", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const [school, teacher, student] = await ethers.getSigners();

    const price = ethers.utils.parseEther("1");

    const Contract:School__factory = await ethers.getContractFactory("School");
    const contract:School = await Contract.deploy();

    await contract.deployed();

    const CertificateContract = await ethers.getContractFactory("Certificate");
    const certificateContract = CertificateContract.attach(await contract.certificateContract())

    console.log(`School/ERC20 contract: ${contract.address}\nCertificate contract address: ${certificateContract.address}`);

    return { certificateContract, contract, school, teacher, student, price };
  }

  describe("Deployment", function () {
    it("Should set the right price, tax, student status, owner", async function () {
      const { contract, price, school} = await loadFixture(deployOneYearLockFixture);

      expect(await contract.price()).to.equal(price);
      expect(await contract.tax()).to.equal(3);
      expect(await contract.statusDefault()).to.equal(0);
      expect(await contract.owner()).to.equal(school.address);
    });

    it("Should set the right erc20 token metadata", async function () {
      const { contract } = await loadFixture(deployOneYearLockFixture);

      expect(await contract.name()).to.equal('QTKN');
      expect(await contract.symbol()).to.equal('QTKN');
    });
  });

  describe("Setters", function () {
    describe("addTeacher", function () {
      it("Should add the teacher to the mapping", async function () {
        const { contract, teacher } = await loadFixture(deployOneYearLockFixture);

        await contract.addTeacher(teacher.address);

        await expect(contract.isTeacher()).to.equal(true);
      });

      it("Should revert with the right error if called from another account", async function () {
        const { contract, teacher } = await loadFixture(deployOneYearLockFixture);

        await contract.addTeacher(teacher.address);

        // We use contract.connect() to send a transaction from another account
        await expect(contract.connect(teacher).addTeacher(teacher.address)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { contract, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(contract.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { contract, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(contract.withdraw())
          .to.emit(contract, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { contract, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(contract.withdraw()).to.changeEtherBalances(
          [owner, contract],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
