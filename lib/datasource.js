// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================
App.Query = {};

App.Query.POPULAR = SC.Query.remote(App.Models.Media, {query: {
        endpoint: "media",
        id: "popular",
        qualifier: "",
        params:""
    }
}); // end App.Query.Popular

App.Query.RECENT_TAG = SC.Query.remote(App.Models.Media, {query:{
        endpoint: "tags",
        id:"",
        qualifier: "media/recent",
        params:""
    }
});

App.Query.USER_SEARCH = SC.Query.remote(App.Models.User, {query:{
        endpoint: "users/search",
        id:"",
        qualifier: "",
        params:""
    }
});

App.Query.TAG_SEARCH = SC.Query.remote(App.Models.Tag, {query:{
        endpoint: "users/search",
        id:"",
        qualifier: "",
        params:""
    }
});

App.Query.NEARBY = SC.Query.remote(App.Models.Media, {query:{
        endpoint: "media",
        id:"search",
        qualifier:"",
        params: ""
    }
});

App.MediaDataSource = SC.DataSource.extend(
/** @scope App.MediaDataSource.prototype */ {

    fetch: function(store, query) {

        var auth_token="client_id="+App.INSTAGRAM_CLIENT_ID;

        var q = query.get("query");
        var endpoint = q.endpoint;
        var id = q.id;
        var qualifier = q.qualifier;
        var params = q.params;

        var jsonpCallback="callback=?";

        var url = App.INSTAGRAM_API_INSTAGRAM_API_BASE_URL+endpoint+"/"+ id+ "/"+ qualifier +"?"+auth_token+"&"+jsonpCallback+params;

        this.fetchMedia(store, query, url);
        return YES; // return YES if you handled the query
    },

    fetchMedia: function(store, query, url){
        SC.Logger.log("fetchMedia - Fetching content at: "+ url);

        $.getJSON(url,"",function(data, textStatus, jqXHR){
            var status = data.meta.code;

            SC.Logger.log("fetchMedia Result Code: " + status);
            if (status == '200') {

                var items = data.data;

                var storeKeys = store.loadRecords(query.get("recordType"), items);

                // This is required for remote queries but not local.
                store.loadQueryResults(query, storeKeys);

                store.dataSourceDidFetchQuery(query);
            } else {
                store.dataSourceDidErrorQuery(query)
            }
        });
    }
});