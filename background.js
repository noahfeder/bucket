chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.insertCSS({
    file: 'style.css'
  }, function() {
      chrome.tabs.executeScript({
          file: 'hello.js'
      });
  });
});
