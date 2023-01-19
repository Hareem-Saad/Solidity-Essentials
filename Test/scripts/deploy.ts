import { ethers } from "hardhat";
import { School, School__factory } from "../typechain-types";

async function main() {
  const [school, teacher, student] = await ethers.getSigners();

  const price = ethers.utils.parseEther("1");

  const Contract:School__factory = await ethers.getContractFactory("School");
  const contract:School = await Contract.deploy();

  await contract.deployed();

  const CertificateContract = await ethers.getContractFactory("Certificate");
  const certificateContract = CertificateContract.attach(await contract.certificateContract())

  console.log(`School/ERC20 contract: ${contract.address}\nCertificate contract address: ${certificateContract.address}`);

  console.log(`School assigns ${teacher.address} as teacher`);
  await (await contract.addTeacher(teacher.address)).wait();

  console.log(`Teacher creates course`);
  // await contract.connect(teacher)["create_course(string,address,uint256)"]
  //await (await contract.connect(teacher)["create_course(string,address,uint256)"].call("ICS", teacher.address, "50")).wait()
  await (await contract.connect(teacher).createCourse("ICS", teacher.address, 50, 10)).wait()

  console.log(`Student buys 100 tokens`);
  await (await contract.connect(student).mint("100", { value: price })).wait();

  console.log(`Student buys a course`);
  await (await contract.connect(student).enroll(0)).wait();

  console.log(`Teacher graduates student`);
  await (await contract.connect(teacher).graduate(0, student.address)).wait();

  console.log(`Student get nft on graduating`);
  await certificateContract.connect(student).ownerOf(1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
