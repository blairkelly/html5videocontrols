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
		seekbitColor: '#EEE',
		seekbitActiveColor: '#678',
		seekbitBoundary: 1,
		seekfillColor: '#00aae8',
		seekfillNegativeColor: "#CCC"
	}
	for ( var i in options ) {
		this.options[i] = options[i];
	}
	var seekbitColor = this.options.seekbitColor;
	var seekbitActiveColor = this.options.seekbitActiveColor;
	var seekbitBoundary = Math.abs(this.options.seekbitBoundary);
	if(target.closest('.vidcradle').length) {
		target.closest('.vidcradle').find('.vidcontrols').remove();
		target.unwrap();
	}
	target.wrap('<div class="vidcradle" style="position: relative; display: inline-block;"></div>');
	var vidcradle = target.closest('.vidcradle');
	var vchtml = '<div class="vidcontrols" style="-webkit-touch-callout: none; -webkit-user-select: none; user-select: none; background-color:rgba(0,0,0,0.50); font-family: Arial; height: 36px; width: 100%; position: absolute; bottom: 0; left: 0;"></div>';
	vidcradle.append(vchtml);
	var videocontrols = vidcradle.find('.vidcontrols');
	videocontrols.append('<div class="playpause" style="position: absolute; padding: 9px 18px 9px 18px;"></div>')
	var playpause = videocontrols.find('.playpause');
	playpause.append('<div class="play" style="display: none; width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 18px solid white;"></div>');
	playpause.append('<div class="pause" style="display: none;"><div style="display: inline-block; width: 6px; height: 18px; margin-right: 5px; background: #fff;"></div><div style="display: inline-block; width: 6px; height: 18px; background: #fff;"></div></div>');
	videocontrols.append('<div class="time" style="color: #fff; font-size: 12px; position: absolute; top: 10px; left: 60px;">0:00</div>');
	var timedisplay = videocontrols.find('.time');
	videocontrols.append('<div class="opts" style="position: absolute; top: 0px; right: 0px; padding-right: 10px;"></div>');
	var opts = videocontrols.find('.opts');
	videocontrols.append('<div class="seekbar" style="position: relative; margin: 15px 0 0 95px; height: 6px; background-color:rgba(10,10,10,0.72);"></div>');
	var seekbar = videocontrols.find('.seekbar');
	seekbar.append('<div class="seekfill-negative" style="display: none; position: absolute; top: 0; left: 0; width: 0px; height: 6px;"></div>');
	var seekfillnegative = seekbar.find('.seekfill-negative');
	seekfillnegative.css('background-color', this.options.seekfillNegativeColor)
	seekbar.append('<div class="seekfill" style="position: absolute; top: 0; left: 0; width: 0px; height: 6px;"></div>')
	var seekfill = seekbar.find('.seekfill');
	seekfill.css('background-color', this.options.seekfillColor);
	seekbar.append('<div class="seekbit" style="display: none; cursor: pointer; position: absolute; width: 16px; height: 16px; -webkit-border-radius: 8px; top: -5px; left: -1px;"></div>')
	var seekbit = seekbar.find('.seekbit');
	seekbit.data('seeking', false);
	seekbit.css('background-color', this.options.seekbitColor);
	opts.append('<div class="duration" style="color: #fff; margin-top: 10px; font-size: 12px;">0:00</div>');
	var duration = opts.find('.duration');

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
		videocontrols.stop().fadeTo(180, 1, function () {
			videocontrols.removeClass('hiding').removeClass('hidden').removeClass('countdownset');
		});
	}
	var hidecontrols = function () {
		videocontrols.addClass('hiding');
		videocontrols.stop().fadeTo(520, 0, function () {
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
		updatetime(duration, vidstate.duration);
		var nw = opts.width() + 18 + 'px';
		seekbar.css('margin-right',  nw);
		seekbit.css('display', 'block');
		seekbit.data('fullrange', seekbar.width() - seekbit.width() + (seekbitBoundary * 2));
		seekbit.data('boundaryLeft', (0 - seekbitBoundary));
		seekbit.data('boundaryRight', (seekbit.data('fullrange') - seekbitBoundary));
	});
	target.on('timeupdate', function () {
		if(!seekbit.data('seeking')) {
			updatetime(timedisplay, vidstate.currentTime);
			var percentage = vidstate.currentTime / vidstate.duration;
			var seekbitpos = ((seekbit.data('fullrange') * percentage) - seekbitBoundary) + 'px';
			var seekfillwidth = (seekbit.data('fullrange') * percentage) + 'px';
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
		}
	});
	target.on('touchstart mousedown mouseenter', function () {
		if(videocontrols.hasClass('hiding') || videocontrols.hasClass('hidden')) {
			showcontrols();
		}
	});
	var playpausedelay = false;
	playpause.on('mousedown touchstart', function(e) {
		e.stopPropagation();
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
		}, 555);
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
    	var seekfillwidth = newseekposx + seekbitBoundary + 'px';
    	seekfill.css('width', seekfillwidth);
    	var percentage = (newseekposx + seekbitBoundary) / seekbit.data('fullrange');
    	var newseconds = percentage * vidstate.duration;
    	updatetime(timedisplay, newseconds);
    	seekbit.data('seekto', newseconds);
    }
    var breakpoint = function (event) {
    	seekbit.css('background-color', seekbitColor);
		thedoc.off('mousemove touchmove', doseek);
		thedoc.off('mouseup touchend', breakpoint);
		seekfillnegative.css('display', 'none');
    	vidstate.currentTime = seekbit.data('seekto');
    	vidstate.play();
		seekbit.data('seeking', false);
    }
	seekbit.on('mousedown touchstart', function (event) {
		showcontrols();
		seekfillnegative.css('width', seekfill.width() + 'px');
		seekfillnegative.css('display', 'block');
		seekbit.data('seeking', true);
		seekbit.css('background-color', seekbitActiveColor);
        thedoc.on('mousemove touchmove', doseek);
        thedoc.on('mouseup touchend', breakpoint);
        getpointpos(event.originalEvent);
        thedoc.data('startX', thedoc.data('pX'));
        thedoc.data('startY', thedoc.data('pY'));
        seekbit.data('startX', seekbit.position().left);
	});

	if(this.options.autoplay) {
		showpausebtn();
		vidstate.play();
	} else {
		showplaybtn();
		vidstate.pause();
	}
}