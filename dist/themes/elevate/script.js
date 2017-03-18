/*!
betajs-media-components - v0.0.49 - 2017-03-15
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/
(function () {

var Scoped = this.subScope();

Scoped.binding("browser", "global:BetaJS.Browser");
Scoped.binding("module", "global:BetaJS.MediaComponents");

Scoped.extend('module:Templates', function () {
return {"elevate-video_player_controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class=\"{{css}}-top-block\">          <div class=\"{{css}}-top-left-block\">             <div class=\"{{css}}-time-container {{css}}-left-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>             </div>         </div>          <div class=\"{{css}}-top-right-block\">              <div class=\"{{css}}-time-container {{css}}-right-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>             </div>          </div>          <div class=\"{{css}}-progressbar\">             <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"                  onmousedown=\"{{startUpdatePosition(domEvent)}}\"                  onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                  onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                  onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                  <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                 <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                     <div class=\"{{css}}-progressbar-button-description\" style=\"display: none\">                         <div class=\"{{css}}-current-stream-screen-shot\">                             <img src=\"\"/>                         </div>                         <div class=\"{{css}}-time-container\">                             <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>                         </div>                     </div>                     <div class=\"{{css}}-progressbar-button\"></div>                 </div>             </div>         </div>      </div>      <div class=\"{{css}}-bottom-block\">          <div class=\"{{css}}-left-block\">              <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">                 <div class=\"{{css}}-button-inner\">                     {{string('submit-video')}}                 </div>             </div>              <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-ccw\"></i>                 </div>             </div>              <div data-selector=\"button-icon-play\" class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-play\"></i>                 </div>             </div>              <div data-selector=\"button-icon-pause\" class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-pause\"></i>                 </div>             </div>              <div data-selector=\"button-icon-volume\" class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>                 </div>             </div>              <div class=\"{{css}}-volumebar\">                 <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"                      onmousedown=\"{{startUpdateVolume(domEvent)}}\"                      onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                      onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                      onmousemove=\"{{progressUpdateVolume(domEvent)}}\">                     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>                 </div>             </div>          </div>          <div class=\"{{css}}-center-block\">             <div data-selector=\"video-title-block\" class=\"{{css}}-video-title-block\" ba-if=\"{{title}}\">                 <p class=\"{{css}}-video-title\">                     {{title}}                 </p>             </div>         </div>          <div class=\"{{css}}-right-block\">              <div data-selector=\"button-stream-label\" class=\"{{css}}-button-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">                 <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                     <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>                 </div>             </div>              <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-button-container\"                   ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\">                 <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                     <i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>                 </div>             </div>          </div>      </div> </div> "};
});
Scoped.extend("module:Assets.playerthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"elevate": {
			css: "ba-videoplayer-elevate-theme",
			csstheme: "ba-videoplayer-elevate-theme",
			tmplcontrolbar: Templates["elevate-video_player_controlbar"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		}
	};
});

Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates"
], function (Templates) {
	return {
		"elevate": {
			css: "ba-videorecorder-theme-elevate",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["elevate-video_recorder_chooser"],
			tmpltopmessage: Templates["elevate-video_recorder_topmessage"],
			tmplcontrolbar: Templates["elevate-video_recorder_controlbar"],
			tmplimagegallery: Templates["elevate-recorder_imagegallery"],
			tmplmessage: Templates["elevate-video_recorder_message"]
		}
	};
});

}).call(Scoped);