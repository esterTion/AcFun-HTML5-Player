if (window.parent != window) {
    function sendMessage(name, detail) {
        let message = {
            name,
            detail
        }
        parent.postMessage(JSON.stringify(message), '*');
    }
    function createPopup(param) {
        sendMessage('AHP_createPopup', param);
    }
    console.log = function () {
        sendMessage('AHP_log', Array.from(arguments));
    }
}

const rc4_key = '8bdc7e1a';
let pageInfo;

let knownTypes = {
    'flvhd': _t('flvhd'),
    'mp4hd': _t('mp4hd'),
    'mp4hd2': _t('mp4hd2'),
    'mp4hd3': _t('mp4hd3')
};
let srcUrl = {};
let availableSrc = [];
window.currentSrc = '';
window.currentLang = '';
let firstTime = true;
let highestType;

window.changeSrc = function (e, t) {
    let div = document.getElementById('ABP-info-box');
    if ((abpinst == undefined || (currentSrc == t)) && !force)
        return false;
    if (div.style.opacity == 0) {
        div.style.opacity = 1;
    }
    abpinst.playerUnit.querySelector('.BiliPlus-Scale-Menu .Video-Defination div.on').className = '';
    abpinst.playerUnit.querySelector('.BiliPlus-Scale-Menu .Video-Defination div[name=' + t + ']').className = 'on';
    abpinst.video.pause();
    if (srcUrl[t] != undefined) {
        div.childNodes[0].childNodes[0].textContent = ABP.Strings.switching;
        if (!dots.running)
            dots.runTimer();
        if (abpinst.lastTime == undefined)
            abpinst.lastTime = abpinst.video.currentTime;
        if (abpinst.lastSpeed == undefined)
            abpinst.lastSpeed = abpinst.video.playbackRate;
        abpinst.video.dispatchEvent(new CustomEvent('autoplay'));
        flvparam(t);
    }
}
window.overallBitrate = 0;
let self = window;
let createPlayer = function (e) {
    if (self.flvplayer != undefined) {
        self.flvplayer.unload();
        self.flvplayer.destroy();
        delete self.flvplayer;
    }
    if (e.detail == null)
        return false;
    self.flvplayer = flvjs.createPlayer(e.detail.src, e.detail.option);
    self.flvplayer.on('error', load_fail);
    self.flvplayer.attachMediaElement(document.querySelector('video'));
    self.flvplayer.load();
}
let load_fail = function (type, info, detail) {
    let div = _('div', {
        style: {
            width: '100%',
            height: '100%',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.8)',
            position: 'absolute',
            color: '#FFF'
        }
    }, [
            _('div', {
                style: {
                    position: 'relative',
                    top: '50%'
                }
            }, [
                    _('div', {
                        style: {
                            position: 'relative',
                            fontSize: '16px',
                            lineHeight: '16px',
                            top: '-8px'
                        }
                    }, [_('text', _t('loadErr'))])
                ])
        ]);
    document.querySelector('.ABP-Video').insertBefore(div, document.querySelector('.ABP-Video>:first-child'));
    document.getElementById('ABP-info-box').remove();
    createPopup({
        content: [_('p', { style: { fontSize: '16px' } }, [_('text', _t('playErr'))]), _('div', { style: { whiteSpace: 'pre-wrap' } }, [_('text', JSON.stringify({ type, info, detail }, null, '  '))])],
        showConfirm: false
    });
}
let flvparam = function (select) {
    currentSrc = select;
    createPlayer({ detail: { src: srcUrl[select], option: { seekType: 'range', reuseRedirectedURL: true } } });
    if (srcUrl[select].partial) {
        setTimeout(function () { abpinst.createPopup(_t('partialAvailable'), 3e3) }, 4e3);
    }
    if (srcUrl[select].segments) {
        let totalSize = 0;
        srcUrl[select].segments.forEach(function (i) { totalSize += i.filesize })
        overallBitrate = totalSize / srcUrl.duration * 8
    } else {
        overallBitrate = srcUrl[select].filesize / srcUrl.duration * 8
    }
};
let ABPConfig;
function chkInit() {
    readStorage('PlayerSettings', function (item) {
        ABPConfig = item.PlayerSettings || {};
        init();
    })
}
let tempEvent, tempEventType;
function eventPasser() {
    switch (tempEventType) {
        case 'keydown':
            if (tempEvent.initKeyboardEvent) {
                tempEvent.initKeyboardEvent('keydown', true, true, tempEvent.view, tempEvent.char, tempEvent.key, tempEvent.location, null, tempEvent.repeat);
            }
            break;
    }
    abpinst.playerUnit.dispatchEvent(tempEvent);
    tempEvent = null;
    tempEventType = '';
}
function init() {
    if (!pageInfo.vid)
        return;
    window.cid = pageInfo.vid;
    let video = document.body.appendChild(_('video'));
    window.flvplayer = { unload: function () { }, destroy: function () { } };
    abpinst = ABP.create(video.parentNode, {
        src: {
            playlist: [{
                video: video
            }]
        },
        width: '100%',
        height: '100%',
        config: ABPConfig,
        mobile: isMobile()
    });
    dots.init({
        id: 'dots',
        width: '100%',
        height: '100%',
        r: 16,
        thick: 4
    });
    dots.runTimer();

    window.addEventListener('keydown', function (e) {
        if (!abpinst.playerUnit.contains(e.target) && ['input', 'textarea'].indexOf(e.target.nodeName.toLowerCase()) == -1) {
            switch (e.keyCode) {
                case 27:
                case 32:
                case 37:
                case 39:
                case 38:
                case 40:
                    e.preventDefault();
                    tempEvent = e;
                    tempEventType = 'keydown';
                    setTimeout(eventPasser, 0);
                    break;
            }
        }
    });

    fetch('http://www.acfun.cn/video/getVideo.aspx?id=' + pageInfo.vid, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache'
    }).then(function (r) {
        r.json().then(function (data) {
            console.log(data);
        })
    }).catch(function (e) {
        createPopup({
            content: [_('p', { style: { fontSize: '16px' } }, [_('text', _t('fetchSourceErr'))]), _('text', e.message)],
            showConfirm: false
        });
    });
}
(function () {
    flvjs.LoggingControl.enableVerbose = false;
    flvjs.LoggingControl.enableInfo = false;
    flvjs.LoggingControl.enableDebug = false;
    if ((vid = location.href.match(/vid=(\d+)/)) != null) {
        pageInfo = {
            vid: vid[1]
        }
        console.log(pageInfo);
        chkInit();
    }
})();
window.crc_engine = () => { return ''; };