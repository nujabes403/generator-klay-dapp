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

  setCount = (direction) => () => {
    const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0]

    // Need to integrate wallet for calling contract method.
    if (!walletInstance) return

    this.setState({ settingDirection: direction })
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

    // It returns event emitter, so after sending, you can listen on event.
    // Use .on('transactionHash') event,
    // : if you want to handle logic after sending transaction.
    // Use .once('receipt') event,
    // : if you want to handle logic after your transaction is put into block.
    // ex:) .once('receipt', (data) => {
    //   console.log(data)
    // })
    this.countContract.methods[direction]().send({
      from: walletInstance.address,
      gas: '200000',
    })
      .once('transactionHash', console.log)
      .once('receipt', () => {
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
          onClick={this.setCount('plus')}
          className={cx('Count__button', 'Count__button--plus', {
            'Count__button--setting': settingDirection === 'plus',
          })}
        >
          +
        </button>
        <button
          onClick={this.setCount('minus')}
          className={cx('Count__button', 'Count__button--minus', {
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

`this.countContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)` make a contract instance to interact interact with deployed `Count` contract, by providing `DEPLOYED_ABI` and `DEPLOYED_ADDRESS` to `cav.klay.Contract` API. and this contract instance is stored to `this.countContract`.  

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
setCount = (direction) => () => {
  const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0]

  // Need to integrate wallet for calling contract method.
  if (!walletInstance) return

  this.setState({ settingDirection: direction })
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

  // It returns event emitter, so after sending, you can listen on event.
  // Use .on('transactionHash') event,
  // : if you want to handle logic after sending transaction.
  // Use .once('receipt') event,
  // : if you want to handle logic after your transaction is put into block.
  // ex:) .once('receipt', (data) => {
  //   console.log(data)
  // })
  this.countContract.methods[direction]().send({
    from: walletInstance.address,
    gas: '200000',
  })
    .once('transactionHash', console.log)
    .once('receipt', () => {
      this.setState({ settingDirection: null })
    })
    .once('error', (error) => {
      alert(error.message)
      this.setState({ settingDirection: null })
    })
}
```

`setCount`....

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


## G. Deploy your smart contract code
1) truffle configuration  
`truffle.js`:  

`truffle.js`

1. DEPLOY METHOD 1: By private key
You shouldn't expose your private key. Otherwise, your account would be hacked.
If you deploy your contract through private key, `provider` option is needed.
1) set your private key to 1st argument on `new PrivateKeyConnector()` function.
2) set your node's URL to 2nd argument on `new PrivateKeyConnector()` function.
example)
{
 ...,
 provider: new PrivateKeyConnector(
   '0x48f5a77dbf13b436ae0325ae91efd084430d2da1123a8c273d7df5009248f90c',
   `http://aspen.klaytn.com`,
  ),
 ...
}
If you deploy your contract with private key connector,
You don't need to set `host`, `port`, `from` option.
2. DEPLOY METHOD 2: By unlocked account
You must set `host`, `port`, `from` option
to deploy your contract with unlocked account.
example)
{
 ...,
 host: 'localhost',
 port: 8551,
 from: '0xd0122fc8df283027b6285cc889f5aa624eac1d23',
 ...
}
If you deploy your contract with unlocked account on klaytn node,
You don't need to set `provider` option.

```
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

2) Deploy setup (What contract do you want to deploy?)  
`migrations/2_deploy_contracts.js`:  


3) Deploy  
type  `$ truffle deploy --network klaytn`

## H. Let's run our app
Run our app in browser.  
type `$ npm run local`

## I. Let's expose your first bapp to your friends with AWS S3.
Build our app with optimization.
type `$npm run build`
