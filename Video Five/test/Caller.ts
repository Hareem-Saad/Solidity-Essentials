import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe ("Caller", function () {
  async function deployTicketContract() {
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

  describe("Deployment", function () {

    it("Should trigger book ticket's fallback", async function () {
      const { contractCaller, owner , contractTicket} = await loadFixture(deployTicketContract);

      // expect(await contractCaller.callFallbackUsingSignature()).to.emit(contractTicket, "logMsgData").withArgs("0x6c6f6c6c7920706f70", 0);

      const tsx = await contractCaller.callFallbackUsingSignature()
      console.log((await tsx.wait()).events?.filter((x) => {return x.event == "logMsgData"}));
    });
  });
});



/**
 * const [owner, acc1, acc2] = await ethers.getSigners();

    const ContractTicket = await ethers.getContractFactory("BookTicket");
    const contractTicket = await ContractTicket.deploy();

    const ContractCaller = await ethers.getContractFactory("Caller");
    const contractCaller = await ContractCaller.deploy();

    const ContractConstant = await ethers.getContractFactory("Constant");
    const contractConstant = await ContractConstant.deploy();

    const basicPrice = await contract.basicPrice();
    const silverPrice = await contract.silverPrice();
    const goldPrice = await contract.goldPrice();

    return { contractTicket, owner, acc1, acc2, basicPrice, silverPrice, goldPrice, contractCaller, contractConstant };
 */