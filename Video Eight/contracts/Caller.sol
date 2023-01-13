// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./Age.sol";

contract Caller {
    Age age;

    constructor(address _contract) {
        age = Age(_contract);
    }

    function callSetAge(uint _age) public {
        (bool success,) = address(age).call(abi.encodeWithSignature("setAge(uint256)", _age));
        require(success);
    }
}