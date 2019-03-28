## 4. Writing smart contract (Count.sol)

### 1) Background
We will make a super simple contract called "Count" contract.  

a. There would be just one storage variable called `count`.  
b. User can increase `count` variable by 1 or decrease it by 1. So there would be two functions, `plus` function which increases `count` variable by 1, and `minus` function which decreases `count` variable by 1. That's all!

### 2) Setup variable
Before setting variable, we should specify solidity version. Let's use 0.4.24 stable version.
```solidity
pragma solidity 0.4.24; // Specify solidity's version
```

Then we should name our contract to "Count".
```solidity
pragma solidity 0.4.24;

contract Count { // set contract names to "Count"

}
```

We need to set variable `count` as `uint`(unsigned integer) type, and initial value of it would be 0.

```solidity
pragma solidity 0.4.24;

contract Count {
  uint public count = 0; // Declare count variable as uint type and intialize its value to 0.
}
```

### 3) Setup functions
We need two functions, `plus`, `minus`.  each functions's role is like below:  
`plus` - increase `count` storage variable by 1. (count = count + 1)  
`minus` - decrease `count` storage variable by 1. (count = count - 1)  


```solidity
pragma solidity 0.4.24;

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
To enable the user to call a functions freely, function should be declared as a `public` function like below:

```solidity
function plus() public { … }
```

### 4) Let's do more..
Our contract is simple, so we want to add a more feature for it. How about a feature tracking a last participant's wallet address?

#### 4-1) Setup variable
So we will have a variable, `lastParticipant` as `address` type like below:  
`address public lastParticipant;`

```solidity
pragma solidity 0.4.24;

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
pragma solidity 0.4.24;

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
1) `public`
If you declare variable or function as `public`,  you can access this variable outer blockchain,  
for example, you can access this variable or function in your frontend application.  
You will see how to interact with contract public method, variables soon. (6-3 frontend-count-component.md)

2) `msg.sender`  
`msg.sender` is the person who currently connecting with the contract.  
To get the address of transaction sender we can use `msg.sender` variable.
```solidity
lastParticipant = msg.sender;
```
This line will make `lastParticipant`'s value to `msg.sender`
