## F. Frontend code overview
`src/index.js`:  
```js
import ReactDOM from 'react-dom'

import App from './App'
import renderRoutes from './routes'

import './index.scss'

// Render App(root component).
ReactDOM.render(
  renderRoutes(App),
  document.getElementById('root')
)

// hot module replacement.
if (module.hot) {
  module.hot.accept('./App.js', () => {
    const NextApp = require('./App').default
    ReactDOM.render(renderRoutes(NextApp), document.getElementById('root'))
    console.log('Hot module replaced..')
  })
}
```
`'index.js'` is main javascript file for our tutorial app. Literally, it is the 'index' point of our app.

It uses 'react-dom' library to render a React element into the DOM in the supplied container('#root') and return a reference to the component. In short, through 'react-dom' our tutorial app's DOM will be populated to `<div id="root"></div>` in `public/index.html` file.

`public/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <title>klay blockchain-based app</title>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div> <!-- DOM will be populated into here. -->
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>

```

For further information, visit React official site https://reactjs.org/docs/react-dom.html#render

`src/routes.js`:  

```js
import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Count from 'components/Count'

const renderRoutes = rootComponent => (
  <Router history={browserHistory}>
    <Route component={rootComponent}>
      <Route path="/" component={Count} />
    </Route>
  </Router>
)

export default renderRoutes
```

`'routes.js'` contains route definition for our tutorial app.  
As a root component, `'App.js'` component renders children component defined in `'route.js'` file.  
By above code, `'Count'` component would be rendered as a children of rootComponent when browser's URL path is `"/"`.

For further information, visit React router github https://github.com/ReactTraining/react-router/blob/v3.2.1/docs/API.md


`src/App.js`:  

```js
import React, { Component } from 'react'

import { cav } from 'klaytn/caver'
import BlockNumber from 'components/BlockNumber'
import Auth from 'components/Auth'

import './App.scss'

class App extends Component {
  componentWillMount() {
    /**
     * sessionStorage is internet browser's feature which stores data
     * until the browser tab is closed.
     */
    const walletFromSession = sessionStorage.getItem('walletInstance')

    // If 'walletInstance' value exists, add it to caver's wallet
    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession))
      } catch (e) {
        // If value in sessionStorage is invalid wallet instance,
        // remove it from sessionStorage.
        sessionStorage.removeItem('walletInstance')
      }
    }
  }

  render() {
    return (
      <div className="App">
        <BlockNumber />
        <Auth />
        {this.props.children}
      </div>
    )
  }
}

export default App

```

`'App.js'` is root component of our tutorial app.


```js
render() {
  return (
    <div className="App">
      <BlockNumber />
      <Auth />
      {this.props.children}
    </div>
  )
}
```

It renders `BlockNumber`, `Auth` and `{this.props.children}` component.  
`{this.props.children}` will be populated according to `routes.js` file.  
If your browser's url path is `/`, it will render `<Count />` component.

```js
componentWillMount() {
  /**
   * sessionStorage is internet browser's feature which stores data
   * until the browser tab is closed.
   */
  const walletFromSession = sessionStorage.getItem('walletInstance')

  // If 'walletInstance' value exists, add it to caver's wallet
  if (walletFromSession) {
    try {
      cav.klay.accounts.wallet.add(JSON.parse(walletFromSession))
    } catch (e) {
      // If value in sessionStorage is invalid wallet instance,
      // remove it from sessionStorage.
      sessionStorage.removeItem('walletInstance')
    }
  }
}
```

There are `componentWillMount` life cycle on App component.  
It checks there is a `walletInstance` session in browser's sessionStorage.  
`walletInstance` session may not exist if you have never logged in our tutorial app.  
Otherwise, `walletInstance` session may exist as JSON string, if so, try add wallet instance to caver.  
You can add wallet instance to caver through `cav.klay.accounts.wallet.add(JSON.parse(walletFromSession))`.  
For further information related `caver.klay.accounts`, visit klaytn docs site https://docs.klaytn.com/api/toolkit.html#walletadd  

cf) `JSON.parse` is needed since `walletInstance` session is stored as JSON string.


`src/components/BlockNumber.js`:  

