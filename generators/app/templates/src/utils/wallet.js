import store from '../store'

export const getWallet = () => {
  const walletState = store.getState().wallet
  return walletState && walletState.walletInstance
}

export default getWallet
