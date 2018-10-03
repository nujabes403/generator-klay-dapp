import {
  INTEGRATE_WALLET,
  LOAD_WALLET,
  REMOVE_WALLET,
} from 'actions/actionTypes'

export const integrateWallet = (privateKey) => ({
  type: INTEGRATE_WALLET,
  payload: { privateKey },
})

export const loadWallet = (walletInstance) => ({
  type: LOAD_WALLET,
  payload: { walletInstance },
})

export const removeWallet = () => ({
  type: REMOVE_WALLET,
})
