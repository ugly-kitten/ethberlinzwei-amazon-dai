document.body.style.background = 'green';

var iFrame  = document.createElement ("iframe");
iFrame.src  = chrome.extension.getURL ("embedded.html");

document.body.insertBefore (iFrame, document.body.firstChild);