CapsLock
--------

CapsLock gives you a couple of new events which you can use to check if the caps lock key is turned on. It works by first sniffing the state of the caps lock key based on the output of key presses. Once the state is established, it switches to check only presses of the caps lock key which toggle the state. This gives CapsLock an advantage over many of the caps lock checkers out there since feedback can be provided to the user as soon as the caps lock key is pressed, not after their input which is a limit of keycode sniffers.

![Screenshot](http://pradador.com/images/mootools/capslock.screenshot.jpg)


How to Use
==========

There are two ways to use the plugin. First off, every Event object will have a hasCapsLock method which returns the status of the caps lock key. True means caps lock is on, false means caps lock is off, and null means CapsLock can't determine the status safely yet.

	#JS
	document.id('myTextInput').addEvent('keydown', function(event) {
		if (event.hasCapsLock()) {
			// Warn the user that caps lock is turned on.
		}
	});
	
The second way is by using the new Element events created by CapsLock: capsLockOn and capsLockOff. You can attach listeners to any element and these will fire when the caps lock is enabled/disabled. Use them in pairs to show/hide notifications about the state of the caps lock key.

	#HTML
	<input type="password" id="password" />
	<div id="capsWarn"></div>
	
	#JS
	function warnCapsOn() { document.id('capsWarn').set('text', 'Caps lock key is on.'); }
	function removeWarn() { document.id('capsWarn').set('text', ''); }
	
	document.id('password').addEvents({
		capsLockOn: warnCapsOn,
		capsLockOff: removeWarn
	});
	
	// For this type of functionality, you should also add blur/focus events like this:
	document.id('password').addEvents({
		blur: removeWarn,
		focus: function(event) {
			if (event.hasCapsLock()) { warnCapsOn(); }
		}
	});
	

Known Issues
============

Since CapsLock has to first sniff the state of the caps lock key, there can be a delay between user input being able to provide feedback via the events. Specifically, until there is a keypress event where the user types in a lowercase letter with shift pressed down or they type in an uppercase letter without shift, these events won't fire.

Additionally, if the user un-focuses the window and comes back, we have no way of knowing if the caps lock state was changed during that time so CapsLock resets its state when this happens to ensure no false positives so a re-sniffing will be done.

In practice though, users will type in their username or other data first which will establish the state of the caps lock before moving on to the password field where these events are most useful. This means there will be no discernible delay on the user's side and will allow you to provide accurate visual feedback.