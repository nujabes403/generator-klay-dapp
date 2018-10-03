import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'

import { cav } from 'klaytn/caver'

import * as walletActions from 'actions/wallet'

type Props = {

}

import './Auth.scss'

class Auth extends Component<Props> {
  state = {
    privateKey: '',
    password: '',
    keystoreMsg: '',
    keystore: '',
    accessType: 'keystore', // || 'privateKey'
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleImport = (e) => {
    const keystore = e.target.files[0]
    const fileName = keystore && keystore.name
    const fileReader = new FileReader()
    fileReader.onload = ({ target }) => {
      try {
        const parsedKeystore = JSON.parse(target.result)

        const isValidKeystore = parsedKeystore.version &&
          parsedKeystore.id &&
          parsedKeystore.address &&
          parsedKeystore.crypto

        if (!isValidKeystore) {
          this.setState({ keystoreMsg: '올바르지 않은 키스토어입니다.' })
          return
        }

        this.setState({
          keystoreMsg: '올바른 키스토어 파일입니다. 패스워드를 입력해주세요.',
          fileName,
          keystore: target.result,
          keystoreAddress: parsedKeystore.address,
        }, () => document.querySelector('#input-password').focus())
      } catch (e) {
        this.setState({ keystoreMsg: '올바른 키스토어 파일 (JSON)이 아닙니다.' })
        return
      }
    }
    fileReader.readAsText(keystore)
  }

  handleLogin = () => {
    const { keystore, password, privateKey, accessType } = this.state
    const { integrateWallet } = this.props

    // Access type1: access through keystore + password
    if (accessType == 'keystore') {
      try {
        const { privateKey: privateKeyFromKeystore } = cav.klay.accounts.decrypt(keystore, password)
        integrateWallet(privateKeyFromKeystore)
        this.reset()
      } catch (e) {
        console.log(e)
        this.setState({ keystoreMsg: '패스워드가 맞지 않습니다.' })
      }
      return
    }

    // Access type2: access thorugh private key
    integrateWallet(privateKey)
    this.reset()
  }

  toggleAccessType = () => {
    const { accessType } = this.state
    this.setState({
      accessType: accessType === 'privateKey' ? 'keystore' : 'privateKey'
    }, this.reset)
  }

  renderAuth = () => {
    const { privateKey, keystoreMsg, accessType } = this.state
    const { walletInstance, integrateWallet, removeWallet } = this.props
    if (walletInstance) {
      return (
        <Fragment>
          <label className="Auth__label">Integrated: </label>
          <p className="Auth__address">{walletInstance.address}</p>
          <button className="Auth__logout" onClick={removeWallet}>Logout</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        {accessType === 'keystore'
          ? (
            <Fragment>
              <label className="Auth__label">Keystore:</label>
              <input className="Auth__keystoreInput" type="file" onChange={this.handleImport} />
              <label className="Auth__label">Password:</label>
              <input id="input-password" className="Auth__passwordInput" name="password" type="password" onChange={this.handleChange} />
            </Fragment>
          )
          : (
            <Fragment>
              <label className="Auth__label">Private Key:</label>
              <input className="Auth__input" name="privateKey" onChange={this.handleChange} />
            </Fragment>
          )
        }
        <button className="Auth__login" onClick={this.handleLogin}>Login</button>
        <p className="Auth__keystoreMsg">{keystoreMsg}</p>
        <p className="Auth__toggleAccessButton" onClick={this.toggleAccessType}>
          {accessType === 'privateKey'
            ? 'Want to login with keystore? (click)'
            : 'Want to login with privatekey? (click)'
          }
        </p>
      </Fragment>
    )
  }

  reset = () => {
    this.setState({
      keystore: '',
      privateKey: '',
      password: '',
      keystoreMsg: ''
    })
  }

  render() {
    const { keystore } = this.state
    return (
      <div className={cx('Auth', {
        'Auth--active': !!keystore,
      })}
      >
        <div className="Auth__flag" />
        <div className="Auth__content">
          {this.renderAuth()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  walletInstance: state.wallet.walletInstance,
})

const mapDispatchToProps = (dispatch) => ({
  integrateWallet: (privateKey) => dispatch(walletActions.integrateWallet(privateKey)),
  removeWallet: () => dispatch(walletActions.removeWallet()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)
