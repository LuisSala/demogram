App.HistorySupport = SC.Object.extend({
    goBack: function(){
                this.gotoState(this.get("statechart").popHistory());
    }
});

App.cookies = SC.Object.create({
    setCookie: function (c_name,value,exdays) {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
    },
    getCookie: function(c_name) {
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++) {
          x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
          y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
          x=x.replace(/^\s+|\s+$/g,"");
          if (x==c_name) {
            return unescape(y);
          }
        }
    }
});

App.hashTools = SC.Object.create({

    hash: function (str) {
        var hash = 0;
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },

    randomGuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
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