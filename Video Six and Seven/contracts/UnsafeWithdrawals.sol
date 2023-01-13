// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract UnsafeWithdrawals {
   address payable public richest;
   uint public mostSent;

   constructor() payable {
      richest = payable(msg.sender);
      mostSent = msg.value;
   }
   function becomeRichestUnsafe() public payable returns (bool) {
      if (msg.value > mostSent) {
         // Insecure practice
         richest.transfer(msg.value);
         richest = payable(msg.sender);
         mostSent = msg.value;
         return true;
      } else {
         return false;
      }
   }
}

// contract ContractB {
//    fallback() external payable {}
//    receive() external payable {}
// }