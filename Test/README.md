# Contracts on goerli
- School/ERC20 contract: 0x51363a255ae0A700AB3CcE4143a5a164D1C1a84a
- Certificate contract address: 0xef6E898ff1425Fd838521E11C74B01cbfb4BAA64
- CourseNFT contract address: 0x2cAF4b35A7F9d81a514d20e8199D6733836E6903

run ```npx hardhat run scripts/deploy.ts``` to run on localhost 
# Q-Solutions-Test

Create following smart contracts:
1. Create a contract (ERC20) named QTKN to pay for registration and distribute the funds as
mentioned in course terms.
2. Create a school smart contract which allow teacher to create a course and assigned himself or
another teacher. School will set its own base term for example 90/10. Teacher can't set the
terms minimum to base term set by school. The base term can be changed by Owner.
Teacher should be able to write the sharing terms with school and himself (for example 80/20 or
60/40). School will charge 3% tax apart of terms set by teacher. Teacher will provide the base
price of course. Course price will be calculated after adding terms and 3% tax.
For e.g. BasePrice+Tax+SchoolShare = Course Price.
3. Student will buy QTKN in order to register in the course. Once student complete the course. The
certificate (NFT) will be minted and transferred to student.
1 ETH = 100 QTKN.
Deliverable:
- Code repository should be available on Github.
- Code should be publish on surge.

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
