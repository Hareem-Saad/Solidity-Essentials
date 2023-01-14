import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Linearization", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLinearization() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("Linearization");
    const contract = await Contract.deploy();

    return { contract, owner, otherAccount };
  }

  describe("Functions", function () {
    it("getNum -- should override the 2 functions and give the output 8", async function () {
      const { contract} = await loadFixture(deployLinearization);

      expect(await contract.getNum()).to.equal(8);
    });

    it("getNumTest -- should return the Test contract's get num function ", async function () {
      const { contract} = await loadFixture(deployLinearization);

      expect(await contract.getNumTest()).to.equal(6);
    });
  });
});
