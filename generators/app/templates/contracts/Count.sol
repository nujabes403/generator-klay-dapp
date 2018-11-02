pragma solidity ^0.4.23;

/*
  * storage variables *
  Count contract has 3 public storage variables.

  1) owner - By default, owner is contract deployer's address.
             `reset` function only can be called by owner.
  2) lastParticipant - lastParticipant is last person's address
                       who sent a transaction(called plus or minus) to Count contract.
  3) count - By default, count's value is 0,
             it could increase or decrease through `plus` or `minus` function.
  Count contract.

  * functions *
  Count contract has 3 public functions.
  1) plus - increase `count` storage variable by 1. (+1)
  2) minus - decrease `count` storage variable by 1. (-1)
  3) reset - reset `count` storage variable to 0.
 */

contract Count {
  address public owner;
  address public lastParticipant;
  uint public count;

  constructor() public {
    owner = msg.sender;
    count = 0;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function plus() public {
    count++;
    lastParticipant = msg.sender;
  }

  function minus() public {
    count--;
    lastParticipant = msg.sender;
  }

  function reset() public onlyOwner {
    count = 0;
  }
}
