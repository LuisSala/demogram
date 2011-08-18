// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================

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
	classNames: ["photo-details"]
});

App.UserButton = SC.Button.extend({

});

App.TagButton = SC.Button.extend({
});

App.UserView = SC.View.extend({
    templateName: "user-details",
    classNames: ["user-details"]
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


App.PinchableView = SC.View.extend({
  scale: 1,

  translate: {
    x: 0,
    y: 0
  },

  pinchChange: function(recognizer, scale) {
    this.scale = scale;
    this._applyTransforms();
  },

  panChange: function(recognizer, translation) {
    this.translate = translation;
    this._applyTransforms();
  },

  _applyTransforms: function() {
    var string = 'translate3d('+this.translate.x+'px,'+this.translate.y+'px,0)';
        string += ' scale3d('+this.scale+','+this.scale+',1)';

    this.$().css('-webkit-transform',string);
  }
});