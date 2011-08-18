// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================

App.homeViewDelegate = SC.Object.create({
    searchQuery: "",

    showPopular: function() {
        App.statechart.sendAction("showPopular");
    },

    showNearby: function() {
        App.statechart.sendAction("showNearby");
    }

});

App.navigationController = SC.Object.create({

    title: "Demogram",
    goBack:function() {
        SC.Logger.log("navigationController: Going back.");
        App.statechart.sendAction("goBack");
    },

    openSettings: function() {
        window.location.href = App.get("INSTAGRAM_AUTH_URL");
    }

});

App.userController = SC.ArrayProxy.create({
    content: null,
    loadUser: function(view) {
        var id = view.getPath("templateContext.itemView.content.id");

        SC.Logger.log("Loading User: "+id);
        if (id)
            App.statechart.sendAction("showUser", id);
    },
    loadUserRecord: function(id) {

        var query = SC.Query.remote(App.Models.User, {query:{
            endpoint: "users",
            id:id,
            qualifier: "",
            params:""
            }
        });
        this.set("content",App.store.find(query));

    }


});

App.mediaController = SC.ArrayProxy.create({
    content: [],

    loadPopular: function() {
        this.set("content",[]);
        this.set("content",App.store.find(App.Query.POPULAR));
    },

    loadNearby: function() {
        this.set("content",[]);

        var _self = this;
        SC.Logger.log("mediaController.loadNearby() called.");
        navigator.geolocation.getCurrentPosition(function(pos){
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            SC.Logger.log("mediaController.loadNearby() lat="+lat+" lng="+lng);

            var query = SC.Query.remote(App.Models.Media, {query:{
                    endpoint: "media",
                    id:"search",
                    qualifier:"",
                    params: "&lat="+lat+"&lng="+lng+"&"
                }
            });

            _self.set("content",App.store.find(query));
        });
    },

    loadUserPhotos: function(id) {
        this.set("content", []);

        var query = SC.Query.remote(App.Models.Media, {query:{
                endpoint: "users",
                id:id,
                qualifier:"media/recent",
                params: ""
            }
        });

        this.set("content",App.store.find(query));
    },

	openDetails: function(item) {
		SC.Logger.log("Opening: "+item.get("id"));
        App.statechart.sendAction("showPhotoDetails", item);
	},

	closeDetails: function() {
		var view = this.get("detailsView");
		view.destroy();
	}
});