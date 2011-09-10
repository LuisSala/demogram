// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================
require ('sproutcore-statechart');
require ('./claritics');

// TODO Consolidate most controller functions to the statechart.
// TODO Related to above. Change history implementation to push/pop a more complete "context".

App.statechart =  SC.Statechart.create({
    trace: true,

    history: [],

    rootState: SC.State.extend({

        initialSubstate: SC.HistoryState.extend({
            defaultState: "showingHomeView"
        }),

        _navigationView: null,
        enterState: function(){

            App.uid = App.cookies.getCookie("dg_uid"); // Random but unique user ID.
            App.sid = App.cookies.getCookie("dg_sid"); // Random session id.

            if (!App.uid) {
                App.uid = Math.abs(App.hashTools.hash(App.hashTools.randomGuid()));
            }

            if (!App.sid) {
                App.sid = Math.abs(App.hashTools.hash(App.hashTools.randomGuid()));
            }

            App.cookies.setCookie("dg_uid", App.uid, 365);

            App.analytics = Claritics;
            console.log("Initializing Claritics UID="+App.uid);
            App.analytics.claritics_init(App.uid, App.ANALYTICS_API_KEY);
            console.log("Starting New Claritics Session "+App.sid);
            App.analytics.newSession(App.sid, 0,"M","US");

            App.mediaController.loadPopular();
            if (!this._navigationView) {
                this._navigationView = App.NavigationView.create();
            }

            this._navigationView.append();
        },

        exitState:function(){

        },

        // STATE: showingHomeView
        showingHomeView: SC.State.extend({
            _homeView: null,

            enterState: function() {
                console.log("Triggering pageView");
                App.analytics.pageView(App.sid, 0, "home", 0, 0);

                if (this._homeView == null) {
                    this._homeView = App.MainView.create();
                }

                this._homeView.append();
            },

            exitState: function(){
                this._homeView.remove();
            },

            showPopular: function() {
                this.get("statechart").pushHistory(this);
                this.gotoState('showingPopular');
            },

            showNearby: function() {
                this.get("statechart").pushHistory(this);
                this.gotoState('showingNearby');
            }
        }), // end state: showingHomeView

        //STATE: showingPopular
        showingPopular: SC.State.extend({

            _photoGrid: null,

            enterState: function() {
                App.analytics.pageView(App.sid, 0, "popular", 0, 0);

                if (!this._photoGrid) {
                    this._photoGrid = App.PhotoGridView.create();
                }
                App.mediaController.loadPopular();
                this._photoGrid.append();
            },

            exitState: function(){
                this._photoGrid.destroy();
                this._photoGrid = null;
            },

            goBack: function(){
                this.gotoState(this.get("statechart").popHistory());
            },

            showPhotoDetails: function(item) {
                this.get("statechart").pushHistory(this);
                this.gotoState("showingPhotoDetails", item);
            }
        }), // end state: showingPhotoGrid
        //STATE: showingPopular
        showingNearby: SC.State.extend({

            _photoGrid: null,

            enterState: function() {
                App.analytics.pageView(App.sid, 0, "nearby", 0, 0);

                if (!this._photoGrid) {
                    this._photoGrid = App.PhotoGridView.create();
                }
                App.mediaController.loadNearby();
                this._photoGrid.append();
            },

            exitState: function(){
                this._photoGrid.destroy();
                this._photoGrid = null;
            },

            goBack: function(){
                this.gotoState(this.get("statechart").popHistory());
            },

            showPhotoDetails: function(item) {
                this.get("statechart").pushHistory(this);
                this.gotoState("showingPhotoDetails", item);
            }
        }), // end state: showingPhotoGrid

        //STATE: showingPhotoDetails
        showingPhotoDetails: SC.State.extend({

            _detailsView: null,

            enterState: function(item) {
                App.analytics.pageView(App.sid, 0, "details", 0, 0);

                if (!this._detailsView) {
                    this._detailsView = App.MediaDetailsView.create();
                }
                if (item) {
                    this._detailsView.set("content", item);
                }
                this._detailsView.append();
            },

            exitState: function(){
                this._detailsView.remove();
            },

            goBack: function(){
                this.gotoState(this.get("statechart").popHistory());
            },

            showUser: function(id){
                this.get("statechart").pushHistory(this);
                this.gotoState("showingUser",id);

            }
        }), // end state: showingPhotoDetails

        //STATE: showingUser
        showingUser: SC.State.extend({

            _userView: null,

            enterState: function(id) {
                App.analytics.pageView(App.sid, 0, "user", 0, id);

                if (!this._userView) {
                    this._userView = App.UserView.create();
                }

                if (id) {
                    this.set("id", id);
                } else {
                    id = this.get("id");
                }
                App.userController.loadUserRecord(id);
                App.mediaController.loadUserPhotos(id);
                this._userView.append();
            },

            exitState: function(){
                this._userView.remove();
            },

            goBack: function(){
                this.gotoState(this.get("statechart").popHistory());
            },

            showPhotoDetails: function(item) {
                this.get("statechart").pushHistory(this);
                this.gotoState("showingPhotoDetails", item);
            }
        })
    }), // end state: rootState

    pushHistory: function(state) {
        this.get("history").push(state);
    },

    popHistory: function() {
        return this.get("history").pop();
    }
}); // end App.statechart