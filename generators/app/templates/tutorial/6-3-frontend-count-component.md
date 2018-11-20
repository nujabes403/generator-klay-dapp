`src/components/Count.js`:  

## `Count` component
1) Full code  
2) `Count` component's role  
3) How to interact with contract?  
4) Interact with contract: `getCount` method  
5) Interact with contract: `setPlus` method  
6) Transaction life cycle  

### 1) Full code

```js
import React, { Component } from 'react'
import cx from 'classnames'

import { cav } from 'klaytn/caver'

import './Count.scss'

class Count extends Component {
  constructor() {
    super()
    // ** 1. Create contract instance **
    // ex:) new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
    // You can call contract method through this instance.
    // Now you can access the instance by `this.countContract` variable.
    this.countContract = DEPLOYED_ABI
      && DEPLOYED_ADDRESS
      && new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
    this.state = {
      count: '',
      lastParticipant: '',
      isSetting: false,
    }
  }

  intervalId = null

  getCount = async () => {
    // ** 2. Call contract method (CALL) **
    // ex:) this.countContract.methods.methodName(arguments).call()
    // You can call contract method (CALL) like above.
    // For example, your contract has a method called `count`.
    // You can call it like below:
    // ex:) this.countContract.methods.count().call()
    // It returns promise, so you can access it by .then() or, use async-await.
    const count = await this.countContract.methods.count().call()
    const lastParticipant = await this.countContract.methods.lastParticipant().call()
    this.setState({
      count,
      lastParticipant,
    })
  }

  setPlus = () => {
    const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0]

    // Need to integrate wallet for calling contract method.
    if (!walletInstance) return

    this.setState({ settingDirection: 'plus' })

    // 3. ** Call contract method (SEND) **
    // ex:) this.countContract.methods.methodName(arguments).send(txObject)
    // You can call contract method (SEND) like above.
    // For example, your contract has a method called `plus`.
    // You can call it like below:
    // ex:) this.countContract.methods.plus().send({
    //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
    //   gas: '200000',
    //   chainId: '1000', // default `chainId` is '1000'.
    // })
    this.countContract.methods.plus().send({
      from: walletInstance.address,
      gas: '200000',
    })
      .once('transactionHash', (txHash) => {
        console.log(`
          Sending a transaction... (Call contract's function 'plus')
          txHash: ${txHash}
          `
        )
      })
      .once('receipt', (receipt) => {
        console.log(`
          Received receipt! It means your transaction(calling plus function)
          is in klaytn block(#${receipt.blockNumber})
        `, receipt)
        this.setState({
          settingDirection: null,
          txHash: receipt.transactionHash,
        })
      })
      .once('error', (error) => {
        alert(error.message)
        this.setState({ settingDirection: null })
      })
  }

  setMinus = () => {
    const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0]

    // Need to integrate wallet for calling contract method.
    if (!walletInstance) return

    this.setState({ settingDirection: 'minus' })

    // 3. ** Call contract method (SEND) **
    // ex:) this.countContract.methods.methodName(arguments).send(txObject)
    // You can call contract method (SEND) like above.
    // For example, your contract has a method called `minus`.
    // You can call it like below:
    // ex:) this.countContract.methods.minus().send({
    //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
    //   gas: '200000',
    //   chainId: '1000', // default `chainId` is '1000'.
    // })

    // It returns event emitter, so after sending, you can listen on event.
    // Use .on('transactionHash') event,
    // : if you want to handle logic after sending transaction.
    // Use .once('receipt') event,
    // : if you want to handle logic after your transaction is put into block.
    // ex:) .once('receipt', (data) => {
    //   console.log(data)
    // })
    this.countContract.methods.minus().send({
      from: walletInstance.address,
      gas: '200000',
    })
      .once('transactionHash', (txHash) => {
        console.log(`
          Sending a transaction... (Call contract's function 'minus')
          txHash: ${txHash}
          `
        )
      })
      .once('receipt', (receipt) => {
        console.log(`
          Received receipt which means your transaction(calling minus function)
          is in klaytn block(#${receipt.blockNumber})
        `, receipt)
        this.setState({
          settingDirection: null,
          txHash: receipt.transactionHash,
        })
      })
      .once('error', (error) => {
        alert(error.message)
        this.setState({ settingDirection: null })
      })
  }

  componentDidMount() {
    this.intervalId = setInterval(this.getCount, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { lastParticipant, count, settingDirection, txHash } = this.state
    return (
      <div className="Count">
        {lastParticipant && (
          <div className="Count__lastParticipant">
            last participant: {lastParticipant}
          </div>
        )}
        <div className="Count__count">COUNT: {count}</div>
        <button
          onClick={this.setPlus}
          className={cx('Count__button', {
            'Count__button--setting': settingDirection === 'plus',
          })}
        >
          +
        </button>
        <button
          onClick={this.setMinus}
          className={cx('Count__button', {
            'Count__button--setting': settingDirection === 'minus',
          })}
        >
          -
        </button>
        {txHash && (
          <div className="Count__lastTransaction">
            <p className="Count__lastTransactionMessage">
              You can check your last transaction in klaytn scope:
            </p>
            <a
              target="_blank"
              href={`https://scope.klaytn.com/transaction/${txHash}`}
              className="Count__lastTransactionLink"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>
    )
  }
}

export default Count
```
### 2) `Count` component's role
`'Count'` component's role is interacting with Count contract deployed on klaytn blockchain.  

In Count.sol contract, we declared several variables and functions like below:  
1.`count`  
2.`lastParticipant`  
3.`plus` - increase `count` storage variable by 1. (count = count + 1)  
4.`minus` - decrease `count` storage variable by 1. (count = count - 1)

In Count.js component, we should have a methods to interact with Count.sol contract.  
For example, we should have a method which retrieves `count` variable's value and `lastParticipant` value, moreover, we should have a function that set `count` variable and `lastParticipant` also by calling `plus`, `minus` functions.  

### 3) How to interact with contract?
To interact with the contract, we need a contract instance with deployed contract.  
contract instance can be made through `caver.klay.Contract(ABI, contractAddress)` API of caver-js. (https://docs.klaytn.com/api/toolkit.html#caverklaycontract)

`Contract ABI`(Application Binary Interface) informs how to call contract method to caver, so caver easily call contrcat method,  
for example)  
`contractInstance.methods.count().call()`  
`contractInstance.methods.plus().send({ ... })`  
`contractInstance.methods.minus().send({ ... })`  

`Contract address` informs where the contract is deployed.  
So to make a contract instance, contract ABI and contract address is needed. After compiling & deploying our Count.sol contract, we can see it in `build/contracts/Count.json` file.  
Luckily, we already made `deployedABI` and `deployedAddress` file in our directory after deploying our contract. It contains ABI of our Count contract and deployed contract address.  
And thanks to webpack's configuration, we can access it as variable.(`DEPLOYED_ADDRESS`, `DEPLOYED_ABI`)

For example)  
Accessing `DEPLOYED_ADDRESS` returns deployed Address.  
Accesing `DEPLOYED_ABI` returns Count contract ABI.

```js
constructor() {
  super()
  // ** 1. Create contract instance **
  // ex:) new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
  // You can call contract method through this instance.
  // Now you can access the instance by `this.countContract` variable.
  this.countContract = DEPLOYED_ABI
    && DEPLOYED_ADDRESS
    && new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
  ...
}
```

`this.countContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)` make a contract instance to interact with deployed `Count` contract, by providing `DEPLOYED_ABI` and `DEPLOYED_ADDRESS` to `cav.klay.Contract` API. and this contract instance is stored to `this.countContract`.  

### 4) Interact with contract: `getCount` method
```js
getCount = async () => {
  // ** 2. Call contract method (CALL) **
  // ex:) this.countContract.methods.methodName(arguments).call()
  // You can call contract method (CALL) like above.
  // For example, your contract has a method called `count`.
  // You can call it like below:
  // ex:) this.countContract.methods.count().call()
  // It returns promise, so you can access it by .then() or, use async-await.
  const count = await this.countContract.methods.count().call()
  const lastParticipant = await this.countContract.methods.lastParticipant().call()
  this.setState({
    count,
    lastParticipant,
  })
}
```

Since we have contract instance, we can call contract method now. out contract instance has property, `methods`.  
It contains functions declared on deployed address, for example, `count`, `lastParticipant`, `plus`, `minus`.  

In above code, `getCount` function is declared as `async` function. Since contract function call returns promise value, it is useful to declare function as `async`.
We can fetch `count` storage variable's value by calling `this.countContract.mehotds.count().call()`.  
We can fetch also `lastParticipant` storage variable's value by calling `this.countContract.mehotds.lastParticipant().call()`.  
After fetching those variable's value, set state properties `count`, `lastParticipant` to responsed value from contract function call.  

For further information about calling contract methods, visit klaytn docs site https://docs.klaytn.com/api/toolkit.html#methods

```js
componentDidMount() {
  this.intervalId = setInterval(this.getCount, 1000)
}

