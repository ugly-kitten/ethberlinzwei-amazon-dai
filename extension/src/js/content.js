let payAction = () => {
    document.getElementById("gcpromoinput").value = "dai dai";

    // todo add payment logic
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
