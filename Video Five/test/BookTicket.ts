import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookTicket", function () {
  async function deployTicketContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, acc1, acc2, acc3, acc4, acc5, acc6] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("BookTicket");
    const contract = await Contract.deploy();

    const basicPrice = await contract.basicPrice();
    const silverPrice = await contract.silverPrice();
    const goldPrice = await contract.goldPrice();

    return { contract, owner, acc1, acc2, acc3, acc4, acc5, acc6, basicPrice, silverPrice, goldPrice };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployTicketContract);

      expect(await contract.contractOwner()).to.equal(owner.address);
    });
  });

  describe("User Functionality", function () {
    describe("Buying", function () {
      it("Should revert when user buys zero tickets", async function () {
        const { contract, acc1 } = await loadFixture(deployTicketContract);

        await expect(contract.connect(acc1).buyBasicTicket(0, { value: 0 })).to.be.revertedWith(
          "cannot buy 0 tickets"
        );
      });

      it("Should revert with the right error if amount is not equal to price * amount", async function () {
        const { contract, acc1, basicPrice } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.connect(acc1).buyBasicTicket(2, { value: basicPrice })).to.be.revertedWith(
          "wrong amount"
        );
      });

      it("Should assign the n amount of tickets asked if msg.value is correct", async function () {
        const { contract, acc1, basicPrice } = await loadFixture(
          deployTicketContract
        );

        const price = (basicPrice.toNumber() * 2).toString()

        await expect(contract.connect(acc1).buyBasicTicket(2, { value: price })).to.emit(contract, "ticketBought")
        .withArgs(anyValue, acc1.address, 0);
      });
    });

    describe("Transfer of tickets", function () {
      it("Should revert if the owner of the ticket is not msg.sender", async function () {
        const { contract, acc1, acc2 } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.connect(acc2).transferTickets(1, acc2.address)).to.be.revertedWith(
          "you are not the owner of the ticket"
        );
      });

      it("Should change the ownership if the owner of the ticket is msg.sender", async function () {
        const { contract, acc1, acc2, basicPrice} = await loadFixture(
          deployTicketContract
        );

        const price = (basicPrice.toNumber() * 2).toString()

        expect(await contract.connect(acc1).buyBasicTicket(2, { value: price }))

        await expect(contract.connect(acc1).transferTickets(1, acc2.address)).not.to.be.reverted

        expect((await contract.tickets(1)).owner).to.equal(acc2.address);
      });
    });
  });

  describe("Owner Functionality", function () {
    describe("Change Price", function () {
      it("Should revert when the owner is not the caller", async function () {
        const { contract, acc1 } = await loadFixture(deployTicketContract);

        await expect(contract.connect(acc1).changeSilverPrice(0)).to.be.revertedWith(
          "not the owner"
        );
      });

      it("Should revert with the right error if amount is greater than gold and lower than basic -- for silver", async function () {
        const { contract } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.changeSilverPrice(0)).to.be.revertedWith(
          "new price should be > bp & < gp"
        );

        await expect(contract.changeSilverPrice(400000000000000)).to.be.revertedWith(
          "new price should be > bp & < gp"
        );
      });

      it("Should revert with the right error if amount is greater than gold or silver -- for basic", async function () {
        const { contract } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.changeBasicPrice(300000000000000)).to.be.revertedWith(
          "new price should be < sp & gp"
        );

        await expect(contract.changeBasicPrice(400000000000000)).to.be.revertedWith(
          "new price should be < sp & gp"
        );
      });

      it("Should revert with the right error if amount is greater than silver and basic -- for gold", async function () {
        const { contract } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.changeGoldPrice(200000000000000)).to.be.revertedWith(
          "new price should be > bp & sp"
        );
      });

      it("Should update the price when price is right -- for gold", async function () {
        const { contract } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.changeGoldPrice(400000000000000)).not.to.be.revertedWith
      });

      it("Should update the price when price is right -- for silver", async function () {
        const { contract } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.changeSilverPrice(250000000000000)).not.to.be.revertedWith
      });

      it("Should update the price when price is right -- for basic", async function () {
        const { contract } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.changeBasicPrice(150000000000000)).not.to.be.revertedWith
      });
    });

    describe("Withdrawals", function () {
      it("Should revert if the owner is not msg.sender", async function () {
        const { contract, acc1, acc2 } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.connect(acc2).withdraw()).to.be.revertedWith(
          "not the owner"
        );
      });

      it("Should withdraw everything if is msg.sender", async function () {
        const { contract, acc1, acc2 } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.withdraw()).not.to.be.reverted

        expect((await ethers.provider.getBalance(contract.address))).to.equal(0);
      });
    });
  });

  describe("Default Functionality", function () {
    describe("Receive / Fallback Function", function () {
      it("Should receive ether", async function () {
        const { contract, acc1 } = await loadFixture(deployTicketContract);

        let tx = {
          to: contract.address,
          // Convert currency unit from ether to wei
          value: ethers.utils.parseEther("1")
        }
        // Send a transaction
        // await acc1.sendTransaction(tx).then((txObj) => {
        //     console.log('txHash', txObj.hash)
        // })

        await acc1.sendTransaction(tx)

        expect(await ethers.provider.getBalance(contract.address)).to.equal(ethers.utils.parseEther("1"));

      });

      it("Should log msg.data when fallback is triggered", async function () {
        const { contract } = await loadFixture(
          deployTicketContract
        );

        await expect(contract.fallback({data: "0x6c6f6c6c7920706f70"})).to.emit(contract, "logMsgData").withArgs("0x6c6f6c6c7920706f70", 0);

      });
    });
  });
});
