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

        var auth_string=App.get("INSTAGRAM_AUTH_STRING");

        var q = query.get("query");
        var endpoint = q.endpoint;
        var id = q.id;
        var qualifier = q.qualifier;
        var params = q.params;

        var jsonpCallback="callback=?";

        var url = App.INSTAGRAM_API_INSTAGRAM_API_BASE_URL+endpoint+"/"+ id+ "/"+ qualifier +"?"+auth_string+"&"+jsonpCallback+params;

        if (query.get("recordType") === App.Models.Media) {
            this.fetchRecords(store, query, url);
        } else if (query.get("recordType") === App.Models.User) {
            this.fetchRecord(store,query, url)
        }
        return YES; // return YES if you handled the query
    },

    fetchRecords: function(store, query, url){
        SC.Logger.log("fetchRecords - Fetching content at: "+ url);

        var data = App.cache.read(url);

        if (data) {
            SC.Logger.log("fetchRecords() Cache Hit: "+url);
            var items = data.data;

            var storeKeys = store.loadRecords(query.get("recordType"), items);

            // This is required for remote queries but not local.
            store.loadQueryResults(query, storeKeys);

            store.dataSourceDidFetchQuery(query);
        } else {
            $.getJSON(url,"", function(data, textStatus, jqXHR){

                var status = data.meta.code;

                SC.Logger.log("fetchMedia Result Code: " + status);
                if (status == '200') {
                    App.cache.write(url, data);

                    var items = data.data;

                    var storeKeys = store.loadRecords(query.get("recordType"), items);

                    // This is required for remote queries but not local.
                    store.loadQueryResults(query, storeKeys);

                    store.dataSourceDidFetchQuery(query);
                } else {
                    store.dataSourceDidErrorQuery(query)
                }
            }); // end getJSON
        } // end if-else
    }, // end fetchRecords()

    fetchRecord: function(store, query, url){
        SC.Logger.log("fetchRecord - Fetching content at: "+ url);

        var data = App.cache.read(url);

        if (data) {
            SC.Logger.log("fetchRecord() Cache Hit: "+url);
            var item = data.data;

            var storeKey = store.loadRecord(query.get("recordType"), item);

            // This is required for remote queries but not local.
            store.loadQueryResults(query, [storeKey]);

            store.dataSourceDidFetchQuery(query);
        } else {
            $.getJSON(url,"", function(data, textStatus, jqXHR){
                var status = data.meta.code;

                SC.Logger.log("fetchMedia Result Code: " + status);
                if (status == '200') {

                    App.cache.write(url, data);

                    var item = data.data;

                    var storeKey = store.loadRecord(query.get("recordType"), item);

                    // This is required for remote queries but not local.
                    store.loadQueryResults(query, [storeKey]);

                    store.dataSourceDidFetchQuery(query);
                } else {
                    store.dataSourceDidErrorQuery(query)
                }
            }); // end getJSON
        } // end if-else
    } // end fetchRecord()
});