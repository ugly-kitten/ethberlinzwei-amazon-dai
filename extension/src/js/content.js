let payAction = () => {
    document.getElementById("gcpromoinput").value = "dai dai";
}

let wrapperForDai = document.getElementById("imb-wrapper");
let daiBox;

let addBox = () => {
    daiBox = document.createElement('div');
    daiBox.setAttribute('class', 'a-box a-spacing-base');
    daiBox.setAttribute('style', 'width:805px;paddingBottom:10px;paddingLeft:10px');
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
    text.innerText = "At Amazon we support your Crypto";

   daiBox.appendChild(text);
   daiBox.appendChild(button);
   daiBox.appendChild(document.createElement('br'));


};
addHeadline();
addBox();
addDAIButton();


//
// var iFrame  = document.createElement ("iframe");
// iFrame.src  = chrome.extension.getURL ("embedded.html");
//
// document.body.insertBefore (iFrame, document.body.firstChild);