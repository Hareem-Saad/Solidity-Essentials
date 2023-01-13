import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Callers", function () {
  async function deployCallers() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();

    const ContractAge = await ethers.getContractFactory("Age");
    const contractAge = await ContractAge.deploy();

    const ContractCaller = await ethers.getContractFactory("Caller");
    const contractCaller = await ContractCaller.deploy(contractAge.address);

    const ContractDelegator = await ethers.getContractFactory("Delegator");
    const contractDelegator = await ContractDelegator.deploy(contractAge.address);

    const ContractStaticCaller = await ethers.getContractFactory("StaticCaller");
    const contractStaticCaller = await ContractStaticCaller.deploy(contractAge.address);

    console.log(`contractAge: ${contractAge.address} \ncontractDelegator: ${contractDelegator.address} \ncontractCaller: ${contractCaller.address} \ncontractStaticCaller: ${contractStaticCaller.address} \nowner: ${owner.address}`);

    return { contractStaticCaller, owner, contractDelegator, contractCaller, contractAge};
  }

  describe("Caller", function () {

    it("Should set the variable in age contract", async function () {
      const { contractAge, contractCaller } = await loadFixture(deployCallers);

      await contractCaller.callSetAge(7)

      expect(await contractAge._age()).to.equal(7);
    });
  });

  describe("Delegator", function () {

    it("Should set the variavle in delegator contract", async function () {
      const { contractAge, contractDelegator } = await loadFixture(deployCallers);

      await contractDelegator.callSetAge(8)

      expect(await contractAge._age()).not.to.equal(7);
      expect(await contractDelegator._age()).to.equal(8);
    });
  });

  describe("StaticCaller", function () {

    it("callSetAge should revert as it is not a view function", async function () {
      const { contractAge, contractStaticCaller } = await loadFixture(deployCallers);


      expect(contractStaticCaller.callSetAge(7)).to.be.revertedWithoutReason
    });

    it("callAge should not revert as it is a view function", async function () {
      const { contractAge, contractStaticCaller } = await loadFixture(deployCallers);


      expect(contractStaticCaller.callAge()).not.to.be.revertedWithoutReason
    });
  });
  
});