componentWillUnmount() {
  clearInterval(this.intervalId)
}
```

We want to fetch `count` variable per 1 second, it could be achieved by `setInterval` and `clearInterval`.  
It is similar pattern to `BlockNumber.js`'s `getBlockNumber` function which calls `caver.klay.getBlockNumber()` intervally.

### 5) Interact with contract: `setPlus` method
```js
setPlus = () => {
  const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0]

  // Need to integrate wallet for calling contract method.
  if (!walletInstance) return

  this.setState({ settingDirection: 'plus' })

  // 3. ** Call contract method (SEND) **
  // ex:) this.countContract.methods.methodName(arguments).send(txObject)
  // You can call contract method (SEND) like above.
  // For example, your contract has a method called `plus`.
  // You can call it like below:
  // ex:) this.countContract.methods.plus().send({
  //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
  //   gas: '200000',
  //   chainId: '1000', // default `chainId` is '1000'.
  // })
  this.countContract.methods.plus().send({
    from: walletInstance.address,
    gas: '200000',
  })
    .once('transactionHash', (txHash) => {
      console.log(`
        Sending a transaction... (Call contract's function 'plus')
        txHash: ${txHash}
        `
      )
    })
    .once('receipt', (receipt) => {
      console.log(`
        Received receipt! It means your transaction calling plus function is in klaytn block(#${receipt.blockNumber})
      `, receipt)
      this.setState({ settingDirection: null })
    })
    .once('error', (error) => {
      alert(error.message)
      this.setState({ settingDirection: null })
    })
}
```

`'setPlus'` function is most important part in Count component. It interacts with contract by calling contract function `plus`. Since this function is also contract method, it is contained in `this.counterContract.methods`.  
However, unlike `count` and `lastParticipant` function reads data from klaytn blockchain, this `plus` function __writes data__ to klaytn blockchain.  
Just reading data is free, however writing data has cost for computation & storage. This cost is called `'gas'` and this kind of process is called `'Sending a transaction'`.  
You can easily think `'transaction'` as `writing data to blockchain.` and it costs `'gas'` for computation and storing data.  

By this reason, Sending a transaction needs `from:` property to inform klaytn node who will send a transaction(who will pay for this transaction) and `gas:` property for how much cost will you endure for sending a transaction.

```js
this.countContract.methods.plus().send({
  from: walletInstance.address,
  gas: '200000',
})
```

So instead `.call()` we used before for calling `count` function, use like below:
```js
.send({
  from: ...,
  gas: ...
})
```

### 6) Transaction life cycle
```js
.once('transactionHash', (txHash) => {
  console.log(`
    Sending a transaction... (Call contract's function 'plus')
    txHash: ${txHash}
    `
  )
})
.once('receipt', (receipt) => {
  console.log(`
    Received receipt! It means your transaction calling plus function is in klaytn block(#${receipt.blockNumber})
  `, receipt)
  this.setState({ settingDirection: null })
})
.once('error', (error) => {
  alert(error.message)
  this.setState({ settingDirection: null })
})
```

After sending transaction, you can hook into transaction life cycle. (`transactionHash`, `receipt`, `error`).  
In `transactionHash` life cycle, you can get transaction hash before sending actual transaction.  
In `receipt` life cycle, you can get transaction receipt. It means you transaction got into the block.   you can check exact block number which your transaction goes into. by `receipt.blockNumber`.  
In `error` life cycle is triggered when error occurred for sending a transaction.

cf) `settingDirection` is used for showing loading indicator(gif), if transaction have been get into the block, you don't need to show loading indicator. So set `settingDirection` value to `null`.

```js
<button
  onClick={this.setPlus}
  className={cx('Count__button', {
    'Count__button--setting': settingDirection === 'plus',
  })}
