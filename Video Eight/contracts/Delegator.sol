// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./Age.sol";

contract Delegator {
    //variables in target contract should be same in delegate contract
    uint public _age = 9;
    Age age;

    constructor(address _contract) {
        age = Age(_contract);
    }

    //delegate call preserves context so the msg.sender will be the caller of this function
    //and storage of Age will be used of this contract so age of this contract will be updated
    function callSetAge(uint __age) public {
        (bool success,) = address(age).delegatecall(abi.encodeWithSignature("setAge(uint256)", __age));
        require(success);
    }
}