// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================

App.mediaController = SC.ArrayProxy.create({
    content: [],
    comments: [],

    loadPopular: function() {
        this.set("content",App.store.find(App.Query.POPULAR));
    },

	openDetails: function(item) {
		SC.Logger.log("Opening: "+item.get("id"));

		var view = App.MediaDetailsView.create({
			content: item
		});

		this.set("comments", item.getPath("comments.data"));

		view.append();

		this.set("detailsView", view);
	},

	closeDetails: function() {
		var view = this.get("detailsView");
		view.destroy();
	}
});