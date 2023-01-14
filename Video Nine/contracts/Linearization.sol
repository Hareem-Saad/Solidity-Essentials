// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./Test.sol";
import "./Test2.sol";

contract Linearization is Test, Test2 {

    //Derived contract must override function "getNum". Two or more base classes define function with same name and parameter types.
    function getNum() public pure override(Test, Test2) returns (uint) {
        return 8;
    }

    function getNumTest() public pure returns (uint) {
        return Test.getNum();
    }
}