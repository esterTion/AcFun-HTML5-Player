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
        send: function (data) {
          navigator.sendBeacon(this.url, data);
          console.log('beacon queued', this.url, data);
        },
      }
    };
  });
  MediaSource.isTypeSupported = () => false;
  var hack = document.firstElementChild.appendChild(document.createElement('style'));
  hack.className = 'player';
}).toString() + ')();';
document.firstElementChild.appendChild(script).remove();
