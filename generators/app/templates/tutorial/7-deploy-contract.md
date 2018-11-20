## G. Deploy your smart contract code

1) truffle congiruation  
2) Deploy setup (What contract do you want to deploy?)    
3) Deploy  


### 1) truffle configuration  
`truffle.js`:

`truffle.js` file is the place you can describe "How to deploy your contract code". You can congifure below items through truffle.js

__1) Who will deploy the contract?  
2) Which network will you deploy on?  
3) How many gas will you pay to deploy the contract?__

There are 2 different methods to deploy your contract, first one uses `private key`, the other one uses `unlocked account`.

#### DEPLOY METHOD 1: By private key
*WARNING: You shouldn't expose your private key.
Otherwise, your account would be hacked.*  

If you want to deploy your contract through private key, `provider` option is needed.   

1) set your private key to 1st argument on `new PrivateKeyConnector()` function.  
2) set your klaytn node's URL to 2nd argument on `new PrivateKeyConnector()` function.

example)
```js
{
 ...,
 provider: new PrivateKeyConnector(
   'YOUR PRIVATE KEY',
   `http://aspen.klaytn.com`, // If you're running full node you can set your node's rpc url.
  ),
 ...
}
```

```js
const PrivateKeyConnector = require('connect-privkey-to-provider')

const NETWORK_ID = '1000'
const GASLIMIT = '20000000'

const URL = `http://aspen.klaytn.com`
const PRIVATE_KEY = '0x48f5a77dbf13b436ae0325ae91efd084430d2da1123a8c273d7df5009248f90c'

module.exports = {
  networks: {
    /**
     * DEPLOY METHOD 1: By private key.
     * You shouldn't expose your private key. Otherwise, your account would be hacked!!
     */
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },
}

```

See `networks` property above code. It has `klaytn` key which has 4 properties,
`provider`, `network_id`, `gas`, `gasPrice`.

`provider: new PrivateKeyConnector(PRIVATE_KEY, URL)` line informs truffle __Who will deploy the contract, and who will pay for the deploy fee? (PRIVATE_KEY)__  and __Which node will you deploy on (URL)?__

`network_id: NETWORK_ID` line specify network id in klaytn, you should specify it `1000` in klaytn aspen network(testnet).  

`gas: GASLIMIT` line informs truffle how much gas limit will you endure to deploy your contract.  

`gasPrice: null` line informs truffle how much price will you pay per gas unit. Currently in klaytn, there is fixed gas price `'25000000000'`, you don't need to set this value to `gasPrice` property, if you set it as `null`, truffle will set fixed gas price automatically.  

Like above, if you deploy your contract with private key connector, You don't need to set `host`, `port`, `from` option.

#### 2. DEPLOY METHOD 2: By unlocked account (difficult)
To deploy contract by unlocked account, you should have your klaytn full node.  
Access your klaytn node's console by typing `$ klay attach http://localhost:8551`
If you don't have account in the node, generate it by typing `personal.newAccount()` on klaytn console.  
If you already have one, unlock your account through `personal.unlockAccount()`.  

After ensuring account is unlocked,  
you should set properties `host`, `port`, `network_id`, `from`.
1) where to deploy(`host`, `port`, `network_id`)  
2) who will deploy(`from`)
3) How much gas will you endure to deploy your contract.(`gas`)

Put your unlocked account address on `from`.
If you're running your own klaytn full node, set the node's host to `host` and node's port to `port`.


example)
```js
{
  host: 'localhost',
  port: 8551,
  from: '0xd0122fc8df283027b6285cc889f5aa624eac1d23',
  network_id: NETWORK_ID,
  gas: GASLIMIT,
  gasPrice: null,
}
```

Like above, if you deploy your contract with unlocked account on klaytn node,
You don't need to set `provider` option.


### 2) Deploy setup (What contract do you want to deploy?)  
`migrations/2_deploy_contracts.js`:  

```js
const Count = artifacts.require('./Count.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(Count)
    .then(() => {
    // Record recently deployed contract address to 'deployedAddress' file.
    if (Count._json) {
      // Save abi file to deployedABI.
      fs.writeFile(
        'deployedABI',
        JSON.stringify(Count._json.abi, 2),
        (err) => {
          if (err) throw err
          console.log(`The abi of ${Count._json.contractName} is recorded on deployedABI file`)
        })
    }

    fs.writeFile(
      'deployedAddress',
      Count.address,
      (err) => {
        if (err) throw err
        console.log(`The deployed contract address * ${Count.address} * is recorded on deployedAddress file`)
    })
  })
}
```

You can specify which contract code will you deploy in your `contracts/` directory.  
At first, you should import your contract file (`Count.sol`) in this file through `const Count = artifats.require('./Count.sol')`  
And use `deployer` to deploy your contract, through `deployer.deploy(Count)`. Actually, it is enough to deploy your contract.  
However, if you want to add some logic after deploying your contract, use `.then()`.  
We want to store deployed contracts' ABI and address.  `fs` node.js module make it possible to save it as a file. (`fs.writeFile(filename, content, callback)`)  
Through this additional logic, we can save our deployed contract's address and ABI to our directory (`deployedABI` and `deployedAddress`).  

For further information about `artifacts.`, try visit truffle document site, https://truffleframework.com/docs/truffle/getting-started/running-migrations#artifacts-require-

### 3) Deploy  
You need KLAY for deploying contract. There are 2 different methods to receive testnet KLAY.

* a. Through klaytn wallet  
https://wallet.klaytn.com/faucet  
there is a faucet providing 1000 KLAY per 900 blocks in Klaytn Aspen testnet.  
After creating your klaytn account, run faucet to receive 1000 KLAY.  

* b. Through terminal curl  
If you already have your klaytn account(address), type command below in terminal.  
`$ curl -X GET "https://apiwallet.klaytn.com/faucet?address=YOUR_ADDRESS"`  
example)  
`$ curl -X GET "https://apiwallet.klaytn.com/faucet?address=0x32421b7Bfe2F81ca6708b72eDc5b2f1Ce9f80a79"`

![deploy](https://github.com/nujabes403/generator-klay-dapp/blob/master/images/3deploy.gif?raw=true)  
type `$ truffle deploy --network klaytn`.  
It will deploy your contract according to `truffle.js` and `migrations/2_deploy_contracts.js` configuration.  

cf) `--reset` option  
After deploying your contract, if you just type `$ truffle deploy --network klaytn`,  Nothing will happen.  
It's because truffle only deploy contract when there were change in contract, otherwise truffle will not do anything.  
However, if you just want to deploy your contract anyway, there is an option `--reset`.  
If you provide this option, truffle will deploy your contract even the content of contract hasn't changed.  
ex) `$ truffle deploy --reset --network klaytn`

To recap, `truffle.js` configures `where to deploy, who will deploy, how much gas will you endure to deploy`. `migrations/2_deploy_contracts.js` configures `what contract to deploy`.  
`where?`: We will deploy our contract to the node `http://aspen.klaytn.com` or own full node `http://localhost:8551`.  
`who?`: '0xd0122fc8df283027b6285cc889f5aa624eac1d23' account address will deploy this contract.  
`gas?`: We can endure '20000000' gas limit for deploying our contract.  
`what contract?`: We will deploy our Count contract.  

You can check your contract deployed on your terminal if you succeed.  
You can also check the deployed contract address where the contract is deployed.  

[Next: Run app](8-run-app.md)
