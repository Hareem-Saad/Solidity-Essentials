// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * an abstract contract can not be deployed
 * it can have function signatures without body -- Must contain the modifier virtual
 * inheriting contracts MUST define the virtual functions using the modifier override
 * if the inheriting contract is abstract it does not need to define the function
 * a contract can inherit an abstract contract but an abstract contract cannot inherit a non abstract contract
 * abstract contracts can have function defination, this is the default code if not overriden the code in abs contract executes
 * if you want a function (with body or no) it needs to have a virtual keyword
 */

abstract contract ContractA {
    function getNum() public pure returns (uint) {
        return 45;
    }

    function getResult() public pure virtual returns (uint);
}

contract ContractB is ContractA {

    function getResult() public pure override returns (uint) {
        return 85;
    }
}
