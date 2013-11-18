/*
Blair's HTML5 video controls
*/
var vidcontrols = function (target, options) {
	var thedoc = $(document);
	target.removeAttr('controls');
	target.removeAttr('autoplay');
	
	var firstload = true;

	var vidstate = target.get(0);

	var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
	var downevent = isIOS ? "touchstart" : "mousedown";
	var upevent = isIOS ? "touchend" : "mouseup";
	var moveevent = isIOS ? "touchmove" : "mousemove";

	/*SET DEFAULT OPTIONS*/
	this.options = {
		seek: true,
		fullscreen: false,
		autoplay: false,
		showonstart: true,
		taptoplaypause: false,
		displaydelay: 2,
		playpausedelay: 100,
		startat: null,
		seekbitpointColor: '#FFF',
		seekbitpointActiveColor: '#CCC',
		seekbitBoundary: 7,
		seekfillColor: '#00aae8',
		seekfillNegativeColor: "#AAA",
		vidcontrolbottom: '0px',
		vidposter: "",
		vidwidth: "",
		vidheight: ""
	}
	/*SET OPTIONS SENT THROUGH FUNCTION CALL*/
	for ( var i in options ) {
		this.options[i] = options[i];
	}
	var autoplay = this.options.autoplay;
	var displaydelay = this.options.displaydelay;
	var playpausedelay_duration = this.options.playpausedelay;
	var taptoplaypause = this.options.taptoplaypause;
	var showonstart = this.options.showonstart;
	var startat = this.options.startat;
	var seekbitpointColor = this.options.seekbitpointColor;
	var seekbitpointActiveColor = this.options.seekbitpointActiveColor;
	var seekfillNegativeColor = this.options.seekfillNegativeColor;
	var seekfillColor = this.options.seekfillColor;
	var seekbitpointColor = this.options.seekbitpointColor;
	var seekbitBoundary = Math.abs(this.options.seekbitBoundary);
	var vidcontrolbottom = this.options.vidcontrolbottom;

	//check to see if target is already wrapped. if so, destroy wrapper.
	if(target.closest('.vidcradle').length) {
	    target.closest('.vidcradle').children('*:not(video)').each().remove(); //kills anything in the cradle except the video tag (the baby).
	    target.unwrap(); //removes existing cradle
    }

	//add the video cradle and the video element
	target.wrap('<div class="vidcradle" style="-webkit-touch-callout: none; -webkit-user-select: none; user-select: none; position: relative; display: inline-block; overflow: hidden;"></div>');
	var vidcradle = target.closest('.vidcradle');

	//functions for global use
	var playpausedelay = false;
	var doplaypause = function () {
		showcontrols();
		if(!playpausedelay) {
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
		videocontrols.stop().fadeTo(250, 1, function () {
			videocontrols.removeClass('hiding').removeClass('hidden').removeClass('countdownset');
		});
	}
	var hidecontrols = function () {
		videocontrols.addClass('hiding');
		videocontrols.stop().fadeTo(500, 0, function () {
			videocontrols.removeClass('hiding').addClass('hidden');
		});
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

	

	

	//add the following listener after a short time. Has to be here: iOS doesn't add the listeners until the video is activated by the user
	setTimeout(function () {
		if(taptoplaypause) {
			target.on(downevent, function () {doplaypause();});  //delay to prevent touch event firing prematurely.
		}
	}, 100);

	if(autoplay) {
		showpausebtn();
		vidstate.play();
	} else {
		showplaybtn();
		vidstate.pause();
	}

}