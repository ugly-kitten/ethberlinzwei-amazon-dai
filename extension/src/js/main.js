let daiContractAbi = [{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const Web3Utils = require("web3-utils")
const Web3 = require("web3")
const daiContractAddress = "0x2cab5720ce6e95fdfda58c1a6c693580324b7109"
const amazonDaiBackendUrl = "http://localhost:3001"
let web3

console.log("web 3");
console.log(Web3);


let enterVoucher = () => {
    /*document.getElementById("gcpromoinput").value = "dai dai";
    let voucherButton = document.getElementById('button-add-gcpromo');
    voucherButton.form.submit();*/

    // remove voucher display
    let voucherInfo = document.getElementById("existing-balance");
    voucherInfo.setAttribute("hidden", true);


}


let payAction = async () => {
    document.getElementById("gcpromoinput").value = "dai dai";
    const voucher = await checkout(daiContractAddress,"very@ugly-kitten.com",1000);

    // metamask checkout
    //let result = await checkout(daiContractAddress,"dummy@dummy.de",1000);

    let txHash = "0x68147866d3b99da7e3ccab5a1cd21e8fc89b98e5e4b8d63b172f6cda25320e90";
    enterVoucher();
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

let injectReviewOrder = () => {
    let reviewOrder = document.getElementById("payment-information");
    reviewOrder.innerHTML = "Paid with DAI <img src=\"https://cdn.publish0x.com/prod/fs/images/b5e62e07277bdc3e8954015bfa47e1f5108018db927e3c0428d2c7a8d6496baa.png\" width=\"10%\">";

};

let injectPaymentList = () => {
    addHeadline();
    addBox();
    addDAIButton();

};


let injectAmazon = () => {
    let isReviewOrder = document.getElementById("payment-information");
    console.log("ishere");
    console.log(isReviewOrder);
    if (isReviewOrder !== null && isReviewOrder !== undefined ) {
        injectReviewOrder();
    }

    let isPaymentList = document.getElementById("imb-wrapper");
    if (isPaymentList !== null && isPaymentList  !== undefined) {
        injectPaymentList();
    }

};

// start script
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
    const voucher = await submitPaymentReceipt(transactionHash, customerEmail)
    return {transactionHash, voucher};
}

async function submitPaymentTransaction(web3, paymentAccount, merchantAccount, daiContractAddress, daiAmount) {
    const fromAddress = paymentAccount
    const toAddress = merchantAccount
    const amount = Web3Utils.toHex(daiAmount)
    const count = await web3.eth.getTransactionCount(fromAddress)

    const transactionConfig = {
        "gasPrice": Web3Utils.toHex(2 * 1e9),
        "gasLimit": Web3Utils.toHex(210000),
        "nonce": Web3Utils.toHex(count)
    }

    const contract = new web3.eth.Contract(daiContractAbi, daiContractAddress)

    var rawTransaction = {
        "from": fromAddress,
        "gasPrice": Web3Utils.toHex(2 * 1e9),
        "gasLimit": Web3Utils.toHex(210000),
        "to": daiContractAddress,
        "data": contract.methods.transferFrom(fromAddress, toAddress, amount).encodeABI(),
        "nonce": Web3Utils.toHex(count)
    }

    const transaction = await web3.eth.sendTransaction(rawTransaction)
    return transaction.transactionHash
}

async function submitPaymentReceipt(transactionHash, customerEmail) {
    return new Promise((resolve, reject) => {
        const settings = {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                txid: transactionHash,
                email: customerEmail
            })
        }
        try {
           fetch(`${amazonDaiBackendUrl}/voucher`, settings)
           .then(function(response) {
                return response.json();
            }).then(function(data) {
                resolve(data.token)
            });
        } catch (error) {
            reject(new Error(`Can not connect to backend service ${error}`))
        }

      })
}