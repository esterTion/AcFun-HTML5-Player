/*!
 *
 * ABPlayer-bilibili-ver
 * Copyright (c) 2014 Jim Chen (http://kanoha.org/), under the MIT license.
 *
 * bilibili-ver
 * @author zacyu
 *
 */
Array.from = Array.from || function(a){return [].slice.call(a)};
function isMobile() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }

var ABP = {
	"version": "0.8.0"
};
ABP.Strings = new Proxy({}, {
	get: function(target, property, receiver) {
		return _t(property) || (console.warn('[YHP] Undefined translation key', property), property);
  }
});

(function() {
	"use strict";
	if (!ABP) return;
	var $$ = jQuery,
	addEventListener='addEventListener',
	versionString='HTML5 Player ver.181110 based on ABPlayer-bilibili-ver',
	mousePrevPos=[0,0],
	mouseMoved=function(e){
		var oldPos=mousePrevPos;
		mousePrevPos=[e.clientX,e.clientY];
		return !(oldPos[0] == mousePrevPos[0] 
		&& oldPos[1] == mousePrevPos[1]);
	},
	$ = function(e) {
		return playerIframe.contentDocument.getElementById(e);
	};

	var findRow = function(node) {
		var i = 1;
		while (node = node.previousSibling) {
			if (node.nodeType === 1) {
				++i
			}
		}
		return i;
	}

	var findClosest = function(node, className) {
		for (; node; node = node.parentNode) {
			if (hasClass(node.parentNode, className)) {
				return node;
			}
		}
	}

	HTMLElement.prototype.tooltip = function(data) {
		this.tooltipData = data;
		this.dispatchEvent(new Event("updatetooltip"));
	};

	if (typeof HTMLElement.prototype.requestFullScreen == "undefined") {
		HTMLElement.prototype.requestFullScreen = function() {
			if (this.webkitRequestFullscreen) {
				this.webkitRequestFullscreen();
			} else if (this.mozRequestFullScreen) {
				this.mozRequestFullScreen();
			} else if (this.msRequestFullscreen) {
				this.msRequestFullscreen();
			}
		}
	}

	var videoProto = Object.keys(HTMLVideoElement.prototype);
	if (videoProto.indexOf("webkitDecodedFrameCount") != -1 && videoProto.indexOf("getVideoPlaybackQuality") == -1) {
		//Workaround for a fake videoPlaybackQuality
		HTMLVideoElement.prototype.getVideoPlaybackQuality = function () {
			return {
				totalVideoFrames: this.webkitDecodedFrameCount,
				droppedVideoFrames: this.webkitDroppedFrameCount
			};
		}
	}

	if (typeof document.isFullScreen == "undefined") {
		document.isFullScreen = function() {
			return document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenEnabled;
		}
	}

	if (typeof document.exitFullscreen == "undefined") {
		document.exitFullscreen = function() {
			if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (window.msExitFullscreen) {
				msExitFullscreen()
			}
		}
	}

	var pad = function(number, length) {
		length = length || 2;
		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	}

	var htmlEscape = function(text) {
		return text.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	}

	var formatInt = function(source, length) {
		var strTemp = "";
		for (var i = 1; i <= length - (source + "").length; i++) {
			strTemp += "0";
		}
		return strTemp + source;
	}

	var formatDate = function(timestamp, shortFormat) {
		if (timestamp == 0) {
			return lang['oneDay'];
		}
		var date = new Date((parseInt(timestamp)) * 1000),
			year, month, day, hour, minute, second;
		year = String(date.getFullYear());
		month = String(date.getMonth() + 1);
		if (month.length == 1) month = "0" + month;
		day = String(date.getDate());
		if (day.length == 1) day = "0" + day;
		hour = String(date.getHours());
		if (hour.length == 1) hour = "0" + hour;
		minute = String(date.getMinutes());
		if (minute.length == 1) minute = "0" + minute;
		second = String(date.getSeconds());
		if (second.length == 1) second = "0" + second;
		if (shortFormat) return String(month + "-" + day + " " + hour + ":" + minute);
		return String(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
	}

	var formatTime = function(time) {
		if (isNaN(time)) return '00:00';
		return formatInt(parseInt(time / 60), 2) + ':' + formatInt(parseInt(time % 60), 2);
	}

	var convertTime = function(formattedTime) {
		var timeParts = formattedTime.split(":"),
			total = 0;
		for (var i = 0; i < timeParts.length; i++) {
			total *= 60;
			var value = parseInt(timeParts[i]);
			if (isNaN(value) || value < 0) return false;
			total += value;
		}
		return total;
	}
	var hoverTooltip = function(elem, follow, yoffset) {
		if (!elem) return;
		elem[addEventListener]("mousemove", function(e) {
			var tooltip = $("ABP-Tooltip"),
				elemWidth = elem.clientWidth,
				elemHeight = elem.clientHeight,
				elemOffset = elem.getBoundingClientRect(),
				player = findClosest(elem, 'ABP-Unit').parentNode,
				unitOffset = player.getBoundingClientRect(),
				elemTop = elemOffset.top - unitOffset.top,
				elemLeft = follow ? e.clientX - unitOffset.left : elemOffset.left - unitOffset.left,
				tooltipLeft = elemLeft,
				tooltipRect;
			if (tooltip == null) {
				tooltip = _("div", {
					"id": "ABP-Tooltip",
				}, [_("text", elem.tooltipData)]);
				tooltip.by = elem;
				player.appendChild(tooltip);
				tooltip.style["top"] = elemTop + elemHeight + 2 + "px";
				tooltip.style["left"] = elemLeft + elemWidth / 2 - tooltip.clientWidth / 2 + "px";
				tooltipLeft += elemWidth / 2 - tooltip.clientWidth / 2;
			}
			if (follow) {
				tooltip.style["left"] = elemLeft - tooltip.clientWidth / 2 + "px";
				tooltipLeft -= elemWidth / 2;
			}
			tooltipRect=tooltip.getBoundingClientRect();
			if(tooltipRect.left < unitOffset.left){
				tooltip.style.left='0px';
			}else if(tooltipRect.right > unitOffset.right){
				tooltip.style.left=unitOffset.width-tooltipRect.width+'px';
			}
			yoffset=yoffset||-6;
			if (yoffset) {
				tooltip.style["top"] = elemTop - tooltip.clientHeight + 2 + yoffset + "px";
			}
		});
		var mouseout = function() {
			var tooltip = $("ABP-Tooltip");
			if (tooltip && tooltip.parentNode) {
				tooltip.remove();
			}
		},
		touchendTimeout=null;
		elem[addEventListener]("mouseout", mouseout);
		elem[addEventListener]("touchend", function(){
			if(touchendTimeout != null){
				clearTimeout(touchendTimeout);
				touchendTimeout = null;
			}
			touchendTimeout = setTimeout(function(){
				touchendTimeout = null;
				mouseout();
			},2e3);
		});
		elem[addEventListener]("updatetooltip", function(e) {
			var tooltip = $("ABP-Tooltip");
			if (tooltip && tooltip.by == e.target) {
				tooltip.textContent = elem.tooltipData;
			}
		});
	}
	var addClass = function(elem, className) {
		if (elem == null) return;
		var oldClass = elem.className.split(" ");
		if (oldClass[0] == "") oldClass = [];
		if (oldClass.indexOf(className) < 0) {
			oldClass.push(className);
		}
		elem.className = oldClass.join(" ");
	};
	var hasClass = function(elem, className) {
		if (elem == null) return false;
		var oldClass = elem.className.split(" ");
		if (oldClass[0] == "") oldClass = [];
		return oldClass.indexOf(className) >= 0;
	}
	var removeClass = function(elem, className) {
		if (elem == null) return;
		var oldClass = elem.className.split(" ");
		if (oldClass[0] == "") oldClass = [];
		if (oldClass.indexOf(className) >= 0) {
			oldClass.splice(oldClass.indexOf(className), 1);
		}
		elem.className = oldClass.join(" ");
	};
	var buildFromDefaults = function(n, d) {
		var r = {};
		for (var i in d) {
			if (n && typeof n[i] !== "undefined")
				r[i] = n[i];
			else
				r[i] = d[i];
		}
		return r;
	}


	ABP.create = function(element, params) {
		playerIframe.contentWindow.HTMLElement.prototype.tooltip = HTMLElement.prototype.tooltip;
		var elem = element;
		if (!params) {
			params = {};
		}
		ABP.playerConfig = params.config ? params.config : {};
		params = buildFromDefaults(params, {
			"replaceMode": true,
			"width": 512,
			"height": 384,
			"src": ""
		});
		if (typeof element === "string") {
			elem = $(element);
		}
		// 'elem' is the parent container in which we create the player.
		if (!hasClass(elem, "ABP-Unit")) {
			// Assuming we are injecting
			var container = _("div", {
				"className": "ABP-Unit",
				"style": {
					"width": params.width.toString().indexOf("%") >= 0 ? params.width : params.width + "px",
					"height": params.height.toString().indexOf("%") >= 0 ? params.height : params.height + "px"
				}
			});
			elem.appendChild(container);
		} else {
			container = elem;
		}
		// Create the innards if empty
		if (container.children.length > 0 && params.replaceMode) {
			container.textContent = "";
		}
		var playlist = [];
		var danmaku = [];
		if (typeof params.src === "string") {
			params.src = _("video", {
				"autobuffer": "true",
				"dataSetup": "{}",
			}, [
				_("source", {
					"src": params.src
				})
			]);
			playlist.push(params.src);
		} else if (params.src.hasOwnProperty("playlist")) {
			var data = params.src;
			var plist = data.playlist;
			for (var id = 0; id < plist.length; id++) {
				if (plist[id].hasOwnProperty("sources")) {
					var sources = [];
					for (var mime in plist[id]["sources"]) {
						sources.push(_("source", {
							"src": plist[id][mime],
							"type": mime
						}));
					}
					playlist.push(_("video", {
						"autobuffer": "true",
						"dataSetup": "{}",
					}, sources));
				} else if (plist[id].hasOwnProperty("video")) {
					playlist.push(plist[id]["video"]);
				} else {}
				danmaku.push(plist[id]["comments"]);
			}
		} else {
			playlist.push(params.src);
		}
		container.appendChild(_("div", {
			"className": "ABP-Player"
		}, [_("div", {
			"className": "ABP-Video",
			"tabindex": "10"
		}, [_('div',{id:'info-box',style:{opacity:1}},[
				_('div',{className:'text-wrapper'},[_('div',{},[_('text',ABP.Strings.loadingMeta)])]),
				_('div',{id:'dots'})
			]),
			_("div", {
				"className": "ABP-Container"
			},[_('div',{className:'cmt',style:{left:0}},[_('text','　')])]),playlist[0],_('div',{className:'Player-Stats'},[
				/*
				dimension
					player
					video
				buffer
				*flvjs
					mimeType
					audioCodec
					videoCodec
					fps
					videoBit
					audioBit
					currentBitrate
				bitrate
				*firefox
					frames
						decoded
						painted
						presented
						dropped
				*webkit
					frames
						decoded
						dropped
				*/
				_('div',{id:'player-dimension'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsPlayer)]),_('span')]),
				_('div',{id:'video-dimension'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsVideo)]),_('span')]),
				_('div',{id:'mimeType'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsMimetype)]),_('span')]),
				_('div',{id:'buffer-health'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsBuffer)]),_('span',{className:'stats-column',id:'buffer-health-column'}),_('span')]),
				_('div',{style:{position:'relative'}},[
				_('span',{className:'stats_name'},[_('text',ABP.Strings.statsBufferClip)]),_('span',{id:'buffer-clips'},[
					_('span'),
					_('span',{},[
						_('div',{style:{width:'1px',height:'400%',top:'-150%',position:'absolute',background:'#FFF',left:0}})
					])
				]),_('pre',{style:{position:'absolute',margin:0,left:'250px',width:'90px',fontFamily:'inherit'}})]),
				
				_('br',{className:'flvjs'}),
				_('div',{className:'flvjs'},[_('span',{className:'stats_name'},[_('text','fps：')]),_('span')]),
				_('div',{className:'flvjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsVideoBitrate)]),_('span')]),
				_('div',{className:'flvjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsAudioBitrate)]),_('span')]),
				_('div',{className:'flvjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsCurrentBitrate)]),_('span')]),
				
				_('div',{title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.overallBitrate)]),_('span',{id:'overall-bitrate'})]),
				_('div',{className:'flvjs',style:{position:'relative'}},[_('div',{style:{position:'absolute',left:'240px',bottom:'100%',cursor:'pointer'},event:{click:function(e){e.stopPropagation(),flvplayer&&flvplayer.reloadSegment&&flvplayer.reloadSegment()}}},[_('text','[ '+ABP.Strings.reload+' ]')])]),
				_('div',{className:'flvjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsRealtimeBitrate)]),_('span',{className:'stats-column',id:'realtime-bitrate-column',style:{verticalAlign:'top'}}),_('span')]),
				_('div',{className:'flvjs'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsDownloadSpeed)]),_('span',{className:'stats-column',id:'download-speed-column',style:{verticalAlign:'top'}}),_('span')]),
				_('div',{className:'flvjs'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsSourceHost)]),_('span',{className:'srcUrl'})]),
				_('div',{className:'flvjs'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsRedirection)]),_('span',{className:'redirUrl'})]),
				
				_('br',{className:'hlsjs'}),
				_('div',{className:'hlsjs'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.currentQuality)]),_('span')]),
				_('div',{className:'hlsjs'},[_('span',{className:'stats_name'},[_('text','fps：')]),_('span')]),
				_('div',{className:'hlsjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsVideoBitrate)]),_('span')]),
				_('div',{className:'hlsjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsAudioBitrate)]),_('span')]),
				_('div',{className:'hlsjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.overallBitrate)]),_('span')]),
				_('div',{className:'hlsjs'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.currentFragment)]),_('span',{style:{width:'180px',height:'5px',display:'inline-block',position:'relative',border:'solid #AAA 1px',borderRadius:'4px',verticalAlign:'middle',marginRight:'2px'}},[
					_('span',{id:'download-progress-hls',style:{position:'absolute',left:'2px',right:'2px',top:'1px',bottom:'1px',background:'#CCC',borderRadius:'3px',transition:'width .3s',width:0}})
				]),_('span')]),
				_('div',{className:'hlsjs',title:'1 kbps = 1000 bps'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsRealtimeBitrate)]),_('span',{className:'stats-column',id:'realtime-bitrate-column-hls',style:{verticalAlign:'top'}}),_('span')]),
				_('div',{className:'hlsjs'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsDownloadSpeed)]),_('span',{className:'stats-column',id:'download-speed-hls-column',style:{verticalAlign:'top'}}),_('span')]),
				_('br'),

				_('div',{id:'canvas-fps'},[_('span',{className:'stats_name'},[_('text','Canvas fps：')]),_('span')]),
				
				_('div',{className:'videoQuality'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsPresent)]), ,_('span',{className:'stats-column',id:'playback-fps-column'}),_('span')]),
				_('div',{className:'videoQuality'},[_('span',{className:'stats_name'},[_('text',ABP.Strings.statsDrop)]), ,_('span',{className:'stats-column',id:'drop-fps-column'}),_('span')]),
				
				_('br'),
				_('div',{style:{fontSize:'11px'}},[_('text',versionString)]),
				_('div',{style:{fontSize:'11px'}},[_('text','2018©esterTion')]),
				_('div',{id:'stats-close'},[_('text','×')])
			])
		]), _("div", {
			"className": "ABP-Bottom",
		}, [_("div", {
			"className": "ABP-Bottom-Extend"
		}),_("div", {
			"className": "BiliPlus-Scale-Menu"
		}, [_("div",{
			"className": "Video-Defination"
		}),_("div",{
			"className": "Video-Scale"
		},[_("div", {
				'changeTo':'default',
				'className':'on'
			}, [_("text", ABP.Strings.displayScaleD)]),
			_("div", {
				'changeTo':'16_9'
			}, [_("text", "16:9")]),
			_("div", {
				'changeTo':'4_3'
			}, [_("text", "4:3")]),
			_("div", {
				'changeTo':'full'
			}, [_("text", ABP.Strings.displayScaleF)])
		])
		]),_('div',{className:'ABP-Bottom-Wrapper'},[_("div", {
			"className": "ABP-Text",
		}, [
			_("div", {
				"className": "ABP-CommentStyle"
			}, [
				_("div", {
					"className": "button-group ABP-Comment-FontGroup"
				}, [_("div", {
					"className": "button ABP-Comment-Font icon-font-style"
				}), _("div", {
					"className": "ABP-Comment-FontOption"
				}, [
					_("p", {
						"className": "style-title"
					}, [_("text", ABP.Strings.sendSize)]),
					_("div", {
						"className": "style-select",
						"name": "commentFontSize"
					}, [_("div", {
						"className": "style-option",
						"value": 18
					}, [_("text", ABP.Strings.sendSmall)]), _("div", {
						"className": "style-option on",
						"value": 25
					}, [_("text", ABP.Strings.sendMid)])]),
					_("p", {
						"className": "style-title"
					}, [_("text", ABP.Strings.sendMode)]),
					_("div", {
						"className": "style-select",
						"name": "commentMode"
					}, [_("div", {
						"className": "style-option",
						"value": 5
					}, [_("text", ABP.Strings.sendTop)]), _("div", {
						"className": "style-option on",
						"value": 1
					}, [_("text", ABP.Strings.sendScroll)]), _("div", {
						"className": "style-option",
						"value": 4
					}, [_("text", ABP.Strings.sendBottom)])])
				])]),
				_("div", {
					"className": "button-group ABP-Comment-ColorGroup"
				}, [_("div", {
					"className": "ABP-Comment-Color-Display"
				}), _("div", {
					"className": "button ABP-Comment-Color icon-color-mode"
				}), _("div", {
					"className": "ABP-Comment-ColorOption"
				}, [_("div", {
					"className": "ABP-Comment-ColorPicker"
				})])]),
			]),
			_('form',{},[_("input", {
				"className": "ABP-Comment-Input",
			})]),
			_("div", {
				"className": "ABP-Comment-Send"
			}, [
				_("text", ABP.Strings.send)
			])
		]), _("div", {
			"className": "ABP-Control"
		}, [
			_("div", {
				"className": "button ABP-Play icon-play"
			}),
			_("div", {
				"className": "button ABP-Next icon-next"
			}, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 12 12"><path d="M 2,12 8.5,7 2,2 z M 10,2 h 1.5 V 12 h -1.5 z"/></svg>'),
			_("div", {
				"className": "progress-bar"
			}, [
				_("div", {
					"className": "bar"
				}, [
					_("div", {
						"className": "load"
					}),
					_("div", {
						"className": "dark"
					})
				]),
			]),
			_("div", {
				"className": "time-label"
			}, [_("text", "00:00 / 00:00")]),
			_("div", {
				"className": "button ABP-Volume icon-volume-high"
			}),
			_("div", {
				"className": "volume-bar"
			}, [
				_("div", {
					"className": "bar"
				}, [
					_("div", {
						"className": "load"
					})
				]),
			]),
			_("div", {
				"className": "button-group ABP-CommentGroup"
			}, [_("div", {
				"className": "button ABP-CommentShow icon-comment on"
			})]), _("div", {
				"className": "button-group ABP-PlaySpeedGroup"
			},[_("div", {
				"className": "button ABP-Loop icon-loop"
			})]), _("div", {
				"className": "button ABP-Setting icon-gear"
			}),_("div", {
				"className": "button ABP-CommentListShow icon-list"
			}, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 15 12"><path d="M 1,1 h 3 v 2 h -3 v -2 z M 6,1 h 8 v 2 h -8 z M1,5 h 3 v 2 h -3 v -2 z M 6,5 h 8 v 2 h -8 z M 1,9 h 3 v 2 h -3 v -2 z M 6,9 h 8 v 2 h -8 z"/></svg>'),
			_("div", {
				"className": "button-group ABP-FullScreenGroup"
			}, [_("div", {
				"className": "button ABP-FullScreen icon-screen-full"
			}), _("div", {
				"className": "button ABP-Web-FullScreen icon-screen"
			})])
		])]),_('div',{className:'ABP-Title'})])]));
		container.appendChild(_('div',{className:'shield hidden'},[
			_('div',{
				className:'shield_top'
			},[_('text',ABP.Strings.commentBlock),_('span',{className:'close'})]),
			_('div',{className:'shield_tabs'},[
				_('div',{className:'shield_tab on'},[_('div',{},[_('text',ABP.Strings.shieldTypeText)])]),
				_('div',{className:'shield_tab'},[_('div',{},[_('text',ABP.Strings.shieldTypeUser)])]),
				_('div',{className:'shield_tab'},[_('div',{},[_('text',ABP.Strings.shieldTypeColor)])]),
				_('div',{className:'shield_tab'},[_('div',{},[_('text',ABP.Strings.shieldTypeSetting)])])
			]),
			_('div',{className:'shield_tab_slash'}),
			_('div',{className:'shield_body'},[
				_('div',{className:'shield_body_wrapper'},[
					_('div',{className:'shield_tab_body'},[
						_('div',{id:'shield_text'}),
						_('div',{className:'shield_item'},[
							_('input',{className:'new',type:'text',placeholder:ABP.Strings.shieldAdd}),
							_('div',{className:'add'})
						]),
					]),
					_('div',{className:'shield_tab_body'},[
						_('div',{id:'shield_user'})
					]),
					_('div',{className:'shield_tab_body'},[
						_('div',{id:'shield_color'})
					]),
					_('div',{className:'shield_tab_body'},[
						_('div',{className:'shield_toggle',id:'useReg'},[_('text',ABP.Strings.shieldUseRegex)]),
						_('div',{className:'shield_toggle',id:'blockTop'},[_('text',ABP.Strings.shieldBlockTop)]),
						_('div',{className:'shield_toggle',id:'blockBottom'},[_('text',ABP.Strings.shieldBlockBottom)]),
						_('div',{className:'shield_toggle',id:'blockVisitor'},[_('text',ABP.Strings.shieldBlockVisitor)]),
						_('div',{className:'shield_slide',id:'repeat'},[
							_('div',{className:'fill'}),
							_('div',{className:'button'}),
							_('div',{className:'slide_info'})
						]),
						_('div',{style:{padding:'0 16px'}},[_('text',ABP.Strings.shieldRepeat)])
					])
				])
			])
		]))
		container.appendChild(_("div", {
			"className": "ABP-Comment-List"
		}, [
			_('div',{
				className:'ABP-Comment-List-Count'
			},[
				_('div',{
					style:{
						position:'absolute',
						right:'200px'
					}
				},[_('span',{id:'viewer',style:{fontWeight:'bold'}},[_('text','--')]),_('text',ABP.Strings.viewers)]),
				_('div',{
					style:{
						position:'absolute',
						right:'20px'
					}
				},[_('span',{id:'danmaku',style:{fontWeight:'bold'}},[_('text','--')]),_('text',ABP.Strings.comments)]),
			]),
			_("div", {
				"className": "ABP-Comment-List-Title"
			}, [_("div", {
				"className": "cmt-time",
				"item": "time"
			}, [_("text", ABP.Strings.commentTime)]), _("div", {
				"className": "cmt-content",
				"item": "content"
			}, [_("text", ABP.Strings.commentContent)]), _("div", {
				"className": "cmt-date",
				"item": "date"
			}, [_("text", ABP.Strings.commentDate)])]), _("div", {
				"className": "ABP-Comment-List-Container"
			}, [_("ul", {
				"className": "ABP-Comment-List-Container-Inner"
			})])
		]));
		container.appendChild(_('div',{className:'ABP-Settings'},[_('div',{},[
			_('div',{className:'ABP-Settings-Top'},[_('div',{className:'ABP-Settings-Close'},[_('text','×')])]),
			_('div',{className:'ABP-Settings-Container'},[
			//CommentOption
				_('p',{className:'label big'},[_('text',ABP.Strings.settComment)]),
				_('p', {
				className:'label prop'
			}, [_('text',ABP.Strings.useCSS), _("div", {
				"className": "prop-checkbox"
			})]), _("p", {
				"className": "label"
			}, [_("text", ABP.Strings.commentSpeed)]), _("div", {
				"className": "speed-bar"
			}, [
				_("div", {
					"className": "bar"
				}, [
					_("div", {
						"className": "load"
					})
				]),
			]), _("p", {
				"className": "label"
			}, [_("text", ABP.Strings.commentScale)]), _("div", {
				"className": "scale-bar"
			}, [
				_("div", {
					"className": "bar"
				}, [
					_("div", {
						"className": "load"
					})
				]),
			]), _("p", {
				"className": "label"
			}, [_("text", ABP.Strings.commentDensity)]), _("div", {
				"className": "density-bar"
			}, [
				_("div", {
					"className": "bar"
				}, [
					_("div", {
						"className": "load"
					})
				]),
			]), _("p", {
				"className": "label"
			}, [_("text", ABP.Strings.commentOpacity),_("div", {
				"className": "prop-checkbox",
				style:{
					top:'10px',
					left:'calc(100% - 20px)'
				}
			}), _('span',{style:{position:'absolute',right:0,top:'-4px'}},[_('text', ABP.Strings.autoOpacityOff)])]), _("div", {
				"className": "opacity-bar",
				style:{
					width:'calc(100% - 25px)'
				}
			}, [
				_("div", {
					"className": "bar"
				}, [
					_("div", {
						"className": "load"
					})
				]),
			]),
			_('p',{className:'label prop'},[_('text',ABP.Strings.cmStyle),_("select",{id:'setting-cmStyle',event:{mouseup:function(e){e.stopPropagation();}}},[
				_('option',{value:'0-1'},[_('text',ABP.Strings.cmStyle_st)]),
				_('option',{value:'1-0'},[_('text',ABP.Strings.cmStyle_sh)]),
				_('option',{value:'1-1'},[_('text',ABP.Strings.cmStyle_stsh)])
			])]),
			_("div", {
				"className": "shield-enrty"
			}, [
				_("text", ABP.Strings.commentBlock),
			]),
			
			//PlaySpeedOption
			_("p", {
				"className": "label big"
			}, [_("text", ABP.Strings.playSpeed)]), _("div", {
				"className": "playSpeed-bar"
			}, [
				_("div", {
					"className": "bar"
				}, [
					_("div", {
						"className": "load"
					})
				]),
			]), _("div",{
				"className": "play-speed-reset"
			},[_("text", ABP.Strings.playSpeedReset)]),
			_('p', {
				className:'label prop'
			}, [_('text',ABP.Strings.recordPlaySpeed), _("div", {
				id:'setting-recordPlaySpeed',
				className: "prop-checkbox"
			})]),
			
			//PlayerOption
			_('p',{className:'label big'},[_('text',ABP.Strings.settPlayer)]),
			_('p',{className:'label prop'},[_('text',ABP.Strings.autoPlay),_("div",{id:'setting-autoPlay',className:"prop-checkbox"})]),
			_('p',{className:'label prop'},[_('text',ABP.Strings.defaultFull),_("div",{id:'setting-defaultFull',className:"prop-checkbox"})]),
			_('p',{className:'label prop'},[_('text',ABP.Strings.playerTheme +'：'),_("select",{id:'setting-playerTheme',event:{mouseup:function(e){e.stopPropagation();}}},[
				_('option',{value:'bilibili'},[_('text','BiliBili')]),
				_('option',{value:'YouTube'},[_('text','YouTube')]),
				_('option',{value:'AcFun'},[_('text','AcFun')]),
			])]),
			//end
			])
		])]));
		container.appendChild(_('div',{className:'Context-Menu'},[
			_('div',{className:'Context-Menu-Background'}),
			_('div',{className:'Context-Menu-Body'},[
				_('div',{id:'Player-Stats-Toggle', className:'preserve'},[_('text',ABP.Strings.showStats)]),
				_('div',{id:'Player-Screenshot',className:'dm preserve'},[_('div',{className:'content'},[_('text',ABP.Strings.screenshot)]),_('div',{className:'dmMenu'},[
					_('div',{'data-comment':'off'},[_('text',ABP.Strings.screenshotWithoutComment)]),
					_('div',{'data-comment':'on'}, [_('text',ABP.Strings.screenshotWithComment)])
				])]),
				_('div',{id:'Player-Speed-Control',className:'dm preserve'},[_('div',{className:'content'},[_('text',ABP.Strings.playSpeed)]),_('div',{className:'dmMenu',style:{top:'-37px'}},[
					_('div',{'data-speed':0.5},[_('text',0.5)]),
					_('div',{'data-speed':1},[_('text',1)]),
					_('div',{'data-speed':1.25},[_('text',1.25)]),
					_('div',{'data-speed':1.5},[_('text',1.5)]),
					_('div',{'data-speed':2},[_('text',2)])
				])]),
				_('div',{className:'about preserve'},[_('text',versionString)])
			])
		]));
		container.appendChild(_('input', {class: 'Copy-Text-Input', type:'text', style:{height:'1px',width:'1px',padding:0,border:0,pointerEvents:'none',opacity:0}}));
		var bind = ABP.bind(container);
		return bind;
	}
	var BiliBili_midcrc=function(){
		var CRCPOLYNOMIAL = 0xEDB88320,
		crctable=new Array(256),
		create_table=function(){
			var crcreg,
			i,j;
			for (i = 0; i < 256; ++i)
			{
				crcreg = i;
				for (j = 0; j < 8; ++j)
				{
					crcreg = (crcreg & 1) != 0 ? CRCPOLYNOMIAL ^ (crcreg >>> 1) : crcreg >>> 1;
				}
				crctable[i] = crcreg;
			}
		},
		crc32=function(input,returnIndex){
			var crcstart = 0xFFFFFFFF, len = input.length, index;
			for(var i=0;i<len;++i){
				index = (crcstart ^ input.charCodeAt(i)) & 0xff;
				crcstart = (crcstart >>> 8) ^ crctable[index];
			}
			return returnIndex?index:crcstart;
		},
		getcrcindex=function(t){
			for(var i=0;i<256;i++){
				if(crctable[i] >>> 24 == t)
					return i;
			}
			return -1;
		},
		deepCheckData='',
		deepCheck=function(i,index){
			var tc=0x00,str='',
			hash=crc32(i.toString(),!1);
			tc = hash & 0xff ^ index[2];
			if (!(tc <= 57 && tc >= 48))
				return 0;
			str+=tc-48;
			hash = crctable[index[2]] ^ (hash >>> 8);
			tc = hash & 0xff ^ index[1];
			if (!(tc <= 57 && tc >= 48))
				return 0;
			str+=tc-48;
			hash = crctable[index[1]] ^ (hash >>> 8);
			tc = hash & 0xff ^ index[0];
			if (!(tc <= 57 && tc >= 48))
				return 0;
			str+=tc-48;
			hash = crctable[index[0]] ^ (hash >>> 8);
			deepCheckData=str;
			return 1;
		};
		create_table();
		var index=new Array(4);
		return function(input){
			var ht=parseInt(input,16)^0xffffffff,
			snum,i,lastindex;
			for(i=1;i<1001;i++){
				if(ht==crc32(i.toString(),!1))
					return i;
			}
			for(i=3;i>=0;i--){
				index[3-i]=getcrcindex( ht >>> (i*8) );
				snum=crctable[index[3-i]];
				ht^=snum>>>((3-i)*8);
			}
			for(i=0;i<1e5; i++){
				lastindex = crc32(i.toString(),!0);
				if(lastindex == index[3]){
					if(deepCheck(i,index))
						break;
				}
			}
			return (i==1e5)?-1:(i+''+deepCheckData);
		}
	},
	getBuffer=function(video){
		var index = 0, buff = video.buffered, len = buff.length, i=0, currentTime = video.currentTime;

		for (; i < len; i++) {
			if (currentTime < buff.start(i)) break;
			index = i;
		}

		var s = buff.start(index), e = buff.end(index);
		return {
			start: s,
			end: e,
			delta: e - currentTime,
			index:index
		};


		/*
		for(var s,e,i=0,currentTime=video.currentTime;i<video.buffered.length;i++){
			if( currentTime>=video.buffered.start(i) && currentTime<=video.buffered.end(i) ){
				s = video.buffered.start(i);
				e = video.buffered.end(i);
				break;
			}
		}
		if(i==video.buffered.length)
			throw 'Not in a range';
		return {
			start:s,
			end:e,
			delta:e-currentTime,
			index:i
		}
		*/
	};
	window.crc_engine=new BiliBili_midcrc();

	ABP.bind = function(playerUnit, state) {
		var ABPInst = {
			playerUnit: playerUnit,
			btnPlay: null,
			btnNext: null,
			barTime: null,
			barLoad: null,
			barTimeHitArea: null,
			barVolume: null,
			barVolumeHitArea: null,
			barOpacity: null,
			barOpacityHitArea: null,
			barScale: null,
			barScaleHitArea: null,
			barSpeed: null,
			barSpeedHitArea: null,
			barPlaySpeed: null,
			barPlaySpeedHitArea: null,
			btnFont: null,
			btnColor: null,
			btnSend: null,
			controlBar: null,
			timeLabel: null,
			timeJump: null,
			divComment: null,
			btnWide: null,
			btnFull: null,
			btnWebFull: null,
			btnDm: null,
			btnLoop: null,
			btnProp: null,
			btnAutoOpacity: null,
			videoDiv: null,
			btnVolume: null,
			video: null,
			txtText: null,
			commentColor: 'ffffff',
			commentFontSize: 25,
			commentMode: 1,
			displayColor: null,
			cmManager: null,
			commentList: null,
			commentListContainer: null,
			lastSelectedComment: null,
			commentCoolDown: 2000,
			commentScale: ABP.playerConfig.scale ? ABP.playerConfig.scale : 1,
			commentSpeed: ABP.playerConfig.speed ? ABP.playerConfig.speed : 1,
			proportionalScale: ABP.playerConfig.prop,
			autoPlay: false,
			defaultFull: false,
			recordPlaySpeed: false,
			defaults: {
				w: 0,
				h: 0
			},
			inited: false,
			state: buildFromDefaults(state, {
				fullscreen: false,
				commentVisible: true,
				allowRescale: false,
				autosize: false,
				widescreen: false,
				commentListShow: false,
				settingsShow: false
			}),
			createPopup: function(text, delay) {
				if (playerUnit.hasPopup === true)
					return false;
				var p = _("div", {
					"className": "ABP-Popup"
				}, [_("text", text)]);
				p.remove = function() {
					if (p.isRemoved) return;
					p.isRemoved = true;
					playerUnit.removeChild(p);
					playerUnit.hasPopup = false;
				};
				playerUnit.appendChild(p);
				playerUnit.hasPopup = true;
				if (typeof delay === "number") {
					setTimeout(function() {
						p.remove();
					}, delay);
				}
				return p;
			},
			removePopup: function() {
				var pops = playerUnit.getElementsByClassName("ABP-Popup");
				for (var i = 0; i < pops.length; i++) {
					if (pops[i].remove != null) {
						pops[i].remove();
					} else {
						pops[i].parentNode.removeChild(pops[i]);
					}
				}
				playerUnit.hasPopup = false;
			},
			loadCommentList: function(sort, order) {
				order = order == "asc" ? -1 : 1;
				var keysSorted = Object.keys(ABPInst.commentList).sort(function(a, b) {
					if (ABPInst.commentList[a][sort] < ABPInst.commentList[b][sort]) return order;
					if (ABPInst.commentList[a][sort] > ABPInst.commentList[b][sort]) return -order;
					return 0;
				});
				ABPInst.commentObjArray = [];
				for (i in keysSorted) {
					var key = keysSorted[i];
					var comment = ABPInst.commentList[key];
					if (comment && comment.time) {
						var commentObj = _("li", {}),
							commentObjTime = _("span", {
								"className": "cmt-time"
							}, [_("text", formatTime(comment.time / 1000))]),
							commentObjContent = _("span", {
								"className": "cmt-content"
							}, [_("text", comment.content)]),
							commentObjDate = _("span", {
								"className": "cmt-date"
							}, [_("text", formatDate(comment.date, true))]);
						hoverTooltip(commentObjContent, false, 36);
						hoverTooltip(commentObjDate, false, 18);
						commentObjContent.tooltip(comment.content);
						commentObjDate.tooltip(formatDate(comment.date));
						commentObj.appendChild(commentObjTime);
						commentObj.appendChild(commentObjContent);
						commentObj.appendChild(commentObjDate);
						commentObj.data = comment;
						commentObj.originalData=comment.originalData;
						if(comment.mode==8){
							commentObj.style.background='#ffe100';
						}else if(comment.pool!=0){
							commentObj.style.background='#20ff20';
						}
						commentObj[addEventListener]("dblclick", function(e) {
							ABPInst.video.currentTime = this.data.time / 1000;
							updateTime(video.currentTime);
						});
						ABPInst.commentObjArray.push(commentObj);
					}
				}
				ABPInst.commentListContainer.style.height = ABPInst.commentObjArray.length * 24 + "px";
				ABPInst.renderCommentList();
				ABPInst.playerUnit.querySelector('.ABP-Comment-List-Count span#danmaku').textContent=ABPInst.commentObjArray.length;
			},
			renderCommentList: function() {
				var offset = ABPInst.commentListContainer.parentElement.scrollTop,
					firstIndex = parseInt(offset / 24);
				ABPInst.commentListContainer.textContent = "";
				for (var i = firstIndex; i <= firstIndex + 40; i++) {
					if (typeof ABPInst.commentObjArray[i] !== "undefined") {
						if (i == firstIndex && i > 0) {
							var commentObj = ABPInst.commentObjArray[i].cloneNode(true),
								commentObjContent = commentObj.getElementsByClassName("cmt-content")[0],
								commentObjDate = commentObj.getElementsByClassName("cmt-date")[0];
							commentObj[addEventListener]("dblclick", function(e) {
								ABPInst.video.currentTime = ABPInst.commentObjArray[i].data.time / 1000;
								updateTime(video.currentTime);
							});
							hoverTooltip(commentObjContent, false, 36);
							hoverTooltip(commentObjDate, false, 18);
							commentObjContent.tooltip(ABPInst.commentObjArray[i].data.content);
							commentObjDate.tooltip(formatDate(ABPInst.commentObjArray[i].data.date));
							commentObj.style.paddingTop = 24 * firstIndex + "px";
						} else {
							var commentObj = ABPInst.commentObjArray[i];
						}
						if(ABPInst.commentObjArray[i].data.originalData.isBlocked){
							ABPInst.commentObjArray[i].childNodes[0].className='cmt-time blocked';
							ABPInst.commentObjArray[i].childNodes[0].title=ABP.Strings.blockMatch+ABPInst.commentObjArray[i].data.originalData.blockReason;
						}else{
							ABPInst.commentObjArray[i].childNodes[0].className='cmt-time';
							ABPInst.commentObjArray[i].childNodes[0].title='';
						}
						ABPInst.commentListContainer.appendChild(commentObj);
					} else {
						break;
					}
				}
			},
			commentCallback: function(data) {
				if (data.result) {
					ABPInst.commentList[data.id] = ABPInst.commentList[data.tmp_id];
					delete ABPInst.commentList[data.tmp_id];
				} else {
					delete ABPInst.commentList[data.tmp_id];
					ABPInst.createPopup(data.error, 5000);
				}
			},
			swapVideo: null
		};
		ABPInst.copyText = function (txt) {
			try{
				/*
				chrome需要已有input中才能复制，新生成input无效
				*/
				var copier = ABPInst.playerUnit.querySelector('.Copy-Text-Input');
				copier.value=txt;
				copier.select();
				var success=playerIframe.contentDocument.execCommand('copy');
				copier.blur();
				if(!success)
					throw '';
				ABPInst.createPopup(ABP.Strings.copied,1e3);
			}catch(e){
				console.error(e)
				ABPInst.createPopup(ABP.Strings.copyFail,3e3);
			}
		}
		Object.defineProperty(ABPInst,'title',{
			get:function(){
				return ABPInst.playerUnit.getElementsByClassName('ABP-Title')[0].textContent;
			},
			set:function(s){
				var title=ABPInst.playerUnit.getElementsByClassName('ABP-Title')[0]
				title.textContent='';
				title.appendChild(_('text',s));
			}
		})
		ABPInst.swapVideo = function(video) {
			var bufferListener=function() {
				if (!dragging) {
					updateTime(video.currentTime);
					try {
						var buffer=getBuffer(this),
						dur = this.duration,
						perc = (buffer.end / dur) * 100;
						ABPInst.barLoad.style.width = perc + "%";
					} catch (err) {
						return;
					}
				}
			}
			video[addEventListener]("timeupdate", bufferListener);
			video[addEventListener]('timeupdate', function(e){ABPInst.inited=true;});
			video[addEventListener]('canplay', function(e){ABPInst.inited=true;});
			var lastCheckTime = 0,isFirst=true,isEnded=false,isLooping=false,loadingNew=false,
			autoPlay=function(){
				loadingNew=false;
				video.removeEventListener('canplay',autoPlay);
				if(ABPInst.lastTime!=undefined){
					video.currentTime=ABPInst.lastTime;
					delete ABPInst.lastTime;
				}
				if(ABPInst.lastSpeed!=undefined){
					video.playbackRate=ABPInst.lastSpeed;
					delete ABPInst.lastSpeed;
				}
				if(video.paused && (ABPInst.autoPlay || !isFirst))
					ABPInst.btnPlay.click();
				if(!isFirst)
					return;
				isFirst=!1;
				if(!ABPInst.state.fullscreen && ABPInst.defaultFull){
					ABPInst.btnWebFull.click();
				}
			},
			buffering=function(){
				var rs=video.readyState,div=playerUnit.querySelector('#'+'info-box');
				if(video.ended)
					return;
				switch(rs){
					case 1:
						if(isMobile() && video.paused){
							ABPInst.createPopup('请点击播放器开始播放',3e3);
							ABPInst.video.dispatchEvent(new Event('autoPlayFailed'));
						}
					case 2:
						try{
							var buffered=video.buffered, buffer=getBuffer(video);
							if(flvplayer && flvplayer._mediaDataSource && buffer.delta<.2 && buffer.index<buffered.length-1){
								console.warn('buffer gap at',buffered.end(buffer.index),', jump from',video.currentTime,'to',buffered.start(buffer.index+1));
								video.currentTime = buffered.start(buffer.index+1);
								return;
							}
						}catch(e){}
						if(div.style.opacity==0){
							div.style.opacity=1;
						}
						if(!dots.running)
							dots.runTimer();
						try{
							var buffer=getBuffer(video);
							div.childNodes[0].childNodes[0].textContent=ABP.Strings.buffering+' '+Math.floor( (buffer.delta)*100 )/100+'s';
						}catch(e){
							div.childNodes[0].childNodes[0].textContent=ABP.Strings.buffering;
						}
					break;
					case 3:
					case 4:
						if(div.style.opacity==1){
							div.style.opacity=0;
							dots.stopTimer();
						}
					break;
				}
			},
			saveHistory=function(){
				if(!window.cid || isEnded || isLooping || loadingNew)
					return;
				var history=JSON.parse(localStorage.playHistory||'{}');
				history[cid]=video.currentTime|0;
				localStorage.playHistory=JSON.stringify(history);
			},
			removeHistory=function(){
				if(!window.cid)
					return;
				var history=JSON.parse(localStorage.playHistory||'{}');
				if(history[cid])
					delete history[cid];
				localStorage.playHistory=JSON.stringify(history);
			};
			video[addEventListener]('autoplay',function(){
				video[addEventListener]('canplay',autoPlay);
			});
			video[addEventListener]('pause',saveHistory);
			video[addEventListener]('ended',function(){isEnded=true;removeHistory();})
			try{
				var history=JSON.parse(localStorage.playHistory||'{}');
				if(history[cid]!=undefined)
					ABPInst.lastTime=history[cid];
			}catch(e){}
			window[addEventListener]('beforeunload',function(){saveHistory();return null;});
			ABPInst.playerUnit[addEventListener]('beforecidchange',function(){saveHistory();loadingNew=true;isEnded=false});
			video[addEventListener]('loop',function(){isLooping=video.loop});
			video[addEventListener]('canplay',autoPlay);
			video[addEventListener]('canplay',buffering);
			video[addEventListener]('waiting',buffering);
			video[addEventListener]('readystatechange',buffering);
			video[addEventListener]('progress',buffering);
			video[addEventListener]("ended", function() {
				ABPInst.btnPlay.className = "button ABP-Play icon-play";
				ABPInst.videoDiv.className='ABP-Video';
				playerUnit.dispatchEvent(new Event('callNext'));
			});
			video[addEventListener]("progress", bufferListener);
			/*
			video[addEventListener]("loadedmetadata", function() {
				if (this.buffered != null) {
					try {
						var s = this.buffered.start(0);
						var e = this.buffered.end(0);
					} catch (err) {
						return;
					}
					var dur = this.duration;
					var perc = (e / dur) * 100;
					ABPInst.barLoad.style.width = perc + "%";
				}
			});
			*/
			video.isBound = true;
			var lastPosition = 0;
			if (ABPInst.cmManager) {
				ABPInst.cmManager[addEventListener]("load", function() {
					ABPInst.commentList = {};
					for (i in ABPInst.cmManager.timeline) {
						var danmaku = ABPInst.cmManager.timeline[i];
						if (danmaku.dbid && danmaku.stime) {
							ABPInst.commentList[danmaku.dbid] = {
								"date": danmaku.date,
								"time": danmaku.stime,
								"mode": danmaku.mode,
								"user": danmaku.hash,
								"pool": danmaku.pool,
								"content": danmaku.text||danmaku.code,
								"originalData":danmaku
							}
						}
					}
					ABPInst.loadCommentList("date", "asc");
					ABPInst.commentListContainer.parentElement[addEventListener]("scroll", ABPInst.renderCommentList);
				});
				ABPInst.cmManager.setBounds = function() {
					if (playerUnit.offsetHeight <= 300 || playerUnit.offsetWidth <= 700) {
						addClass(playerUnit, "ABP-Mini");
					} else {
						removeClass(playerUnit, "ABP-Mini");
					}
					var actualWidth = ABPInst.videoDiv.offsetWidth,
						actualHeight = ABPInst.videoDiv.offsetHeight,
						scale = ABPInst.proportionalScale ? actualHeight / 493 * ABPInst.commentScale : ABPInst.commentScale;
					this.width = actualWidth/* / scale*/;
					this.height = actualHeight/* / scale*/;
					this.options.global.scale = this.width / 680 / ABPInst.commentSpeed/* / ABPInst.video.playbackRate*/;
					this.dispatchEvent("resize");
					for (var a in this.csa) this.csa[a].setBounds(this.width, this.height);
					this.stage.style.width = this.width + "px";
					this.stage.style.height = this.height + "px";
					this.stage.style.perspective = this.width * Math.tan(40 * Math.PI / 180) / 2 + "px";
					this.stage.style.webkitPerspective = this.width * Math.tan(40 * Math.PI / 180) / 2 + "px";
					//this.stage.style.zoom = scale;
					playerUnit.querySelector('.BiliPlus-Scale-Menu .Video-Scale div.on').click();
					this.canvasResize();
				}
				setTimeout(function(){ABPInst.cmManager.setBounds();},0)
				ABPInst.cmManager.clear();
				//ABPInst.video[addEventListener]('loadedmetadata',function(){;isFirst=true;})
				video[addEventListener]("progress", function() {
					if (lastPosition == video.currentTime && isPlaying && new Date().getTime() - lastCheckTime >= 100) {
						video.hasStalled = true;
						ABPInst.cmManager.stopTimer();
						ABPInst.cmManager.pauseComment();
					} else if (lastPosition != video.currentTime) {
						lastPosition = video.currentTime;
					}
					lastCheckTime = new Date().getTime();
				});
				if (window) {
					window[addEventListener]("resize", function() {
						ABPInst.cmManager.setBounds();
					});
				}
				video[addEventListener]("timeupdate", function() {
					if (ABPInst.cmManager.display === false) return;
					if (video.hasStalled) {
						ABPInst.cmManager.startTimer();
						ABPInst.cmManager.resumeComment();
						video.hasStalled = false;
					}
					ABPInst.cmManager.time(Math.floor(video.currentTime * 1000));
				});
				video[addEventListener]("play", function() {
					ABPInst.cmManager.startTimer();
					ABPInst.cmManager.resumeComment();
					ABPInst.btnPlay.className='button ABP-Play ABP-Pause icon-pause';
					ABPInst.btnPlay.tooltip(ABP.Strings.pause);
					addClass(ABPInst.videoDiv, "ABP-HideCursor");
				});
				video[addEventListener]("ratechange", function() {
					if (video.playbackRate !== 0) {
						if(ABPInst.recordPlaySpeed)
							saveConfigurations();
						updatePlaySpeed(ABPInst.video.playbackRate);
					}
				});
				var isPlaying = false;
				video[addEventListener]("pause", function() {
					ABPInst.cmManager.stopTimer();
					ABPInst.cmManager.pauseComment();
					ABPInst.btnPlay.className='button ABP-Play icon-play';
					ABPInst.btnPlay.tooltip(ABP.Strings.play)
					isPlaying = false;
					removeClass(ABPInst.videoDiv, "ABP-HideCursor");
				});
				video[addEventListener]("waiting", function() {
					ABPInst.cmManager.stopTimer();
					ABPInst.cmManager.pauseComment();
					isPlaying = false;
				});
				video[addEventListener]("playing", function() {
					ABPInst.cmManager.startTimer();
					ABPInst.cmManager.resumeComment();
					isPlaying = true;
				});
			}
		}
		if (playerUnit === null || playerUnit.getElementsByClassName === null) return;
		ABPInst.defaults.w = playerUnit.offsetWidth;
		ABPInst.defaults.h = playerUnit.offsetHeight;
		var _v = playerUnit.getElementsByClassName("ABP-Video");
		if (_v.length <= 0) return;
		var video = null;
		ABPInst.videoDiv = _v[0];
		for (var i in _v[0].children) {
			if (_v[0].children[i].tagName != null &&
				_v[0].children[i].tagName.toUpperCase() === "VIDEO") {
				video = _v[0].children[i];
				break;
			}
		}
		var cmtc = _v[0].getElementsByClassName("ABP-Container");
		if (cmtc.length > 0)
			ABPInst.divComment = cmtc[0];
		if (video === null) return;
		ABPInst.video = video;
		ABPInst.video.seek=function(t){this.currentTime=parseFloat(t)/1000;};
		/** Bind the Play Button **/
		var _p = playerUnit.getElementsByClassName("ABP-Play");
		if (_p.length <= 0) return;
		ABPInst.btnPlay = _p[0];
		ABPInst.btnPlay.tooltip(ABP.Strings.play);
		hoverTooltip(ABPInst.btnPlay);
		/** Bind the Next Button **/
		var _n = playerUnit.getElementsByClassName("ABP-Next");
		if (_n.length <= 0) return;
		ABPInst.btnNext = _n[0];
		ABPInst.btnNext.tooltip(ABP.Strings.next);
		hoverTooltip(ABPInst.btnNext);
		ABPInst.btnNext[addEventListener]('click',function(e){
			e.stopPropagation();
			playerUnit.dispatchEvent(new Event('callNext'));
		});
		/** Bind the Loading Progress Bar **/
		var pbar = playerUnit.getElementsByClassName("progress-bar");
		if (pbar.length <= 0) return;
		var pbars = pbar[0].getElementsByClassName("bar");
		ABPInst.barTimeHitArea = pbars[0];
		ABPInst.barLoad = pbars[0].getElementsByClassName("load")[0];
		ABPInst.barTime = pbars[0].getElementsByClassName("dark")[0];
		/** Bind the Time Label **/
		var _tl = playerUnit.getElementsByClassName("time-label");
		if (_tl.length <= 0) return;
		ABPInst.timeLabel = _tl[0];
		/** Bind the Volume button **/
		var vlmbtn = playerUnit.getElementsByClassName("ABP-Volume");
		if (vlmbtn.length <= 0) return;
		ABPInst.btnVolume = vlmbtn[0];
		ABPInst.btnVolume.tooltip(ABP.Strings.mute);
		hoverTooltip(ABPInst.btnVolume);
		/** Bind the Volume Bar **/
		var vbar = playerUnit.getElementsByClassName("volume-bar");
		if (vbar.length <= 0) return;
		var vbars = vbar[0].getElementsByClassName("bar");
		ABPInst.barVolumeHitArea = vbars[0];
		ABPInst.barVolume = vbars[0].getElementsByClassName("load")[0];
		/** Bind the Opacity Bar **/
		var obar = playerUnit.getElementsByClassName("opacity-bar");
		if (obar.length <= 0) return;
		var obar = obar[0].getElementsByClassName("bar");
		ABPInst.barOpacityHitArea = obar[0];
		ABPInst.barOpacity = obar[0].getElementsByClassName("load")[0];
		/** Bind the Scale Bar **/
		var sbar = playerUnit.getElementsByClassName("scale-bar");
		if (sbar.length <= 0) return;
		var sbar = sbar[0].getElementsByClassName("bar");
		ABPInst.barScaleHitArea = sbar[0];
		ABPInst.barScale = sbar[0].getElementsByClassName("load")[0];
		ABPInst.barDensityHitArea = playerUnit.querySelector('.density-bar .bar');
		ABPInst.barDensity = ABPInst.barDensityHitArea.getElementsByClassName("load")[0];
		/** Bind the Speed Bar **/
		var spbar = playerUnit.getElementsByClassName("speed-bar");
		if (spbar.length <= 0) return;
		var spbar = spbar[0].getElementsByClassName("bar");
		ABPInst.barSpeedHitArea = spbar[0];
		ABPInst.barSpeed = spbar[0].getElementsByClassName("load")[0];
		/** Bind the Play Speed Bar **/
		var pspbar = playerUnit.getElementsByClassName("playSpeed-bar");
		if (pspbar.length <= 0) return;
		var pspbar = pspbar[0].getElementsByClassName("bar");
		ABPInst.barPlaySpeedHitArea = pspbar[0];
		ABPInst.barPlaySpeed = pspbar[0].getElementsByClassName("load")[0];
		playerUnit.querySelector('.play-speed-reset')[addEventListener]('click',function(){
			ABPInst.video.playbackRate=1;
		});
		/** Bind the Proportional Scale checkbox **/
		var pcheck = playerUnit.getElementsByClassName("prop-checkbox");
		if (pcheck.length <= 0) return;
		ABPInst.btnAutoOpacity = pcheck[1];
		ABPInst.btnAutoOpacity.tooltip(ABP.Strings.autoOpacityOff)
		hoverTooltip(ABPInst.btnAutoOpacity);
		ABPInst.btnProp = pcheck[0];
		ABPInst.btnProp.tooltip(ABP.Strings.usingCanvas);
		hoverTooltip(ABPInst.btnProp);
		/** Bind the FullScreen button **/
		var fbtn = playerUnit.getElementsByClassName("ABP-FullScreen");
		if (fbtn.length <= 0) return;
		ABPInst.btnFull = fbtn[0];
		ABPInst.btnFull.tooltip(ABP.Strings.fullScreen);
		hoverTooltip(ABPInst.btnFull);
		/** Bind the WebFullScreen button **/
		var wfbtn = playerUnit.getElementsByClassName("ABP-Web-FullScreen");
		if (wfbtn.length <= 0) return;
		ABPInst.btnWebFull = wfbtn[0];
		ABPInst.btnWebFull.tooltip(ABP.Strings.webFull);
		hoverTooltip(ABPInst.btnWebFull);
		/** Bind the WideScreen button **/
		var wsbtn = playerUnit.getElementsByClassName("ABP-CommentListShow");
		if (wsbtn.length <= 0) return;
		ABPInst.btnCmtListShow = wsbtn[0];
		ABPInst.btnCmtListShow.tooltip(ABP.Strings.cmtListShow);
		hoverTooltip(ABPInst.btnCmtListShow);
		/** Bind the Comment Font button **/
		var cfbtn = playerUnit.getElementsByClassName("ABP-Comment-Font");
		if (cfbtn.length <= 0) return;
		ABPInst.btnFont = cfbtn[0];
		ABPInst.btnFont.tooltip(ABP.Strings.sendStyle);
		hoverTooltip(ABPInst.btnFont);
		/** Bind the Comment Color button **/
		var ccbtn = playerUnit.getElementsByClassName("ABP-Comment-Color");
		if (ccbtn.length <= 0) return;
		ABPInst.btnColor = ccbtn[0];
		ABPInst.btnColor.tooltip(ABP.Strings.sendColor);
		hoverTooltip(ABPInst.btnColor);
		var ccd = playerUnit.getElementsByClassName("ABP-Comment-Color-Display");
		if (ccd.length <= 0) return;
		ABPInst.displayColor = ccd[0];
		/** Bind the Comment Input **/
		var cmti = playerUnit.getElementsByClassName("ABP-Comment-Input");
		if (cmti.length <= 0) return;
		ABPInst.txtText = cmti[0];
		/** Bind the Send Comment List Container **/
		var clc = playerUnit.getElementsByClassName("ABP-Comment-List-Container-Inner");
		if (clc.length <= 0) return;
		ABPInst.commentListContainer = clc[0];
		/** Bind the Send Comment button **/
		var csbtn = playerUnit.getElementsByClassName("ABP-Comment-Send");
		if (csbtn.length <= 0) return;
		ABPInst.btnSend = csbtn[0];
		ABPInst.btnSend.tooltip(ABP.Strings.sendTooltip);
		hoverTooltip(ABPInst.btnSend);
		// Controls
		var controls = playerUnit.getElementsByClassName("ABP-Control");
		if (controls.length > 0) {
			ABPInst.controlBar = controls[0];
		}
		/** Bind the Comment Disable button **/
		var cmbtn = playerUnit.getElementsByClassName("ABP-CommentShow");
		if (cmbtn.length <= 0) return;
		ABPInst.btnDm = cmbtn[0];
		ABPInst.btnDm.tooltip(ABP.Strings.hideComment);
		hoverTooltip(ABPInst.btnDm);
		/** Bind the Loop button **/
		var lpbtn = playerUnit.getElementsByClassName("ABP-Loop");
		if (lpbtn.length <= 0) return;
		ABPInst.btnLoop = lpbtn[0];
		ABPInst.btnLoop.tooltip(ABP.Strings.loopOff);
		hoverTooltip(ABPInst.btnLoop);
		var settBtn = playerUnit.getElementsByClassName('ABP-Setting')[0],
		settingPanel = playerUnit.getElementsByClassName('ABP-Settings')[0];
		ABPInst.btnSetting = settBtn;
		ABPInst.settingPanel = settingPanel;
		ABPInst.btnSetting.tooltip(ABP.Strings.settings);
		hoverTooltip(ABPInst.btnSetting);
		var settingsOn = false,
		settingClick = function(){
			settingsOn ? removeClass(settingPanel, 'expand') : addClass(settingPanel, 'expand');
			settingsOn ? removeClass(settBtn, 'on') : addClass(settBtn, 'on');
			if (!settingsOn && ABPInst.state.commentListShow) ABPInst.btnCmtListShow.click();
			settingsOn = !settingsOn;
			ABPInst.state.settingsShow = settingsOn;
		};
		ABPInst.btnSetting[addEventListener]('click',settingClick);
		playerUnit.getElementsByClassName('ABP-Settings-Close')[0][addEventListener]('click',settingClick);
		playerUnit.querySelector('#'+'setting-autoPlay')[addEventListener]('click',function(){
			ABPInst.autoPlay=!ABPInst.autoPlay;
			ABPInst.autoPlay?addClass(this,'on'):removeClass(this,'on')
			saveConfigurations();
		});
		playerUnit.querySelector('#'+'setting-defaultFull')[addEventListener]('click',function(){
			ABPInst.defaultFull=!ABPInst.defaultFull;
			ABPInst.defaultFull?addClass(this,'on'):removeClass(this,'on')
			saveConfigurations();
		});
		playerUnit.querySelector('#'+'setting-recordPlaySpeed')[addEventListener]('click',function(){
			ABPInst.recordPlaySpeed=!ABPInst.recordPlaySpeed;
			ABPInst.recordPlaySpeed?addClass(this,'on'):removeClass(this,'on')
			saveConfigurations();
		});
		
		var enabledStats={
			videoDimension:true,
			videoQuality:true,
			flvjs:true
		},document_querySelector=function(a){return playerIframe.contentDocument.querySelector(a)},
		gEle=function(a){return playerIframe.contentDocument.getElementById(a)},
		to2digitFloat=function(a){return (a*1).toFixed(2)},
		lastChild='>:last-child',
		playerDimension=gEle('player-dimension').lastChild,
		videoDimension=gEle('video-dimension').lastChild,
		canvasFPS=gEle('canvas-fps').lastChild,
		bufferColumn=gEle('buffer-health-column'),
		realtimeBitrateColumn=gEle('realtime-bitrate-column'),
		realtimeBitrateColumnHls=gEle('realtime-bitrate-column-hls'),
		downloadSpeedColumn=gEle('download-speed-column'),
		downloadSpeedHlsColumn=gEle('download-speed-hls-column'),
		playFpsColumn=gEle('playback-fps-column'),
		playFpsNum = playFpsColumn.parentNode.lastChild,
		dropFpsColumn=gEle('drop-fps-column'),
		dropFpsNum = dropFpsColumn.parentNode.lastChild,
		bufferArr=[],
		downloadSpeedArr=[],
		downloadSpeedHlsArr=[],
		playFpsArr=[],
		dropFpsArr=[],
		prevPlayedFrames=0,
		prevDroppedFrames=0,
		bufferNum=gEle('buffer-health').lastChild,
		svgStats='<svg style="width:180px;height:21px"><polyline style="fill:transparent;stroke:#ccc"></polyline><polyline points="1,21 180,21 180,1" style="fill:transparent;stroke:#fff"></polyline></svg>',
		addStyle='',style=_('style'),flvjsStyle=_('style'),hlsjsStyle=_('style'),flvjsStats=playerIframe.contentDocument.querySelectorAll('.flvjs>:last-child'),hlsjsStats=playerIframe.contentDocument.querySelectorAll('.hlsjs>:last-child'),i=0,
		renderColumn=function(column,arr){
			var max=0,i,points=[];
			arr.forEach(function(i){max=(i>max)?i:max});
			max==0&&(max=1);
			for(i in arr){
				points.push(i*3 + ',' + (20*(1-arr[i]/max)+1) + ' ' + (i*3+3) +','+ (20*(1-arr[i]/max)+1));
			}
			column.setAttribute('points',points.join(' '));
		},
		playerStatsOn=false,
		contextToggle=gEle('Player-Stats-Toggle'),
		contextToggleListener=function(e){
			if(e.target.id=='stats-close')
				e.stopPropagation();
			document_querySelector('.Player-Stats').style.display=playerStatsOn?'':'block';
			playerStatsOn=!playerStatsOn;
		},
		odd=0;
		contextToggle[addEventListener]('click',contextToggleListener);
		gEle('stats-close')[addEventListener]('click',contextToggleListener);
		for(;i<60;i++){
			bufferArr.push(0);
			downloadSpeedArr.push(0);
			downloadSpeedHlsArr.push(0);
			playFpsArr.push(0);
			dropFpsArr.push(0);
		}
		//bufferColumn=document.querySelectorAll('#buffer-health-column>span');
		bufferColumn.innerHTML=svgStats;
		bufferColumn=bufferColumn.firstChild.firstChild;
		realtimeBitrateColumn.innerHTML=svgStats;
		realtimeBitrateColumn.firstChild.lastChild.setAttribute('points', '1,21 180,21 60,22 60,1');
		realtimeBitrateColumn=realtimeBitrateColumn.firstChild.firstChild;
		realtimeBitrateColumnHls.innerHTML=svgStats;
		realtimeBitrateColumnHls.firstChild.lastChild.setAttribute('points', '1,21 180,21 120,22 120,1');
		realtimeBitrateColumnHls=realtimeBitrateColumnHls.querySelector('polyline');
		downloadSpeedColumn.innerHTML=svgStats;
		downloadSpeedColumn=downloadSpeedColumn.querySelector('polyline');
		downloadSpeedHlsColumn.innerHTML=svgStats;
		downloadSpeedHlsColumn=downloadSpeedHlsColumn.querySelector('polyline');
		playFpsColumn.innerHTML=svgStats;
		playFpsColumn=playFpsColumn.firstChild.firstChild;
		dropFpsColumn.innerHTML=svgStats;
		dropFpsColumn=dropFpsColumn.firstChild.firstChild;
		//realtimeBitrateColumn=document.querySelectorAll('#realtime-bitrate-column>span');
		if(video.videoWidth==undefined){
			enabledStats.videoDimension=false;
			addStyle+='#video-dimension{display:none}';
		}
		if(video.getVideoPlaybackQuality==undefined){
			enabledStats.videoQuality=false;
			addStyle+='.videoQuality{display:none}'
		}
		style.textContent=addStyle,
		playerIframe.contentDocument.head.appendChild(style);
		flvjsStyle.textContent='.flvjs{display:none}';
		playerIframe.contentDocument.head.appendChild(flvjsStyle);
		hlsjsStyle.innerHTML='.hlsjs{display:none}';
		playerIframe.contentDocument.head.appendChild(hlsjsStyle);
		if(window.flvplayer==undefined){
			enabledStats.flvjs=false;
		}

		var copySegUrl = function () {
			ABPInst.copyText(this.title);
		}
		ABPInst.playerUnit.querySelector('.srcUrl').contextActionName = ABP.Strings.copySegUrl;
		ABPInst.playerUnit.querySelector('.srcUrl').contextMenuAction = copySegUrl;
		ABPInst.playerUnit.querySelector('.redirUrl').contextActionName = ABP.Strings.copySegUrl;
		
		setInterval(function(){
			odd^=1;
			playerDimension.textContent=video.offsetWidth+'x'+video.offsetHeight+' *'+devicePixelRatio;
			if(enabledStats.videoDimension){
				videoDimension.textContent=video.videoWidth+'x'+video.videoHeight;
			}
			
			var buffer={};
			try{
				buffer=getBuffer(video);
			}catch(e){}
			buffer=buffer.delta>0?buffer.delta:0;
			bufferArr.push(buffer);
			bufferArr.shift();
			bufferNum.textContent=to2digitFloat(buffer)+'s';
			if(playerStatsOn)
				renderColumn(bufferColumn,bufferArr);
			
			//Buffer Clip Render
			if(playerStatsOn){
				var buffered = video.buffered,
				clipsContainer=document_querySelector('#buffer-clips>span');
			
				var duration = video.duration==Infinity ? buffered.end(buffered.length-1) : video.duration,
				clipsTitle=[];
				for(var i=0,start,length;i<buffered.length;i++){
					if(i>=clipsContainer.childNodes.length){
						clipsContainer.appendChild(_('span',{className:'buffer-clip'}));
					}
					start = buffered.start(i);
					length = buffered.end(i) - start;
					clipsContainer.childNodes[i].style.left=to2digitFloat(start/duration*100) + '%';
					clipsContainer.childNodes[i].style.width=to2digitFloat(length / duration * 100) + '%';
					clipsTitle.push(formatTime(start|0)+' - '+formatTime((start+length)|0));
				}
				while(i<clipsContainer.childNodes.length){
					clipsContainer.childNodes[i].remove();
				}
				clipsContainer.parentNode.parentNode.childNodes[2].textContent=clipsTitle.join('\n');
				document_querySelector('#buffer-clips>span>div').style.left = to2digitFloat(video.currentTime / duration*100) + '%';
			}
			
			if(enabledStats.flvjs){
				if(flvplayer._mediaInfo){
					flvjsStyle.textContent='';
					var i=0,mediaInfo=flvplayer._mediaInfo,statisticsInfo=flvplayer.statisticsInfo,currentTime=video.currentTime,segs=flvplayer._mediaDataSource.segments,timeOffset=0,off=0,bitrate,timeIndex;
					for(timeIndex=0;timeIndex < segs.length;timeIndex++){
						if(currentTime<=(timeOffset+segs[timeIndex].duration)/1e3){
							//console.log(off,timeOffset,currentTime)
							timeOffset=(currentTime-timeOffset/1e3)|0;
							break;
						}else{
							timeOffset+=segs[timeIndex].duration;
							off++
						}
					}
					
					if(playerStatsOn){
						var segSeperator = document_querySelector('#buffer-clips>span:nth-of-type(2)'), segSeperatorChild=segSeperator.children;
						while(segSeperatorChild.length > segs.length){
							segSeperatorChild[segs.length].remove();
						}
						while(segSeperatorChild.length < segs.length){
							segSeperator.appendChild(_('div',{style:{
								width:'1px',
								height:'300%',
								top:'-100%',
								position:'absolute',
								background:'#CCC',
								left:0
							}}));
						}
						for(var j=1, timeBaseOffset=0; j < segs.length; j++){
							segSeperatorChild[j].style.left = to2digitFloat((timeBaseOffset+segs[j-1].duration)/1e3 / duration*100) + '%';
							timeBaseOffset+=segs[j-1].duration
						}
					}
					
					var segIndex=statisticsInfo.currentSegmentIndex,currentSeg=segs[segIndex]||{},currentSize=currentSeg.filesize|0,currentDuration=currentSeg.duration|0;
					/*['mimeType','audioCodec','videoCodec'].forEach(function(name){
						flvjsStats[i++].innerHTML=mediaInfo[name];
					})*/
					gEle('mimeType').lastChild.textContent=mediaInfo.mimeType;
					flvjsStats[i++].textContent=to2digitFloat(mediaInfo.fps);
					flvjsStats[i++].textContent=to2digitFloat(mediaInfo.videoDataRate)+' kbps';
					flvjsStats[i++].textContent=to2digitFloat(mediaInfo.audioDataRate)+' kbps';
					flvjsStats[i++].textContent=to2digitFloat(currentSize/currentDuration*8)+' kbps' + ('　Seg '+(segIndex+1)+'/'+statisticsInfo.totalSegmentCount);
					i++;
					
					if(mediaInfo.bitrateMap){
						
						var bitrateMap = mediaInfo.bitrateMap;
						if(bitrateMap[off])
							bitrate=bitrateMap[off][timeOffset];
						if(bitrate!=undefined){
							flvjsStats[i++].textContent=to2digitFloat(bitrate)+' kbps';
						}else{
							flvjsStats[i++].textContent='N/A';
						}
						if(playerStatsOn){
							var realtimeBitrateArr=[];
							var displaySegOffset = off, time = timeOffset - 20;
							while (time < 0) {
								displaySegOffset--;
								if (!bitrateMap[displaySegOffset]) {
									displaySegOffset++;
									break;
								}
								time += bitrateMap[displaySegOffset].length;
							}
							while (realtimeBitrateArr.length < 60) {
								if (bitrateMap[displaySegOffset]==undefined) {
									realtimeBitrateArr.push(0);
									continue;
								}
								realtimeBitrateArr.push(bitrateMap[displaySegOffset][time] ||0);
								time++;
								time >= bitrateMap[displaySegOffset].length && (displaySegOffset++, time = 0);
							}
							renderColumn(realtimeBitrateColumn,realtimeBitrateArr);
						}
					}else{
						flvjsStats[i++].textContent='N/A'
					}
					if(odd){
						if (typeof statisticsInfo.speed == 'number'){
							downloadSpeedArr.push(statisticsInfo.speed);
							downloadSpeedArr.shift();
						}
						if(playerStatsOn)
							renderColumn(downloadSpeedColumn,downloadSpeedArr);
						flvjsStats[i++].textContent=to2digitFloat(statisticsInfo.speed)+' KB/s'
						flvplayer._statisticsInfo.speed=0;
					}else{
						i++;
					}
					var srcHostMatch = (currentSeg.url||'').match(/(http[s]?:)?\/\/([a-zA-Z0-9\.\-]+)/),srcHost,srcProtocol;
					if(srcHostMatch==null){
						srcProtocol=location.protocol;
						srcHost=location.hostname;
					}else{
						srcProtocol = srcHostMatch[1] || location.protocol;
						srcHost = srcHostMatch[2];
					}
					flvjsStats[i].title=currentSeg.url;
					flvjsStats[i++].textContent=srcProtocol+'//'+srcHost;
					if(!statisticsInfo.hasRedirect){
						flvjsStats[i].contextMenuAction = undefined;
						flvjsStats[i++].textContent=ABP.Strings.statsRedirectionNone;
					}else{
						flvjsStats[i].contextMenuAction = copySegUrl;
						flvjsStats[i].title=currentSeg.redirectedURL;
						flvjsStats[i++].textContent=currentSeg.redirectedURL.match(/(http[s]?:)?\/\/([a-zA-Z0-9\.\-]+)/)[0];
					}
				}else{
					flvjsStyle.textContent='.flvjs{display:none}';
					gEle('mimeType').lastChild.textContent='video/mp4';
					var segSeperatorChild = document_querySelector('#buffer-clips>span:nth-of-type(2)').children;
					while(segSeperatorChild.length > 1){
						segSeperatorChild[1].remove();
					}
				}
			}

			// hls
			if(window.hlsplayer && window.hlsplayer.mediaInfo){
				hlsjsStyle.innerHTML='';
				var percentage = hlsplayer.downloadPercentage * 100, i = 0, levelName = function (n) { return (hlsplayer.levelName&&hlsplayer.levelName[n])||n; }, level = levelName(hlsplayer.currentLevel), mediaInfo = hlsplayer.mediaInfo;
				if (level != levelName(hlsplayer.nextLoadLevel)) {
					level += ' '+ABP.Strings.switchingTo+': '+ levelName(hlsplayer.nextLoadLevel);
				}
				hlsjsStats[i++].textContent = level;
				
				hlsjsStats[i++].textContent=to2digitFloat(mediaInfo.video.fps);
				hlsjsStats[i++].textContent=to2digitFloat(mediaInfo.video.averageBitrate / 1000)+' kbps';
				hlsjsStats[i++].textContent=to2digitFloat(mediaInfo.audio.averageBitrate / 1000)+' kbps';
				hlsjsStats[i++].textContent=to2digitFloat(
					(mediaInfo.video.totalSize + mediaInfo.audio.totalSize) / (mediaInfo.video.totalDuration / mediaInfo.video.timeScale) / 1000*8
				) + ' kbps';

				document_querySelector('#download-progress-hls').style.width=percentage+'%';
				hlsjsStats[i++].textContent = to2digitFloat(percentage)+'%'

				// 码率
				var bitrateMap = hlsplayer.mediaInfo.bitrateMap, bitrate = bitrateMap[video.currentTime | 0];
				if (bitrate!=undefined) {
					hlsjsStats[i++].textContent = to2digitFloat(bitrate)+' kbps';
				} else {
					hlsjsStats[i++].textContent = 'N/A';
				}
				if (playerStatsOn) {
					var realtimeBitrateArr=[];
					var time = (video.currentTime | 0) - 40;
					while (realtimeBitrateArr.length < 60) {
						realtimeBitrateArr.push(bitrateMap[time] ||0);
						time++;
					}
					renderColumn(realtimeBitrateColumnHls,realtimeBitrateArr);
				}
				if(odd){
					var speed = hlsplayer.downloadSpeed||0;
					downloadSpeedHlsArr.push(speed);
					downloadSpeedHlsArr.shift();
					if(playerStatsOn)
						renderColumn(downloadSpeedHlsColumn,downloadSpeedHlsArr);
					hlsjsStats[i++].innerHTML=to2digitFloat(speed)+' KB/s'
				}
			}else{
				hlsjsStyle.innerHTML='.hlsjs{display:none}';
			}
			if(!window.overallBitrate){
				gEle('overall-bitrate').parentNode.style.display='none'
			}else{
				gEle('overall-bitrate').parentNode.style.display=''
				gEle('overall-bitrate').textContent=to2digitFloat(overallBitrate)+' kbps';
			}
			
			if(odd)
				canvasFPS.textContent = ABPInst.cmManager.canvasFPS;
			
				if(odd && enabledStats.videoQuality){
					var quality=video.getVideoPlaybackQuality();
					if (prevPlayedFrames > quality.totalVideoFrames) prevPlayedFrames = 0;
					if (prevDroppedFrames > quality.droppedVideoFrames) prevDroppedFrames = 0;
					var playedFrames=quality.totalVideoFrames - prevPlayedFrames;
					var droppedFrames=quality.droppedVideoFrames - prevDroppedFrames;
					prevPlayedFrames = quality.totalVideoFrames;
					prevDroppedFrames = quality.droppedVideoFrames;
					playFpsArr.push(playedFrames); playFpsArr.shift();
					dropFpsArr.push(droppedFrames); dropFpsArr.shift();
					if(playerStatsOn)
						renderColumn(playFpsColumn, playFpsArr),
						renderColumn(dropFpsColumn, dropFpsArr);
					playFpsNum.textContent = playedFrames + ' fps';
					dropFpsNum.textContent = droppedFrames + ' fps ' + (droppedFrames/playedFrames*100).toFixed(2)+'%';
				}
		},500)
		
		/** Create a commentManager if possible **/
		if (typeof CommentManager !== "undefined") {
			ABPInst.cmManager = new CommentManager(ABPInst.divComment);
			ABPInst.cmManager.display = true;
			ABPInst.cmManager.init();
			ABPInst.cmManager.clear();
			ABPInst.cmManager.filter.addModifier(shield.filter);
			if (window) {
				window[addEventListener]("resize", function() {
					//Notify on resize
					ABPInst.cmManager.setBounds();
				});
			}
		}

		// bind custom volume control
		if (isChrome)
		(function () {
			try {
				var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
				// 移动设备处理
				if (audioCtx.state == 'suspended') 
				window.addEventListener('touchstart', function temp() {
					audioCtx.resume();
					window.removeEventListener('touchstart', temp);
				}), window.addEventListener('mousemove', function temp() {
					audioCtx.resume();
					window.removeEventListener('mousemove', temp);
				});
				var gainNode = audioCtx.createGain();4
				var source = audioCtx.createMediaElementSource(ABPInst.video);
				source.connect(gainNode);
				gainNode.connect(audioCtx.destination);
				
				var currentVolume = 1;
				var muted = false;
				Object.defineProperty(ABPInst.video, 'volume', {
					get: function() {
						return currentVolume;
					},
					set: function(v) {
						v = parseFloat(v);
						if (isNaN(v)) return null;
						currentVolume = v;
						!muted && (gainNode.gain.value = v);
						return currentVolume;
					}
				});
				Object.defineProperty(ABPInst.video, 'muted', {
					get: function() {
						return muted;
					},
					set: function(v) {
						if ( v !== true && v !== false) return null;
						muted = v;
						gainNode.gain.value = muted ? 0 : currentVolume;
						return muted;
					}
				});
			} catch (e) { }
		})();
		
		if (typeof ABP.playerConfig == "object") {
			if (ABP.playerConfig.volume) ABPInst.video.volume = ABP.playerConfig.volume;
			if (ABP.playerConfig.opacity) ABPInst.cmManager.options.global.opacity = ABP.playerConfig.opacity;
			if (ABP.playerConfig.autoPlay) {ABPInst.autoPlay=true; addClass(playerUnit.querySelector('#'+'setting-autoPlay'),'on');}
			if (ABP.playerConfig.defaultFull) {ABPInst.defaultFull=true; addClass(playerUnit.querySelector('#'+'setting-defaultFull'),'on');}
			if (ABP.playerConfig.commentVisible===false) {addClass(ABPInst.playerUnit, 'hide-comment');removeClass(ABPInst.btnDm,'on');ABPInst.cmManager.display = false;ABPInst.cmManager.stopTimer();ABPInst.btnDm.tooltip(ABP.Strings.showComment);}
			if (ABP.playerConfig.autoOpacity) {addClass(ABPInst.btnAutoOpacity,'on');ABPInst.cmManager.autoOpacity(true);ABPInst.btnAutoOpacity.tooltip(ABP.Strings.autoOpacityOn);}
			if (ABP.playerConfig.useCSS) {addClass(ABPInst.btnProp,'on');ABPInst.cmManager.useCSS(true);ABPInst.btnProp.tooltip(ABP.Strings.usingCSS);}
			if (ABP.playerConfig.recordPlaySpeed) {
				ABPInst.recordPlaySpeed=true;
				addClass(playerUnit.querySelector('#'+'setting-recordPlaySpeed'),'on');
				ABPInst.lastSpeed=ABP.playerConfig.playSpeed;
			}
			var density = ABP.playerConfig.density||0;
			ABPInst.cmManager.options.global.density = density;
			var theme = ABP.playerConfig.theme||'YouTube'
			playerUnit.setAttribute('theme', theme);
			(document_querySelector('#setting-playerTheme [value='+theme+']') ||{}).selected=true;
			playerUnit.querySelector('#setting-playerTheme')[addEventListener]('change',function(){
				playerUnit.setAttribute('theme',this.value);
				saveConfigurations();
				playerUnit.dispatchEvent(new Event('themeChange'));
			});
			var cmStyle = ABP.playerConfig.cmStyle || '1-0';
			(document_querySelector('#setting-cmStyle [value="'+cmStyle+'"]') ||{}).selected=true;
			playerUnit.querySelector('#setting-cmStyle')[addEventListener]('change',function cmStyleChange(){
				var style = this.value.split('-');
				ABPInst.cmManager.options.global.shadow = style[0]==1;
				ABPInst.cmManager.options.global.outline = style[1]==1;
				saveConfigurations && saveConfigurations();
			});
			playerUnit.querySelector('#setting-cmStyle').dispatchEvent(new Event('change'));
		}
		$$(playerUnit.querySelectorAll('.ABP-Comment-List-Title *')).click(function() {
			var item = $$(this).attr('item'),
				order = $$(this).hasClass('asc') ? 'desc' : 'asc';
			$$(playerUnit.querySelectorAll('.ABP-Comment-List-Title *')).removeClass('asc').removeClass('desc');
			$$(this).addClass(order);
			ABPInst.loadCommentList(item, order);
		});
		$$(playerUnit.querySelectorAll('.ABP-Unit .ABP-CommentStyle .ABP-Comment-FontOption .style-option')).click(function() {
			$$(this).closest('.style-select').find('.style-option').removeClass('on');
			$$(this).addClass('on');
			ABPInst[$$(this).closest('.style-select').attr('name')] = parseInt($$(this).attr('value'));
		});
		$$(playerUnit.querySelectorAll('.ABP-Comment-ColorPicker')).colpick({
			flat: true,
			submit: 0,
			color: 'ffffff',
			onChange: function(hsb, hex) {
				ABPInst.commentColor = hex;
				ABPInst.displayColor.style.backgroundColor = '#' + hex;
			}
		});
		if (video.isBound !== true) {
			ABPInst.swapVideo(video);
			ABPInst.playerUnit.querySelector('.BiliPlus-Scale-Menu .Video-Defination')[addEventListener]('click',function(e){
				if(!e.target.hasAttribute('changeto'))
					return false;
				var t=JSON.parse(e.target.getAttribute('changeto'));
				changeSrc({target:{value:t[1]}},t[0]);
				removeClass(e.target.parentNode.querySelector('.on'),'on');
				addClass(e.target, 'on');
			});
			ABPInst.playerUnit.querySelector('.BiliPlus-Scale-Menu .Video-Scale')[addEventListener]('click',function(e){
				if(!e.target.hasAttribute('changeto'))
					return false;
				switch( e.target.getAttribute('changeto') ){
					case 'default':
						if( hasClass(ABPInst.video, 'scale') ){
							removeClass(ABPInst.video, 'scale');
						}
						ABPInst.video.style.width='';
						ABPInst.video.style.height='';
						ABPInst.video.style.paddingTop='';
						ABPInst.video.style.paddingLeft='';
					break;
					case '16_9':
						addClass(ABPInst.video, 'scale');
						var width=ABPInst.videoDiv.offsetWidth, height=ABPInst.videoDiv.offsetHeight, paddingTop='', paddingLeft='';
						if( width < (height/9*16) ){
							//Calc base on width
							paddingTop=( height-(width/16*9) )/2+'px';
							height=( (width/16*9)/height *100)+'%';
							width='100%';
						}else{
							//Calc base on height
							paddingLeft=( width-(height/9*16) )/2+'px';
							width=( (height/9*16)/width *100)+'%';
							height='100%';
						}
						ABPInst.video.style.width=width;
						ABPInst.video.style.height=height;
						ABPInst.video.style.paddingTop=paddingTop;
						ABPInst.video.style.paddingLeft=paddingLeft;
					break;
					case '4_3':
						addClass(ABPInst.video, 'scale');
						var width=ABPInst.videoDiv.offsetWidth, height=ABPInst.videoDiv.offsetHeight, paddingTop='', paddingLeft='';
						if( width < (height/3*4) ){
							//Calc base on width
							paddingTop=( height-(width/4*3) )/2+'px';
							height=( (width/4*3)/height *100)+'%';
							width='100%';
						}else{
							//Calc base on height
							paddingLeft=( width-(height/3*4) )/2+'px';
							width=( (height/3*4)/width *100)+'%';
							height='100%';
						}
						ABPInst.video.style.width=width;
						ABPInst.video.style.height=height;
						ABPInst.video.style.paddingTop=paddingTop;
						ABPInst.video.style.paddingLeft=paddingLeft;
					break;
					case 'full':
						addClass(ABPInst.video, 'scale');
						ABPInst.video.style.width='';
						ABPInst.video.style.height='';
						ABPInst.video.style.paddingTop='';
						ABPInst.video.style.paddingLeft='';
					break;
				}
				removeClass(e.target.parentNode.querySelector('.on'),'on');
				addClass(e.target, 'on');
			});
			var autoPlayFailed=false;
			video[addEventListener]('autoPlayFailed',function(){
				autoPlayFailed=true;
			})
			var timeoutPause,lastClick=0,
			videoDivClickEventListener=function(e) {
				var now=Date.now();
				if(now-lastClick<=500){
					ABPInst.btnFull.click();
					if(now-lastClick<=200)
						clearTimeout(timeoutPause);
					else
						ABPInst.btnPlay.click();
				}else{
					if(autoPlayFailed){
						ABPInst.btnPlay.click();
						autoPlayFailed=false;
					}else
					timeoutPause=setTimeout(function(){
						ABPInst.btnPlay.click();
					},250);
				}
				lastClick=now;
				e.preventDefault();
			};
			ABPInst.videoDiv[addEventListener]("click", videoDivClickEventListener);
			ABPInst.playerUnit.querySelector('.ABP-Bottom-Extend')[addEventListener]('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				videoDivClickEventListener(e);
			})
			var hideCursorTimer = setTimeout(function() {
				addClass(ABPInst.videoDiv, "ABP-HideCursor");
			}, 3000);
			ABPInst.videoDiv[addEventListener]("mousemove", function(e) {
				if(!mouseMoved(e))return;
				if (hideCursorTimer) {
					clearTimeout(hideCursorTimer);
				}
				if (hasClass(ABPInst.videoDiv, "ABP-HideCursor")) {
					removeClass(ABPInst.videoDiv, "ABP-HideCursor");
				}
				hideCursorTimer = setTimeout(function() {
					addClass(ABPInst.videoDiv, "ABP-HideCursor");
				}, 3000);
			});
			ABPInst.btnVolume[addEventListener]("click", function() {
				if (ABPInst.video.muted == false) {
					ABPInst.video.muted = true;
					if(ABPInst.video.muted == false){
						this.tooltip(ABP.Strings.muteNotSupported);
						return;
					}
					this.className = "button ABP-Volume icon-volume-mute2";
					this.tooltip(ABP.Strings.unmute);
					ABPInst.barVolume.style.width = "0%";
				} else {
					ABPInst.video.muted = false;
					this.className = "button ABP-Volume icon-volume-";
					if (ABPInst.video.volume < .10) this.className += "mute";
					else if (ABPInst.video.volume < .33) this.className += "low";
					else if (ABPInst.video.volume < .67) this.className += "medium";
					else this.className += "high";
					this.tooltip(ABP.Strings.mute);
					ABPInst.barVolume.style.width = (ABPInst.video.volume * 100) + "%";
				}
			});
			ABPInst.btnWebFull[addEventListener]("click", function() {
				ABPInst.state.fullscreen = hasClass(playerUnit, "ABP-FullScreen");
				var climb = playerIframe;
				while (climb != document.body) {
					climb.ABP_origZIndex = climb.style.zIndex;
					climb.style.zIndex = 0xffffff;
					climb = climb.parentNode;
				}
				playerIframe.style.position = 'fixed';
				playerIframe.style.width = '100%';
				playerIframe.style.height = '100%';
				playerIframe.style.top = '0';
				playerIframe.style.left = '0';
				addClass(playerUnit, "ABP-FullScreen");
				addClass(document.body, "ABP-FullScreen");
				ABPInst.btnFull.className = "button ABP-FullScreen icon-screen-normal";
				ABPInst.btnFull.tooltip(ABP.Strings.exitWebFull);
				ABPInst.state.fullscreen = true;
				if (ABPInst.cmManager)
					ABPInst.cmManager.setBounds();
				if (!ABPInst.state.allowRescale) return;
				if (ABPInst.state.fullscreen) {
					if (ABPInst.defaults.w > 0) {
						ABPInst.cmManager.options.scrollScale = playerUnit.offsetWidth / ABPInst.defaults.w;
					}
				} else {
					ABPInst.cmManager.options.scrollScale = 1;
				}
			});
			var fontOn=false,colorOn=false;
			ABPInst.btnFont[addEventListener]("click", function(e) {
				if(colorOn)
					ABPInst.btnColor.click();
				this.parentNode.classList.toggle("on");
				fontOn=!fontOn
			});
			ABPInst.btnColor[addEventListener]("click", function(e) {
				if(fontOn)
					ABPInst.btnFont.click();
				this.parentNode.classList.toggle("on");
				colorOn=!colorOn
			});
			ABPInst.btnAutoOpacity[addEventListener]("click", function(e) {
				this.classList.toggle("on");
				var autoOpacity=this.classList.contains("on");
				ABPInst.cmManager.autoOpacity(autoOpacity);
				this.tooltip(autoOpacity ? ABP.Strings.autoOpacityOn : ABP.Strings.autoOpacityOff);
				saveConfigurations();
			});
			ABPInst.btnProp[addEventListener]("click", function(e) {
				this.classList.toggle("on");
				var useCSS=this.classList.contains("on");
				ABPInst.cmManager.useCSS(useCSS);
				this.tooltip(useCSS ? ABP.Strings.usingCSS : ABP.Strings.usingCanvas);
				saveConfigurations();
			});
			var fullscreenChangeHandler = function() {
				if (!document.isFullScreen() && hasClass(playerUnit, "ABP-FullScreen")) {
					removeClass(playerUnit, "ABP-FullScreen");
					ABPInst.btnFull.className = "button ABP-FullScreen icon-screen-full";
					ABPInst.btnFull.tooltip(ABP.Strings.fullScreen);
					ABPInst.state.fullscreen=!!document.isFullScreen();
					//ABPInst.btnLoop.click();ABPInst.btnLoop.click();
				}
			}
			document[addEventListener]("fullscreenchange", fullscreenChangeHandler, false);
			document[addEventListener]("webkitfullscreenchange", fullscreenChangeHandler, false);
			document[addEventListener]("mozfullscreenchange", fullscreenChangeHandler, false);
			document[addEventListener]("MSFullscreenChange", fullscreenChangeHandler, false);
			ABPInst.btnFull[addEventListener]("click", function() {
				ABPInst.state.fullscreen = hasClass(playerUnit, "ABP-FullScreen");
				if (!ABPInst.state.fullscreen) {
					addClass(playerUnit, "ABP-FullScreen");
					this.className = "button ABP-FullScreen icon-screen-normal";
					this.tooltip(ABP.Strings.exitFullScreen);
					playerIframe.requestFullScreen();
				} else {
					removeClass(playerUnit, "ABP-FullScreen");
					removeClass(document.body, "ABP-FullScreen");
					this.className = "button ABP-FullScreen icon-screen-full";
					if(this.tooltipData == ABP.Strings.exitWebFull){
						playerIframe.style.position = '';
						playerIframe.style.width = '';
						playerIframe.style.height = '';
						playerIframe.style.top = '';
						playerIframe.style.left = '';
						var climb = playerIframe;
						while (climb != document.body) {
								if (climb.ABP_origZIndex != undefined)
										climb.style.zIndex = climb.ABP_origZIndex;
								climb = climb.parentNode;
						}
					}
					this.tooltip(ABP.Strings.fullScreen);
					document.exitFullscreen();
				}
				ABPInst.state.fullscreen = !ABPInst.state.fullscreen;
				if (ABPInst.cmManager)
					ABPInst.cmManager.setBounds();
				if (!ABPInst.state.allowRescale) return;
				if (ABPInst.state.fullscreen) {
					if (ABPInst.defaults.w > 0) {
						ABPInst.cmManager.options.scrollScale = playerUnit.offsetWidth / ABPInst.defaults.w;
					}
				} else {
					ABPInst.cmManager.options.scrollScale = 1;
				}
			});

			ABPInst.btnCmtListShow[addEventListener]("click", function() {
				var container = ABPInst.commentListContainer.parentNode.parentNode;
				ABPInst.state.commentListShow = hasClass(container, "expand");
				if (!ABPInst.state.commentListShow) {
					addClass(container, "expand");
					this.classList.add('on');
					this.tooltip(ABP.Strings.cmtListHide);
					if (ABPInst.state.settingsShow) ABPInst.btnSetting.click();
				} else {
					removeClass(container, "expand");
					this.classList.remove('on');
					this.tooltip(ABP.Strings.cmtListShow);
				}
				ABPInst.state.commentListShow = !ABPInst.state.commentListShow;
			});
			ABPInst.btnDm[addEventListener]("click", function() {
				if (ABPInst.cmManager.display == false) {
					ABPInst.cmManager.display = true;
					ABPInst.cmManager.startTimer();
					this.className = "button ABP-CommentShow icon-comment on";
					this.tooltip(ABP.Strings.hideComment);
					removeClass(ABPInst.playerUnit, 'hide-comment');
				} else {
					ABPInst.cmManager.display = false;
					ABPInst.cmManager.clear();
					ABPInst.cmManager.stopTimer();
					this.className = "button ABP-CommentShow icon-comment";
					this.tooltip(ABP.Strings.showComment);
					addClass(ABPInst.playerUnit, 'hide-comment');
				}
				saveConfigurations();
			});
			ABPInst.btnLoop[addEventListener]("click", function() {
				if (ABPInst.video.loop == false) {
					ABPInst.video.loop = true;
					this.className = "button ABP-Loop icon-loop on";
					this.tooltip(ABP.Strings.loopOn);
				} else {
					ABPInst.video.loop = false;
					this.className = "button ABP-Loop icon-loop";
					this.tooltip(ABP.Strings.loopOff);
				}
				ABPInst.video.dispatchEvent(new CustomEvent('loop'))
			});
			var contextMenu=ABPInst.playerUnit.querySelector('.Context-Menu'),
			contextMenuBackground=contextMenu.querySelector('.Context-Menu-Background'),
			contextMenuBody=contextMenu.querySelector('.Context-Menu-Body'),
			dismissListener=function(e){
				if(activingContext){
					e.preventDefault();
					e.stopPropagation();
					activingContext=!1;
					return false;
				}
				contextMenu.style.display='none';
				e.preventDefault();
			},
			commentLocating=function(id){
				var i=0,found=-1
				for(var i=0,len=ABPInst.commentObjArray.length;i<len;i++){
					if(ABPInst.commentObjArray[i].data.originalData.dbid == id){
						found=i;
						break;
					}
				}
				if(found==-1)
					return;
				if(ABPInst.state.fullscreen)
					ABPInst.btnFull.click();
				if(ABPInst.state.widescreen)
					ABPInst.btnWide.click();
				ABPInst.commentListContainer.parentNode.scrollTop=found*24;
			},
			senderInfoTimeout=null,senderInfoDivTimeout=null,currentSender=0,currentSenderDiv=null,
			senderInfoCache={},
			getSenderInfo=function(){
			},
			showContextMenu=function(x,y,dmList,elementAction){
				contextMenu.style.display='block';
				var aboutDiv,remove = contextMenuBody.children,originalData,color,isWhite,containerBox=ABPInst.playerUnit.getBoundingClientRect(),
				dmitem;
				for(i=remove.length-2;i>=0;i--){
					!remove[i].classList.contains('preserve') && remove[i].remove();
				}
				aboutDiv=contextMenuBody.firstChild;
				for(i=0;i<dmList.length;i++){
					originalData=dmList[i].originalData;
					color=originalData.color.toString(16);
					while(color.length<6)
						color='0'+color;
					isWhite= (originalData.color==0xffffff);
					dmitem=_('div',{className:'dm'},[
						_('div',{className:'content'},[_('text',originalData.text)]),
						_('div',{className:'dmMenu'},[
							_('div',{'data-content':originalData.text},[_('text',ABP.Strings.copyComment)]),
							_('div',{'data-dmid':originalData.dbid},[_('text',ABP.Strings.findComment)]),
							_('div',{event:{click:shield.addText.bind(shield, originalData.text)}},[_('text',ABP.Strings.blockContent+'“'+originalData.text+'”')]),
							_('div',{event:{click:shield.addUser.bind(shield,originalData.hash)}},[_('text',ABP.Strings.blockUser+''+originalData.hash)]),
							_('div',(isWhite)?{}:{event:{click:shield.addColor.bind(shield,color)}},[_('text',isWhite?ABP.Strings.blockColorWhite:ABP.Strings.blockColor+''),_('div',{className:'color',style:{background:'#'+color}})])
						])
					])
					if(originalData.mode>6){
						dmitem.childNodes[0].textContent='特殊弹幕';
						var dmMenu=dmitem.childNodes[1];
						dmMenu.childNodes[0].style.display='none';
						dmMenu.childNodes[2].style.display='none';
						dmMenu.childNodes[4].style.display='none';
					}
					contextMenuBody.insertBefore(dmitem,aboutDiv);
				}
				if (elementAction != undefined) {
					contextMenuBody.insertBefore(_('div', {event:{click: function(){elementAction.contextMenuAction();}}},[
						_('div',{className:'content'},[_('text',elementAction.contextActionName)])
					]),aboutDiv);
				}
				var itemMenu=contextMenuBody.querySelectorAll('.dm:not(.preserve)>.dmMenu');
				for(i=0;i<itemMenu.length;i++){
					itemMenu[i].childNodes[0][addEventListener]('click',function(){
						ABPInst.copyText(this.dataset.content);
					});
					itemMenu[i].childNodes[1][addEventListener]('click',function(){
						commentLocating(this.getAttribute('data-dmid'));
					})
					itemMenu[i].childNodes[3][addEventListener]('mouseenter',function(){
						currentSender=this.getAttribute('data-mid');
						currentSenderDiv=this;
						senderInfoTimeout=setTimeout(getSenderInfo,500);
					})
					itemMenu[i].childNodes[3][addEventListener]('mouseleave',function(){
						clearTimeout(senderInfoTimeout);
						currentSender=0;
						currentSenderDiv=null;
						if(playerUnit.querySelector('#'+'Sender-Info')!=null){
							clearTimeout(senderInfoDivTimeout);
							senderInfoDivTimeout=setTimeout(function(){playerIframe.contentDocument.body.removeChild(playerUnit.querySelector('#'+'Sender-Info'))},500);
						}
					})
				};
				x-=containerBox.left;
				y-=containerBox.top;
				if( containerBox.width-x <300)
					x=containerBox.width-300;
				if( containerBox.height-contextMenuBody.offsetHeight-y <0)
					y=containerBox.height-contextMenuBody.offsetHeight;
				var lastMenu=contextMenuBody.querySelector('.dm:nth-last-of-type(2)>.dmMenu')
				if(lastMenu!=null){
					lastMenu.style.display='block';
					var lastMenuBox=lastMenu.getBoundingClientRect();
					lastMenu.style.display='';
					if( containerBox.top+containerBox.height-lastMenuBox.height-y <0)
						y=containerBox.height-lastMenuBox.height;
				}
				contextMenuBody.style.left=x+'px';
				contextMenuBody.style.top=y+'px';
			},
			touchContextTimer=null,activingContext=!1;
			contextMenuBody.querySelector('#Player-Screenshot .dmMenu')[addEventListener]('click',function(e){
				var shouldContainComment = e.target.dataset.comment == 'on';
				var canvas = _('canvas'), video = ABPInst.video, ctx = canvas.getContext('2d'), devicePixelRatio = window.devicePixelRatio, cmManager = ABPInst.cmManager, paused = video.paused;
				video.pause();
				if (shouldContainComment) {
					if (abpinst.cmManager.options.global.useCSS) {
						ABPInst.createPopup(ABP.Strings.screenshotCSSNoSupport, 3e3);
						!paused && video.play();
						return;
					}
					var width = Math.ceil(cmManager.width * devicePixelRatio), height = Math.ceil(cmManager.height * devicePixelRatio),
					vh = video.videoHeight, vw = video.videoWidth, vl = 0,  vt = 0;
					canvas.width = width;
					canvas.height = height;
					ctx.fillStyle = 'black';
					ctx.fillRect(0, 0, width, height);

					// calculate video offset
					if (vh * (width / vw) > vh) {
						vh = vh * (width / vw);
						vw = width;
						vt = Math.floor((height - vh) / 2);
					} else {
						vw = vw * (height / vh);
						vh = height;
						vl = Math.floor((width - vw) / 2);
					}
					ctx.drawImage(video, vl, vt, vw, vh);

					ctx.drawImage(cmManager.canvas, 0, 0);
				} else {
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					ctx.drawImage(video, 0, 0);
				}
				try {
					var url = canvas.toDataURL();
					var newWin = window.open('about:blank');
					try {
					newWin.onload = function() {
						newWin.document.title = ABP.Strings.screenshot + ' @ ' + formatTime(video.currentTime) + ' - ' + ABP.Strings[shouldContainComment ? 'screenshotWithComment' : 'screenshotWithoutComment'];
						newWin.document.body.innerHTML = '<style>body{background:#222;padding:0;margin:0}img{width:100%;height:100%;object-fit:scale-down}</style><img src="'+url+'">';
						console.log(newWin.document.body)
					}
					} catch(e) {
						//火狐 wtf???
						newWin.location.href = url;
					}
				} catch(e) {
					console.error(e);
					ABPInst.createPopup(ABP.Strings.screenshotError, 3e3);
					!paused && video.play();
				}
			});
			contextMenuBody.querySelector('#Player-Speed-Control .dmMenu')[addEventListener]('click',function(e){
				var speed=e.target.getAttribute('data-speed');
				if(speed!=undefined)
					ABPInst.video.playbackRate = speed;
			});
			contextMenu[addEventListener]('click',dismissListener);
			contextMenuBackground[addEventListener]('contextmenu',dismissListener);
			ABPInst.videoDiv.parentNode[addEventListener]('contextmenu',function(e){
				e.preventDefault();
				e.stopPropagation();
				var box=ABPInst.divComment.getBoundingClientRect(),x=e.clientX,y=e.clientY,elementAction;
				var element = e.target;
				while (this.contains(element)) {
					if (element.contextMenuAction!=undefined) {
						elementAction = element;
						break;
					}
					element = element.parentNode;
				}
				showContextMenu(x,y,ABPInst.cmManager.getCommentFromPoint(x-box.left,y-box.top),elementAction);
			})
			ABPInst.commentListContainer[addEventListener]('contextmenu',function(e){
				var dmData=e.target.parentNode.data
				if(dmData==undefined)
					return false;
				e.preventDefault();
				e.stopPropagation();
				showContextMenu(e.clientX,e.clientY,[dmData]);
			});

			var saveConfigurations = function() {
				if (ABPInst.inited)
				saveStorage({PlayerSettings:{
					volume: ABPInst.video.volume,
					opacity: ABPInst.cmManager.options.global.opacity,
					scale: ABPInst.commentScale,
					speed: ABPInst.commentSpeed,
					commentVisible: ABPInst.cmManager.display,
					autoOpacity: ABPInst.cmManager.options.global.autoOpacity,
					useCSS: ABPInst.cmManager.options.global.useCSS,
					autoPlay: ABPInst.autoPlay,
					defaultFull: ABPInst.defaultFull,
					playSpeed: ABPInst.video.playbackRate,
					recordPlaySpeed: ABPInst.recordPlaySpeed,
					theme: playerUnit.querySelector('#setting-playerTheme').value,
					cmStyle: playerUnit.querySelector('#setting-cmStyle').value,
					density: ABPInst.cmManager.options.global.density
				}});
			}

			var sendComment = function() {
				var date = new Date(),
					commentId = "" + date.getTime() + Math.random();
				if (ABPInst.txtText.value == "" || ABPInst.txtText.disabled) return false;
				ABPInst.playerUnit.dispatchEvent(new CustomEvent("sendcomment", {
					"detail": {
						"id": commentId,
						"message": ABPInst.txtText.value,
						"fontsize": ABPInst.commentFontSize,
						"color": parseInt("0x" + ABPInst.commentColor),
						"date": date.getFullYear() + "-" + pad(date.getMonth()) + "-" + pad(date.getDay()) +
							" " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()),
						"playTime": ABPInst.video.currentTime,
						"mode": ABPInst.commentMode,
						"pool": 0
					}
				}));
				ABPInst.cmManager.send({
					"text": ABPInst.txtText.value,
					"mode": ABPInst.commentMode,
					"stime": ABPInst.video.currentTime,
					"size": ABPInst.commentFontSize,
					"color": parseInt("0x" + ABPInst.commentColor),
					"border": true
				});
				ABPInst.txtText.value = "";
				ABPInst.txtText.disabled = true;
				setTimeout(function() {
					ABPInst.txtText.disabled = false;
				}, ABPInst.commentCoolDown);
			};

			ABPInst.txtText.parentNode[addEventListener]("submit", function(e) {
				e.preventDefault();
				sendComment();
				return false;
			});

			ABPInst.btnSend[addEventListener]("click", sendComment);

			ABPInst.timeLabel[addEventListener]("click", function() {
				ABPInst.timeJump = _("input", {
					"className": "time-jump"
				});
				ABPInst.timeJump.value = formatTime(ABPInst.video.currentTime);
				ABPInst.controlBar.appendChild(ABPInst.timeJump);
				ABPInst.timeJump[addEventListener]("blur", function() {
					if (ABPInst.timeJump) ABPInst.timeJump.parentNode.removeChild(ABPInst.timeJump);
					ABPInst.timeJump = null;
				});
				ABPInst.timeJump[addEventListener]("keydown", function(e) {
					if (e.keyCode == 13) {
						var time = convertTime(ABPInst.timeJump.value);
						if (time && time <= ABPInst.video.duration) {
							ABPInst.video.currentTime = time;
							if (ABPInst.video.paused) ABPInst.btnPlay.click();
						}
						ABPInst.timeJump.parentNode.removeChild(ABPInst.timeJump);
					} else if ((e.keyCode < 48 || e.keyCode > 59) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode != 16 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 46) {
						e.preventDefault();
					}
				});
				ABPInst.timeJump.focus();
				ABPInst.timeJump.select();
			});
			ABPInst.barTime.style.width = "0%";
			var dragging = false;
			ABPInst.barTimeHitArea[addEventListener]("mousedown", function(e) {
				dragging = true;
			});
			var preview={
				imgs:[],
				data:[],
				len:[0,0],
				size:[0,0]
			},
			fetchedPreview=function(json){
				if(json.code!=0)
					return false;
				preview.imgs=json.data.image;
				preview.len=[json.data.img_x_len,json.data.img_y_len];
				preview.size=[json.data.img_x_size,json.data.img_y_size];
				for(var i=0,arr=[];i<preview.imgs.length*100;i++){
					arr.push(i*json.data.step);
				}
				preview.data=arr;
			},
			onTimeBar=!1;
			ABPInst.barTimeHitArea[addEventListener]("mouseenter",function(e){
				onTimeBar=!0;
			});
			ABPInst.barTimeHitArea[addEventListener]("mouseleave",function(e){
				onTimeBar=!1;
			});
			ABPInst.playerUnit[addEventListener]('previewData',function(e){
				fetchedPreview(e.detail);
			})
			playerIframe.contentDocument[addEventListener]("mouseup", function(e) {
				if (dragging) {
					var newTime = ((e.clientX - ABPInst.barTimeHitArea.getBoundingClientRect().left) / ABPInst.barTimeHitArea.offsetWidth) * ABPInst.video.duration;
					if (newTime < 0) newTime = 0;
					if (Math.abs(newTime - ABPInst.video.currentTime) > 4) {
						if (ABPInst.cmManager)
							ABPInst.cmManager.clear();
					}
					ABPInst.video.currentTime = newTime;
				}
				dragging = false;
			});
			var updateTime = function(time) {
				ABPInst.barTime.style.width = (time / video.duration * 100) + "%";
				ABPInst.timeLabel.textContent = formatTime(time) + " / " + formatTime(video.duration);
			}
			playerIframe.contentDocument[addEventListener]("mousemove", function(e) {
				var newTime = ((e.clientX - ABPInst.barTimeHitArea.getBoundingClientRect().left) / ABPInst.barTimeHitArea.offsetWidth) * ABPInst.video.duration;
				if (newTime < 0) newTime = 0;
				if (newTime > ABPInst.video.duration) newTime = ABPInst.video.duration;
				if(preview.data.length>0 && $('ABP-Tooltip')!=null && onTimeBar){
					var index;
					for(index=0;index<preview.data.length;index++){
						if(newTime<preview.data[index]){
							index--;
							break;
						}
					}
					var numPic=Math.floor(index/100),
							posY=Math.floor((index%100)/10),
							posX=index%10,
							div=$('preview-container'),
							tooltip=$('ABP-Tooltip');
					if(div==null){
						div=_("div",{
							"id":'preview-container',
							'style':{
								'position':'absolute',
								'background-size':preview.size[0]+'px '+preview.size[1]+'px',
								'width':preview.size[0]+'px',
								'height':preview.size[1]+'px',
								'background':'rgba(0,0,0,0)',
								'display':'none'
							}
						})
						tooltip.parentNode.insertBefore(div,tooltip);
					}
					var left = tooltip.offsetLeft+(tooltip.offsetWidth-preview.size[0])/2;
					if (left < 5) left = 5;
					else if (left > ABPInst.cmManager.width - 5 - preview.size[0]) left = ABPInst.cmManager.width - 5 - preview.size[0];
					div.style.left=left+'px';
					div.style.top=tooltip.offsetTop+(tooltip.offsetHeight-preview.size[1])+'px';
					div.style.display='block';
					div.style.backgroundImage='url("'+preview.imgs[numPic]+'")';
					div.style.backgroundPosition='-'+(posX*preview.size[0])+'px -'+(posY*preview.size[1])+'px';
				}
				if($('ABP-Tooltip')==null && $('preview-container')!=null){
					$('preview-container').style.display='none';
				}
				ABPInst.barTimeHitArea.tooltip(formatTime(newTime));
				if (dragging) {
					updateTime(newTime);
				}
			});
			hoverTooltip(ABPInst.barTimeHitArea, true, -12);
			var draggingVolume = false;
			ABPInst.barVolumeHitArea[addEventListener]("mousedown", function(e) {
				draggingVolume = true;
			});
			var hideVolumeTimeout=null,
			showVolume = function(){
				hideVolumeTimeout && clearTimeout(hideVolumeTimeout)
				addClass(playerUnit,'volume-show');
			},
			hideVolume = function(){
				hideVolumeTimeout = setTimeout(function(){removeClass(playerUnit,'volume-show');},2e3);
			}
			ABPInst.barVolumeHitArea[addEventListener]('mouseenter',showVolume);
			ABPInst.btnVolume[addEventListener]('mouseenter',showVolume);
			ABPInst.barVolumeHitArea[addEventListener]('mouseleave',hideVolume);
			ABPInst.btnVolume[addEventListener]('mouseleave',hideVolume);
			ABPInst.barVolume.style.width = Math.min((ABPInst.video.volume * 100), 100) + "%";
			var updateVolume = function(volume) {
				ABPInst.barVolume.style.width = Math.min((volume * 100), 100) + "%";
				ABPInst.video.muted = false;
				ABPInst.btnVolume.className = "button ABP-Volume icon-volume-";
				if (volume < .10) ABPInst.btnVolume.className += "mute";
				else if (volume < .33) ABPInst.btnVolume.className += "low";
				else if (volume < .67) ABPInst.btnVolume.className += "medium";
				else ABPInst.btnVolume.className += "high";
				ABPInst.btnVolume.tooltip(ABP.Strings.mute);
				ABPInst.barVolumeHitArea.tooltip(parseInt(volume * 100) + "%");
				saveConfigurations();
			}
			playerIframe.contentDocument[addEventListener]("mouseup", function(e) {
				if (draggingVolume) {
					var newVolume = (e.clientX - ABPInst.barVolumeHitArea.getBoundingClientRect().left) / ABPInst.barVolumeHitArea.offsetWidth;
					if (newVolume < 0) newVolume = 0;
					if (newVolume > 1) newVolume = 1;
					ABPInst.video.volume = newVolume;
					updateVolume(ABPInst.video.volume);
				}
				draggingVolume = false;
			});
			playerIframe.contentDocument[addEventListener]("mousemove", function(e) {
				var newVolume = (e.clientX - ABPInst.barVolumeHitArea.getBoundingClientRect().left) / ABPInst.barVolumeHitArea.offsetWidth;
				if (newVolume < 0) newVolume = 0;
				if (newVolume > 1) newVolume = 1;
				if (draggingVolume) {
					ABPInst.video.volume = newVolume;
					updateVolume(ABPInst.video.volume);
				} else {
					ABPInst.barVolumeHitArea.tooltip(parseInt(newVolume * 100) + "%");
				}
			});
			hoverTooltip(ABPInst.barVolumeHitArea, true, -12);
			var draggingOpacity = false;
			ABPInst.barOpacityHitArea[addEventListener]("mousedown", function(e) {
				draggingOpacity = true;
			});
			ABPInst.barOpacity.style.width = (ABPInst.cmManager.options.global.opacity * 100) + "%";
			var updateOpacity = function(opacity) {
				ABPInst.barOpacity.style.width = (opacity * 100) + "%";
				ABPInst.barOpacityHitArea.tooltip(parseInt(opacity * 100) + "%");
			}
			playerIframe.contentDocument[addEventListener]("mouseup", function(e) {
				if (draggingOpacity) {
					var newOpacity = (e.clientX - ABPInst.barOpacityHitArea.getBoundingClientRect().left) / ABPInst.barOpacityHitArea.offsetWidth;
					if (newOpacity < 0) newOpacity = 0;
					if (newOpacity > 1) newOpacity = 1;
					ABPInst.cmManager.options.global.opacity = newOpacity;
					updateOpacity(ABPInst.cmManager.options.global.opacity);
					saveConfigurations();
				}
				draggingOpacity = false;
			});
			playerIframe.contentDocument[addEventListener]("mousemove", function(e) {
				var newOpacity = (e.clientX - ABPInst.barOpacityHitArea.getBoundingClientRect().left) / ABPInst.barOpacityHitArea.offsetWidth;
				if (newOpacity < 0) newOpacity = 0;
				if (newOpacity > 1) newOpacity = 1;
				if (draggingOpacity) {
					ABPInst.cmManager.options.global.opacity = newOpacity;
					updateOpacity(ABPInst.cmManager.options.global.opacity);
				} else {
					ABPInst.barOpacityHitArea.tooltip(parseInt(newOpacity * 100) + "%");
				}
			});
			hoverTooltip(ABPInst.barOpacityHitArea, true, -6);
			var draggingScale = false;
			ABPInst.barScaleHitArea[addEventListener]("mousedown", function(e) {
				draggingScale = true;
			});
			ABPInst.barScale.style.width = (ABPInst.commentScale - 0.2) / 1.8 * 100 + "%";
			var updateScale = function(scale) {
				ABPInst.barScale.style.width = (scale - 0.2) / 1.8 * 100 + "%";
				ABPInst.barScaleHitArea.tooltip(parseInt(scale * 100) + "%");
				ABPInst.cmManager.setBounds();
			}
			playerIframe.contentDocument[addEventListener]("mouseup", function(e) {
				if (draggingScale) {
					var newScale = 0.2 + 1.8 * (e.clientX - ABPInst.barScaleHitArea.getBoundingClientRect().left) / ABPInst.barScaleHitArea.offsetWidth;
					if (newScale < 0.2) newScale = 0.2;
					if (newScale > 2) newScale = 2;
					ABPInst.commentScale = newScale;
					updateScale(ABPInst.commentScale);
					saveConfigurations();
				}
				draggingScale = false;
			});
			playerIframe.contentDocument[addEventListener]("mousemove", function(e) {
				var newScale = 0.2 + 1.8 * (e.clientX - ABPInst.barScaleHitArea.getBoundingClientRect().left) / ABPInst.barScaleHitArea.offsetWidth;
				if (newScale < 0.2) newScale = 0.2;
				if (newScale > 2) newScale = 2;
				if (draggingScale) {
					ABPInst.commentScale = newScale;
					updateScale(ABPInst.commentScale);
				} else {
					ABPInst.barScaleHitArea.tooltip(parseInt(newScale * 100) + "%");
				}
			});
			hoverTooltip(ABPInst.barScaleHitArea, true, -6);
			var draggingDensity = false;
			ABPInst.barDensityHitArea[addEventListener]('mousedown', function() {
				draggingDensity = true;
			});
			//0-0.8 -> 5-100 step 5, 0.8-0.95 -> 100-1000 step 100, 1 -> 0
			var formatDensity = function(density){
				if (density>=5&&density<100)
					return ((density/5)|0)*5;
				else if (density>=100 && density<=1000)
					return ((density/100)|0)*100;
				else
					return 0
			}
			var updateDensity = function(density) {
				density = formatDensity(density);
				var width = 100;
				if ( density >= 5 && density < 100 ) {
					width = (density/5-1) / 19 * 80;
				} else if ( density >= 100 && density <= 1000 ) {
					width = (density/100-1) / 9 * 15 + 80;
				}
				ABPInst.barDensity.style.width = width + '%';
				ABPInst.barDensityHitArea.tooltip(density||'无限制');
			}
			playerIframe.contentDocument[addEventListener]("mouseup", function(e) {
				if (draggingDensity) {
					var perc = (e.clientX - ABPInst.barScaleHitArea.getBoundingClientRect().left) / ABPInst.barScaleHitArea.offsetWidth, newDensity = 0;
					if (perc >=0 && perc < .8){
						newDensity = Math.round(perc/.8*19)*5+5;
					} else if (perc >= .8 && perc <= .95) {
						newDensity = Math.round((perc-.8)/.15*9)*100+100;
					}
					ABPInst.cmManager.options.global.density = newDensity;
					updateDensity(newDensity);
					saveConfigurations();
				}
				draggingDensity = false;
			});
			playerIframe.contentDocument[addEventListener]("mousemove", function(e) {
				var perc = (e.clientX - ABPInst.barScaleHitArea.getBoundingClientRect().left) / ABPInst.barScaleHitArea.offsetWidth, newDensity = 0;
				if (perc >=0 && perc < .8){
					newDensity = Math.round(perc/.8*19)*5+5;
				} else if (perc >= .8 && perc <= .95) {
					newDensity = Math.round((perc-.8)/.15*9)*100+100;
				}
				if (draggingDensity) {
					ABPInst.cmManager.options.global.density = newDensity;
					updateDensity(newDensity);
				} else {
					ABPInst.barDensityHitArea.tooltip(newDensity||'无限制');
				}
			});
			hoverTooltip(ABPInst.barDensityHitArea, true, -6);
			updateDensity(ABPInst.cmManager.options.global.density);
			/*Copy from scale bar*/
			var draggingSpeed = false;
			ABPInst.barSpeedHitArea[addEventListener]("mousedown", function(e) {
				draggingSpeed = true;
			});
			ABPInst.barSpeed.style.width = (ABPInst.commentSpeed - 0.5) / 1.5 * 100 + "%";
			var updateSpeed = function(speed) {
				ABPInst.barSpeed.style.width = (speed - 0.5) / 1.5 * 100 + "%";
				ABPInst.barSpeedHitArea.tooltip(parseInt(speed * 100) + "%");
				ABPInst.cmManager.setBounds();
				saveConfigurations();
			}
			playerIframe.contentDocument[addEventListener]("mouseup", function(e) {
				if (draggingSpeed) {
					var newSpeed = 0.5 + 1.5 * (e.clientX - ABPInst.barSpeedHitArea.getBoundingClientRect().left) / ABPInst.barSpeedHitArea.offsetWidth;
					if (newSpeed < 0.5) newSpeed = 0.5;
					if (newSpeed > 2) newSpeed = 2;
					ABPInst.commentSpeed = newSpeed;
					updateSpeed(ABPInst.commentSpeed);
					saveConfigurations();
				}
				draggingSpeed = false;
			});
			playerIframe.contentDocument[addEventListener]("mousemove", function(e) {
				var newSpeed = 0.5 + 1.5 * (e.clientX - ABPInst.barSpeedHitArea.getBoundingClientRect().left) / ABPInst.barSpeedHitArea.offsetWidth;
				if (newSpeed < 0.5) newSpeed = 0.5;
				if (newSpeed > 2) newSpeed = 2;
				if (draggingSpeed) {
					ABPInst.commentSpeed = newSpeed;
					updateSpeed(ABPInst.commentSpeed);
				} else {
					ABPInst.barSpeedHitArea.tooltip(parseInt(newSpeed * 100) + "%");
				}
			});
			hoverTooltip(ABPInst.barSpeedHitArea, true, -6);
			/*Speed add finish*/
			/*Copy from scale bar*/
			var draggingPlaySpeed = false;
			ABPInst.barPlaySpeedHitArea[addEventListener]("mousedown", function(e) {
				draggingPlaySpeed = true;
			});
			ABPInst.barPlaySpeed.style.width = (ABPInst.video.playbackRate - 0.5) / 1.5 * 100 + "%";
			var updatePlaySpeed = function(playSpeed) {
				ABPInst.barPlaySpeed.style.width = (playSpeed - 0.5) / 1.5 * 100 + "%";
				ABPInst.barPlaySpeedHitArea.tooltip(playSpeed.toFixed(2) + "x");
			}
			playerIframe.contentDocument[addEventListener]("mouseup", function(e) {
				if (draggingPlaySpeed) {
					var newPlaySpeed = 0.5 + 1.5 * (e.clientX - ABPInst.barPlaySpeedHitArea.getBoundingClientRect().left) / ABPInst.barPlaySpeedHitArea.offsetWidth;
					if (newPlaySpeed < 0.5) newPlaySpeed = 0.5;
					if (newPlaySpeed > 2) newPlaySpeed = 2;
					ABPInst.video.playbackRate = newPlaySpeed;
				}
				draggingPlaySpeed = false;
			});
			playerIframe.contentDocument[addEventListener]("mousemove", function(e) {
				var newPlaySpeed = 0.5 + 1.5 * (e.clientX - ABPInst.barPlaySpeedHitArea.getBoundingClientRect().left) / ABPInst.barPlaySpeedHitArea.offsetWidth;
				if (newPlaySpeed < 0.5) newPlaySpeed = 0.5;
				if (newPlaySpeed > 2) newPlaySpeed = 2;
				if (draggingPlaySpeed) {
					ABPInst.video.playbackRate = newPlaySpeed;
				} else {
					ABPInst.barPlaySpeedHitArea.tooltip(newPlaySpeed.toFixed(2) + "x");
				}
			});
			hoverTooltip(ABPInst.barPlaySpeedHitArea, true, -6);
			/*PlaySpeed add finish*/
			ABPInst.btnPlay[addEventListener]("click", function() {
				if (ABPInst.video.paused) {
					ABPInst.video.play();
				} else {
					ABPInst.video.pause();
				}
			});
			playerUnit[addEventListener]("keydown", function(e) {
				if (e && playerIframe.contentDocument.activeElement.tagName != "INPUT") {
					if([27,32,37,38,39,40].indexOf(e.keyCode)!=-1)
						e.preventDefault();
					switch (e.keyCode) {
						case 27:
							if(ABPInst.state.fullscreen)
								ABPInst.btnFull.click();
						break;
						case 32:
							ABPInst.btnPlay.click();
							break;
						case 37:
							// <-
							var newTime = ABPInst.video.currentTime -= 5 * ABPInst.video.playbackRate;
							ABPInst.cmManager.clear();
							var buffer = getBuffer(ABPInst.video);
							if (buffer.start - newTime > 0 && buffer.start - newTime < 4) {
								// 距离缓冲段头部0-4秒，设置为缓冲段头部
								newTime = buffer.start;
							}
							if (newTime < 0) newTime = 0;
							ABPInst.video.currentTime = newTime.toFixed(3);
							if (ABPInst.video.paused) ABPInst.btnPlay.click();
							updateTime(video.currentTime);
							ABPInst.barTimeHitArea.tooltip(formatTime(video.currentTime));
							break;
						case 39:
							// ->
							var newTime = ABPInst.video.currentTime += 5 * ABPInst.video.playbackRate;
							ABPInst.cmManager.clear();
							var buffer = getBuffer(ABPInst.video);
							if (buffer.end - newTime < 0 && buffer.end - newTime > -4) {
								// 距离缓冲段尾部0-4秒，设置为缓冲段尾部-1
								newTime = buffer.end - 1;
							}
							if (newTime > ABPInst.video.duration) newTime = ABPInst.video.duration;
							ABPInst.video.currentTime = newTime.toFixed(3);
							if (ABPInst.video.paused) ABPInst.btnPlay.click();
							updateTime(video.currentTime);
							ABPInst.barTimeHitArea.tooltip(formatTime(video.currentTime));
							break;
						case 38:
							if(e.ctrlKey){
								var newSpeed = ABPInst.video.playbackRate + .05;
								if (newSpeed > 2) newSpeed = 2;
								ABPInst.video.playbackRate = newSpeed.toFixed(3);
								ABPInst.removePopup();
								ABPInst.createPopup(ABP.Strings.rateChange + ((newSpeed*1e2)|0) + '%',1e3);
							}else{
								var volume = ABPInst.video.volume;
								var newVolume = volume + (volume >= 1 ? .25 : .1);
								if (volume < 1 && newVolume > 1) newVolume = 1
								var max = isChrome ? 4 : 1;
								if (newVolume > max) newVolume = max;
								ABPInst.video.volume = newVolume.toFixed(3);
								updateVolume(ABPInst.video.volume);
								ABPInst.removePopup();
								ABPInst.createPopup(ABP.Strings.volumeChange + ((newVolume*1e2)|0) + '%',1e3);
							}
							break;
						case 40:
							if(e.ctrlKey){
								var newSpeed = ABPInst.video.playbackRate - .05;
								if (newSpeed < .5) newSpeed = .5;
								ABPInst.video.playbackRate = newSpeed.toFixed(3);
								ABPInst.removePopup();
								ABPInst.createPopup(ABP.Strings.rateChange + ((newSpeed*1e2)|0) + '%',1e3);
							}else{
								var volume = ABPInst.video.volume;
								var newVolume = volume - (volume > 1 ? .25 : .1);
								if (newVolume < 0) newVolume = 0;
								ABPInst.video.volume = newVolume.toFixed(3);
								updateVolume(ABPInst.video.volume);
								ABPInst.removePopup();
								ABPInst.createPopup(ABP.Strings.volumeChange + ((newVolume*1e2)|0) + '%',1e3);
							}
							break;
					}
				}
			});
			var _touch = null;
			playerUnit[addEventListener]("touchstart", function(e) {
				if (hasClass(ABPInst.videoDiv, "ABP-HideCursor")) {
					removeClass(ABPInst.videoDiv, "ABP-HideCursor");
				}
				if (e.targetTouches.length > 0) {
					//Determine whether we want to start or stop
					_touch = e.targetTouches[0];
				}
			});
			playerUnit[addEventListener]("touchend", function(e) {
				addClass(ABPInst.videoDiv, "ABP-HideCursor");
				if (e.changedTouches.length > 0) {
					if (_touch != null) {
						var diffx = e.changedTouches[0].pageX - _touch.pageX;
						var diffy = e.changedTouches[0].pageY - _touch.pageY;
						if (Math.abs(diffx) < 20 && Math.abs(diffy) < 20) {
							_touch = null;
							return;
						}
						if (Math.abs(diffx) > 3 * Math.abs(diffy)) {
							if (diffx > 0) {
								if (ABPInst.video.paused) {
									ABPInst.btnPlay.click();
								}
							} else {
								if (!ABPInst.video.paused) {
									ABPInst.btnPlay.click();
								}
							}
						} else if (Math.abs(diffy) > 3 * Math.abs(diffx)) {
							if (diffy < 0) {
								ABPInst.video.volume = Math.min(1, ABPInst.video.volume + 0.1)
							} else {
								ABPInst.video.volume = Math.max(0, ABPInst.video.volume - 0.1)
							}
						}
						_touch = null;
					}
				}
			});
			playerUnit[addEventListener]("mouseup", function() {
				if (playerIframe.contentDocument.activeElement.tagName != "INPUT") {
					var oSY = window.scrollY;
					ABPInst.videoDiv.focus();
					window.scrollTo(window.scrollX, oSY);
				}
			});
		}
		/** Create a bound CommentManager if possible **/
		if (typeof CommentManager !== "undefined") {
			if (ABPInst.state.autosize) {
				var autosize = function() {
					if (video.videoHeight === 0 || video.videoWidth === 0) {
						return;
					}
					var aspectRatio = video.videoHeight / video.videoWidth;
					// We only autosize within the bounds
					var boundW = playerUnit.offsetWidth;
					var boundH = playerUnit.offsetHeight;
					var oldASR = boundH / boundW;

					if (oldASR < aspectRatio) {
						playerUnit.style.width = (boundH / aspectRatio) + "px";
						playerUnit.style.height = boundH + "px";
					} else {
						playerUnit.style.width = boundW + "px";
						playerUnit.style.height = (boundW * aspectRatio) + "px";
					}

					ABPInst.cmManager.setBounds();
				};
				video[addEventListener]("loadedmetadata", autosize);
				autosize();
			}
		}
		/*
		Connect WebSocket
		*/
		if(window.cid && window.WebSocket){
			var connected = false;
			var sock = new WebSocket('ws://danmaku.acfun.cn:443/' + window.cid);
			var open = function () {
				connected = true;
				var obj = {
					client: '16bk983221049',
					client_ck: '884509046',
					vid: window.cid,
					vlength: 0,
					time: Date.now(),
					uid: window.user.uid||null,
					uid_ck: window.user.uid_ck||null
				}
				obj.uid == -1 && (obj.uid = null);
				var data = JSON.stringify({ action: 'auth', command: JSON.stringify(obj) })
				sock.send(data);
				sock.send(JSON.stringify({ "action": "onlanNumber", "command": "WALLE DOES NOT HAVE PENNIS" }));
			}
			var message = function (e) {
				var data = JSON.parse(e.data);
				if(data.action!=undefined){
					switch(data.action) {
						case 'post':
							//收到弹幕
							var danmaku = JSON.parse(data.command);
							danmaku={
								border:false,
								position:'absolute',
								stime:danmaku.stime*1e3,
								mode:danmaku.mode|0,
								size:danmaku.size|0,
								color:danmaku.color|0,
								date:Date.now()/1e3|0,
								pool:0,
								hash:danmaku.authUser.userId,
								dbid:danmaku.commentid,
								text:danmaku.message
							};
							if(danmaku.mode==8){
								danmaku.code=danmaku.text;
								delete danmaku.text;
							}
							var comment={
								"date": danmaku.date,
								"time": danmaku.stime,
								"mode": danmaku.mode,
								"user": danmaku.hash,
								"pool": danmaku.pool,
								"content": danmaku.text||danmaku.code,
								"originalData":danmaku
							};
							ABPInst.cmManager.insert(danmaku);
							shield.shield();
							ABPInst.commentList[danmaku.dbid] = comment;
							var commentObj = _("li", {}),
								commentObjTime = _("span", {
									"className": "cmt-time"
								}, [_("text", formatTime(comment.time / 1000))]),
								commentObjContent = _("span", {
									"className": "cmt-content"
								}, [_("text", comment.content)]),
								commentObjDate = _("span", {
									"className": "cmt-date"
								}, [_("text", formatDate(comment.date, true))]);
							hoverTooltip(commentObjContent, false, 36);
							hoverTooltip(commentObjDate, false, 18);
							commentObjContent.tooltip(comment.content);
							commentObjDate.tooltip(formatDate(comment.date));
							commentObj.appendChild(commentObjTime);
							commentObj.appendChild(commentObjContent);
							commentObj.appendChild(commentObjDate);
							commentObj.data = comment;
							if(danmaku.code!=undefined){
								commentObj.style.background='#ffe100';
							}else if(danmaku.pool!=0){
								commentObj.style.background='#20ff20';
							}
							commentObj[addEventListener]("dblclick", function(e) {
								ABPInst.video.currentTime = this.data.time / 1000;
								updateTime(video.currentTime);
							});
							ABPInst.commentObjArray.push(commentObj);
							var commentListContainer=ABPInst.commentListContainer,scroll=!1;
							if( commentListContainer.parentNode.scrollTop+commentListContainer.parentNode.offsetHeight == commentListContainer.scrollHeight ){
								scroll=!0;
							}
							ABPInst.renderCommentList();
							if(scroll)commentListContainer.parentNode.scrollTop+=24;
							ABPInst.playerUnit.querySelector('.ABP-Comment-List-Count span#danmaku').textContent=ABPInst.commentObjArray.length;
							break;
						case 'vow':
							//公告
							console.log(data.command);
							break;
						case 'close':
							sock.close();
							break;
					}
				}else if(data.status!=undefined){
					switch(data.status) {
						case '600':
							//在线人数
							ABPInst.playerUnit.querySelector('.ABP-Comment-List-Count span#viewer').textContent=data.msg;
							break;
						case '500':
							ABPInst.createPopup(_t('postCommentFail') + '<br>[500]服务器异常');
							break;
						case '403':
							ABPInst.createPopup(_t('postCommentFail') + '<br>[403]' + data.msg);
							break;
						case '401':
							ABPInst.createPopup(_t('postCommentFail') + '<br>[401]你已被封禁');
							break;
						case '200':
							//发送成功，不提示，由ws返回时加入弹幕池
							break;
						default:
							console.log('not implemented status', data);
					}
				}
			};
			var close = function () {
				connected = false;
				console.warn('WebSocket closed!');
			}
			var error = function () {
				connected = false;
				console.warn('WebSocket connection error!');
				setTimeout(function () {
					sock = new WebSocket('ws://danmaku.acfun.cn:443/' + window.cid);
					sock.addEventListener('open',open);
					sock.addEventListener('message',message);
					sock.addEventListener('close',close);
					sock.addEventListener('error',error);
					ABPInst.danmu_ws = sock;
				}, 5e3);
			}
			ABPInst.danmu_ws = sock;
			var sendInterval = setInterval(function () { connected && sock.send(JSON.stringify({ "action": "onlanNumber", "command": "WALLE DOES NOT HAVE PENNIS" })) }, 3e4);
			sock.addEventListener('open',open);
			sock.addEventListener('message',message);
			sock.addEventListener('close',close);
			sock.addEventListener('error',error);
		}
		var watchingCountMover=function(e){
			var commentListShow = ABPInst.state.commentListShow,
			countDivInPlayer=ABPInst.playerUnit.querySelector('.ABP-Player .ABP-Comment-List-Count'),
			countDivInList=ABPInst.playerUnit.querySelector('.ABP-Comment-List .ABP-Comment-List-Count');
			if(!commentListShow && countDivInList!=null){
				ABPInst.playerUnit.querySelector('.ABP-Player').appendChild(countDivInList);
			}else if(commentListShow && countDivInPlayer!=null){
				var commentList=ABPInst.playerUnit.querySelector('.ABP-Comment-List')
				commentList.insertBefore(countDivInPlayer,commentList.childNodes[0]);
			}
		}
		ABPInst.controlBar[addEventListener]('click',watchingCountMover);
		watchingCountMover();
		shield.init(ABPInst);
		return ABPInst;
	}
})();/*
colpick Color Picker
Copyright 2013 Jose Vargas. Licensed under GPL license. Based on Stefan Petre's Color Picker www.eyecon.ro, dual licensed under the MIT and GPL licenses

For usage and examples: colpick.com/plugin
 */

