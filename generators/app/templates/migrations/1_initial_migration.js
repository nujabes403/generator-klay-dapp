const Migrations = artifacts.require('./Migrations.sol')
const Count = artifacts.require('./Count.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(Count).then(() => {
    // Record recently deployed contract address to 'deployedAddress' file.
    if (Count._json) {

      // Save abi file to deployedABI.
      fs.writeFile('deployedABI', JSON.stringify(Count._json.abi, 2), (err) => {
        if (err) throw err
        console.log(`The abi of ${Count._json.contractName} is recorded on deployedABI file`)
      })
    }

    fs.writeFile('deployedAddress', Count.address, function (err) {
      if (err) throw err
      console.log(`The address ${Count.address} is recorded on deployedAddress file`)
    })
  })
};
