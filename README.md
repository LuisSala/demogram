# DemoGram

### Description:

Full-featured Instagram client built with SproutCore 2.0 and the Browser Package Manager (BPM) tools.

A simplified client can be found at: http://github.com/luissala/demogram-basic

### Features / Problems:
Touch gesture support on iOS.

* Tap an image to view details.
* Pinch and pan to zoon on the image in the details view.

### Requirements:

BPM - http://getbpm.org or http://sproutcutter.heroku.com

	$ gem install bpm

Strobe - http://home.strobeapp.com

    $ gem install strobe

### Configure:

Obtain a Client ID from http://instagram.com/developer then copy lib/config.sample.js to config.js and edit config.js to insert your Client ID.

	CONFIG.INSTAGRAM_CLIENT_ID="CLIENT ID GOES HERE"

### Run:	
This app makes use of the Strobe proxy and Strobe Social Addon.

From your project directory run:
	
	$ strobe preview
	
Open http://localhost:9292 in your browser.
