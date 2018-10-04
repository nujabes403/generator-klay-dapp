import React, { Component } from 'react'
import cx from 'classnames'

import { cav } from 'klaytn/caver'
import { getWallet } from 'utils/wallet'

import './Example.scss'

class Example extends Component<Props> {
  constructor() {
    super()
    // ** 1. Create contract instance **
    // ex:) new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
    // You can call contract method through this instance.
    // Now you can access the instance by `this.exampleContract` variable.
    this.exampleContract = DEPLOYED_ABI
      && DEPLOYED_ADDRESS
      && new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
    this.state = {
      count: '',
      isSetting: false,
    }
  }

  intervalId = null

  getCount = async () => {
    // ** 2. Call contract method (CALL) **
    // ex:) this.exampleContract.methods.methodName(arguments).call()
    // You can call contract method (CALL) like above.
    // For example, your contract has a method called `count`.
    // You can call it like below:
    // ex:) this.exampleContract.methods.count().call()
    // It returns promise, so you can access it by .then() or, use async-await.
    const count = await this.exampleContract.methods.count().call()
    this.setState({ count })
  }

  setCount = (direction) => () => {
    const walletInstance = getWallet()

    // Need to integrate wallet for calling contract method.
    if (!walletInstance) return

    this.setState({ settingDirection: direction })
    // 3. ** Call contract method (SEND) **
    // ex:) this.exampleContract.methods.methodName(arguments).send(txObject)
    // You can call contract method (SEND) like above.
    // For example, your contract has a method called `plus`.
    // You can call it like below:
    // ex:) this.exampleContract.methods.plus().send({
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
    this.exampleContract.methods[direction]().send({
      from: walletInstance.address,
      gas: '200000',
    })
      .once('transactionHash', console.log)
      .once('receipt', () => {
        this.getCount()
        this.setState({ settingDirection: null })
      })
      .once('error', console.log)
  }

  componentDidMount() {
    this.intervalId = setInterval(this.getCount, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { count, settingDirection } = this.state
    return (
      <div className="Example">
        <div className="Example__count">COUNT: {count}</div>
        <button
          onClick={this.setCount('plus')}
          className={cx('Example__button', 'Example__button--plus', {
            'Example__button--setting': settingDirection === 'plus',
          })}
        >
          +
        </button>
        <button
          onClick={this.setCount('minus')}
          className={cx('Example__button', 'Example__button--minus', {
            'Example__button--setting': settingDirection === 'minus',
          })}
        >
          -
        </button>
      </div>
    )
  }
}

export default Example
