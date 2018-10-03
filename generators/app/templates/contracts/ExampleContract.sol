pragma solidity ^0.4.23;

contract ExampleContract {
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
