import { ethers } from "hardhat";
import { School, School__factory } from "../typechain-types";

async function main() {
  let provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)

  // Load the wallet to deploy the contract with
  let school = new ethers.Wallet(`${process.env.FIRST_PRIVATE_KEY}`, provider);
  let teacher = new ethers.Wallet(`${process.env.SECOND_PRIVATE_KEY}`, provider);
  let student = new ethers.Wallet(`${process.env.THIRD_PRIVATE_KEY}`, provider);

  const price = ethers.utils.parseEther("0.5");

  const Contract:School__factory = await ethers.getContractFactory("School");
  const contract:School = await Contract.deploy();

  await contract.deployed();

  const CertificateContract = await ethers.getContractFactory("Certificate");
  const certificateContract = CertificateContract.attach(await contract.certificateContract())

  const CourseNftContract = await ethers.getContractFactory("CourseNFT");
  const courseNftContract = CourseNftContract.attach(await contract.cnft())

  console.log(`School/ERC20 contract: ${contract.address}\nCertificate contract address: ${certificateContract.address}\nCourseNFT contract address: ${courseNftContract.address}`);

  console.log(`School assigns ${teacher.address} as teacher`);
  await (await contract.addTeacher(teacher.address)).wait();

  console.log(`Teacher creates course`);
  await (await contract.connect(teacher).createCourse("ICS", teacher.address, 50, 10)).wait()

  console.log(`Teacher gets course nft with id: ${await courseNftContract.connect(teacher).tokenURI(1)}`);
  
  console.log(`Student buys 50 tokens`);
  await (await contract.connect(student).mint("50", { value: price })).wait();

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
