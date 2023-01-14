// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Test {
    function getNum() public pure virtual returns (uint) {
        return 6;
    }

    function encode(uint _num) public view virtual returns (bytes memory) {
        return abi.encode(msg.sender, _num);
    }

    function encodePacked(uint _num) public view virtual returns (bytes memory) {
        return abi.encodePacked(msg.sender, _num);
    }
}