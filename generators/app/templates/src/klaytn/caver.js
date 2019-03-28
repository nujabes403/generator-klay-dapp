/**
 * caver-js library make a connection with klaytn node.
 * You could connect to specific klaytn node by changing 'rpcURL' value.
 * If you are running a klaytn full node, set rpcURL to your node's URL.
 * ex) rpcURL: 'http://localhost:8551'
 * default rpcURL is 'https://api.baobab.klaytn.net:8651'.
 */
import Caver from 'caver-js'

export const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}

export const cav = new Caver(config.rpcURL)

export default cav