(function ($) {
	var colpick = function () {
		var
			tpl = '<div class="colpick"><div class="colpick_color"><div class="colpick_color_overlay1"><div class="colpick_color_overlay2"><div class="colpick_selector_outer"><div class="colpick_selector_inner"></div></div></div></div></div><div class="colpick_hue"><div class="colpick_hue_arrs"><div class="colpick_hue_larr"></div><div class="colpick_hue_rarr"></div></div></div><div class="colpick_new_color"></div><div class="colpick_current_color"></div><div class="colpick_hex_field"><div class="colpick_field_letter">#</div><input type="text" maxlength="6" size="6" /></div><div class="colpick_rgb_r colpick_field"><div class="colpick_field_letter">R</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_rgb_g colpick_field"><div class="colpick_field_letter">G</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_rgb_b colpick_field"><div class="colpick_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_hsb_h colpick_field"><div class="colpick_field_letter">H</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_hsb_s colpick_field"><div class="colpick_field_letter">S</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_hsb_b colpick_field"><div class="colpick_field_letter">B</div><input type="text" maxlength="3" size="3" /><div class="colpick_field_arrs"><div class="colpick_field_uarr"></div><div class="colpick_field_darr"></div></div></div><div class="colpick_submit"></div></div>',
			defaults = {
				showEvent: 'click',
				onShow: function () {},
				onBeforeShow: function(){},
				onHide: function () {},
				onChange: function () {},
				onSubmit: function () {},
				colorScheme: 'light',
				color: '3289c7',
				livePreview: true,
				flat: false,
				layout: 'full',
				submit: 1,
				submitText: 'OK',
				height: 156
			},
			//Fill the inputs of the plugin
			fillRGBFields = function  (hsb, cal) {
				var rgb = hsbToRgb(hsb);
				$(cal).data('colpick').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colpick').fields
					.eq(4).val(Math.round(hsb.h)).end()
					.eq(5).val(Math.round(hsb.s)).end()
					.eq(6).val(Math.round(hsb.b)).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colpick').fields.eq(0).val(hsbToHex(hsb));
			},
			//Set the round selector position
			setSelector = function (hsb, cal) {
				$(cal).data('colpick').selector.css('backgroundColor', '#' + hsbToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colpick').selectorIndic.css({
					left: parseInt($(cal).data('colpick').height * hsb.s/100, 10),
					top: parseInt($(cal).data('colpick').height * (100-hsb.b)/100, 10)
				});
			},
			//Set the hue selector position
			setHue = function (hsb, cal) {
				$(cal).data('colpick').hue.css('top', parseInt($(cal).data('colpick').height - $(cal).data('colpick').height * hsb.h/360, 10));
			},
			//Set current and new colors
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colpick').currentColor.css('backgroundColor', '#' + hsbToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colpick').newColor.css('backgroundColor', '#' + hsbToHex(hsb));
			},
			//Called when the new color is changed
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colpick').color = col = hexToHsb(fixHex(this.value));
					fillRGBFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colpick').color = col = fixHSB({
						h: parseInt(cal.data('colpick').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colpick').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colpick').fields.eq(6).val(), 10)
					});
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
				} else {
					cal.data('colpick').color = col = rgbToHsb(fixRGB({
						r: parseInt(cal.data('colpick').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colpick').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colpick').fields.eq(3).val(), 10)
					}));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colpick').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colpick').el, 0]);
			},
			//Change style on blur and on focus of inputs
			blur = function (ev) {
				$(this).parent().removeClass('colpick_focus');
			},
			focus = function () {
				$(this).parent().parent().data('colpick').fields.parent().removeClass('colpick_focus');
				$(this).parent().addClass('colpick_focus');
			},
			//Increment/decrement arrows functions
			downIncrement = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colpick_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colpick').livePreview
				};
				$(playerIframe.contentDocument).mouseup(current, upIncrement);
				$(playerIframe.contentDocument).mousemove(current, moveIncrement);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val - ev.pageY + ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colpick_slider').find('input').focus();
				$(playerIframe.contentDocument).off('mouseup', upIncrement);
				$(playerIframe.contentDocument).off('mousemove', moveIncrement);
				return false;
			},
			//Hue slider functions
			downHue = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				$(playerIframe.contentDocument).on('mouseup touchend',current,upHue);
				$(playerIframe.contentDocument).on('mousemove touchmove',current,moveHue);

				var pageY = ((ev.type == 'touchstart') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );
				change.apply(
					current.cal.data('colpick')
					.fields.eq(4).val(parseInt(360*(current.cal.data('colpick').height - (pageY - current.y))/current.cal.data('colpick').height, 10))
						.get(0),
					[current.cal.data('colpick').livePreview]
				);
				return false;
			},
			moveHue = function (ev) {
				var pageY = ((ev.type == 'touchmove') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY );
				change.apply(
					ev.data.cal.data('colpick')
					.fields.eq(4).val(parseInt(360*(ev.data.cal.data('colpick').height - Math.max(0,Math.min(ev.data.cal.data('colpick').height,(pageY - ev.data.y))))/ev.data.cal.data('colpick').height, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function (ev) {
				fillRGBFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
				$(playerIframe.contentDocument).off('mouseup touchend',upHue);
				$(playerIframe.contentDocument).off('mousemove touchmove',moveHue);
				return false;
			},
			//Color selector functions
			downSelector = function (ev) {
				ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colpick').livePreview;

				$(playerIframe.contentDocument).on('mouseup touchend',current,upSelector);
				$(playerIframe.contentDocument).on('mousemove touchmove',current,moveSelector);

				var pageX,pageY;
				if(ev.type == 'touchstart') {
					pageX = ev.originalEvent.changedTouches[0].pageX,
					pageY = ev.originalEvent.changedTouches[0].pageY;
				} else {
					pageX = ev.pageX;
					pageY = ev.pageY;
				}

				change.apply(
					current.cal.data('colpick').fields
					.eq(6).val(parseInt(100*(current.cal.data('colpick').height - (pageY - current.pos.top))/current.cal.data('colpick').height, 10)).end()
					.eq(5).val(parseInt(100*(pageX - current.pos.left)/current.cal.data('colpick').height, 10))
					.get(0),
					[current.preview]
				);
				return false;
			},
			moveSelector = function (ev) {
				var pageX,pageY;
				if(ev.type == 'touchmove') {
					pageX = ev.originalEvent.changedTouches[0].pageX,
					pageY = ev.originalEvent.changedTouches[0].pageY;
				} else {
					pageX = ev.pageX;
					pageY = ev.pageY;
				}

				change.apply(
					ev.data.cal.data('colpick').fields
					.eq(6).val(parseInt(100*(ev.data.cal.data('colpick').height - Math.max(0,Math.min(ev.data.cal.data('colpick').height,(pageY - ev.data.pos.top))))/ev.data.cal.data('colpick').height, 10)).end()
					.eq(5).val(parseInt(100*(Math.max(0,Math.min(ev.data.cal.data('colpick').height,(pageX - ev.data.pos.left))))/ev.data.cal.data('colpick').height, 10))
					.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function (ev) {
				fillRGBFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colpick').color, ev.data.cal.get(0));
				$(playerIframe.contentDocument).off('mouseup touchend',upSelector);
				$(playerIframe.contentDocument).off('mousemove touchmove',moveSelector);
				return false;
			},
			//Submit button
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colpick').color;
				cal.data('colpick').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colpick').onSubmit(col, hsbToHex(col), hsbToRgb(col), cal.data('colpick').el);
			},
			//Show/hide the color picker
			show = function (ev) {
				// Prevent the trigger of any direct parent
				ev.stopPropagation();
				var cal = $('#' + $(this).data('colpickId'));
				cal.data('colpick').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				var viewPort = getViewport();
				var calW = cal.width();
				if (left + calW > viewPort.l + viewPort.w) {
					left -= calW;
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colpick').onShow.apply(this, [cal.get(0)]) != false) {
					cal.show();
				}
				//Hide when user clicks outside
				$('html').mousedown({cal:cal}, hide);
				cal.mousedown(function(ev){ev.stopPropagation();})
			},
			hide = function (ev) {
				if (ev.data.cal.data('colpick').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
					ev.data.cal.hide();
				}
				$('html').off('mousedown', hide);
			},
			getViewport = function () {
				var m = playerIframe.contentDocument.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? playerIframe.contentDocument.documentElement.scrollLeft : playerIframe.contentDocument.body.scrollLeft),
					w : window.innerWidth || (m ? playerIframe.contentDocument.documentElement.clientWidth : playerIframe.contentDocument.body.clientWidth)
				};
			},
			//Fix the values if the user enters a negative or high value
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			},
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			},
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colpick').origColor;
				cal.data('colpick').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				//Set color
				if (typeof opt.color == 'string') {
					opt.color = hexToHsb(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = rgbToHsb(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}

				//For each selected DOM element
				return this.each(function () {
					//If the element does not have an ID
					if (!$(this).data('colpickId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						//Generate and assign a random ID
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colpickId', id);
						//Set the tpl's ID and get the HTML
						var cal = $(tpl).attr('id', id);
						//Add class according to layout
						cal.addClass('colpick_'+options.layout+(options.submit?'':' colpick_'+options.layout+'_ns'));
						//Add class if the color scheme is not default
						if(options.colorScheme != 'light') {
							cal.addClass('colpick_'+options.colorScheme);
						}
						//Setup submit button
						$(cal[0].querySelectorAll('div.colpick_submit')).html(options.submitText).click(clickSubmit);
						//Setup input fields
						options.fields = $(cal[0].querySelectorAll('input')).change(change).blur(blur).focus(focus);
						$(cal[0].querySelectorAll('div.colpick_field_arrs')).mousedown(downIncrement).end().find('div.colpick_current_color').click(restoreOriginal);
						//Setup hue selector
						options.selector = $(cal[0].querySelectorAll('div.colpick_color')).on('mousedown touchstart',downSelector);
						options.selectorIndic = $(options.selector[0].querySelectorAll('div.colpick_selector_outer'));
						//Store parts of the plugin
						options.el = this;
						options.hue = $(cal[0].querySelectorAll('div.colpick_hue_arrs'));
						huebar = options.hue.parent();
						//Paint the hue bar
						var UA = navigator.userAgent.toLowerCase();
						var isIE = navigator.appName === 'Microsoft Internet Explorer';
						var IEver = isIE ? parseFloat( UA.match( /msie ([0-9]{1,}[\.0-9]{0,})/ )[1] ) : 0;
						var ngIE = ( isIE && IEver < 10 );
						var stops = ['#ff0000','#ff0080','#ff00ff','#8000ff','#0000ff','#0080ff','#00ffff','#00ff80','#00ff00','#80ff00','#ffff00','#ff8000','#ff0000'];
						if(ngIE) {
							var i, div;
							for(i=0; i<=11; i++) {
								div = $('<div></div>').attr('style','height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+'); -ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='+stops[i]+', endColorstr='+stops[i+1]+')";');
								huebar.append(div);
							}
						} else {
							stopList = stops.join(',');
							huebar.attr('style','background:-webkit-linear-gradient(top,'+stopList+'); background: -o-linear-gradient(top,'+stopList+'); background: -ms-linear-gradient(top,'+stopList+'); background:-moz-linear-gradient(top,'+stopList+'); -webkit-linear-gradient(top,'+stopList+'); background:linear-gradient(to bottom,'+stopList+'); ');
						}
						$(cal[0].querySelectorAll('div.colpick_hue')).on('mousedown touchstart',downHue);
						options.newColor = $(cal[0].querySelectorAll('div.colpick_new_color'));
						options.currentColor = $(cal[0].querySelectorAll('div.colpick_current_color'));
						//Store options and fill with default color
						cal.data('colpick', options);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						//Append to body if flat=false, else show in place
						if (options.flat) {
							cal.appendTo(this).show();
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							cal.appendTo(playerIframe.contentDocument.body);
							$(this).on(options.showEvent, show);
							cal.css({
								position:'absolute'
							});
						}
					}
				});
			},
			//Shows the picker
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colpickId')) {
						show.apply(this);
					}
				});
			},
			//Hides the picker
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colpickId')) {
						$('#' + $(this).data('colpickId')).hide();
					}
				});
			},
			//Sets a color as new and current (default)
			setColor: function(col, setCurrent) {
				setCurrent = (typeof setCurrent === "undefined") ? 1 : setCurrent;
				if (typeof col == 'string') {
					col = hexToHsb(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = rgbToHsb(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colpickId')) {
						var cal = $('#' + $(this).data('colpickId'));
						cal.data('colpick').color = col;
						cal.data('colpick').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));

						setNewColor(col, cal.get(0));
						cal.data('colpick').onChange.apply(cal.parent(), [col, hsbToHex(col), hsbToRgb(col), cal.data('colpick').el, 1]);
						if(setCurrent) {
							setCurrentColor(col, cal.get(0));
						}
					}
				});
			}
		};
	}();
	//Color space convertions
	var hexToRgb = function (hex) {
		var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
		return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
	};
	var hexToHsb = function (hex) {
		return rgbToHsb(hexToRgb(hex));
	};
	var rgbToHsb = function (rgb) {
		var hsb = {h: 0, s: 0, b: 0};
		var min = Math.min(rgb.r, rgb.g, rgb.b);
		var max = Math.max(rgb.r, rgb.g, rgb.b);
		var delta = max - min;
		hsb.b = max;
		hsb.s = max != 0 ? 255 * delta / max : 0;
		if (hsb.s != 0) {
			if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
			else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
			else hsb.h = 4 + (rgb.r - rgb.g) / delta;
		} else hsb.h = -1;
		hsb.h *= 60;
		if (hsb.h < 0) hsb.h += 360;
		hsb.s *= 100/255;
		hsb.b *= 100/255;
		return hsb;
	};
	var hsbToRgb = function (hsb) {
		var rgb = {};
		var h = hsb.h;
		var s = hsb.s*255/100;
		var v = hsb.b*255/100;
		if(s == 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255-s)*v/255;
			var t3 = (t1-t2)*(h%60)/60;
			if(h==360) h = 0;
			if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
			else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
			else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
			else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
			else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
			else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
			else {rgb.r=0; rgb.g=0;	rgb.b=0}
		}
		return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
	};
	var rgbToHex = function (rgb) {
		var hex = [
			rgb.r.toString(16),
			rgb.g.toString(16),
			rgb.b.toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('');
	};
	var hsbToHex = function (hsb) {
		return rgbToHex(hsbToRgb(hsb));
	};
	$.fn.extend({
		colpick: colpick.init,
		colpickHide: colpick.hidePicker,
		colpickShow: colpick.showPicker,
		colpickSetColor: colpick.setColor
	});
	$.extend({
		colpick:{
			rgbToHex: rgbToHex,
			rgbToHsb: rgbToHsb,
			hsbToHex: hsbToHex,
			hsbToRgb: hsbToRgb,
			hexToHsb: hexToHsb,
			hexToRgb: hexToRgb
		}
	});
})(jQuery);
