// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./UnsafeWithdrawals.sol";
import "./WithdrawPattern.sol";

contract ContractA {

   function callMethodUnsafe(address _contract) public payable {
      UnsafeWithdrawals(_contract).becomeRichestUnsafe();
   }

   function callMethodSafe(address _contract) public payable {
      WithdrawPattern(_contract).becomeRichestSafe();
   }
}