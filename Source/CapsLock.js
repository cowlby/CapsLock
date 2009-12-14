/*
---

script: CapsLock.js

description: Set of custom events to check if the caps lock key is enabled.

license: MIT-style license.

requires:
  core/1.2.4: [Event, Element.Event]

provides: [Event.hasCapsLock, capsLockOn, capsLockOff]

...
*/
(function() {

var capsOn = null,
    target = (Browser.Engine.trident) ? document : window;

/**
 * Figure out if caps lock is on by going through the permutations of lower/upper
 * case letters with shift key pressed or not pressed. Once we know if it is on/off,
 * remove the event listener.
 */
function checkCapsKey(event) {
	if (event.code > 64 && event.code < 91) { // Capital Letters
		capsOn = (event.shift) ? null : true;
	} else if (event.code > 96 && event.code < 123) { // Lower-case Letters
		capsOn = (event.shift) ? true : false;
	}
	
	if (capsOn !== null) {
		target.removeEvent('keypress', checkCapsKey);
	}
}

/**
 * Handle the caps lock key presses. If it's Safari 3+, keyup means caps lock is
 * off and keydown means caps lock is on. Otherwise just toggle the value of capsOn.
 */
function checkCapsPress(event) {
	if (event.code == 20 && capsOn !== null) {
		if (Browser.Engine.webkit && Browser.Engine.version > 420) {
			capsOn = (event.event.type == 'keydown');
		} else {
			if (event.event.type == 'keydown') {
				capsOn = !capsOn;
			}
		}
		
		if (capsOn) {
			window.fireEvent('capsLockOn');
			document.fireEvent('capsLockOn');
		} else {
			window.fireEvent('capsLockOff');
			document.fireEvent('capsLockOff');
		}
	}
}

/**
 * Re-attaches the event listener to check if caps lock is on/off. Used when user
 * moves away from the window since we have no way of checking what he does with the
 * caps key at that point.
 */
function resetCapsKey(event) {
	capsOn = null;
	target.addEvent('keypress', checkCapsKey);
}

target.addEvents({
	'keyup': checkCapsPress,
	'keydown': checkCapsPress,
	'keypress': checkCapsKey
});
window.addEvent('blur', resetCapsKey);

Event.implement({
	hasCapsLock: function(event) {
		return capsOn;
	}
});

Element.Events.capsLockOn = {
	base: 'keydown',
	condition: function(event) {
		return capsOn;
	}
}

Element.Events.capsLockOff = {
	base: 'keydown',
	condition: function(event) {
		return !capsOn;
	}
}

})();