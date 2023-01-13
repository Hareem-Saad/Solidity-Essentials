// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ContractA {
   //private state variable
   uint private data;
   
   constructor(uint _data) {
    data = _data;
   }
}

/**
 * if contract inherits a contract which demands input in its constructor
 * Call the constructor along side child's constructor
 * first child contract's constructor will be executed then parent's
 */

contract ContractB is ContractA{
   
   
   constructor(uint _data) ContractA(_data) {

   }
}
