// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Age {
    uint public _age = 9;
    event ageChange (uint num, address caller);

    function setAge(uint __age) public {
        _age = __age;
        emit ageChange(__age, msg.sender);
    }
}