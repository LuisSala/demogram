require('sproutcore');
require('sproutcore-datastore');

var CONFIG = require('./config');
var INFO = require('demogram/~package');

window.App = SC.Application.create({
    NAME:    INFO.name,
    VERSION: INFO.version,
    store: SC.Store.create({commitRecordsAutomatically: YES}).from('App.MediaDataSource'),

    CACHE_TTL_MS: 60000,
    CACHE_PERMANENT_TTL_MS: 2592000000, // 30 days

    INSTAGRAM_CLIENT_ID: CONFIG.INSTAGRAM_CLIENT_ID,
    INSTAGRAM_API_INSTAGRAM_API_BASE_URL: "https://api.instagram.com/v1/",
    INSTAGRAM_AUTH_URL: null,
    INSTAGRAM_ACCESS_TOKEN: null,
    INSTAGRAM_AUTH_STRING: "client_id="+CONFIG.INSTAGRAM_CLIENT_ID,
    USE_OPTIMIZED_IMAGES: CONFIG.USE_OPTIMIZED_IMAGES,

    init:function() {
        this._super();
        var url = window.location.href;
        var hash = window.location.hash;

        if (hash) {
            url = window.location.href.substring(0, url.indexOf("#"));
        }
        this.set("INSTAGRAM_AUTH_STRING", "client_id="+this.get("INSTAGRAM_CLIENT_ID")),
        this.set("INSTAGRAM_AUTH_URL","http://instagram.com/oauth/authorize/?client_id="+this.get("INSTAGRAM_CLIENT_ID")+"&redirect_uri="+url+"&response_type=token&scope=comments+relationships+likes");

        this.set("twitter", Strobe.Social("twitter"));

        if (hash && hash.indexOf("access_token")) {
            this.set("INSTAGRAM_ACCESS_TOKEN",hash.substring(14));
            SC.Logger.log("App.init(): User Authenticated access_token="+this.get("INSTAGRAM_ACCESS_TOKEN"));
            this.set("INSTAGRAM_AUTH_STRING", "access_token="+this.get("INSTAGRAM_ACCESS_TOKEN"));
        }
    }

});