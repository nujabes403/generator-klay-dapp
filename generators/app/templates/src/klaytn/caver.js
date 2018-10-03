import Caver from 'caver-js'

export const config = {
  rpcURL: 'http://localhost:8551'
}

export const cav = new Caver(new Caver.providers.HttpProvider(config.rpcURL))
