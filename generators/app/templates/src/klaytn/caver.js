import Caver from 'caver-js'

export const config = {
  rpcURL: 'http://aspen.klaytn.com'
}

export const cav = new Caver(config.rpcURL)

export default cav
