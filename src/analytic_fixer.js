if (/blob:/.test(location.href)) throw 'not in blob';
let script = document.createElement('script');
script.textContent = '(' + (function () {
  if ([
    /acfun\.cn\/v\//,
    /acfun\.cn\/bangumi\//,
    /hapame\.com\/video\//
  ].find(i => i.test(location.href))) {
    console.log('[AHP] 假装有flash');
    navigator.mimeTypes["application/x-shockwave-flash"] = navigator.mimeTypes["application/x-shockwave-flash"] || [];
  }
  window.addEventListener('beforeunload', function () {
    XMLHttpRequest = function () {
      return {
        open: function (method, url, async) {
          this.url = url;
        },
        send: function (data){
          navigator.sendBeacon(this.url, data);
          console.log('beacon queued', this.url, data);
        },
      }
    };
  });
  let fakeIsSupported = () => {/*debugger; */return false};
  let fakeCreatePlayer = () => {/*debugger; */throw 'AcFun Official Html5 Player creation BLOCKED';};
  let blockAcPlayerInterval = setInterval(function () {
    if (window.H5Player != undefined) {
      window.H5Player.prototype.isSupport = fakeIsSupported;
      window.H5Player.createPlayer = fakeCreatePlayer;
      window.H5Player.createPlayerDOM = fakeCreatePlayer;
    }
  }, 50);
  window.addEventListener('load', function () {
    clearInterval(blockAcPlayerInterval);
  });
}).toString() + ')();';
document.firstElementChild.appendChild(script).remove();
