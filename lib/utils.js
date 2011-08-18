App.HistorySupport = SC.Object.extend({
    goBack: function(){
                this.gotoState(this.get("statechart").popHistory());
    }
});

App.cache = SC.Object.create({
    init: function() {
        this._super();

        setInterval("App.cache.cleanup()", 30000);
    },

    read: function(key) {
        var data = $.jStorage.get(key);
        var now =  new Date().getTime();
        if (data && (now < data.expirationTime)) {
            SC.Logger.log("App.cache.read() Cache Hit "+key);
            return data.value;
        } else if (data) {
            SC.Logger.log("App.cache.read() Stale Key "+key);
            this.remove(key);
            return false;
        }
        SC.Logger.log("App.cache.read() Cache Miss "+key);
        return false;
    },

    write: function(key, value) {
        SC.Logger.log("App.cache.write() key="+key);
        var data = {};
        data.expirationTime= new Date().getTime()+App.CACHE_TTL_MS;
        data.value = value;
        $.jStorage.set(key, data);
    },

    readPermanent:function(key) {
        SC.Logger.log("App.cache.readPermanent() key="+key);
        $.jStorage.get(key);
    },

    writePermanent: function(key, value) {
        SC.Logger.log("App.cache.writePermanent() key="+key);

        var data = {};
        data.expirationTime= new Date().getTime()+App.CACHE_PERMANENT_TTL_MS;
        data.value = value;
        $.jStorage.set(key, data);
    },

    remove: function(key) {
        $.jStorage.deleteKey(key)
    },

    cleanup:function() {
        SC.Logger.log("App.cache.cleanup() Started");
        var idx = $.jStorage.index();

        for (var i=0; i < idx.length; i++) {
            this.read(idx[i]);
        }
    }
});