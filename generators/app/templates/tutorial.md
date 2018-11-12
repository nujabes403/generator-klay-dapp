## A. Introudction
Basic smart contract bapp, “Count”

## B. Setting up the development environment

### 1) Install node.js(npm)  
\- Download node.js(npm) in node.js official site. https://nodejs.org/  
\- If you want to check you already have node.js(npm), type `$ npm -v` in your terminal.
If it shows npm version, just skip it, you already have one.  
### 2) Install truffle globally  
\- type `$ npm install -g truffle` in your terminal.
\- If you want to check you already have installed truffle globally, type `$ truffle -v` in your terminal. If it shows truffle version, just skip it, you already have one.


## C. Scaffolding installation
### 1) Install yeoman generator  
yeoman generator is generic scaffolding system allowing the creation of any kind of app.  
We'll use it to create a klaytn-based blockchain application.  
\- `$ npm install -g yo`

### 2) Install klay-dapp generator  
\- `$ npm install -g generator-klay-dapp`

### 3) Scaffold it!  
\- `$ mkdir tutorial` - Make an empty folder called 'tutorial'  
\- `$ cd tutorial` - Enter the empty folder  
\- `$ yo klay-dapp` - Scaffold klay-dapp your empty folder.  

Now you can see files are populated to your folder, 'tutorial'.  
Let's see what file is added in detail.

## D. Directory structure

`contracts/`: Contains Solidity smart contract files.  (__What is your contract logic? make it here with .sol extension__)  
`migrations/`: Contains procedural deploy(migrate) definition files. (__What contract exactly will you deploy? write down it here.__)  
`truffle.js`: Truffle configuration file.  
  (__How to deploy your contract code?  write down it.  
  1) Who will deploy the contract?  
  2) Which network will you deploy on?  
  3) How many gas will you pay to deploy the contract?__)  


`src/components`: Contains frontend component files  
* `src/components/BlockNumber.js`: Show current block number.  
* `src/components/Auth.js`: Enable to login to wallet with 2 different methods.  1)private key 2)keystore + password
* `src/components/Count.js`: Enable to interact with deployed Count contract.  we can call several functions declared in contract through caver.js.  
ex) `plus`, `minus`,`lastParticipant`, `count`.

`src/klaytn`: Contains klaytn blockchain related file.
* `src/klaytn/caver.js`: It instantiates caver within configured setting.  
cf) caver-js is a RPC call library which makes a connection to klaytn node, interacting with node or smart contract deployed on klaytn.

`src/styles`: overall style definition on stylesheet  
`src/index.js`: Our tutorial app's index file. ReactDOM.render logic is in here.  
`src/App.js`: Our tutorial app's root component file for overall components.  
`src/routes.js`: Contains route definitions.  
`static/`: Contains static files, for example, images..

## E. Writing smart contract (Count.sol)

### 1) Background
We will make super simple contract called "Count" contract.  

a. There would be just one storage variable called `count`.  
b. User can increase `count` variable by 1 or decrease it by 1. So there would be two functions, `plus` function which increases `count` variable by 1, and `minus` function which decreases `count` variable by 1. That's all! For helping your understanding, let me show screenshot our tutorial app will be like.

[tutorial app screenshot]

### 2) Setup variable
Before setting variable, we should specify solidity version. Let's use 0.4.23 stable version.
```
pragma solidity 0.4.23; // Specify solidity's version
```

Then we should name our contract to "Count".
```
pragma solidity 0.4.23;

contract Count { // set contract names to "Count"

}
```

We need to set variable `count` as `uint`(unsigned integer) type, and initial value of it would be 0.

```
pragma solidity 0.4.23;

contract Count {
  uint public count = 0; // Declare count variable as uint type and intialize its value to 0.
}
```

### 3) Setup functions

`plus` - increase `count` storage variable by 1. (+1)  
`minus` - decrease `count` storage variable by 1. (-1)

### 4) Let's do more.. how about adding a feature which tracks a last participant?
#### 4-1) variable setup
`address public lastParticipant;``
#### 4-2) function setup
When user call `plus` or `minus` function, we want to set his address as a lastParticipant variable’s value.

Things to notice:
i) To enable user to call a functions freely, function should be declared as a `public` function like below:

```
function plus() public { … }
```

ii) To get transaction sender’s address we can use `msg.sender` variable.

Then let’s add a logic like below:
```
lastParticipant = msg.sender;
```

## F. Frontend code overview

## G. Deploy your smart contract code
1) truffle configuration
2) Deploy setup
(What contract do you want to deploy?)
migrations/2_deploy_contracts.js

3) Deploy

## G. npm run local

## H. Let’s expose your first bapp to your friends with AWS S3.

npm run build
