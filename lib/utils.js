App.HistorySupport = SC.Object.extend({
    goBack: function(){
                this.gotoState(this.get("statechart").popHistory());
    }
});