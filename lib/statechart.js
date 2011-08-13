// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================
require ('sproutcore-statechart');

App.statechart =  SC.Statechart.create({
    trace: true,
    rootState: SC.State.extend({

        _mainView: null,

        enterState: function() {
            if (this._mainView == null) {
                this._mainView = App.MainView.create();
            }

            this._mainView.append();
        },

        exitState: function(){
            this._mainView.remove();
        },

        showPhotoGrid: function() {
            this.gotoState("showingPhotoGrid");
        }

    }),

    showingPhotoGrid: SC.State.extend({
        enterState: function() {
            App.PhotoGridView.create().append();
        },

        exitState: function(){

        }

    })
});