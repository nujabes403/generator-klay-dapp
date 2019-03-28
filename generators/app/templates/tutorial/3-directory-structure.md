## 3. Directory structure
```
|-- contracts
|-- migrations
|-- truffle.js
|-- static  
|-- src  
    |-- styles
    |-- klaytn
      |-- caver.js
    |-- components
      |-- BlockNumber.js
      |-- Auth.js
      |-- Count.js
    |-- index.js
    |-- App.js
    |-- routes.js
```
WHAT ABOUT:

`contracts/`: Contains the Solidity source files for our smart contracts. (__What is your contract logic? make it here with .sol extension__)  

`migrations/`: Contains javascript files thatl handle smart contract deployments. 1_initial_migration.js is an additional special smart contract that keeps track of changes. (__What contract exactly will you deploy? write down it here.__)  

`truffle.js`: Truffle configuration file that will configure the way you deploy your smart contracts.  


`src/components`: Contains frontend component files  
* `src/components/BlockNumber.js`: Shows the current block number.  
* `src/components/Auth.js`: Enables to login to wallet with 2 different methods.  1)private key 2)keystore + password
* `src/components/Count.js`: Enables to interact with deployed Count contract. We can call several functions declared in contract through caver.js.  
ex) `plus`, `minus`,`lastParticipant`, `count`.

`src/klaytn`: Contains klaytn blockchain related file.
* `src/klaytn/caver.js`: It instantiates caver within configured setting.  
cf) caver-js is a RPC call library which makes a connection to klaytn node, interacting with node or smart contract deployed on klaytn.

`src/styles`: Overall style definition on stylesheet  
`src/index.js`: Our tutorial app's index file. ReactDOM.render logic is in here.  
`src/App.js`: Our tutorial app's root component file for overall components.  
`src/routes.js`: Contains route definitions.  
`static/`: Contains static files, for example, images..
