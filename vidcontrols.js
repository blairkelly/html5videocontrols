/*
Blair's HTML5 video controls
*/
var vidcontrols = function (target, options) {
	var thedoc = $(document);
	var targetid = target.attr('id');
	var vidparent = target.parent();
	target.removeAttr('controls');
	target.removeAttr('autoplay');
	var vidstate = target.get(0);
	var firstload = true;

	var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
	var downevent = isIOS ? "touchstart" : "mousedown";
	var upevent = isIOS ? "touchend" : "mouseup";
	var moveevent = isIOS ? "touchmove" : "mousemove";

	/*SET DEFAULT OPTIONS*/
	this.options = {
		seek: true,
		fullscreen_ok: true,
		autoplay: false,
		showonstart: true,
		taptoplaypause: false,
		displaydelay: 2,
		playpausedelay: 100,
		startat: null,
		controlbuttoncolor: '#FFF',
		seekbitpointColor: '#FFF',
		seekbitpointActiveColor: '#CCC',
		seekbitBoundary: 7,
		seekfillColor: '#00aae8',
		seekfillNegativeColor: "#AAA",
		vidcontrolbottom: '0px',
		vidcontrolbgopacity: '0.56',
		vidcontrolfadeinoutduration: "333",
		vidposter: "",
		vidwidth: "",
		vidheight: ""
	}
	/*SET OPTIONS SENT THROUGH FUNCTION CALL*/
	for ( var i in options ) {
		this.options[i] = options[i];
	}
	var fullscreen_ok = this.options.fullscreen_ok;
	var autoplay = this.options.autoplay;
	var displaydelay = this.options.displaydelay;
	var playpausedelay_duration = this.options.playpausedelay;
	var taptoplaypause = this.options.taptoplaypause;
	var showonstart = this.options.showonstart;
	var startat = this.options.startat;
	var controlbuttoncolor = this.options.controlbuttoncolor;
	var seekbitpointColor = this.options.seekbitpointColor;
	var seekbitpointActiveColor = this.options.seekbitpointActiveColor;
	var seekfillNegativeColor = this.options.seekfillNegativeColor;
	var seekfillColor = this.options.seekfillColor;
	var seekbitpointColor = this.options.seekbitpointColor;
	var seekbitBoundary = Math.abs(this.options.seekbitBoundary);
	var vidcontrolbottom = this.options.vidcontrolbottom;
	var vidcontrolbgopacity = this.options.vidcontrolbgopacity;
	var vidcontrolfadeinoutduration = this.options.vidcontrolfadeinoutduration;

	//check to see if target is already wrapped. if so, destroy wrapper.
	if(target.closest('.vidcradle').length) {
	    target.closest('.vidcradle').children('*:not(video)').each().remove(); //kills anything in the cradle except the video tag.
	    target.unwrap(); //removes existing cradle
    }

	//add the video cradle and the video element
	target.wrap('<div class="vidcradle" style="-webkit-touch-callout: none; -webkit-user-select: none; user-select: none; position: relative; display: inline-block; overflow: hidden;"></div>');
	var vidcradle = target.closest('.vidcradle');

	//add style for classes not necessarily used at startup
	vidcradle.append('<style>.invisible {opacity: 0;}</style>');

	//functions for global use
	var playpausedelay = false;
	var doplaypause = function () {
		showcontrols();
		var controlsvisibility = parseFloat(videocontrols.css('opacity'));
		if(!playpausedelay && (controlsvisibility > 0)) {
			if(vidstate.paused) {
				vidstate.play();
			} else {
				vidstate.pause();
			}
			playpausedelay = true;
		}
		setTimeout(function() {
			playpausedelay = false;
		}, playpausedelay_duration);
	};
	var showpausebtn = function () {
		playpause.find('.play').css('display', 'none');
		playpause.find('.pause').css('display', 'block');
	}
	var showplaybtn = function () {
		playpause.find('.pause').css('display', 'none');
		playpause.find('.play').css('display', 'block');
	}
	var updatetime = function (target, thesecs) {
		var mins = Math.floor(thesecs / 60);
		var secs = Math.floor(thesecs - (mins * 60));
		mins = mins.toString();
		secs = secs.toString();
		if(secs.length < 2) {
			secs = "0" + secs;
		}
		target.html(mins + ':' + secs);
	}
	var showcontrols = function () {
		if(showonstart) {
			videocontrols.removeClass('invisible').removeClass('countdownset');
		}
	}
	var hidecontrols = function () {
		videocontrols.addClass('invisible');
	}
	var getpointpos = function (event) {
		var point = event.touches ? event.touches[0] : event;
		var pX = point.pageX;
		var pY = point.pageY;
        thedoc.data('pX', pX);
        thedoc.data('pY', pY);
    }
    var doseek = function(event) {
    	getpointpos(event.originalEvent);
    	var xdist = thedoc.data('pX') - thedoc.data('startX');
    	var spx = seekbit.data('startX');
    	var newseekposx = spx + xdist;
    	if(newseekposx < seekbit.data('boundaryLeft')) {
    		newseekposx = seekbit.data('boundaryLeft');
    	} else if (newseekposx > seekbit.data('boundaryRight')) {
    		newseekposx = seekbit.data('boundaryRight');
    	}
    	seekbit.css('left', newseekposx + 'px');
    	var percentage = (newseekposx + seekbitBoundary) / seekbit.data('fullrange');
    	var newseconds = 0;
    	if(percentage > 0.9975) {
    		//this is a temporary fix... something mucks up when you try to seek to the end.
    		newseconds = (percentage * vidstate.duration) - 0.5;
    	} else {
    		newseconds = percentage * vidstate.duration;
    	}
    	var seekfillwidth = (percentage * seekbar.width()) + 'px';
    	seekfill.css('width', seekfillwidth);
    	updatetime(timedisplay, newseconds);
    	seekbit.data('percentage', percentage);
    	seekbit.data('seekto', newseconds);
    }
    var breakpoint = function (event) {
    	seekbitpoint.css('background-color', seekbitpointColor);
		thedoc.off('mousemove touchmove', doseek);
		thedoc.off('mouseup touchend', breakpoint);
		seekfillnegative.css('display', 'none');
    	vidstate.currentTime = seekbit.data('seekto');
    	setTimeout(function() {
    		vidstate.play();
    		seekbit.data('touched', false);
    	}, 250);
    }

	//construct controls
	vidcradle.append('<div class="vidcontrols invisible" style="background-color:rgba(0,0,0,'+vidcontrolbgopacity+'); font-family: Arial; height: 36px; bottom: -36px; width: 100%; position: absolute; left: 0; -webkit-transition: opacity 300ms linear;"></div>');
	var videocontrols = vidcradle.find('.vidcontrols');
	videocontrols.css('-webkit-overflow-scrolling', 'touch'); //not necessary for iOS 7... should remove or make conditional.
	videocontrols.append('<div class="playpause" style="cursor: pointer; position: absolute; padding: 9px 18px 9px 18px;"></div>');
	if(showonstart) {
		//videocontrols.css('opacity', '1');
		videocontrols.removeClass('invisible');
	} else {
		//videocontrols.css('opacity', '0');
	}
	var playpause = videocontrols.find('.playpause');
	playpause.append('<div class="play" style="display: none; width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 18px solid '+controlbuttoncolor+';"></div>');
	playpause.append('<div class="pause" style="display: none;"><div style="display: inline-block; width: 6px; height: 18px; margin-right: 5px; background: '+controlbuttoncolor+';"></div><div style="display: inline-block; width: 6px; height: 18px; background: '+controlbuttoncolor+';"></div></div>');
	videocontrols.append('<div class="time" style="color: '+controlbuttoncolor+'; font-size: 12px; position: absolute; top: 10px; left: 60px;">0:00</div>');
	var timedisplay = videocontrols.find('.time');
	videocontrols.append('<div class="opts" style="position: absolute; top: 0px; right: 0px; padding-right: 10px; overflow: auto;"></div>');
	var opts = videocontrols.find('.opts');
	videocontrols.append('<div class="seekbar" style="display: none; position: relative; margin: 15px 0 0 95px; height: 6px; background-color:rgba(10,10,10,0.72);"></div>');
	var seekbar = videocontrols.find('.seekbar');
	seekbar.append('<div class="seekfill-negative" style="display: none; position: absolute; top: 0; left: 0; width: 0px; height: 6px;"></div>');
	var seekfillnegative = seekbar.find('.seekfill-negative');
	seekfillnegative.css('background-color', seekfillNegativeColor);
	seekbar.append('<div class="seekfill" style="position: absolute; top: 0; left: 0; width: 0px; height: 6px;"></div>')
	var seekfill = seekbar.find('.seekfill');
	seekfill.css('background-color', seekfillColor);
	seekbar.append('<div class="seekbit" style="display: none; cursor: pointer; position: absolute; width: 28px; height: 28px; top: -11px; left: -8px;"></div>')
	var seekbit = seekbar.find('.seekbit');
	seekbit.data('seeking', false);
	seekbit.append('<div class="seekbitpoint" style="position: absolute; width: 16px; height: 16px; -webkit-border-radius: 8px; border-radius: 8px; top: 6px; left: 6px;"></div>');
	var seekbitpoint = seekbit.find('.seekbitpoint');
	seekbitpoint.css('background-color', seekbitpointColor);
	opts.append('<div class="duration" style="float: left; color: '+controlbuttoncolor+'; margin-top: 10px; font-size: 12px;">0:00</div>');
	var duration = opts.find('.duration');
	opts.append('<div class="btn_fullscreen" style="float: left; width: 18px; height: 18px; border: 2px solid '+controlbuttoncolor+'; margin-top: 7px; margin-left: 10px; cursor: pointer;"></div>');
	var btn_fullscreen = opts.find('.btn_fullscreen');
	if(!fullscreen_ok) {
		btn_fullscreen.css('display', 'none');
	}

	//LISTENERS
	//clear existing event listeners on certain elements
	vidcradle.unbind();
	target.unbind();

	btn_fullscreen.on(downevent, function () {
		var videlem = document.getElementById(targetid);
		if (videlem.requestFullscreen) {
		  videlem.requestFullscreen();
		} else if (videlem.mozRequestFullScreen) {
		  videlem.mozRequestFullScreen();
		} else if (videlem.webkitRequestFullscreen) {
		  videlem.webkitRequestFullscreen();
		}
	});
	vidcradle.on(downevent + ' ' + moveevent, function () {
		if(videocontrols.hasClass('invisible')) {
			showcontrols();
		}
	});
	playpause.on(downevent, function(e) {
		e.stopPropagation();
		doplaypause();
	});
	seekbit.on(downevent, function (event) {
		event.preventDefault();
		//event.defaultPrevented();
		event.stopPropagation();
		showcontrols();
		seekfillnegative.css('width', seekfill.width() + 'px');
		seekfillnegative.css('display', 'block');
		seekbit.data('seeking', true);
		seekbit.data('touched', true);
		seekbitpoint.css('background-color', seekbitpointActiveColor);
        thedoc.on(moveevent, doseek);
        thedoc.on(upevent, breakpoint);
        getpointpos(event.originalEvent);
        thedoc.data('startX', thedoc.data('pX'));
        thedoc.data('startY', thedoc.data('pY'));
        seekbit.data('startX', seekbit.position().left);
	});
	videocontrols.on(downevent, function (e) {
		e.stopPropagation();
	});
	target.on('seeked', function () {
		showcontrols();
	});
	target.on('play', function () {
		showpausebtn();
		videocontrols.data('startedat', vidstate.currentTime);
	});
	target.on('pause', function () {
		showplaybtn();
	});
	target.on('timeupdate', function () {
		if(!seekbit.data('seeking')) {
			updatetime(timedisplay, vidstate.currentTime);
			var percentage = vidstate.currentTime / vidstate.duration;
			var seekbitpos = ((seekbit.data('fullrange') * percentage) - seekbitBoundary) + 'px';
			var seekfillwidth = (seekbar.width() * percentage) + 'px';
			seekbit.css('left', seekbitpos);
			seekfill.css('width', seekfillwidth);

			if(videocontrols.hasClass('countdownset')) {
			} else {
				videocontrols.data('startedat', vidstate.currentTime);
				videocontrols.addClass('countdownset');
			}

			if(videocontrols.hasClass('invisible')) {
			} else {
				var timediff = (vidstate.currentTime - videocontrols.data('startedat')); //seconds
				if(timediff > displaydelay) {
					hidecontrols();
				}
			}
		} else if (!seekbit.data('touched')) {
			var seekdiff = Math.abs(seekbit.data('seekto') - vidstate.currentTime);
			if(seekdiff < 5) {
				seekbit.data('seeking', false);
			}
		}
	});
	target.on('canplay', function () {
		//set some vars and such
		seekbar.css('display', 'none');
		updatetime(duration, vidstate.duration);
		var nw = opts.width() + 18 + 'px';
		seekbar.css('margin-right',  nw);
		seekbit.css('display', 'block');
		seekbar.css('display', 'block');
		seekbit.data('fullrange', seekbar.width() - seekbit.width() + (seekbitBoundary * 2));
		seekbit.data('boundaryLeft', (0 - seekbitBoundary));
		seekbit.data('boundaryRight', (seekbit.data('fullrange') - seekbitBoundary));
		if(firstload) {
			//firefox seems to force this. annoying.
			if(startat) {
				vidstate.currentTime = startat;
			} else {
				vidstate.currentTime = 0;
			}
			firstload = false;
		}
		if(showonstart) {
			videocontrols.css('bottom', vidcontrolbottom);
		}
	});

	var checkshowonstart = function () {
		if(!showonstart) {
			showonstart = true; //just stops this from activating again.
			//hidecontrols();
			videocontrols.css('bottom', vidcontrolbottom);
			showcontrols();
		}
	}

	//add the following listener after a short time. Has to be here: iOS doesn't add the listeners until the video is activated by the user
	setTimeout(function () {
		target.on(downevent, function () {
			checkshowonstart();
			if(taptoplaypause) {
				doplaypause();
			}
		});  //delay to prevent touch event firing prematurely.
		target.on(moveevent, function () {
			checkshowonstart();
		});
	}, 300);
	if(autoplay) {
		vidstate.play();
		showpausebtn();
	} else {
		vidstate.pause();
		showplaybtn();
	}
}