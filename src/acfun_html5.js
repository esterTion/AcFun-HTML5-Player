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
                setTimeout(function () { div.remove(); }, 500);
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
let knownTypes = {
    'mp4sd': _t('flvhd'),
    'flvhd': _t('flvhd'),
    'mp4hd': _t('mp4hd'),
    'mp4hd2': _t('mp4hd2'),
    'mp4hd2v2': _t('mp4hd2'),
    'mp4hd3': _t('mp4hd3'),
    'mp4hd3v2': _t('mp4hd3')
};
let audioLangs = {};
let srcUrl = {};
let availableSrc = [];
window.currentSrc = '';
window.currentLang = '';
let firstTime = true;
let highestType;
let coreMode = 'hls';

let hlsPending = -1;
window.changeSrc = function (e, t, force) {
    hlsplayer.nextLevel = t;
    abpinst.createPopup(_t('switchingTo') + e.target.value, 3e3);
    hlsPending = t;
};
let self = window;
window.addEventListener('unload', function () {
    if (self.hlsplayer != undefined) {
        self.hlsplayer.stopLoad();
        self.hlsplayer.destroy();
        delete self.hlsplayer;
    }
});
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
    abpinst.playerUnit.querySelector('.ABP-Video').insertBefore(div, document.querySelector('.ABP-Video>:first-child'));
    abpinst.playerUnit.querySelector('#info-box').remove();
    createPopup({
        content: [_('p', { style: { fontSize: '16px' } }, [_('text', _t('playErr'))]), _('div', { style: { whiteSpace: 'pre-wrap' } }, [_('text', JSON.stringify({ type, info, detail }, null, '  '))])],
        showConfirm: false
    });
};

