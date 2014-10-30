console.log('loading-->----------------------->--  F a m i l y   C o n t r o l l e r  --<-----------------------');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');

//------------------>--COMMUNICATION--<-------------
var Controller = function(router){

	router.familyBroadcast = function(inWss, inWs, inUserId, inTransportLayer){
		console.log('familyBroadcast executing');

		//inTransportLayer.toJson().type = inTransportLayer.toJson().routingLayer.fromDeviceTokenId = inWs.deviceTokenId;
		var familyTokenArray = inWss.userHashArrayOfDeviceTokenId.getArrayFromHash(inTransportLayer.toJson().userId);
		for(index in familyTokenArray){
			//familyTokenArray[index].send(inTransportLayer.toString());
			console.log('--------->-- Broadcasting ------to :');
			console.log((inWss.connectedClientHistoryData[familyTokenArray[index]]).deviceId);
			console.dir(inTransportLayer.toString());
			(inWss.connectedClientHistoryData[familyTokenArray[index]]).ws.send(inTransportLayer.toString());
		}
	}


	router.type('transactionToServer', function(inWss, inWs, inTransportLayer){
		console.log('+_+_+_+_transactionToServer' + inTransportLayer.toJson().userId);
		console.dir(inWs);
		if(inTransportLayer.toJson().routingLayer.command == 'returnAllCredentialsForUser'){
			console.log('commandForServer in router routs{{command == returnAllCredentialsForUser}}');
			var familyTokenArray = inWss.userHashArrayOfDeviceTokenId.getArrayFromHash(inWs.userId);
			var credentialsPackage = [];
			for(index in familyTokenArray){
				console.log('credentialAdd:' + index);;
				var currentDeviceWs = (inWss.connectedClientHistoryData[familyTokenArray[index]]).ws
				var credentialPackage = 
					{
						deviceId:currentDeviceWs.deviceId,
						deviceNumber:currentDeviceWs.deviceNumber,
						userAgent:currentDeviceWs.userAgent,
						deviceType:currentDeviceWs.deviceType,
						deviceTokenId:currentDeviceWs.deviceTokenId
					};
				credentialsPackage.push(credentialPackage);
			}
			
			var TL_replyForClient = inTransportLayer.getTransportLayerOnly();
			TL_replyForClient.addRoutingLayer(
				{
					type:'transactionToClient',
					command:'credentialResults'
				}
			);

			TL_replyForClient.addDataLayer(
				{
					credentialsPackage:credentialsPackage
				}
			);
			inWs.send(TL_replyForClient.toString());
		}

	});




}


module.exports = Controller;