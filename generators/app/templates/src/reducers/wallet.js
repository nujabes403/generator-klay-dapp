import {
  INTEGRATE_WALLET,
  LOAD_WALLET,
  REMOVE_WALLET,
} from 'actions/actionTypes'

import { cav } from 'klaytn/caver'

const initialState = {
  walletInstance: ''
}

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case INTEGRATE_WALLET:
      const walletInstance = cav.klay.accounts.privateKeyToAccount(action.payload.privateKey)
      cav.klay.accounts.wallet.add(walletInstance)
      sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance))
      return {
        ...state,
        walletInstance,
      }
    case LOAD_WALLET:
      cav.klay.accounts.wallet.add(action.payload.walletInstance)
      return {
        ...state,
        walletInstance: action.payload.walletInstance,
      }
    case REMOVE_WALLET:
      sessionStorage.removeItem('walletInstance')
      return {
        ...state,
        walletInstance: ''
      }
    default:
      return state
  }
}

export default walletReducer
