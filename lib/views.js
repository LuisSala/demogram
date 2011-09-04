// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================

App.Pinchable = {
  scale: 1,
  translateZ: 0,
  translate: { x: 0, y: 0 },

  touchStart: function(evt) {
    this.$().css('z-index',10);
    this._super();
  },

  touchEnd: function(evt) {
    this._super();
  },

  pinchStart: function(recognizer) {
    console.log("pinchstart" + this.toString());
    console.log(this.$()[0].style.cssText);
  },

  pinchChange: function(recognizer) {
    this.$().css('scale',function(index, value) {
      return recognizer.get('scale') * value
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

  panEnd: function() {
    this._resetTransforms();
  },
  _resetTransforms: function() {
    var self = this;

    this.$().animate({
      scale: 1,
      translateX: 0,
      translateY: 0
    }, 300, function() { self.$().css('z-index',1); })
  }

};

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
    classNames:"photo-grid",
    panOptions: {
        numberOfRequiredTouches: 1
    },
    panChange: function(recognizer) {
        var val = recognizer.get('translation');

        this.$().css({
          //translateX: '%@=%@'.fmt((val.x < 0)? '-' : '+',Math.abs(val.x)),
          translateY: '%@=%@'.fmt((val.y < 0)? '-' : '+',Math.abs(val.y))
        });
    }

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

//SC.mixin(App.MediaItemView, App.Pinchable);

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