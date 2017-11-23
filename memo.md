WebSocket实现：  
（443端口的ws，很强）  
```Javascript
  sock = new WebSocket('ws://danmaku.acfun.cn:443/5391923');
  sock.addEventListener('open', () => {
		var obj = {
			client: '16bk983221049',
			client_ck: '884509046',
			vid: '5391923',
			vlength: 0,
			time: Date.now(),
			uid: null,
			uid_ck: null
		}
		var data = JSON.stringify({ action: 'auth', command: JSON.stringify(obj) })
		console.log(data)
		sock.send(data)
  });
  sock.addEventListener('message', function message(d) {
		console.log('message', d.data);
	});
  sendInterval = setInterval(function () { console.log('online check'); sock.send(JSON.stringify({ "action": "onlanNumber", "command": "WALLE DOES NOT HAVE PENNIS" })) }, 3e4);
```

视频地址API：
```
GET http://player.acfun.cn/flash_data
Query Param:
vid=5a10f4e20cf2ff0931a799ab& (getVideo.aspx -> encode)
ct=85&
ev=3&
sign=1_1511357906_0a812895654f739731a7ea5d0c2d2078& (getVideo.aspx -> sourceId)
time=1511357982391
```
数据使用rc4加密