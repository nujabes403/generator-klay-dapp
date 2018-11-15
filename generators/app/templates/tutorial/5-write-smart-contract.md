## E. Writing smart contract (Count.sol)

### 1) Background
We will make super simple contract called "Count" contract.  

a. There would be just one storage variable called `count`.  
b. User can increase `count` variable by 1 or decrease it by 1. So there would be two functions, `plus` function which increases `count` variable by 1, and `minus` function which decreases `count` variable by 1. That's all!

### 2) Setup variable
Before setting variable, we should specify solidity version. Let's use 0.4.23 stable version.
```solidity
pragma solidity 0.4.23; // Specify solidity's version
```

Then we should name our contract to "Count".
```solidity
pragma solidity 0.4.23;

contract Count { // set contract names to "Count"

}
```

We need to set variable `count` as `uint`(unsigned integer) type, and initial value of it would be 0.

```solidity
pragma solidity 0.4.23;

contract Count {
  uint public count = 0; // Declare count variable as uint type and intialize its value to 0.
}
```

### 3) Setup functions
We need two functions, `plus`, `minus`.  each functions's role is like below:  
`plus` - increase `count` storage variable by 1. (count = count + 1)  
`minus` - decrease `count` storage variable by 1. (count = count - 1)  


```solidity
pragma solidity 0.4.23;

contract Count {
  uint public count = 0;

  function plus() public { // Make a public function called 'plus'
    count = count + 1; // 'plus' function increases count variable by 1.
  }

  function minus() public { // Make a public function called 'plus'
    count = count - 1; // 'minus' function decreases count variable by 1.
  }
}
```

*Things to notice.*  
To enable user to call a functions freely, function should be declared as a `public` function like below:

```solidity
function plus() public { … }
```

### 4) Let's do more..
Our contract is simple, so we want to add a more feature for it. How about a feature tracking a last participant's wallet address?

#### 4-1) Setup variable
So we will have a variable, `lastParticipant` as `address` type like below:  
`address public lastParticipant;`

```solidity
pragma solidity 0.4.23;

contract Count {
  uint public count = 0;
  address public lastParticipant;

  function plus() public { // Make a public function called 'plus'
    count = count + 1; // 'plus' function increases count variable by 1.
  }

  function minus() public { // Make a public function called 'plus'
    count = count - 1; // 'minus' function decreases count variable by 1.
  }
}
```

#### 4-2) Setup functions
To track last particpant's address, we should add a logic storing it to `lastParticipant` variable like below:  

```solidity
pragma solidity 0.4.23;

contract Count {
  uint public count = 0;
  address public lastParticipant;

  function plus() public {
    count = count + 1;
    lastParticipant = msg.sender; // store msg.sender to lastParticipant
  }

  function minus() public {
    count = count - 1;
    lastParticipant = msg.sender; // store msg.sender to lastParticipant
  }
}
```

*Things to notice.*  
To get transaction sender's address we can use `msg.sender` variable.
```solidity
lastParticipant = msg.sender;
```
