// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./BookTicket.sol";
import "./Constant.sol";

contract Caller {

    BookTicket public targetContract;

    constructor(address _targetContract) {
        targetContract = BookTicket(payable(_targetContract));
    }

    function callFallbackUsingSignature() public {
        (bool success,) = address(targetContract).call(abi.encodeWithSignature("nonExistingFunction()"));
        require(success);
    }

    function callFallbackUsingSelector(address _constant) public {
        (bool success,) = address(targetContract).call(abi.encodeWithSelector(Constant(_constant).num.selector, msg.sender));
        require(success);
    }

    // function callFallbackUsingSelector(address _anyOtherContract) public {
    //     address(targetContract).call(abi.encodeWithSelector(anyOtherContract(__anyOtherContract).nonExistingFunction.selector, msg.sender));
    // }

    function callReceiveUsingSend() public payable {
        (bool success) = payable(address(targetContract)).send(1 ether);
        require(success);
    }

    function callReceiveUsingCall() public payable {
        (bool sent,) = payable(address(targetContract)).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

}