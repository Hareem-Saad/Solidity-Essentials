// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * broadcasts the blockchain state as trasaction log
 */
contract ContractA {
    event from (address _from);

    function broadcase() public {
        emit from(msg.sender);
    }
}
