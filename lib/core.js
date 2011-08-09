require('sproutcore');

var INFO = require('demogram/~package');

window.App = SC.Application.create({
    NAME:    INFO.name,
    VERSION: INFO.version,
    store: SC.Store.create({commitRecordsAutomatically: YES}).from('App.MediaDataSource')

  //store: SC.Store.create().from(SC.Record.fixtures)
});

App.INSTAGRAM_CLIENT_ID="74cd2b3572294d88917c0e180a5c2526";
App.INSTAGRAM_API_VERSION="v1";
App.INSTAGRAM_API_INSTAGRAM_API_BASE_URL="https://api.instagram.com/"+App.INSTAGRAM_API_VERSION+"/";