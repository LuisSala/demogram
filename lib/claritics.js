//<script src="jquery-1.6.2.js" type="text/javascript"></script>
//document.write("<script type='text/javascript' src='jquery-1.6.2.js'></script>");
window.Claritics = (function() {


    var me = {};

// The function that actually posts the request to the given url by modifiying the json according to the required format. This is called only when the post request is made for the frst time. If the request fails, then the post request is made through the senddatabysecondworker function
me.postEventNow= function(obj){

	
	var dataArray = obj.rows;
	if (this.supports_local_storage()) {
		var lsQueue = localStorage.getItem("clariticsAPIDataJson");
		if (lsQueue) {
			var queuedRows = JSON.parse(lsQueue);
			if (queuedRows && queuedRows.length > 0) {
				dataArray = dataArray.concat(queuedRows);
				var emptyArr = [];
				localStorage.setItem("clariticsAPIDataJson",JSON.stringify(emptyArr));  // reset the array as it has been queued for sending
			}
		}
	}
	this.postEvents(dataArray);
};


me.supports_local_storage = function () {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch(e){
	    return false;
	  }
};

me.postEvents = function (rows, success_f, failure_f) {
	var final_url = this.claritics_url + "data/";
	var obj = {"rows" : rows, "authCode" : this.authcode};
	
	$.ajax({
	 	   url: final_url,
	 	   type: 'POST',
	 	   data: JSON.stringify(obj),
		    contentType: "application/json",
		    timeout: 1000, // timeout for half a second
			success: 
				function(data) {
					// do nothing, everything is good.
				
				},

			error: 
				function(xmlHttp, textStatus, errorThrown){ 
					// Move the rows into the queue for trying later
					if (supports_local_storage()) {
						var dataArray = rows;
						var lsQueue = localStorage.getItem("clariticsAPIDataJson");
						if (lsQueue) {
							var queuedRows = JSON.parse(lsQueue);
							if (queuedRows && queuedRows.length > 0) {
								if (queuedRows.length > 100) {
									queuedRows.slice(10); // reduce the size, we dont need to buffer more than 100 events
								}
								dataArray = dataArray.concat(queuedRows);
							}
						}
						localStorage.setItem("clariticsAPIDataJson",JSON.stringify(dataArray));
					}
				}			

	});	
};



// This is used when I have to send the failed data that is the data whose post request was failed some time earlier. It is almost the same as the previous function, the difference being that on success, it clears the localStorage and the dataArray and newGameArray arrays that hold the failed requests.
me.flushQueue = function (){
	json = {"rows" : new Array()};
	this.postEventNow(json);
};

// Class vars and global settings
	
	me.str = "";
	me.active = false;
	me.dataArray = new Array(); //stores the falied data requests
	//alert(dataArray);
	me.newGameArray = new Array(); //stores the failed newGame posts
	me.sessionLoad = false;
	//var claritics_url_base = "http://data2.claritics.com";
	me.claritics_url_base = "/_strobe/proxy/data2.claritics.com";

    me.claritics_url = me.claritics_url_base + "/load/"; //stores the url to be posted at
	me.authcode = "authcode";
	me.userid = "userid";
/*
	this.claritics_init = claritics_init;
	this.claritics_dest = claritics_dest;
	this.newUser=newUser;
	this.newSession=newSession;
	this.sendGift=sendGift;
	this.acceptGift=acceptGift;
	this.wallpostSent=wallpostSent;
	this.wallpostAccepted=wallpostAccepted;
	this.requestSent=requestSent;
	this.requestAccepted=requestAccepted;
	this.pageView=pageView;
	this.sellItem=sellItem;
	this.useItem=useItem;
	this.buyItem=buyItem;
	this.enterRegion=enterRegion;
	this.enterStage=enterStage;
	this.achievement=achievement;
	this.levelUp=levelUp;
	this.payment=payment;

*/
	me.numberOfItemsAdded=0;
	me.active1=true;
	me.active2=true;
	
	
	
	//CLARITICS INIT
	me.claritics_init = function (userid, authcode){
			this.userid = userid;
			this.authcode = authcode;
			this.sessionLoad = true;
	};

	//CLARITICS INIT
	me.claritics_init2 = function (userid,  authcode, claritics_url){
			this.claritics_url = claritics_url;
			this.userid = userid;
			this.authcode = authcode;
			this.sessionLoad = true;
	};
	
	me.newSession = function(session_id, player_level, age, gender, country) {
		var data = {"playerLevel" : player_level,  "Age" : age, "Gender" : gender, "Country" : country};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : this.getTimeInMillis(), "playerId" : this.userid,  "actionType" : 34, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
		
	};

	//CLARITICS DEST
	me.claritics_dest = function(){
		this.authcode = null;
		this.sessionLoad = false;
	};
	
	me.getTimeInMillis = function() {
		var d = new Date();
		return d.getTime();		
		
	};
	
	//GAME ACTION NEW PLAYER
	me.newUser = function(session_id, referrer_code, referrer_url){
		var d = new Date();
		timestamp = d.getTime();		
		var data = {"refCode" : (referrer_code + ""), "refURL" : referrer_url};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid,  "actionType" : 1, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};
	
	
	//GAME ACTION SEND GIFT
	me.sendGift = function(session_id, player_level, item_id, sent_to){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "itemId" : item_id, "sentTo" : JSON.parse(JSON.stringify((sent_to)))};
		var json=new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 2, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};
	
	//GAME ACTION ACCEPT GIFT
	me.acceptGift = function( session_id, player_level, item_id, sender_id, delay){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "itemId" : item_id, "sender" : sender_id, "delay" : delay};
		var json= new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 3, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};
	
	//GAME ACTION WALLPOSTSENT
	me.wallpostSent = function( session_id, player_level, post_type){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "postType" : (post_type + "")};
		var json=new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 4, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};
	
	//GAME ACTION WALLPOSTACCEPTED
	me.wallpostAccepted = function(session_id,  player_level, post_type, sender_id, delay){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "postType" : (post_type + ""), "sender" : sender_id, "delay" : delay};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 5, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};

	//GAME ACTION REQUESTSENT
	me.requestSent = function( session_id, player_level, request_type, target_id){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "postType" : request_type, "target" : target_id};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid,  "actionType" : 6, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};
	
	//GAME ACTION REQUESTACCEPTED
	me.requestAccepted = function( session_id, player_level, request_type, sender_id, delay){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "postType" : request_type, "sender" : sender_id, "delay" : delay};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 7, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};

	//GAME ACTION PAGEVIEW
	me.pageView = function( session_id, player_level, page_name, page_type, entry_page_flag){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "pageName" : page_name, "pageType" : page_type, "entry_flag" : entry_page_flag};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 8, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};
	
	//GAME ACTION SELLITEM
	me.sellItem = function(session_id, player_level, location_id, item_price, item_id, item_qty){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "soldFrom" : location_id, "itemPrice" : item_price, "itemId" : item_id, "itemQty" : item_qty};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 21, "sessionId" : session_id});
		json = {"rows" : json};
		//alert("Inside sellItem");
		this.postEventNow(json);
	};
	
	//GAME ACTION USEITEM
	me.useItem = function( session_id,  player_level, item_id){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "itemId" : item_id};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 22, "sessionId" : session_id});
		json = {"rows" : json};
		//alert("Inside useItem");

		this.postEventNow(json);
	};

	me.buyItem = function( session_id, player_level, location_id, currency_name, item_price, item_id, item_qty){
		var d = new Date();
		timestamp = d.getTime();
		itemPrice = new Array();
		var jsonPrice = { currency_name : item_price };
		itemPrice.push (jsonPrice)
		var data={"playerLevel" : player_level, "boughtFrom" : location_id, "itemPrice" : itemPrice, "itemId" : item_id, "itemQty" : item_qty};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 23, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};

	//GAME ACTION BUYITEM
	me.buyItem2 = function( session_id, player_level, location_id, currency_item_price_array, item_id, item_qty){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "boughtFrom" : location_id, "itemPrice" : makeJson(currency_item_price_array), "itemId" : item_id, "itemQty" : item_qty};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 23, "sessionId" : session_id});
		json = {"rows" : json};
		this.postEventNow(json);
	};
	
	//GAME ACTION ENTER_REGION
	me.enterRegion = function( session_id, player_level, region_id){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "regionId" : region_id};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 24, "sessionId" : session_id});
		json = {"rows" : json};
		//alert("Inside enterRegion");
		this.postEventNow(json);
	};

	//GAME ACTION ENTER_STAGE
	me.enterStage = function( session_id, player_level, stage_id, powerups){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "stageId" : stage_id, "powerups" : powerups};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid,  "actionType" : 25, "sessionId" : session_id});
		json = {"rows" : json};
		//alert("Inside enterStage");
		this.postEventNow(json);
	};
	
	//GAME ACTION ACHEIVEMENT
	me.achievement = function( session_id, player_level, achievement_id){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "achievementName" : achievement_id};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 26, "sessionId" : session_id});
		json = {"rows" : json};
		//alert("Inside achievement");
		this.postEventNow(json);
	};
	
	//GAME ACTION LEVELUP
	me.levelUp = function( session_id, player_level){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 26, "sessionId" : session_id});
		json = {"rows" : json};
		//alert("Inside levelUp");
		this.postEventNow(json);
	};

	//GAME ACTION PAYMENT
	 me.payment = function(session_id, player_level, payment_type, success, amount, currency_id, usd_amount, item_type, item_qty, fee_amount){
		var d = new Date();
		timestamp = d.getTime();
		var data={"playerLevel" : player_level, "paymentType" : (payment_type + ""), "success" : success, "amount" : amount, "currency" : currency_id, "usdAmount" : usd_amount, "itemType" : (item_type + ""), "itemQty" : item_qty, "feeAmount" : fee_amount};
		var json = new Array({"data" : JSON.stringify(data), "timeInMillis" : timestamp, "playerId" : this.userid, "actionType" : 26, "sessionId" : session_id});
		json = {"rows" : json};
		//alert("Inside payment");
		this.postEventNow(json);
	};
	
	me.printer = function(obj){
		for (var prop in obj){
			alert(prop + ":" + obj[prop]);
			var type = typeof obj[prop];
			if(type == "object"){
				for(var pp in obj[prop]){
					alert("Inside "+prop+" :-"+ pp +":"+obj[prop][pp]);
					var typ = typeof obj[prop][pp];
					if(typ == "object"){
						for(var p in obj[prop][pp]){
							alert("Inside "+prop+" inside "+pp+":-"+ p +":"+obj[prop][pp][p]);
						}
					}
				}
			}
		}
	};
	
	return me;
}());