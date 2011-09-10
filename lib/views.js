// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================

var animationDuration = 200;
var easing = "easeOutExpo";

jQuery.extend( jQuery.easing,
{
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	}
});

App.MainView = SC.View.extend({
  templateName: "home",

  classNames: ["home"]

});


App.NavigationView = SC.View.extend({
    templateName: "navigation",
    classNames: ["nav", "shadow"],
    controller: App.navigationController
});


App.PhotoGridView = SC.View.extend({
    templateName: "photo-grid",
    classNames:"photo-grid"
});


App.MediaItemView = SC.View.extend({

	click: function() {
		return this.tapEnd();
	},
	tapEnd: function() {
		SC.Logger.log("Tap/Click Detected: "+ this.getPath("content.id"));
		App.mediaController.openDetails(this.get("content"));
		return true;
	}

});


App.MediaDetailsView = SC.View.extend({
	templateName: "photo-details",
	classNames: ["photo-details"],
    content: null
});

App.UserButton = SC.Button.extend({
    userId: null
});

App.TagButton = SC.Button.extend({});

App.UserView = SC.View.extend({
    templateName: "user-details",
    classNames: ["user-details"]
}),

App.TweetDialog = SC.View.extend({
    templateName: "tweet-dialog"
}),

App.CloseDetailsButton = SC.View.extend({
	classNames: ["app-button"],
	click: function(){
        return this.tapEnd();
    },
	tapEnd: function() {
		App.mediaController.closeDetails();
	}
});


App.Pinchable = SC.Mixin.create({
  scale: 1,

  position: {},

  translate: {
    x: 0,
    y: 0
  },

  touchStart: function(evt) {
    this.$().css('z-index',1500);
    this.position = this.$().position();
    this.position.width = this.$().width();
    this.position.height = this.$().height();
  },
  pinchChange: function(recognizer) {
    var jq = this.$();
    var newScale = recognizer.get('scale');
    var curScale = jq.css('scale');

    var boundedScale = Math.max(1,Math.min(1.8, curScale * newScale));

    this.$().css('scale',function(index, value) {
      return newScale * boundedScale;
    });
  },

  pinchEnd: function(recognizer) {

    this._resetTransforms();
  },

  panOptions: {
    numberOfRequiredTouches: 2
  },

  panChange: function(recognizer) {
    var val = recognizer.get('translation');

    this.$().css({
      translateX: '%@=%@'.fmt((val.x < 0)? '-' : '+',Math.abs(val.x)),
      translateY: '%@=%@'.fmt((val.y < 0)? '-' : '+',Math.abs(val.y))
    });
  },
   _resetTransforms: function(accepted) {
    var self = this;
    var position = this.position;
    this.set('isZoomedIn',false);

    this.$().animate({
      scale: 1,
      translateX: 0,
      translateY: 0,
      top: position.top,
      left: position.left,
      width: position.width,
      height: position.height
    }, animationDuration, easing, function() {
      self.$().css('z-index',10);
    });
  }
});

App.PinchableView = SC.View.extend({
    //TODO Mixin App.Pinchable once the bugs are worked out.
});