import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { School, School__factory } from "../typechain-types";
import { BigNumber} from "ethers";

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
    
    const CourseNftContract = await ethers.getContractFactory("CourseNFT");
    const courseNftContract = CourseNftContract.attach(await contract.cnft())
  
    console.log(`School/ERC20 contract: ${contract.address}\nCertificate contract address: ${certificateContract.address}\nCourseNFT contract address: ${courseNftContract.address}`);
    return { certificateContract, contract, school, teacher, student, price, courseNftContract };
  }

  async function CourseCreated() {
    const { certificateContract, contract, school, teacher, student, price, courseNftContract } = await loadFixture(
      deployOneYearLockFixture
    );

    await contract.addTeacher(teacher.address);

    await contract.connect(teacher).createCourse("ICS", teacher.address, 50, 10)

    return { certificateContract, contract, school, teacher, student, price, courseNftContract };
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

    it("Teacher should get an nft upon course creation", async function () {
      const { contract , teacher, courseNftContract} = await loadFixture(
        deployOneYearLockFixture
      );

      await contract.addTeacher(teacher.address);

      await contract.connect(teacher).createCourse("ICS", teacher.address, 50, 10);

      expect( await courseNftContract.ownerOf(1)).to.equal(teacher.address)
    });
  });

  describe("Enroll", function () {
    it("Should revert with the right error if course id does not exist", async function () {
      const { contract , teacher, student } = await loadFixture(CourseCreated);


      await expect(contract.connect(student).enroll(4)).to.be.revertedWith(
        "course id does not exist"
      );
    });

    it("Should revert with the right error if student doesn't have tokens to pay for the course", async function () {
      const { contract , student } = await loadFixture(CourseCreated);

      // console.log(await contract.viewPrice(0));

      await expect(contract.connect(student).enroll(0)).to.be.revertedWith(
        "not enough tokens"
      );
    });

    it("Should calculate the course price correctly", async function () {
      const { contract , student, price } = await loadFixture(CourseCreated);

      await contract.connect(student).mint(100, {value: price})

      const base = Number((((await contract.courses(0)).basePrice).toString()).slice(0, -18))
      const tax = (await contract.tax())
      const share = ((await contract.courses(0)).shareTerm).toNumber()
      // console.log(base , " ", tax, " ", share);
      const cPrice = base + (base * tax / 100) + (base * share / 100)
      // console.log(cPrice);

      expect(await contract.viewPrice(0)).to.equal((ethers.utils.parseEther(cPrice.toFixed(18))).toString());
    });

    it("Should transfer the base price to the teacher", async function () {
      const { contract , student, price, teacher } = await loadFixture(CourseCreated);

      await contract.connect(student).mint(100, {value: price})

      await (await contract.connect(student).enroll(0)).wait()

      expect(await contract.balanceOf(teacher.address)).to.equal((await contract.courses(0)).basePrice)
    });

    it("Should transfer the tax and share price to the school", async function () {
      const { contract , student, price, teacher, school } = await loadFixture(CourseCreated);

      await contract.connect(student).mint(100, {value: price})

      await (await contract.connect(student).enroll(0)).wait()

      expect(await contract.balanceOf(school.address)).to.equal(subBigNumbers((await contract.courses(0)).coursePrice, (await contract.courses(0)).basePrice ))
    });
  });
});


function subBigNumbers(a: BigNumber, b: BigNumber): BigNumber {
  if (a == null || a.isZero() || b == null || b.isZero()) {
      return BigNumber.from(0);
  }

  const aFloat = parseFloat(ethers.utils.formatEther(a));
  const bFloat = parseFloat(ethers.utils.formatEther(b));

  if (isNaN(aFloat) || isNaN(bFloat)) {
      return BigNumber.from(0);
  }

  const resultFloat = aFloat - bFloat;

  return ethers.utils.parseEther(resultFloat.toFixed(18));
}