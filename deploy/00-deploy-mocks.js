const { network } = require("hardhat")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //can also write:
    // if (developmentChain.includes(network.name)) {
    if (chainId == 31337) {
        console.log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            logs: true,
            args: [DECIMALS, INITIAL_PRICE],
        })

        log("Mocks Deployed!")
        log("-----------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
