// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================
require ('sproutcore-statechart');

App.statechart =  SC.Statechart.create({
    trace: true,

    history: [],

    rootState: SC.State.extend({

        initialSubstate: SC.HistoryState.extend({
            defaultState: "showingHomeView"
        }),

        _navigationView: null,
        enterState: function(){
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