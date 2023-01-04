// const networkConfig = {
//     31337: {
//         name: "localhost",
//     },
//     // 4: {
//     //     name: "rinkby",
//     //     ethUsdPriceFeed: "0xF4a33860558De61DBAbDc8BFdb98FD742fA8028e",
//     // },
//     // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
//     5: {
//         name: "goerli",
//         ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
//     },
// }

// const developmentChain = ["hardhat", "local"]

// module.exports = {
//     networkConfig,
//     developmentChain,
// }

const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    5: {
        name: "goerli",
        // ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
