import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe ("Caller", function () {
  async function deployContracts() {
    const [owner, acc1, acc2] = await ethers.getSigners();

    const ContractTicket = await ethers.getContractFactory("BookTicket");
    const contractTicket = await ContractTicket.deploy();

    const ContractCaller = await ethers.getContractFactory("Caller");
    const contractCaller = await ContractCaller.deploy(contractTicket.address);

    const ContractConstant = await ethers.getContractFactory("Constant");
    const contractConstant = await ContractConstant.deploy();

    const basicPrice = await contractTicket.basicPrice();
    const silverPrice = await contractTicket.silverPrice();
    const goldPrice = await contractTicket.goldPrice();

    return { contractTicket, owner, acc1, acc2, basicPrice, silverPrice, goldPrice, contractCaller, contractConstant };
  }

  describe("Functions", function () {

    it("Should trigger book ticket's fallback", async function () {
      const { contractCaller, owner , contractTicket} = await loadFixture(deployContracts);

      expect(await contractCaller.callFallbackUsingSignature()).to.emit(contractTicket, "logMsgData").withArgs("0xf85396d7", 0);

    });

    it("Should trigger book ticket's fallback", async function () {
      const { contractCaller, owner , contractTicket, contractConstant} = await loadFixture(deployContracts);

      expect(await contractCaller.callFallbackUsingSelector(contractConstant.address)).to.emit(contractTicket, "logMsgData").withArgs("0x4e70b1dc0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4", 0);

    });

    it("Should trigger book ticket's receive", async function () {
      const { contractCaller, owner , contractTicket} = await loadFixture(deployContracts);

      expect(await contractCaller.callReceiveUsingCall({value: 3})).to.emit(contractTicket, "logAmount").withArgs(3);

    });
  });
});