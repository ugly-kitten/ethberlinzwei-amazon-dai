let payAction = () => {
    document.getElementById("gcpromoinput").value = "dai dai";
}

let wrapperForDai = document.getElementById("imb-wrapper");
let daiBox;

let addBox = () => {
    daiBox = document.createElement('div');
    daiBox.setAttribute('class', 'a-box a-spacing-base');
    wrapperForDai.appendChild(daiBox);

};

let addHeadline = () => {
    var headline = document.createElement('h1');
    headline.setAttribute("class", "a-spacing-base");
    headline.innerHTML = "Pay with Crypto";
    wrapperForDai.appendChild(headline);
};

let addDAIButton = () => {
    let button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Pay with DAI');
    button.setAttribute('class', ' a-button-text');
    button.addEventListener("click", payAction, false);
    wrapperForDai.appendChild(document.createElement('br'));

    let text = document.createElement('p');
    text.value = "At Amazon we support your Crypto";

   daiBox.appendChild(text);
   daiBox.appendChild(button);


};
addHeadline();
addBox();
addDAIButton();


//
// var iFrame  = document.createElement ("iframe");
// iFrame.src  = chrome.extension.getURL ("embedded.html");
//
// document.body.insertBefore (iFrame, document.body.firstChild);