>
  +
</button>
```

You can call this function by clicking + button.  

To recap, after clicking + button,  
1\. you will send a transaction which calls contract method `plus`.  
2\. Just after sending a transaction, you will receive transaction hash in `transactionHash` life cycle.  
3-a\. After your transaction put into block of klaytn blockchain, you will receive transaction receipt in `receipt` life cycle. (If you received transaction receipt, you can guarantee that your transaction got into block.)  
3-b\. If there were error for sending a transaction, you will receive error in `error` life cycle. And `receipt` life cycle will never be called.

Full code for sending a transaction calling `plus` contract method is below:
```js
this.countContract.methods.plus().send({
  from: walletInstance.address,
  gas: '200000',
})
  .once('transactionHash', (txHash) => {
    console.log(`
      Sending a transaction... (Call contract's function 'plus')
      txHash: ${txHash}
      `
    )
  })
  .once('receipt', (receipt) => {
    console.log(`
      Received receipt! It means your transaction calling plus function is in klaytn block(#${receipt.blockNumber})
    `, receipt)
    this.setState({ settingDirection: null })
  })
  .once('error', (error) => {
    alert(error.message)
    this.setState({ settingDirection: null })
  })
```

### How can I check my transaction put into the blockchain?

![check-transaction](https://github.com/nujabes403/generator-klay-dapp/blob/master/images/check-your-transaction.gif?raw=true)

After sending a transaction, you can check your transaction detail in klaytnscope.  
Check it in `https://scope.klaytn.com/transaction/${txHash}`.


[Next: Deploy contract](7-deploy-contract.md)
