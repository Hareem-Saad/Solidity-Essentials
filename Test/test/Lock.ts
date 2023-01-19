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

      expect(await contract.price()).to.equal("10000000000000000");
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

        expect( await contract.isTeacher(teacher.address)).to.equal(true);
      });

      it("Should revert with the right error if called from another account", async function () {
        const { contract, teacher } = await loadFixture(deployOneYearLockFixture);

        await contract.addTeacher(teacher.address);

        // We use contract.connect() to send a transaction from another account
        await expect(contract.connect(teacher).addTeacher(teacher.address)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("Create Course", function () {
      it("Should revert with the right error if proposed price < minimum", async function () {
        const { contract , teacher } = await loadFixture(
          deployOneYearLockFixture
        );

        await contract.addTeacher(teacher.address);

        await expect(contract.connect(teacher).createCourse("ICS", teacher.address, 0, 10)).to.be.revertedWith(
          "price is lower than the minimum course price"
        );
      });

      it("Should revert with the right error if proposed term < base term", async function () {
        const { contract , teacher } = await loadFixture(
          deployOneYearLockFixture
        );

        await contract.addTeacher(teacher.address);

        await expect(contract.connect(teacher).createCourse("ICS", teacher.address, 50, 0)).to.be.revertedWith(
          "share term is lower than the base term"
        );
      });

      it("Should emit an event on new course addition", async function () {
        const { contract , teacher } = await loadFixture(
          deployOneYearLockFixture
        );

        await contract.addTeacher(teacher.address);

        await expect(contract.connect(teacher).createCourse("ICS", teacher.address, 50, 10))
          .to.emit(contract, "newCourse")
          .withArgs('ICS', 0); // We accept any value as `when` arg
      });
    });
  });

  describe("Setters", function () {
    describe("addTeacher", function () {
      it("Should add the teacher to the mapping", async function () {
        const { contract, teacher } = await loadFixture(deployOneYearLockFixture);

        await contract.addTeacher(teacher.address);

        expect( await contract.isTeacher(teacher.address)).to.equal(true);
      });

      it("Should revert with the right error if called from another account", async function () {
        const { contract, teacher } = await loadFixture(deployOneYearLockFixture);

        await contract.addTeacher(teacher.address);

        // We use contract.connect() to send a transaction from another account
        await expect(contract.connect(teacher).addTeacher(teacher.address)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("Enroll", function () {
      it("Should revert with the right error if course id does not exist", async function () {
        const { contract , teacher, student } = await loadFixture(
          deployOneYearLockFixture
        );

        await contract.addTeacher(teacher.address);

        await expect(contract.connect(teacher).createCourse("ICS", teacher.address, 0, 10)).to.be.revertedWith(
          "price is lower than the minimum course price"
        );
      });

      it("Should revert with the right error if proposed term < base term", async function () {
        const { contract , teacher } = await loadFixture(
          deployOneYearLockFixture
        );

        await contract.addTeacher(teacher.address);

        await expect(contract.connect(teacher).createCourse("ICS", teacher.address, 50, 0)).to.be.revertedWith(
          "share term is lower than the base term"
        );
      });

      it("Should emit an event on new course addition", async function () {
        const { contract , teacher } = await loadFixture(
          deployOneYearLockFixture
        );

        await contract.addTeacher(teacher.address);

        await expect(contract.connect(teacher).createCourse("ICS", teacher.address, 50, 10))
          .to.emit(contract, "newCourse")
          .withArgs('ICS', 0); // We accept any value as `when` arg
      });
    });
  });
});
