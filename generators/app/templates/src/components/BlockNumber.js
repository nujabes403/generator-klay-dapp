import React, { Component } from 'react'

import { cav } from 'klaytn/caver'

import './BlockNumber.scss'

class BlockNumber extends Component<Props> {
  state = {
    currentBlockNumber: '...loading',
  }

  getBlockNumber = async () => {
    const blockNumber = await cav.klay.getBlockNumber()
    this.setState({ currentBlockNumber: blockNumber })
  }

  intervalId = null

  componentDidMount() {
    this.intervalId = setInterval(this.getBlockNumber, 1000)
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  render() {
    const { currentBlockNumber } = this.state
    return (
      <div className="BlockNumber">
      <img
        className="BlockNumber__icon"
        src={`/images/block-${((currentBlockNumber % 5) + 1) || 1}.svg`}
      />
      <span className="BlockNumber__current">Block No. {currentBlockNumber}</span>
      </div>
    )
  }
}

export default BlockNumber
