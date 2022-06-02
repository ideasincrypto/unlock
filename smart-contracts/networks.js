const networks = require('@unlock-protocol/networks')
// When running CI, we connect to the hardhat node container
const testHost = process.env.CI === 'true' ? 'eth-node' : '127.0.0.1'

const hardhatNetworks = {}

Object.keys(networks).forEach((key) => {
  if (['default', 'networks'].indexOf(key) === -1) {
    hardhatNetworks[key] = {
      chainId: networks[key].id,
      name: networks[key].name,
      url: networks[key].publicProvider,
    }
  }
})

module.exports = hardhatNetworks
