chrome.webRequest.onBeforeSendHeaders.addListener(function (d) {
  for (let i of d.requestHeaders) {
    if (i.name.toLowerCase() == 'user-agent') i.value = 'yk_acfun;440;Android;7.0;MI 6';
  }
  return { requestHeaders: d.requestHeaders };
},
  { urls: [
    '*://video.acfun.cn/*',
    '*://*/video.acfun.cn/*'
  ], types: ['xmlhttprequest'] },
  ['requestHeaders', 'blocking']
);
chrome.webRequest.onBeforeSendHeaders.addListener(function (d) {
  let hit = false;
  for (let i of d.requestHeaders) {
    if (i.name.toLowerCase() == 'referer') {
      i.value = 'http://www.acfun.cn/';
      hit = true;
    }
  }
  if (!hit) d.requestHeaders.push({
    name: 'referer',
    value: 'http://www.acfun.cn/'
  })
  return { requestHeaders: d.requestHeaders };
},
  { urls: [
    '*://player.acfun.cn/flash_data*'
  ], types: ['xmlhttprequest'] },
  ['requestHeaders', 'blocking', 'extraHeaders']
);
