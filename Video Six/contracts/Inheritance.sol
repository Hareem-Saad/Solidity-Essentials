// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract C {
   //private state variable
   uint private data;
   
   //public state variable
   uint public info;

   //constructor
   constructor() {
      info = 10;
   }
   //private function
   function increment(uint a) private pure returns(uint) { return a + 1; }
   
   //public function
   function updateData(uint a) public { data = a; }
   function getData() public virtual view returns(uint) { return data; }
   function compute(uint a, uint b) internal pure returns (uint) { return a + b; }
}

//Derived Contract
contract E is C {
   uint private result;
   C private c;
   constructor()  {
      c = new C();
   }  
   function getComputedResult() public {      
      result = compute(3, 5); 
   }
   function getResult() public view returns(uint) { return result; }
   function getData() public view override returns(uint) { return c.info(); }
}

/* a derived contract can call the parent's internal variables/functions but nor private ones
 * 
 */

contract D {
   E e = new E();
   C c = new C();

   function viewstuff() public view returns (uint) {
      //polymorphism
      /* call the gat data fron e or c it is going to call the implementation in the most recent parent */
      return e.getData();

   }
}