```js
import React, { Component } from 'react'

import { cav } from 'klaytn/caver'

import './BlockNumber.scss'

/**
 * BlockNumber component get the current block number per 1 second.(1000ms)
 * current block number can be fetched through caver.js library
 * which make a connection, communicating with klaytn node.
 * cf) If you want to connect to specific klaytn node,
 * change 'rpcURL' config in klaytn/caver.js
 */
class BlockNumber extends Component {
  /**
   * BlockNumber component has a 'currentBlockNumber' state.
   */
  state = {
    currentBlockNumber: '...loading',
  }

  /**
   * 'getBlockNumber' method works
   * 1) get current block number from klaytn node by calling 'cav.klay.getBlockNumber()'
   * 2) set 'currentBlockNumber' state to the value fetched from step 1).
   */
  getBlockNumber = async () => {
    const blockNumber = await cav.klay.getBlockNumber()
    this.setState({ currentBlockNumber: blockNumber })
  }

  /**
   * intervalId value will be populated by the value returned from `setInterval`.
   * intervalId will be used to clear interval, preventing memory leak.
   */
  intervalId = null

  /**
   * In 'componentDidMount' lifecycle, call 'getBlockNumber' method intervally.
   */
  componentDidMount() {
    this.intervalId = setInterval(this.getBlockNumber, 1000)
  }

  /**
   * In 'componentWillUnmount' lifecycle, clear interval
   * which calls getBlockNumber per 1000ms.
   */
  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  /**
   * In 'render' lifecycle, show 'currentBlockNumber' state like below:
   * <p>Block No. {currentBlockNumber}</p>
   */
  render() {
    const { currentBlockNumber } = this.state
    return (
      <div className="BlockNumber">
        <p className="BlockNumber__current">Block No. {currentBlockNumber}</p>
      </div>
    )
  }
}

export default BlockNumber

```

`'BlockNumber'` component's role is showing klaytn's current block number.  
It requests current block number to klaytn node by calling caver.js's API `caver.klay.getBlockNumber()` method per 1 second. When response having current block number comes from klaytn node, it re-renders DOM through `this.setState({ currentBlockNumber: blockNumber })`.  

```js
/**
 * 'getBlockNumber' method works
 * 1) get current block number from klaytn node by calling 'cav.klay.getBlockNumber()'
 * 2) set 'currentBlockNumber' state to the value fetched from step 1).
 */
getBlockNumber = async () => {
  const blockNumber = await cav.klay.getBlockNumber()
  this.setState({ currentBlockNumber: blockNumber })
}
```

Above code, `getBlockNumber` method is declared as async function, declaring function as async can make dealing with asyncrhnous value(promise) easy. Since `cav.klay.getBlockNumber` returns promise, it can be handled easily by append `await` keyword.  

For further information about async-await keyword, see javascript's MDN site https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

After assigning current block number returned from `cav.klay.getBlockNumber()` to `blockNumber` constant variable, we use `this.setState` API in React. `this.setState({ currentBlockNumber: blockNumber })` literally set state's property `currentBlockNumber` to `blockNumber`'s value. `this.setState(nextState)` API changes current state, and re-render component.  

As a result, in `render` lifecycle, `this.state.currentBlockNumber` would be populated by current block number responded from klaytn node through `caver.klay.blockNumber()`.

For further detail about React's this.setState and rendering mechanism, visit React's official site https://reactjs.org/docs/state-and-lifecycle.html

```js
/**
 * In 'componentDidMount' lifecycle, call 'getBlockNumber' method intervally.
 */
componentDidMount() {
  this.intervalId = setInterval(this.getBlockNumber, 1000)
}
```
Since we want our tutorial app to show current block number lively, we should call `getBlockNumber` per 1 seconds(1000ms). We can use `setInterval` function to do this. `setInterval(func, delay)` call function intervally. Since we will call `this.getBlockNumber` method per 1000ms, `setInterval(this.getBlockNumber, 1000)` is needed. And this `setInterval` function returns interval id which will be used to clear this interval, so we store it to `this.intervalId` variable.

```js
/**
 * In 'componentWillUnmount' lifecycle, clear interval
 * which calls getBlockNumber per 1000ms.
 */
componentWillUnmount() {
  if (this.intervalId) clearInterval(this.intervalId)
}
```

When our component will unmount, we don't need to call `this.getBlockNumber` function intervally, so remove this interval by `clearInterval(this.intervalId)`.


`src/components/Auth.js`:  

`'Auth.js'` component longest code in our tutorial app, so we will break codes into step by step.  

It looks like this. [Auth component screenshot.]

