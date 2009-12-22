/*
---
script: CapsLock.js

description: Set of custom events to check if the caps lock key is enabled.

license: MIT-style

authors:
- Jose Prado

requires:
  core/1.2.4: [Browser, Event, Element.Event]

provides: [CapsLock]

...
*/
(function() {

var capsOn = null,
    target = (Browser.Engine.trident) ? document : window;

/**
 * Figure out if caps lock is on by checking for a lower case letter with shift
 * pressed or an uppercase letter without shift. Once we know if it is on/off,
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
 * If user moves away from the window, we can't tell what happened with the caps
 * key when he returns so we reset the caps checker.
 */
window.addEvent('blur', function(event) {
	capsOn = null;
	target.addEvent('keypress', checkCapsKey);
});

/**
 * Checks an event for caps lock key presses. If it's Safari 3+, keyup means caps lock
 * is off and keydown means caps lock is on. Otherwise just toggle the value of capsOn.
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
	}
}

/**
 * Add events to the target to monitor for caps lock key presses and to do
 * the initial caps lock key sniffing.
 */
target.addEvents({
	'keyup': checkCapsPress,
	'keydown': checkCapsPress,
	'keypress': checkCapsKey
});

Event.implement({ hasCapsLock: function(event) { return capsOn; } });

Element.Events.capsLockOn = {
	base: 'keydown',
	condition: function(event) {
		if (event.code == 20) {
			if (Browser.Engine.webkit && Browser.Engine.version > 420) {
				return true;
			} else if (capsOn !== null) {
				return !capsOn;	
			}
		} else if (capsOn !== null) {
			return event.hasCapsLock();
		}
	}
};

Element.Events.capsLockOff = {
	base: (Browser.Engine.webkit) ? 'keyup' : 'keydown',
	condition: function(event) {
		if (event.code == 20) {
			if (Browser.Engine.webkit && Browser.Engine.version > 420) {
				return true;
			} else if (capsOn !== null) {
				if (capsOn === true) {
					return true;
				}
			}
		} else if (capsOn !== null) {
			return !event.hasCapsLock();
		}
	}
};

})();