// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./Age.sol";

contract StaticCaller {
    Age age;

    constructor(address _contract) {
        age = Age(_contract);
    }

    function callSetAge(uint _age) view public {
        (bool success,) = address(age).staticcall(abi.encodeWithSignature("setAge()", _age));
        require(success);
    }

    function callAge() view public {
        (bool success,) = address(age).staticcall(abi.encodeWithSignature("__age()"));
        require(success);
    }
}