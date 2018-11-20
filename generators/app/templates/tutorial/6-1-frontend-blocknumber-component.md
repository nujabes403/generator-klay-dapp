`src/components/BlockNumber.js`:  

## `BlockNumber` component
1) Full code  
2) BlockNumber component's role  
3) `getBlockNumber` method in detail  
4) Call `getBlockNumber` intervally  


### 1) Full code
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
### 2) BlockNumber component's role
`'BlockNumber'` component's role is showing klaytn's current block number.  
It requests current block number to klaytn node by calling caver.js's API `caver.klay.getBlockNumber()` method per 1 second. When response having current block number comes from klaytn node, it re-renders DOM through `this.setState({ currentBlockNumber: blockNumber })`.  

### 3) `getBlockNumber` method in detail
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

### 4) Call `getBlockNumber` intervally
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

[Next: Frontend code detail: Auth component](6-2-frontend-auth-component.md)