This component features are like below:
1) User can input private key to login.
2) User can import keystore file and input password to login.
3) User can logout, remove wallet instance information from browser.

For 1) "User can input private key to login.": `integrateWallet` method is needed.
```js
integrateWallet = (privateKey) => {
  const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey)
  cav.klay.accounts.wallet.add(walletInstance)
  sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance))
  this.reset()
}
```
integateWallet function takes `privateKey` as an argument, use it to make wallet instance.  
`const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey)` stores wallet instance made by `privateKeyToAccount` API to `walletInstance` variable.  
You should add wallet instance to your caver through `cav.klay.accounts.wallet.add(walletInstance)`  
`sessionStorage.setItem` is browser's API for storing value to browser's session storage.  Since we want to not lose our logged in status even we refresh our tutorial app page, we stored it our wallet instance to session storage as JSON string.  
At last, `this.reset()` reset current component's state to initial state to clear your input on which private key is typed.  
cf) Items in session storage disappear when user close the browser tab.  

For further information about `privateKeyToAccount` API of caver, visit klaytn document site https://docs.klaytn.com/api/toolkit.html#privatekeytoaccount  

For 2) "User can import keystore file and input password to login.": `handleImport`, `handleLogin` methods are needed.  
```js
/**
 * handleImport method takes a file, read
 */
handleImport = (e) => {
  const keystore = e.target.files[0]
  // 'FileReader' is used for reading contents of file.
  // We would use 'onload' handler and 'readAsText' method.
  // * FileReader.onload
  // - This event is triggered each time the reading operation is completed.
  // * FileReader.readAsText()
  // - Starts reading the contents.
  const fileReader = new FileReader()
  fileReader.onload = (e) => {
    try {
      if (!this.checkValidKeystore(e.target.result)) {
        // If key store file is invalid, show message "Invalid keystore file."
        this.setState({ keystoreMsg: 'Invalid keystore file.' })
        return
      }

      // If key store file is valid,
      // 1) set e.target.result keystore
      // 2) show message "It is valid keystore. input your password."
      this.setState({
        keystore: e.target.result,
        keystoreMsg: 'It is valid keystore. input your password.',
      }, () => document.querySelector('#input-password').focus())
    } catch (e) {
      this.setState({ keystoreMsg: 'Invalid keystore file.' })
      return
    }
  }
  fileReader.readAsText(keystore)
}
```

To import file from user, we need `FileReader` browser API.  
`e.target.files[0]` contains meta information for file. To read contents of the file, we need `fileReader.readAsText(keystore)` API.  
After calling `fileReader.readAsText(keystore)`, `fileReader.onload` function takes the content of file as `e.target.result`.  
Importing keystore is not enough to login, since it needs password to decrypt keystore.  
So after importing keystore file, we still need to input password.  

cf) keystore contains encrypted private key, we can't know actual private key only with keystore file.  
We need to decrypt it through password so that we can export actual private key(decrypted) from keystore.  
*WARNING Don't expose your keystore file to another person!*

Fill password into `<input>` element. filled value will be stored as `password` state through `handleChange` method.  
```html
<input
  id="input-password"
  className="Auth__passwordInput"
  name="password"
  type="password"
  onChange={this.handleChange}
/>
```

If keystore file and password is ready, we can decrypt keystore file to export private key through `cav.klay.accounts.decrypt(keystore, password)` API.  
This API returns wallet instance containing private key. After exporting private key, we can use `integrateWallet` method we've seen before.  

```js
handleLogin = () => {
  const { accessType, keystore, password, privateKey } = this.state

  // Access type2: access thorugh private key
  if (accessType == 'privateKey') {
    this.integrateWallet(privateKey)
    return
  }

  // Access type1: access through keystore + password
  try {
    const { privateKey: privateKeyFromKeystore } = cav.klay.accounts.decrypt(keystore, password)
    this.integrateWallet(privateKeyFromKeystore)
  } catch (e) {
    this.setState({ keystoreMsg: `Password doesn't match.` })
  }
}
```

For further information about decrypting keystore file with password, visit klaytn document site https://docs.klaytn.com/api/toolkit.html#decrypt  

For 3) "User can logout, remove wallet instance information from browser.": logout means remove wallet instance from browser and caver.  
We can remove wallet instance from caver through `cav.klay.accounts.wallet.clear()` which removes all wallet instance from caver.  
We can remove wallet instance stringified as JSON from browser's session storage through `sessionStorage.removeItem('walletInstance')`.  

```js
/**
 * removeWallet method removes
 * 1) wallet instance from caver.klay.accounts
 * 2) 'walletInstance' value from session storage.
 */
