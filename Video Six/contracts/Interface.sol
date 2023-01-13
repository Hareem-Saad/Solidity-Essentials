// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * interfaces are also not deployable 
 * in interfaces there are no function implementations, just signatures
 * all functions are explicitly virtual so need to add that
 * all must must have a visibility of external, no public, private or internal
 * Variables cannot be declared in interfaces includes mappings
 */

interface ContractA {

    function getNum() external pure returns (uint);

    function getResult() external pure returns (uint);
}

contract ContractB is ContractA {

    function getNum() external pure returns (uint) {
        return 45;
    }

    function getResult() public pure override returns (uint) {
        return 85;
    }
}
