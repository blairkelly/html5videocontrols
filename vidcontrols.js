/*
Blair's HTML5 video controls
*/
var vidcontrols = function (target, options) {
	var thedoc = $(document);
	target.removeAttr('controls');
	var vidstate = target.get(0);
	this.options = {
		seek: true,
		fullscreen: false,
		autoplay: false,
		taptoplaypause: false,
		seekbitpointColor: '#FFF',
		seekbitpointActiveColor: '#CCC',
		seekbitBoundary: 7,
		seekfillColor: '#00aae8',
		seekfillNegativeColor: "#AAA",
		bottom: '0px'
	}
	for ( var i in options ) {
		this.options[i] = options[i];
	}
	var seekbitpointColor = this.options.seekbitpointColor;
	var seekbitpointActiveColor = this.options.seekbitpointActiveColor;
	var seekbitBoundary = Math.abs(this.options.seekbitBoundary);
	if(target.closest('.vidcradle').length) {
		target.closest('.vidcradle').find('.vidcontrols').remove();
		target.unwrap();
	}
	target.wrap('<div class="vidcradle" style="position: relative; display: inline-block;"></div>');
	var vidcradle = target.closest('.vidcradle');
	var vchtml = '<div class="vidcontrols" style="-webkit-touch-callout: none; -webkit-user-select: none; user-select: none; background-color:rgba(0,0,0,0.52); font-family: Arial; height: 36px; width: 100%; position: absolute; left: 0;"></div>';
	vidcradle.append(vchtml);
	var videocontrols = vidcradle.find('.vidcontrols');
	videocontrols.css('-webkit-overflow-scrolling', 'touch'); //not necessary for iOS 7... should remove or make conditional.
	videocontrols.css('bottom', this.options.bottom);
	videocontrols.append('<div class="playpause" style="cursor: pointer; position: absolute; padding: 9px 18px 9px 18px;"></div>');
	var playpause = videocontrols.find('.playpause');
	playpause.append('<div class="play" style="display: none; width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 18px solid white;"></div>');
	playpause.append('<div class="pause" style="display: none;"><div style="display: inline-block; width: 6px; height: 18px; margin-right: 5px; background: #fff;"></div><div style="display: inline-block; width: 6px; height: 18px; background: #fff;"></div></div>');
	videocontrols.append('<div class="time" style="color: #fff; font-size: 12px; position: absolute; top: 10px; left: 60px;">0:00</div>');
	var timedisplay = videocontrols.find('.time');
	videocontrols.append('<div class="opts" style="position: absolute; top: 0px; right: 0px; padding-right: 10px;"></div>');
	var opts = videocontrols.find('.opts');
	videocontrols.append('<div class="seekbar" style="display: none; position: relative; margin: 15px 0 0 95px; height: 6px; background-color:rgba(10,10,10,0.72);"></div>');
	var seekbar = videocontrols.find('.seekbar');
	seekbar.append('<div class="seekfill-negative" style="display: none; position: absolute; top: 0; left: 0; width: 0px; height: 6px;"></div>');
	var seekfillnegative = seekbar.find('.seekfill-negative');
	seekfillnegative.css('background-color', this.options.seekfillNegativeColor)
	seekbar.append('<div class="seekfill" style="position: absolute; top: 0; left: 0; width: 0px; height: 6px;"></div>')
	var seekfill = seekbar.find('.seekfill');
	seekfill.css('background-color', this.options.seekfillColor);
	//seekbar.append('<div class="seekbit" style="display: none; cursor: pointer; position: absolute; width: 16px; height: 16px; -webkit-border-radius: 8px; top: -5px; left: -1px;"></div>')
	seekbar.append('<div class="seekbit" style="display: none; cursor: pointer; position: absolute; width: 28px; height: 28px; top: -11px; left: -8px;"></div>')
	var seekbit = seekbar.find('.seekbit');
	seekbit.data('seeking', false);
	seekbit.append('<div class="seekbitpoint" style="position: absolute; width: 16px; height: 16px; -webkit-border-radius: 8px; top: 6px; left: 6px;"></div>');
	var seekbitpoint = seekbit.find('.seekbitpoint');
	seekbitpoint.css('background-color', this.options.seekbitpointColor);
	opts.append('<div class="duration" style="color: #fff; margin-top: 10px; font-size: 12px;">0:00</div>');
	var duration = opts.find('.duration');

	if(options.taptoplaypause) {
		vidcradle.append('<div class="vidcover" style="position: absolute; top: 0; left: 0;"></div>');
		var vidcover = vidcradle.find('.vidcover');
		vidcover.css('height', (target.height() - videocontrols.height()) + 'px');
		vidcover.css('width', target.width() + 'px');
	}

	var playpausedelay = false;
	var doplaypause = function () {
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
		}, 500);
	};
	var showpausebtn = function () {
		playpause.find('.play').css('display', 'none');
		playpause.find('.pause').css('display', 'block');
	}
	var showplaybtn = function () {
		playpause.find('.pause').css('display', 'none');
		playpause.find('.play').css('display', 'block');
		showcontrols();
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
			if(options.taptoplaypause) {
				setTimeout(function () {
					vidcover.css('display', 'block');
					vidcover.on('mousedown touchstart', function () {doplaypause();});
				}, 500);
			}
		});
	}
	var hidecontrols = function () {
		videocontrols.addClass('hiding');
		if(options.taptoplaypause) {
			vidcover.unbind();
			vidcover.css('display', 'none');
		}
		videocontrols.stop().fadeTo(500, 0, function () {
			videocontrols.removeClass('hiding').addClass('hidden');
		});
	}
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
	target.on('durationchange', function () {
		seekbar.css('display', 'none');
		updatetime(duration, vidstate.duration);
		var nw = opts.width() + 18 + 'px';
		seekbar.css('margin-right',  nw);
		seekbit.css('display', 'block');
		seekbar.css('display', 'block');
		seekbit.data('fullrange', seekbar.width() - seekbit.width() + (seekbitBoundary * 2));
		seekbit.data('boundaryLeft', (0 - seekbitBoundary));
		seekbit.data('boundaryRight', (seekbit.data('fullrange') - seekbitBoundary));
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

			if(videocontrols.hasClass('hiding') || videocontrols.hasClass('hidden')) {
			} else {
				var timediff = (vidstate.currentTime - videocontrols.data('startedat')) * 1000; //milliseconds
				if(timediff > 3200) {
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
	vidcradle.on('touchstart mousedown mouseenter mousemove', function () {
		if(videocontrols.hasClass('hiding') || videocontrols.hasClass('hidden')) {
			showcontrols();
		}
	});
	playpause.on('mousedown touchstart', function(e) {
		e.stopPropagation();
		doplaypause();
	});
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
    	}, 300);
    }
	seekbit.on('mousedown touchstart', function (event) {
		showcontrols();
		seekfillnegative.css('width', seekfill.width() + 'px');
		seekfillnegative.css('display', 'block');
		seekbit.data('seeking', true);
		seekbit.data('touched', true);
		seekbitpoint.css('background-color', seekbitpointActiveColor);
        thedoc.on('mousemove touchmove', doseek);
        thedoc.on('mouseup touchend', breakpoint);
        getpointpos(event.originalEvent);
        thedoc.data('startX', thedoc.data('pX'));
        thedoc.data('startY', thedoc.data('pY'));
        seekbit.data('startX', seekbit.position().left);
	});
	videocontrols.on('mousedown touchstart', function () {
		e.stopPropagation();
	});

	if(this.options.autoplay) {
		showpausebtn();
		vidstate.play();
	} else {
		showplaybtn();
		vidstate.pause();
	}

	//add the following listener after a short time.
	setTimeout(function () {
		if(options.taptoplaypause) {
			vidcover.on('mousedown touchstart', function () {doplaypause();});  //delay to prevent touch event firing prematurely.
		}
	}, 500);
}