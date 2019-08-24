import Web3 from './web3'
let daiContractAbi = [{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];


const daiContractAddress = "0x2cab5720ce6e95fdfda58c1a6c693580324b7109"
const amazonDaiBackendUrl = "http://localhost:3000"
let web3

export default async function checkout(merchantAccount, customerEmail, daiAmount) {

    if (!window.ethereum) {
        throw (new Error("You browser does not support crypto payments"))
    }
    const accounts = await window.ethereum.enable()
    const paymentAccount = accounts[0]
    if (!web3) {
        web3 = new Web3(window.ethereum)
    }

    const transactionHash = await submitPaymentTransaction(web3, paymentAccount, merchantAccount, daiContractAddress, daiAmount)
   // const voucher = await submitPaymentReceipt(transactionHash, customerEmail)
    const voucher = "party party";
    return {transactionHash, voucher};
}

async function submitPaymentTransaction(web3, paymentAccount, merchantAccount, daiContractAddress, daiAmount) {

    const fromAddress = paymentAccount
    const toAddress = merchantAccount
    const amount = web3.utils.toHex(daiAmount)
    const count = await web3.eth.getTransactionCount(fromAddress)

    const transactionConfig = {
        "gasPrice": web3.utils.toHex(2 * 1e9),
        "gasLimit": web3.utils.toHex(210000),
        "nonce": web3.utils.toHex(count)
    }

    const contract = new web3.eth.Contract(daiContractAbi, daiContractAddress)

    var rawTransaction = {
        "from": fromAddress,
        "gasPrice": web3.utils.toHex(2 * 1e9),
        "gasLimit": web3.utils.toHex(210000),
        "to": daiContractAddress,
        "data": contract.methods.transferFrom(fromAddress, toAddress, amount).encodeABI(),
        "nonce": web3.utils.toHex(count)
    }

    //const signedTransaction = await web3.eth.signTransaction(rawTransaction)
    const transactionHash = await web3.eth.sendTransaction(rawTransaction)
    return transactionHash

}

async function submitPaymentReceipt(transactionHash, customerEmail) {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        data: {
            txid: transactionHash,
            email: customerEmail
        }
    }

    let res
    try {
        res = await fetch(`${amazonDaiBackendUrl}/voucher`, settings)
        return res.json()
    } catch (error) {
        throw (new Error(`Can not connect to backend service ${error}`))
    }
}