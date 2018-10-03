import store from '../store'

export const getWallet = () => {
  const walletState = store.getState().wallet
  return walletState.walletInstance
}

export default getWallet
