/**
 * truffle.js config for klaytn.
 *
 * There are two method for deploying contract to klaytn.
 *
 * 1. DEPLOY METHOD 1: By private key
 *
 * ** WARNING **
 * You shouldn't expose your private key. Otherwise, your account would be hacked.
 *
 * If you deploy your contract through private key, `provider` option is needed.
 * 1) set your private key to 1st argument on `new PrivateKeyConnector()` function.
 * 2) set your node's URL to 2nd argument on `new PrivateKeyConnector()` function.
 * example)
 * {
 *  ...,
 *  provider: new PrivateKeyConnector(
 *    '0x48f5a77dbf13b436ae0325ae91efd084430d2da1123a8c273d7df5009248f90c',
 *    `http://aspen.klaytn.com`,
 *   ),
 *  ...
 * }
 * If you deploy your contract with private key connector,
 * You don't need to set `host`, `port`, `from` option.
 */

/**
 * 2. DEPLOY METHOD 2: By unlocked account
 * You must set `host`, `port`, `from` option
 * to deploy your contract with unlocked account.
 *
 * example)
 * {
 *  ...,
 *  host: 'localhost',
 *  port: 8551,
 *  from: '0xd0122fc8df283027b6285cc889f5aa624eac1d23',
 *  ...
 * }
 * If you deploy your contract with unlocked account on klaytn node,
 * You don't need to set `provider` option.
 */

const PrivateKeyConnector = require('connect-privkey-to-provider')

/**
 * truffle network variables
 * for deploying contract to klaytn network.
 */
const NETWORK_ID = '1001'
const GASLIMIT = '20000000'

/**
 * parameters for DEPLOY METHOD 1(By private key)
 */
const URL = `https://api.baobab.klaytn.net:8651`
const PRIVATE_KEY = '0x48f5a77dbf13b436ae0325ae91efd084430d2da1123a8c273d7df5009248f90c'

/**
 * parameters for DEPLOY METHOD 2(By unlocked account)
 */
// const FROM = 'PUT YOUR ADDRESS(DEPLOYER ADDRESS)'
// const HOST = 'localhost'
// const PORT = '8551'

/**
 * network description
 * @param {string} from - wallet address for deploying
 * @param {string} network_id - network id of klaytn node (default: 1000)
 * @param {string} host - host for deploying
 * @param {string} port - port for deploying
 * @param {string} gas - Upper limit of gas for deploying.
 */
module.exports = {
  networks: {
    /**
     * DEPLOY METHOD 1: By private key.
     * You shouldn't expose your private key. Otherwise, your account would be hacked!!
     */
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },

    /**
     * DEPLOY METHOD 2: By unlocked account
     */
    // klaytn: {
    //   host: HOST,
    //   port: PORT,
    //   network_id: NETWORK_ID,
    //   from: FROM,
    //   gas: GASLIMIT,
    //   gasPrice: null,
    // },
  },
}
