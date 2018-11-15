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
