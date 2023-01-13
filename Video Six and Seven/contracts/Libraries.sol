// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * libraries provide code functionality
 * they cannot have non-constant state variables
 * they are not inherited just imported or present in code file
 * the methods are called as (lib-name).(func-name)
 * another way is by assigning a libarary for the data type by using MyMathLib for uint256;
 * after this the functions in library become methods for that datatype THE FIRST PARAMETER OF THE FUNCTION IS REPLACED BY THE DATATYPE ON WHICH YOU ARE CALLING THE METHOD
 * make function in libraries internal so it becomes a part of your contract and you don't have to deploy the libraries.
 */

library MyMathLib {

    uint256 public constant x = 90;

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
}

contract ContractA {
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return MyMathLib.add(a, b);
    }
}

contract ContractB {

    using MyMathLib for uint256;

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a.add(b);
    }
}
