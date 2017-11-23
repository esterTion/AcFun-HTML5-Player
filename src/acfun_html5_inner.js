let createPopup = parent.createPopup;

window.overallBitrate = 0;
let ABPConfig;
function chkInit() {
    readStorage('PlayerSettings', function (item) {
        ABPConfig = item.PlayerSettings || {};
        init();
    });
}
let tempEvent, tempEventType;

window.changeSrc = parent.changeSrc;
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
    //window.cid = pageInfo.vid;
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
    parent.abpinst = abpinst;
    parent.dots = dots;
    parent.ABP = ABP;
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
}
parent.playerLoadedCallback(window) && chkInit();
parent.postMessage('YHP_CrossFrame_Fullscreen_init', '*');