removeWallet = () => {
  cav.klay.accounts.wallet.clear()
  sessionStorage.removeItem('walletInstance')
  this.reset()
}
```

For further information about clearing wallet instance from caver, visit klaytn document site https://docs.klaytn.com/api/toolkit.html#walletclear

`src/components/Count.js`:  
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
          Received receipt! It means your transaction calling plus function is in klaytn block(#${receipt.blockNumber})
        `, receipt)
        this.setState({ settingDirection: null })
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
        this.setState({ settingDirection: null })
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
    const { lastParticipant, count, settingDirection } = this.state
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
      </div>
    )
  }
}

export default Count

```

`'Count'` component's role is interacting with Count contract deployed on klaytn blockchain.  

In Count.sol contract, we declared several variables and functions like below:  
1.`count`  
2.`lastParticipant`  
3.`plus` - increase `count` storage variable by 1. (count = count + 1)  
4.`minus` - decrease `count` storage variable by 1. (count = count - 1)

In Count.js component, we should have a methods to interact with Count.sol contract.  
For example, we should have a method which retrieves `count` variable's value and `lastParticipant` value, moreover, we should have a function that set `count` variable and `lastParticipant` also by calling `plus`, `minus` functions.  

To do this, we need contract instance to interact with deployed contract. contract instnace can be made by `caver.klay.Contract(ABI, contractAddress)` API of caver-js. (https://docs.klaytn.com/api/toolkit.html#caverklaycontract)

`Contract ABI`(Application Binary Interface) informs how to call contract method to caver, so caver easily call contrcat method, for example, `contractInstance.methods.count().call()`, `contractInstance.methods.plus().send({ ... })`, `contractInstance.methods.minus().send({ ... })`.

`Contract address` informs where the contract is deployed.
So to make contract instance, contract ABI and contract address is needed. After compiling & deploying our Count.sol contract, we can see it in `build/contracts/Count.json` file. Luckily, we already made `deployedABI` and `deployedAddress` file in our directory after deploying our contract. It contains ABI of our Count contract and deployed contract address. And thanks to webpack's config, we can access it as variable.(`DEPLOYED_ADDRESS`, `DEPLOYED_ABI`)

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

Since we have contract instance, we can call contract method now. out contract instnace has property, `methods`.  
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
However, unlike `count` and `lastParticipant` function read data from klaytn blockchain, this `plus` function __writes data__ to klaytn blockchain.  
Just reading data is free, however writing data has cost for computation & storage. This cost is called `'gas'`. This kind of process is called `'Sending a transaction'`.  
You can easily think `'transaction'` as `writing data to blockchain.` and it costs `'gas'` for computation and storing data.  
It is the reason why for sending a transaction `from:` property is needed to inform klaytn node who will send a transaction(who will pay for this transaction.) and `gas:` property for how much cost will you endure for sending a transaction.  

```js
this.countContract.methods.plus().send({
  from: walletInstance.address,
  gas: '200000',
})
```
So instead `.call()` we used before for calling `count` function, use `.send({ from: ..., gas: ... })`.

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
In `receipt` life cycle, you can get transaction receipt. It means you transaction got into the block. you can check exact block number which your transaction goes into. by `receipt.blockNumber`.  
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

`src/klaytn/caver.js`:  

```js
/**
 * caver-js library make a connection with klaytn node.
 * You could connect to specific klaytn node by changing 'rpcURL' value.
 * If you are running a klaytn full node, set rpcURL to your node's URL.
 * ex) rpcURL: 'http://localhost:8551'
 * default rpcURL is 'http://aspen.klaytn.com'.
 */
import Caver from 'caver-js'

export const config = {
  rpcURL: 'http://aspen.klaytn.com'
}

export const cav = new Caver(config.rpcURL)

export default cav
```

caver-js library make a connection with klaytn node. You could connect to specific klaytn node by changing 'rpcURL' value.  
If you are running a klaytn full node, you can set rpcURL to your node's URL. for example, `rpcURL: 'http://localhost:8551'`  
If not, default rpcURL is `'http://aspen.klaytn.com'`.

[Next: Deploy contract](7-deploy-contract.md)