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
  /*
  Object.defineProperty(window, 'H5Player', {
    value: null,
    configurable: false,
    writable: false
  })*/
  let blockAcPlayerInterval = setInterval(function () {
    if (window.H5Player != undefined) {
      clearInterval(blockAcPlayerInterval);
      window.H5Player = new Proxy(window.H5Player, {
        get: function (target, property, receiver) {
          if (property === 'createPlayer' || property === 'createPlayerDOM') {
            throw 'AcFun Official Html5 Player creation BLOCKED';
          }
          if (property === 'prototype') {
            target[property].isSupport = function () {return false}
          }
          console.log('[get]', property, target[property]);
          return target[property];
        },
        set: function (target, property, value, receiver) {
          console.log('[set]', property, value);
          return target[property] = value;
        }
      });
    }
  }, 0);
  window.addEventListener('load', function () {
    clearInterval(blockAcPlayerInterval);
  });
}).toString() + ')();';
document.firstElementChild.appendChild(script).remove();
