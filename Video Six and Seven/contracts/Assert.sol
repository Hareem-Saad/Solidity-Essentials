// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * assert is used to verufy you function's actions like to check the state variables after updation
 */
contract ContractA {
    uint public x = 9;

    function changeNum(uint _x) public {
        x = _x;
        assert (x == _x);
    }
}
