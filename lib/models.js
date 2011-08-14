// ==========================================================================
// Project:   DemoGram
// Copyright: ©2011 Strobe, Inc. All rights reserved.
// ==========================================================================
App.Models = {};

App.Models.User = SC.Record.extend({
    primaryKey: 'id',
    username: SC.Record.attr(String),
    profile_picture: SC.Record.attr(String),
    full_name: SC.Record.attr(String)
});

App.Models.Image = SC.Record.extend({
    url: SC.Record.attr(String),
    width: SC.Record.attr(Number),
    height: SC.Record.attr(Number)
});

App.Models.ImageCollection = SC.Record.extend({
    standard_resolution: SC.Record.toOne('App.Models.Image', {nested: true}),
	low_resolution: SC.Record.toOne('App.Models.Image', {nested: true}),
    thumbnail: SC.Record.toOne('App.Models.Image', {nested: true})
});

// An individual comment. Individual Likes, Captions and Comments have an identical
// JSON data structure in the Instagram API.
App.Models.Comment = SC.Record.extend({
    primaryKey: 'id',
    text: SC.Record.attr(String),
    from: SC.Record.toOne('App.Models.User', {nested: true}),
    createDateTime: function() {
        return SC.DateTime.create(this.get("created_time"));
    }.property("created_time").cacheable()
});

// Likes and Comments are nested structures. Individual comments are contained
// in the 'data' array.
App.Models.CommentCollection = SC.Record.extend({
    count: SC.Record.attr(Number),
    data:  SC.Record.toMany('App.Models.Comment', {nested: true})
});

App.Models.LikesCollection = SC.Record.extend({
    count: SC.Record.attr(Number),
    data:  SC.Record.toMany('App.Models.User', {nested: true})
});

App.Models.Tag = SC.Record.extend({
    media_count: SC.Record.attr(Number),
    name: SC.Record.attr(String)
});

App.Models.Media = SC.Record.extend({
    primaryKey: 'id',
    user: SC.Record.toOne('App.Models.User', {nested: true}),
    images: SC.Record.toOne('App.Models.ImageCollection', {nested: true}),
    caption: SC.Record.toOne('App.Models.Comment', {nested: true}),
    comments: SC.Record.toOne('App.Models.CommentCollection', {nested: true}),
    likes: SC.Record.toOne('App.Models.LikesCollection', {nested: true}),
    tags: SC.Record.attr(Array),
    createDateTime: function() {
        return SC.DateTime.create(this.get("created_time"));
    }.property("created_time").cacheable()

}); // end MediaRecord