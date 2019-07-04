/*
  Code Source: https://github.com/spacemeowx2/DouyuHTML5Player/blob/f6c490aefa5d683ce46c817ab20c095e5c85c389/src/hookfetch.js
*/
if( isChrome && (location.protocol=='https:' || chromeVer >= 73) ){
  console.log('chrome+https环境 或 chrome73+，替换fetch');

  let originalFetch = window.fetch;

  function hookFetchCode () {
    // let self = this
    const convertHeader = function convertHeader (headers) {
      let out = new Headers()
      for (let key of Object.keys(headers)) {
        out.set(key, headers[key])
      }
      return out
    }
    const hideHookStack = stack => {
      return stack.replace(/^\s*at\s.*?hookfetch\.js:\d.*$\n/mg, '')
    }
    const base64ToUint8 = (b64) => {
      const s = atob(b64)
      const length = s.length
      let ret = new Uint8Array(length)
      for (let i = 0; i < length; i++) {
        ret[i] = s.charCodeAt(i)
      }
      return ret
    }
    class WrapPort {
      constructor (port) {
        this.curMethod = ''
        this.curResolve = null
        this.curReject = null
        this.stack = ''
        this.port = port
        this.lastDone = true
  
        port.onMessage.addListener(msg => this.onMessage(msg))
      }
      post (method, args) {
        if (!this.lastDone) {
          throw new Error('Last post is not done')
        }
        this.stack = new Error().stack
        return new Promise((resolve, reject) => {
          this.lastDone = false
          this.curMethod = method
          this.curResolve = resolve
          this.curReject = reject
          this.port.postMessage({
            method: method,
            args: args
          })
        })
      }
      onMessage (msg) {
        if (msg.method === this.curMethod) {
          if (msg.err) {
            let err = new Error(msg.err.message)
            err.oriName = msg.err.name
            err.stack = hideHookStack(this.stack)
            // console.log('fetch err', err)
            this.curReject.call(null, err)
          } else {
            if (this.curMethod == 'arrayBuffer') {
              msg.args[0] = base64ToUint8(msg.args[0])
            }
            this.curResolve.apply(null, msg.args)
          }
          this.curResolve = null
          this.curReject = null
          this.lastDone = true
        } else {
          console.error('wtf?')
        }
      }
    }
    class PortReader {
      constructor (port) {
        this.port = port
        this.hasReader = false
      }
      _requireReader () {
        if (this.hasReader) {
          return Promise.resolve()
        } else {
          return this.port.post('body.getReader').then(() => this.hasReader = true)
        }
      }
      read () {
        return this._requireReader()
          .then(() => this.port.post('reader.read'))
          .then(r => {
            if (r.done == false) {
              r.value = base64ToUint8(r.value)
            }
            return r
          })
      }
      cancel () {
        return this._requireReader().then(() => this.port.post('reader.cancel'))
      }
    }
    class PortBody {
      constructor (port) {
        this.port = port
      }
      getReader () {
        return new PortReader(this.port)
      }
    }
    class PortFetch {
      constructor () {
        this.port = new WrapPort(chrome.runtime.connect({name: 'fetch'}))
      }
      fetch (...args) {
        if (args[0].url) args[0] = args[0].url;
        if (args[0].substr(0, 5) == 'blob:') {
          return xhrFakedFetch(...args);
        }
        return this.port.post('fetch', args).then(r => {
          r.json = () => this.port.post('json')
          r.text = () => this.port.post('text')
          r.arrayBuffer = () => this.port.post('arrayBuffer').then(buf => buf.buffer)
          r.headers = convertHeader(r.headers)
          r.body = new PortBody(this.port)
          return r
        })
      }
    }
    function uint8ToStr (buffer) {
      let binary = String.fromCharCode.apply(String, buffer);
      /*let binary = ''
      let len = buffer.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i])
      }*/
      return binary
    }
    function xhrFakedFetch(...args) {
      return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest;
        xhr.open(args[1].method, args[0], true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => res({
          ok: true,
          url: xhr.responseURL,
          text: () => new Promise((res) => res(uint8ToStr(new Uint8Array(xhr.response)))),
          arrayBuffer: () => new Promise((res) => res(xhr.response)),
        })
        xhr.send();
      })
    }
    const bgFetch = function bgFetch (...args) {
      if (args[1] && args[1].useOriginalFetch) return originalFetch(...args);
      const fetch = new PortFetch()
      return fetch.fetch(...args)
    }
    function hookFetch () {
      if (fetch !== bgFetch) {
        fetch = bgFetch
      }
    }
    const oldBlob = Blob
    const newBlob = function newBlob(a, b) {
      a[0] = `(${hookFetchCode})();${a[0]}`
      console.log('new blob', a, b)
      return new oldBlob(a, b)
    }
    // if(self.document !== undefined) {
    //   if (self.Blob !== newBlob) {
    //     self.Blob = newBlob
    //   }
    // }
  
    hookFetch()
  }

  hookFetchCode();
}