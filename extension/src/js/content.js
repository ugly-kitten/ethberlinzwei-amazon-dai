var web3 = document.createElement('script');
web3.src = chrome.runtime.getURL('web3.bundle.js');
web3.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(web3);

var s = document.createElement('script');
s.src = chrome.runtime.getURL('main.bundle.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);





