import React, { Component } from 'react'

import { cav } from 'klaytn/caver'
import BlockNumber from 'components/BlockNumber'
import Auth from 'components/Auth'

import './App.scss'

class App extends Component<Props> {
  componentWillMount() {
    const walletFromSession = sessionStorage.getItem('walletInstance')

    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession))
      } catch (e) {
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