let commentLoadPages = 12;
readStorage('commentLoadPages', function (item) {
    commentLoadPages = (item.commentLoadPages | 0) || 12;
});
function sendComment(e) {
    let cmt = e.detail;
    //abpinst.danmu_ws.send(JSON.stringify(obj));
    var form = [];
    form.push('mode=' + cmt.mode);
    form.push('color=' + cmt.color);
    form.push('size=' + cmt.fontsize);
    form.push('body=' + encodeURIComponent(cmt.message));
    form.push('videoId=' + pageInfo.vid);
    form.push('position=' + ((cmt.playTime * 1e3) | 0));
    form.push('type=' + (isBangumi ? 'bangumi' : 'douga'));
    form.push('id=' + pageInfo[isBangumi ? 'bangumiId' : 'dougaId']);
    form.push('subChannelId=' + (isBangumi ? 155 : pageInfo.channel.parentId));
    form.push('subChannelName=' + encodeURIComponent(isBangumi ? '番剧' : pageInfo.channel.parentName));
    form.push('roleId=');

    var xhr = new XMLHttpRequest;
    xhr.open('POST', location.origin+'/rest/pc-direct/new-danmaku/add', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.onload = function () {
        var data = xhr.response;
        if (data.result != 0) {
            abpinst.createPopup('发送失败：[' + data.result + ']' + data.error_msg, 5e3);
        }
    };
    xhr.onerror = function (e) {
        abpinst.createPopup('发送失败：' + e.message, 5e3);
    };
    xhr.send(form.join('&'));
}

let dest = null;
let ABPConfig;
let currentBangumiUrl = location.href.split('?')[0];
let isBangumi = /\/bangumi\/aa/.test(currentBangumiUrl);
function chkInit() {
    new Promise((res) => {
        readStorage('PlayerSettings', function (item) {
            ABPConfig = item.PlayerSettings || {};
            if (isBangumi) {
                let observer = new MutationObserver(bangumiEpisodeChange);
                observer.observe(document.body, { childList: true, subtree: true });
            }
            res();
        });
    }).then(() => {
        if (!pageInfo.currentVideoInfo) {
            return fetch(
                isBangumi ? 'https://tx.biliplus.com:7823/acfun_getBangumi_app?bangumiId=' + pageInfo.bangumiId + '&pageNo=1&pageSize=1000' : 'https://tx.biliplus.com:7823/acfun_getVideo_app?dougaId=' + pageInfo.dougaId
            ).then(r => r.json()).then(r => {
                if (isBangumi) {
                    pageInfo.currentVideoInfo = (r.items.find(v => v.videoId == pageInfo.videoId) || {}).currentVideoInfo;
                } else {
                    pageInfo.currentVideoInfo = r.currentVideoInfo;
                }
            }).catch(e => console.error(e));
        }
    }).then(init)
}
function bangumiEpisodeChange() {
    let newUrl = location.href.split('?')[0];
    if (newUrl != currentBangumiUrl) {
        location.href = newUrl;
    }
}
let isNewVersionPlayPage = document.getElementById('pagelet_newrecommend') != null;
function init() {
    if (!pageInfo.vid || dest == null)
        return;
    window.cid = pageInfo.vid;
    let container = dest.parentNode;
    if (container == null) {
        dest = document.getElementById('ACFlashPlayer');
        init();
        return;
    }
    dest.remove();
    let blob = new Blob(['<!DOCTYPE HTML><html><head><meta charset="UTF-8"><style>html,body{height:100%;width:100%;margin:0;padding:0}</style><link rel="stylesheet" type="text/css" href="' + chrome.extension.getURL('ABPlayer.css') + '"></head><body></body></html>'], { type: 'text/html' });
    let bloburl = URL.createObjectURL(blob);
    window.playerIframe = container.appendChild(_('div', { style: isNewVersionPlayPage ? { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } : { height: 0 } }, [_('iframe', { className: 'AHP-Player-Container', allowfullscreen: true, src: bloburl, allow: 'fullscreen; autoplay' })])).children[0];
    playerIframe.onload = function () {
        URL.revokeObjectURL(bloburl);
        try {
            if (playerIframe.contentDocument.head.getElementsByTagName('link').length == 0) {
                location.reload();
                return;
            }
        } catch (e) {
            location.reload();
            return;
        }
        let video = playerIframe.contentDocument.body.appendChild(_('video', { poster: pageInfo.coverImage }));
        window.flvplayer = { unload: function () { }, destroy: function () { } };
        abpinst = ABP.create(video.parentNode, {
            src: {
                playlist: [{
                    video: video
                }]
            },
            width: '100%',
            height: '100%',
            config: ABPConfig
        });
        dots.init({
            container: abpinst.playerUnit.querySelector('#dots'),
            width: '100%',
            height: '100%',
            r: 16,
            thick: 4
        });
        dots.runTimer();

        // 弹幕页数设置
        abpinst.settingPanel.firstChild.lastChild.appendChild(_('p', { className: 'label prop' }, [
            _('text', _t('commentLoadPagesSetting')),
            _('select', { id: 'setting-commentLoadPages', event: { mouseup: function (e) { e.stopPropagation(); }, change: function () { saveStorage({ commentLoadPages: this.value }); } } }, [
                _('option', { value: '3' }, [_('text', '3')]),
                _('option', { value: '5' }, [_('text', '5')]),
                _('option', { value: '8' }, [_('text', '8')]),
                _('option', { value: '10' }, [_('text', '10')]),
                _('option', { value: '12' }, [_('text', '12')]),
                _('option', { value: '15' }, [_('text', '15')]),
                _('option', { value: '20' }, [_('text', '20')])
            ]),
            _('text', ' k')
        ]));
        abpinst.settingPanel.querySelector('#setting-commentLoadPages').value = commentLoadPages;

        if (!pageInfo.currentVideoInfo || !pageInfo.currentVideoInfo.ksPlayJson) {
            createPopup({
                content: [_('p', { style: { fontSize: '16px' } }, [_('text', _t('fetchSourceErr'))]), _('text', pageInfo.playErrorMessage || '未找到视频播放地址')],
                showConfirm: false
            });
            return;
        }

        let ksPlayJson = JSON.parse(pageInfo.currentVideoInfo.ksPlayJson);
        let playlists = ksPlayJson.adaptationSet.representation;
        playlists.sort((a, b) => a.width - b.width);
        let masterManifest = '#EXTM3U\n' + playlists.map(i => (
            `#EXT-X-STREAM-INF:BANDWIDTH=${i.bandwidth},RESOLUTION=${i.width}x${i.height}\n${i.url}\n`
        )).join('');
        let masterManifestBlob = new Blob([masterManifest], { mimeType: 'application/vnd.apple.mpegurl' });
        let masterManifestUrl = URL.createObjectURL(masterManifestBlob);
        let conf = {
            enableWorker: isChrome,
            capLevelToPlayerSize: true,
            startLevel: 2
        };
        if (abpinst.lastTime) {
            conf.startPosition = abpinst.lastTime;
            delete abpinst.lastTime;
            console.log('starting from', conf.startPosition);
        }
        /*if (isChrome && chromeVer >= 73) {
            conf.loader = Hls.FetchLoader;
        }*/
        if (isChrome && location.protocol === 'https:') {
            conf.xhrSetup = (xhr, url) => {
                if (/^http:/.test(url)) {
                    xhr.open('GET', url.replace(/http:/, 'https:'), true);
                    xhr.withCredentials = true;
                }
            };
        }
        window.hlsplayer = new Hls(conf);
        hlsplayer.loadSource(masterManifestUrl);
        hlsplayer.attachMedia(abpinst.video);
        hlsplayer.once(Hls.Events.MANIFEST_PARSED, () => URL.revokeObjectURL(masterManifestUrl));
        hlsplayer.on(Hls.Events.LEVEL_SWITCHED, () => {
            if (hlsPending != -1) {
                abpinst.createPopup(_t('switched') + ' ' + (hlsplayer.levelName[hlsPending] || hlsPending), 2e3);
                hlsPending = -1;
            }
        });
        hlsplayer.on('hlsMIStatPercentage', function initialDisplay(m, p) {
            abpinst.playerUnit.querySelector('#info-box').childNodes[0].childNodes[0].textContent = ABP.Strings.buffering + ' ' + (p * 100).toFixed(2) + '%';
        });
        hlsplayer.on(Hls.Events.ERROR, function (n, d) { console.log(n, d); });

        HlsjsMediaInfoModule.observeMediaInfo(hlsplayer);
        let scaleMenu = abpinst.playerUnit.querySelector('.BiliPlus-Scale-Menu');
        scaleMenu.querySelector('.Video-Defination').appendChild(_('div', {
            changeto: JSON.stringify([-1, _t('Auto')]),
            name: _t('Auto'),
            className: 'on'
        }, [_('text', _t('Auto'))]));
        hlsplayer.levelName = playlists.map(i => {
            let name = (function (w) {
                return w > 1280 ? _t('mp4hd3') : w > 960 ? _t('mp4hd2') : w > 640 ? _t('mp4hd') : _t('flvhd');
            })(i.width);
            scaleMenu.querySelector('.Video-Defination').appendChild(_('div', {
                changeto: JSON.stringify([playlists.indexOf(i), name]),
                name: name
            }, [_('text', name)]));
            return name;
        });
        scaleMenu.style.width = playlists.length > 3 ? (((playlists.length + 1) * 50) + 'px') : '';
        scaleMenu.style.animationName = 'scale-menu-show';
        setTimeout(function () {
            scaleMenu.style.animationName = '';
        }, 2e3);

        // 进度条预览
        {
            let xhr = new XMLHttpRequest;
            xhr.open('POST', location.origin+'/rest/pc-direct/play/playInfo/spriteVtt', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.responseType = 'json';
            xhr.onload = function () {
                let data = xhr.response;
                if (data.spriteVtt) {
                    let blob = new Blob([data.spriteVtt.replace(/(\d\d:\d\d:)(\d\.\d\d\d)/g, '$10$2')], {mimeType: 'text/vtt'});
                    let url = URL.createObjectURL(blob);
                    let track = abpinst.video.appendChild(_('track', {
                        src: url,
                        kind: 'metadata',
                        default: '',
                        event: { load: e => {
                            URL.revokeObjectURL(url);
                            let cues = Array.from(abpinst.video.textTracks[0].cues).map(c => [c.startTime, c.endTime, c.text]);
                            track.remove();
                            abpinst.playerUnit.dispatchEvent(new CustomEvent('previewData', {detail: cues}));
                        }}
                    }));
                }
            };
            xhr.onerror = function (e) {
                abpinst.createPopup('发送失败：' + e.message, 5e3);
            };
            xhr.send(`videoId=${pageInfo.vid}&resourceId=${pageInfo.dougaId}&resourceType=2`);
        }

        if (user.uid === -1 || user.uid === '') {
            abpinst.txtText.disabled = true;
            abpinst.txtText.placeholder = _t('noVisitorComment');
            abpinst.txtText.style.textAlign = 'center';
        }
        if (pageInfo.album)
            abpinst.title = pageInfo.title + ' - AB' + pageInfo.video.part;
        else if (pageInfo.bangumiId)
            abpinst.title = pageInfo.episodeName + ' ' + pageInfo.title + ' - AB' + pageInfo.bangumiId;
        else if (pageInfo.videoList && pageInfo.videoList.length > 1)
            abpinst.title = '[P' + (pageInfo.currentVideoInfo.priority + 1) + '] ' + pageInfo.videoList[pageInfo.currentVideoInfo.priority].title + ' || ' + pageInfo.title + ' - AC' + pageInfo.dougaId;
        else
            abpinst.title = pageInfo.title + ' - AC' + pageInfo.dougaId;
        abpinst.playerUnit.addEventListener('sendcomment', sendComment);
    };
    if (!isNewVersionPlayPage) playerIframe.parentNode.style.position = 'relative';
    resizeSensor(playerIframe.parentNode, function () {
        window.dispatchEvent(new Event('resize'));
        if (!isNewVersionPlayPage && !playerIframe.parentNode.classList.contains('small')) {
            playerIframe.parentNode.style.left = '';
        }
    });
    readStorage('updateNotifyVer', function (item) {
        let notVer = '1.9.0';
        if (item.updateNotifyVer != notVer) {
            saveStorage({ 'updateNotifyVer': notVer });
            createPopup({
                content: [
                    _('p', { style: { fontSize: '16px' } }, [_('text', 'AHP 最近有更新啦！')]),
                    _('div', { style: { whiteSpace: 'pre-wrap' } }, [
                        _('text', '现在我们的版本是' + notVer + "\n\n更新细节：\nv1.9.0：受AcFun改版影响，此版本有如下改动：\n- flv.js核心已移除\n- 第三方源支持已全部移除\n- 新番剧将不再提供进度条预览，服务器已处理过的缩略图可正常查看")
                    ])
                ],
                showConfirm: false
            });
        }
    });
}

(function () {
    let noticeWidth = Math.min(500, innerWidth - 40);
    document.head.appendChild(_('style', {}, [_('text', `#AHP_Notice{
position:fixed;left:0;right:0;top:0;height:0;z-index:20000;transition:.5s;cursor:default;pointer-events:none
}
.AHP_down_banner{
margin:2px;padding:2px;color:#FFFFFF;font-size:13px;font-weight:bold;background-color:green
}
.AHP_down_btn{
margin:2px;padding:4px;color:#1E90FF;font-size:14px;font-weight:bold;border:#1E90FF 2px solid;display:inline-block;border-radius:5px
}
body.ABP-FullScreen{
	overflow:hidden
}
@keyframes pop-iframe-in{0%{opacity:0;transform:scale(.7);}100%{opacity:1;transform:scale(1)}}
@keyframes pop-iframe-out{0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(.7)}}
#AHP_Notice>div{
position:absolute;bottom:0;left:0;right:0;font-size:15px
}
#AHP_Notice>div>div{
    border:1px #AAA solid;width:${noticeWidth}px;margin:0 auto;padding:20px 10px 5px;background:#EFEFF4;color:#000;border-radius:5px;box-shadow:0 0 5px -2px;pointer-events:auto
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
}
.noflash-alert,.is-ie{display:none !important}`)]));
    let playerContainer = document.getElementById('ACPlayer');
    if (playerContainer && playerContainer.children.length == 0) {
        playerContainer.appendChild(_('div', { id: 'ACFlashPlayer' }));
    }
    if ((dest = document.getElementById('ACFlashPlayer')) != null) {
        window.addEventListener('AHP_pageInfo', function pageInfoGrabber(e) {
            window.removeEventListener('AHP_pageInfo', pageInfoGrabber);
            pageInfo = e.detail.pageInfo;
            window.user = {
                uid: getCookie('auth_key'),
                uid_ck: getCookie('auth_key_ac_sha1'),
                uname: getCookie('ac_username')
            };
            let additionStyleContent;
            if (document.getElementById('pageInfo') != null) {
                pageInfo.vid = pageInfo.videoId;
                additionStyleContent = '.AHP-Player-Container{width:1160px;height:730px}@media screen and (max-width: 1440px){.AHP-Player-Container{width:980px;height:628px}}.small .AHP-Player-Container{width:100%;height:100%;margin-top:26px}';
            } else if (pageInfo.currentVideoInfo) {
                pageInfo.vid = pageInfo.currentVideoInfo.id;
                pageInfo.coverImage = pageInfo.image;
                additionStyleContent = '.AHP-Player-Container{width:1160px;height:730px}@media screen and (max-width: 1440px){.AHP-Player-Container{width:980px;height:628px}}.small .AHP-Player-Container{width:100%;height:100%;margin-top:26px}';
            } else if (pageInfo.dougaId) {
                pageInfo.vid = pageInfo.currentVideoId;
                pageInfo.coverImage = pageInfo.coverUrl;
                additionStyleContent = '.AHP-Player-Container{width:1160px;height:730px}@media screen and (max-width: 1440px){.AHP-Player-Container{width:980px;height:628px}}.small .AHP-Player-Container{width:100%;height:100%;margin-top:26px}';
            } else if (pageInfo.videoId) {
                pageInfo.vid = pageInfo.videoId;
                pageInfo.coverImage = pageInfo.coverUrl;
                additionStyleContent = '.AHP-Player-Container{width:1160px;height:730px}@media screen and (max-width: 1440px){.AHP-Player-Container{width:980px;height:628px}}.small .AHP-Player-Container{width:100%;height:100%;margin-top:26px}';
            } else {
                pageInfo.vid = pageInfo.video.videos[0].danmakuId;
                pageInfo.coverImage = pageInfo.video.videos[0].image;
                pageInfo.title = (pageInfo.album.title + ' ' + pageInfo.video.videos[0].episodeName + ' ' + pageInfo.video.videos[0].newTitle).trim();
                additionStyleContent = '.AHP-Player-Container{width:1200px;height:715px}@media screen and (max-width: 1440px){.AHP-Player-Container{width:980px;height:592px}}.small .AHP-Player-Container{width:100%;height:100%;margin-top:26px}';
            }
            if (isNewVersionPlayPage) additionStyleContent = '.AHP-Player-Container{width:100%;height:100%}';
            document.head.appendChild(_('style', {}, [_('text', additionStyleContent)]));
            chkInit();
        });
        document.head.appendChild(_('script', {}, [_('text', 'window.dispatchEvent(new CustomEvent("AHP_pageInfo", {detail:{pageInfo}}));setTimeout(function(){try{f.ready();}catch(e){}},0)')])).remove();
        window.screenshotWrapperForm = document.body.appendChild(_('form', { name: 'screenshot-wrapper', style: { display: 'none' } }, [_('input', { name: 'sc_title' }), _('input', { name: 'sc_body' })]));
        document.head.appendChild(_('script', {}, [_('text', '(' + function () {
            document.querySelector('form[name="screenshot-wrapper"]').addEventListener('click', function (e) {
                e.preventDefault();
                var newWin = window.open('about:blank');
                var title = this['sc_title'].value, body = this['sc_body'].value;
                newWin.onload = function () {
                    newWin.document.title = title;
                    newWin.document.body.innerHTML = body;
                };
            });
        }.toString() + ')()')])).remove();
        /*
        if (document.getElementById('pageInfo') != null) {
            //普通投稿
            pageInfo = Object.assign({}, (document.getElementById('pageInfo') || { dataset: {} }).dataset);
            
            init();
        } else {
            //剧集视频
        }*/
    }
})();
window.crc_engine = () => { return ''; };

let webFullState = false;
window.addEventListener('message', function (e) {
    if (['AHP_CrossFrame_Fullscreen_Enter', 'AHP_CrossFrame_Fullscreen_Exit'].indexOf(e.data) == -1) return;
    let srcFrame = Array.from(document.querySelectorAll('iframe')).find(function (i) {
        return i.contentWindow == e.source;
    });
    if (srcFrame == undefined) return;
    if (e.data == 'AHP_CrossFrame_Fullscreen_Enter' && !webFullState) {
        webFullState = true;
        let origStat = {
            height: srcFrame.style.height || (srcFrame.offsetHeight + 'px'),
            width: srcFrame.style.width || (srcFrame.offsetWidth + 'px'),
            left: srcFrame.style.left,
            top: srcFrame.style.top,
            position: srcFrame.style.position,
            zIndex: srcFrame.style.zIndex
        };
        srcFrame.style.zIndex = 0xffffffff;
        srcFrame.style.height = '100%';
        srcFrame.style.width = '100%';
        srcFrame.style.position = 'fixed';
        srcFrame.style.left = '0';
        srcFrame.style.top = '0';
        srcFrame.YHP_origStat = origStat;
        let climb = srcFrame.parentNode;
        while (climb != document.body) {
            climb.YHP_origZIndex = climb.style.zIndex;
            climb.style.zIndex = 0xffffffff;
            climb = climb.parentNode;
        }
    } else if (e.data == 'AHP_CrossFrame_Fullscreen_Exit' && webFullState) {
        webFullState = false;
        let origStat = srcFrame.YHP_origStat;
        srcFrame.style.zIndex = origStat.zIndex;
        srcFrame.style.height = origStat.height;
        srcFrame.style.width = origStat.width;
        srcFrame.style.position = origStat.position;
        srcFrame.style.left = origStat.left;
        srcFrame.style.top = origStat.top;
        delete srcFrame.YHP_origStat;
        let climb = srcFrame.parentNode;
        while (climb != document.body) {
            if (climb.YHP_origZIndex != undefined)
                climb.style.zIndex = climb.YHP_origZIndex;
            climb = climb.parentNode;
        }
    }
    if (parent != window)
        parent.postMessage(e.data, '*');
});

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
window.addEventListener('keydown', function (e) {
    if (typeof abpinst != 'undefined' && ['input', 'textarea'].indexOf(e.target.nodeName.toLowerCase()) == -1 && e.target.getAttribute('contenteditable') != 'true') {
        switch (e.keyCode) {
            case 32:
            case 37:
            case 39:
            case 38:
            case 40:
                e.preventDefault();
                e.stopPropagation();
                tempEvent = e;
                tempEventType = 'keydown';
                setTimeout(eventPasser, 0);
                break;
        }
    }
});
