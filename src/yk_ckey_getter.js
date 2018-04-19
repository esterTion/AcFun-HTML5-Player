document.head.appendChild(_('script', {}, [_('text', '(' + function () {
  var source;
  window.addEventListener('message', e => {
    console.log(e);
    if (e.data == 'AHP_get_stream') {
      source = e.source;
      sendStreamBack();
    }
  });
  var sendStreamBack = function () {
    var ckey = _getUA();
    if (ckey == '') return setTimeout(sendStreamBack, 500);
    fetch('//ups.youku.com/ups/get.json?vid=' + encodeURIComponent(PageConfig.videoId2) + '&ccode=0502&client_ip=192.168.1.2&utid=' + encodeURIComponent(document.cookie.match(/cna=([^;]+)/)[1]) + '&client_ts=' + Date.now() + '&ckey=' + encodeURIComponent(ckey), {
      method: 'GET',
      credentials: 'include',
      referrer: location.href,
      cache: 'no-cache'
    }).then(function (r) { return r.json(); }).then(r=> {
      source.postMessage(JSON.stringify({ 'cmd': 'stream', 'data': r }), '*');
    });
  }
}.toString() + ')();')]));