var toggle = false;
var ever = false;
chrome.browserAction.onClicked.addListener(function (tab) {
  if (!ever) {
    chrome.tabs.insertCSS({
      file: 'style.css'
    });
    ever = true;
  }
  toggle = !toggle
  if (toggle) {
    chrome.tabs.executeScript({
      file: 'hello.js'
    });
    chrome.browserAction.setIcon({
      path: 'mini.png'
    });
    chrome.browserAction.setTitle({
      title: "Click to make Bucket go away!"
    });
  } else {
    chrome.tabs.executeScript({
      file: 'bye.js'
    });
    chrome.browserAction.setIcon({
      path: 'mini-off.png'
    });
    chrome.browserAction.setTitle({
      title: "Click to make Bucket run around!"
    });
  }

});
