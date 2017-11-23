chrome.runtime.onMessage.addListener(function (message, sender, resolve) {
  if (message == 'version') {
    fetch(chrome.extension.getURL('manifest.json')).then(
      function (r) {
        r.json().then(function (manifest) {
          resolve(manifest.version);
        });
      }
    );
    return true;
  } else if (message == 'inject') {
    let tabId = sender.tab.id,
      frameId = sender.frameId;
    injector(tabId, frameId, resolve);
    return true;
  }
});

function injector(tabId, frameId, resolve) {
  let files = [
    "dom_gen.js",
    "resizeSensor.js",
    "rc4.js",
    "jquery-2.1.4.min.js",
    "google-style-loading.min.js",
    "CommentCoreLibrary.min.js",
    "biliplus_shield.min.js",
    "ABPlayer.min.js",
    "acfun_html5_inner.js"
  ],
    loopFunc = function () {
      if (!files.length) {
        resolve();
        return;
      }
      let file = files.shift();
      chrome.tabs.executeScript(
        tabId,
        {
          allFrames: false,
          file,
          frameId,
          runAt: 'document_end',
          matchAboutBlank: true
        },
        loopFunc
      );
    };
  chrome.tabs.insertCSS(
    tabId,
    {
      allFrames: false,
      file: 'ABPlayer.css',
      frameId,
      matchAboutBlank: true
    },
    loopFunc
  );
}