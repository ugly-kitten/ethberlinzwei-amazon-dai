import Web3 from './web3'
let daiContractAbi = [{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const daiContractAddress = "0x2cab5720ce6e95fdfda58c1a6c693580324b7109"
const amazonDaiBackendUrl = "http://localhost:3000"
let web3

let payAction = async () => {
    document.getElementById("gcpromoinput").value = "dai dai";

    console.log(window);
    console.log(window.ethereum);
  // let result = await daiCheckout(daiContractAddress,"dummy@dummy.de","1000");

    let txHash = "0x68147866d3b99da7e3ccab5a1cd21e8fc89b98e5e4b8d63b172f6cda25320e90";
    addSuccessInfo(txHash);
}

let wrapperForDai = document.getElementById("imb-wrapper");
let daiBox;
let daiButton;
let text;

let addBox = () => {
    daiBox = document.createElement('div');
    daiBox.setAttribute('class', 'a-box a-spacing-base');
    daiBox.setAttribute('style', 'width:805px;paddingBottom:10px;paddingLeft:10px');
    wrapperForDai.appendChild(daiBox);

};

let addHeadline = () => {
    let headline = document.createElement('h1');
    headline.setAttribute("class", "a-spacing-base");
    headline.innerHTML = "Pay with Crypto";
    wrapperForDai.appendChild(headline);
};

let addDAIButton = () => {
    daiButton = document.createElement('input');
    daiButton.setAttribute('type', 'button');
    daiButton.setAttribute('value', 'Pay with DAI');
    daiButton.setAttribute('class', ' a-button-text');
    daiButton.addEventListener("click", payAction, false);
    wrapperForDai.appendChild(document.createElement('br'));

    text = document.createElement('p');
    text.innerText = "At Amazon we support your Crypto";

    daiBox.appendChild(text);
    daiBox.appendChild(daiButton);
    daiBox.appendChild(document.createElement('br'));


};

let hideOtherPayments = () => {
    let mainPayments = document.getElementById("existing-payment-methods");
    mainPayments.setAttribute("hidden", true);

    let alternativePayments =  document.getElementById("new-payment-methods");
    alternativePayments.setAttribute("hidden", true);
}

let addSuccessInfo = (txHash) => {
    hideOtherPayments();
    daiButton.setAttribute("hidden", true);
    text.innerText = "Success! TxHash:" + txHash;
};

let injectAmazon = () => {
    addHeadline();
    addBox();
    addDAIButton();
};

injectAmazon();



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
    const transaction = await web3.eth.sendTransaction(rawTransaction)
    return transaction.transactionHash
}

async function submitPaymentReceipt(transactionHash, customerEmail) {
    const settings = {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods":"*"
        },
        body: JSON.stringify({
            txid: transactionHash,
            email: customerEmail
        }),
        mode: "cors"
    }
    
    let res
    try {
        res = await fetch(`${amazonDaiBackendUrl}/voucher`, settings)
        console.log(res)
        return res
    } catch (error) {
        throw (new Error(`Can not connect to backend service ${error}`))
    }    
}