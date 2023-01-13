// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract WithdrawPattern {
   address public richest;
   uint public mostSent;

   mapping (address => uint) pendingWithdrawals;

   constructor() payable {
      richest = msg.sender;
      mostSent = msg.value;
   }
   function becomeRichestSafe() public payable returns (bool) {
      if (msg.value > mostSent) {
         pendingWithdrawals[richest] += msg.value;
         richest = msg.sender;
         mostSent = msg.value;
         return true;
      } else {
         return false;
      }
   }
   function withdraw() public {
      uint amount = pendingWithdrawals[msg.sender];
      pendingWithdrawals[msg.sender] = 0;
      payable(msg.sender).transfer(amount);
   }
}

// contract ContractB {
//    fallback() external payable {}
//    receive() external payable {}
// }