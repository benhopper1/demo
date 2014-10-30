console.log('loading-->----------------------->--  D e v i c e    T o k e n   C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var uuid = require(basePath + '/node_modules/node-uuid');


//------------------>--COMMUNICATION--<-------------
var Controller = function(router){



	router.onSuccessfulLogin(function(inWss, inWs, inData, setupTransportLayer){
		console.log('router.onSuccessfulLogin (data):');
		//console.dir(inWs);
		var deviceTokenId;

		for(key in inWss.connectedClientHistoryData){
			if(inData.toJson().routingLayer.usingDeviceId == inWss.connectedClientHistoryData[key].deviceId){
				//existing id match!!!!! use the key
				deviceTokenId = key;
			}
		}

		if(!(deviceTokenId)){
			deviceTokenId = uuid.v1();
		}
		inWs.deviceTokenId = deviceTokenId;
		inWss.connectedClientHistoryData[deviceTokenId] = 
			{
				deviceId:inData.toJson().routingLayer.usingDeviceId,
				ws:inWs
			}
		;

		//console.log('dump of connectedClientHistoryData ---------------------------------');
		//console.dir(inWss.connectedClientHistoryData);
		inWs.lastDeviceId;
		inWs.lastTokenDeviceId;

		//add device to user   ,,, one to many---
		inWss.userHashArrayOfDeviceTokenId.add(inWs.userId, inWs.deviceTokenId);
		console.log('dump of userHashArrayOfDeviceTokenId');
		inWss.userHashArrayOfDeviceTokenId.dump();

		//build advise package......
		var transportLayer = new TransportLayer();
		transportLayer.toClientBuild(inWs.userId, 'na', inWs.securityToken, false);
		transportLayer.addRoutingLayer(
			{
				type:'tokenToTokenUseFilter',
				filterKey:'filter',
				filterValue:'advise',
				fromDeviceTokenId:inWs.deviceTokenId
			}
		);

		transportLayer.addDataLayer(
			{
				deviceNumber:inWs.deviceNumber,
				deviceType:inWs.deviceType,
				userAgent:inWs.userAgent,
				action:'login'
			}
		);
		console.log('before familyBroadcast');
		console.dir(transportLayer.toJson());
		router.familyBroadcast(inWss, inWs, inWs.userId, transportLayer);


	});



	router.onDisconnect(function(inWss, inWs){
		//remove from connected devices for specific user
		delete inWss.connectedDeviceHash[inWs.deviceId];
		inWss.userHashArrayOfDeviceTokenId.removeItemFromSpecificHash(inWs.userId, inWs.deviceTokenId);
	
		//advise of disconnect-----------
		var transportLayer = new TransportLayer();
		transportLayer.toClientBuild(inWs.userId, 'na', inWs.securityToken, false);
		transportLayer.addRoutingLayer(
			{
				type:'tokenToTokenUseFilter',
				filterKey:'filter',
				filterValue:'advise',
				fromDeviceTokenId:inWs.deviceTokenId
			}
		);

		transportLayer.addDataLayer(
			{
				deviceNumber:inWs.deviceNumber,
				deviceType:inWs.deviceType,
				userAgent:inWs.userAgent,
				action:'logout'
			}
		);
		console.log('before familyBroadcast');
		console.dir(transportLayer.toJson());
		router.familyBroadcast(inWss, inWs, inWs.userId, transportLayer);
	});







	router.type('tokenToTokenUseFilter', function(inWss, inWs, inTransportLayer){
		console.log('tokenToTokenUseFilter in router routs!!!!!');
		if(inTransportLayer.toJson().routingLayer.toDeviceTokenId){
			var toWs = (inWss.connectedClientHistoryData[inTransportLayer.toJson().routingLayer.toDeviceTokenId]).ws;
			inTransportLayer.toJson().deviceId = 0;
			inTransportLayer.toJson().routingLayer.fromDeviceTokenId = inWs.deviceTokenId;
			inTransportLayer.toJson().routingLayer.fromUserId = inWs.userId;
			toWs.send(inTransportLayer.toString());
		}
	});
}


module.exports = Controller;