const Migrations = artifacts.require('./Migrations.sol')
const ExampleContract = artifacts.require('./ExampleContract.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(ExampleContract).then(() => {
    // Record recently deployed contract address to 'deployedAddress' file.
    if (ExampleContract._json) {

      // Save abi file to deployedABI.
      fs.writeFile('deployedABI', JSON.stringify(ExampleContract._json.abi, 2), (err) => {
        if (err) throw err
        console.log(`The abi of ${ExampleContract._json.contractName} is recorded on deployedABI file`)
      })
    }

    fs.writeFile('deployedAddress', ExampleContract.address, function (err) {
      if (err) throw err
      console.log(`The address ${ExampleContract.address} is recorded on deployedAddress file`)
    })
  })
};
