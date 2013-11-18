var dofeedback = true;

var givefeedback = function (msg) {
	if(dofeedback) {
		var feedback = $('.feedback');
		feedback.removeClass('hidden');
		feedback.append(msg + '<br/>');
	}
}

var exLog = console.log;
console.log = function(msg) {
    exLog.apply(this, arguments);
 	givefeedback(msg);   
}

window.onerror = function(errorMsg, url, lineNumber) {
    givefeedback('<span style="color:#f11;">' + errorMsg + '<span style="color: #123">, line ' + lineNumber + '</span></span>');
};