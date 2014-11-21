/*
	jQuery Text Counter
	
	Current Version:	1.0.1

	Author:				Rob Barthle (rob@zadenconsulting.com)
	
	Create Date:		07/31/2010

	Description:		This is a basic text counter, with options I found missing in other
						currently available plugins. So I wrote my own to fit my needs.
	
	Features:			Custom counter display fields and text values
						Displays in a separate HTML element, allowing designer flexibility
						Loads counter accurately on page load
						updates on each key press and copy/paste
						truncates field value when limit has been reached
						counter text changes color at a set limit
						warning limit, warning color, and default color are customizable
	
	Options:			maxChars (maximum number of characters to allow)
						warningNum (number of characters to start "warning" colorization)
						counterDisplayID (ID of HTML element that text counter will be shown in)
						counterDisplayText (text shown after character remaining count)
						warningTextColor (color to change counter to during warning state)
						defaultTextColor (color to show counter during normal state)
						crCount (number of characteres to count carraige returns as)
	
	Browsers Tested:	Firefox 3.x
						Safari 4.x
						MSIE 6.x
						MSIE 7.x
						MSIE 8.x
						Chrome 5.x
					
	jQuery Versions:	1.4.2

	jQuery.zadenCounter is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	jQuery.zadenCounter is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with jQuery.zadenCounter.  If not, see <http://www.gnu.org/licenses/>.
	
	HISTORY
	=============
	v1.0		initial build
	v1.0.1		added crCount attribute
*/
(function($){
	$.fn.zadenCounter = function(passedOptions) {
		var defaultOptions = {
			maxChars: 200,
			warningNum: 10,
			counterDisplayID: "#counterDisplay",
			counterDisplayText: " character(s) remaining",
			warningTextColor: "#FF0000",
			defaultTextColor: "#000000",
			crCount: 1
		};
		// check for passed options to overwrite defaults
		var o = $.extend({},defaultOptions,passedOptions);
		// save a copy of the instance
		var tf = $(this);

		function updateCounter(e) {
			// check the current field value
			var currentCount = $(e).val().length;
			// if they set a different value for counting CR's, do that calc here
			if(o.crCount != 1){
				var numCR = getCR(e);
				var charsRemaining = o.maxChars - currentCount - (numCR*(o.crCount-1)); // crCount-1 = number of extra characters
			} else {
				var charsRemaining = o.maxChars - currentCount;
			}
			// if at or over max, truncate
			if (charsRemaining < 0) {
				if(o.crCount != 1){
					var newMaxChars = o.maxChars - (numCR*(o.crCount-1)); // crCount-1 = number of extra characters
					$(e).val($(e).val().substring(0,newMaxChars));
				} else {
					$(e).val($(e).val().substring(0,o.maxChars));
				}
				// update characters remaining value
				charsRemaining = 0;
			}
			// write the new value to the counter display
			$(o.counterDisplayID).text(charsRemaining + o.counterDisplayText);
			// if at or past warning level, change the text to red
			if (charsRemaining <= o.warningNum) {
				$(o.counterDisplayID).css("color",o.warningTextColor);
			} else {
				$(o.counterDisplayID).css("color",o.defaultTextColor);
			}
		} 
		function getCR(e) {
			var numCR  = new Number(0);
			var crArray = new Array();
			var myText = $(e).val().replace(/\r\n/g, "\n");
			var crRegex = /\n/gi;
			crArray = myText.match(crRegex);
			if (crArray != null) {
				numCR = crArray.length;
				if (numCR == "NaN") {
					numCR = 0;
				}
			}
			return numCR;
		}
		return this.each(function(){
			// initialize on page load
			updateCounter(tf);
			// bind to key and copy/paste events
			$(this).bind('keyup',function(event){updateCounter(tf)})
				.bind('keydown',function(event){updateCounter(tf)})
				.bind('click',function(event){updateCounter(tf)})
				.bind('blur',function(event){updateCounter(tf)})
				.bind('focus',function(event){updateCounter(tf)})
				.bind('paste',function(event){updateCounter(tf)});
		});
	}
})(jQuery);