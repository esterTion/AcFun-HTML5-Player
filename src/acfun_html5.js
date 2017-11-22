function createPopup(param) {
    if (!param.content)
        return;
    if (document.querySelector('#AHP_Notice') != null)
        document.querySelector('#AHP_Notice').remove();

    let div = _('div', { id: 'AHP_Notice' });
    let childs = [];
    if (param.showConfirm) {
        childs.push(_('input', { value: param.confirmBtn, type: 'button', className: 'confirm', event: { click: param.onConfirm } }));
    }
    childs.push(_('input', {
        value: _t('close'), type: 'button', className: 'close', event: {
            click: function () {
                div.style.height = 0;
                setTimeout(function () { div.remove() }, 500);
            }
        }
    }));
    div.appendChild(_('div', {}, [_('div', {},
        param.content.concat([_('hr'), _('div', { style: { textAlign: 'right' } }, childs)])
    )]));
    document.body.appendChild(div);
    div.style.height = div.firstChild.offsetHeight + 'px';
}

let pageInfo;

let tempEvent, tempEventType;
function eventPasser() {
    switch (tempEventType) {
        case 'keydown':
            if (tempEvent.initKeyboardEvent) {
                tempEvent.initKeyboardEvent('keydown', true, true, tempEvent.view, tempEvent.char, tempEvent.key, tempEvent.location, null, tempEvent.repeat);
            }
            break;
    }
    playerIframe.contentWindow.dispatchEvent(tempEvent);
    tempEvent = null;
    tempEventType = '';
}
let dest = null;
function init() {
    if (!pageInfo.vid || dest == null)
        return;
    let container = dest.parentNode;
    dest.remove();
    playerIframe = container.appendChild(_('iframe', { className: 'AHP-Player-Container', allowfullscreen: true, src: chrome.extension.getURL("player.html") + '?vid=' + pageInfo.vid }));
    window.addEventListener('message', function (e) {
        if (e.origin == chrome.extension.getURL("player.html").slice(0,-12)) {
            let message = JSON.parse(e.data);
            switch (message.name) {
                case 'AHP_log':
                    console.log.apply(console, message.detail);
                    break;
                case 'AHP_createPopup':
                    console.log(message);
                    createPopup(message.detail);
                    break;
            }
        }
        //console.log.apply(console, e.detail);
    })
}
(function () {
    let noticeWidth = Math.min(500, innerWidth - 40);
    document.head.appendChild(_('style', {}, [_('text', `#AHP_Notice{
position:fixed;left:0;right:0;top:0;height:0;z-index:20000;transition:.5s;cursor:default
}
.AHP_down_banner{
margin:2px;padding:2px;color:#FFFFFF;font-size:13px;font-weight:bold;background-color:green
}
.AHP_down_btn{
margin:2px;padding:4px;color:#1E90FF;font-size:14px;font-weight:bold;border:#1E90FF 2px solid;display:inline-block;border-radius:5px
}
@keyframes pop-iframe-in{0%{opacity:0;transform:scale(.7);}100%{opacity:1;transform:scale(1)}}
@keyframes pop-iframe-out{0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(.7)}}
#AHP_Notice>div{
position:absolute;bottom:0;left:0;right:0;font-size:15px
}
#AHP_Notice>div>div{
    border:1px #AAA solid;width:${noticeWidth}px;margin:0 auto;padding:20px 10px 5px;background:#EFEFF4;color:#000;border-radius:5px;box-shadow:0 0 5px -2px
}
#AHP_Notice>div>div *{
    margin:5px 0;
}
#AHP_Notice input[type=text]{
    border: none;border-bottom: 1px solid #AAA;width: 60%;background: transparent
}
#AHP_Notice input[type=text]:active{
    border-bottom-color:#4285f4
}
#AHP_Notice input[type=button] {
	border-radius: 2px;
	border: #adadad 1px solid;
	padding: 3px;
	margin: 0 5px;
    width:50px
}
#AHP_Notice input[type=button]:hover {
	background: #FFF;
}
#AHP_Notice input[type=button]:active {
	background: #CCC;
}`)]))
    if ((dest = document.getElementById('ACFlashPlayer')) != null) {
        //普通投稿
        pageInfo = Object.assign({}, (document.getElementById('pageInfo') || { dataset: {} }).dataset);
        document.head.appendChild(_('style', {}, [_('text', '.AHP-Player-Container{width:1160px;height:730px}@media screen and (max-width: 1440px){.AHP-Player-Container{width:980px;height:628px}}')]))
        init();
    } else if ((dest = document.getElementById('ACFlashPlayer-re')) != null) {
        //剧集视频
        pageInfo = {
            vid: (document.querySelector('.active.primary') || { dataset: {} }).dataset.vid
        };
        document.head.appendChild(_('style', {}, [_('text', '.AHP-Player-Container{width:1200px;height:715px}@media screen and (max-width: 1440px){.AHP-Player-Container{width:980px;height:592px}}')]))
        init();
    }
})();
window.crc_engine = () => { return ''; };