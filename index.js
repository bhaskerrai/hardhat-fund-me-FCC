import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")


connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw


console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" }) //this will pop up metamask connection option
        // console.log("Connected!")
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please intall Metamask!"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value

    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        /* we need:
        1. provider / connection to the blockchain
        2. signer / wallet / someone with some gas
        3. contract that we are interacting with
        4. ABI & Address
        */
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount)})
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        }

        catch (error) {
            console.log(error)
        }

    }
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }

}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)    
    //listen for the transaction to finish

    return new Promise((resolve, reject) => {

        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
         })
    
    })
    
}


async function withdraw(){
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        }
        catch (error) {
            console.log(error)
        }
        
}

}
