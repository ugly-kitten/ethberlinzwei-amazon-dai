let daiContractAbi = [{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const Web3Utils = require("web3-utils")
const Web3 = require("web3")
const daiContractAddress = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
const merchantAddress = "0xE6C0353e8b6ce79814BBA28C0eEB08C0268dEc45"
const amazonDaiBackendUrl = "http://localhost:3001"
let web3

let enterVoucher = (voucher) => {
    document.getElementById("gcpromoinput").value = voucher;
   
    let voucherButton = document.getElementById("button-add-gcpromo");
    voucherButton.form.submit();
    // remove voucher display
    setInterval(function(){
        let voucherInfo = document.getElementById("existing-balance");
        voucherInfo && voucherInfo.setAttribute("hidden", true);
        hideOtherPayments();
        addSuccessInfo();
        }, 400);
 };

let payAction = async () => {
    document.getElementById("gcpromoinput").value = "dai dai";
    const { voucher, transactionHash } = await checkout(merchantAddress,"very@ugly-kitten.com", 10620000000000000000);

    enterVoucher(voucher);
    addSuccessInfo(transactionHash);
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
    let voucherInfo = document.getElementById("existing-balance");
    voucherInfo && voucherInfo.setAttribute("hidden", true);
    addHeadline();
    addBox();
    addDAIButton();

};

let hideOtherPayments = () => {
    let mainPayments = document.getElementById("existing-payment-methods");
    mainPayments && mainPayments.setAttribute("hidden", true);
    let alternativePayments =  document.getElementById("new-payment-methods");
    alternativePayments && alternativePayments.setAttribute("hidden", true);
 }

let injectAmazon = () => {
    let isReviewOrder = document.getElementById("payment-information");
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