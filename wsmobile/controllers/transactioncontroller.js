//transactionToServer

console.log('loading-->----------------------->--  T r a n s a c t i o n   C o n t r o l l e r  --<-----------------------');
var fs = require('fs');
var path = require('path');
var basePath = path.dirname(require.main.filename);
var TransportLayer = require(basePath + '/libs/transportlayer.js');


//------------------>--COMMUNICATION--<-------------
var Controller = function(router){

	// fake for testing only------like access to model
	router.type('transactionToServer', function(inWss, inWs, inTransportLayer){
		console.log('transactionToServer in router routs!!!!!');
		if(inTransportLayer.toJson().routingLayer.command == 'getResumeJson'){
			//boomerange of BS--
			var resumeData = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/resume_001.json', 'utf8');
			resumeData = JSON.parse(resumeData);

			var transactionTransportLayer = inTransportLayer.getTransportLayerOnly();
			transactionTransportLayer.addRoutingLayer(
				{
					type:'transactionToClient'
				}
			);
			transactionTransportLayer.addDataLayer(
				{
					resumeData:resumeData
				}
			);

			inWs.send(transactionTransportLayer.toString());
		}
	});




// not finished-----
	router.type('transactionToToken', function(inWss, inWs, inTransportLayer){
		console.log('transactionToToken in router routs!!!!!');

/*		var toWs = (inWss.connectedClientHistoryData[inTransportLayer.toJson().routingLayer.toDeviceTokenId]).ws;
		inTransportLayer.toJson().deviceId = 0;
		inTransportLayer.toJson().routingLayer.fromDeviceTokenId = inWs.deviceTokenId;
		inTransportLayer.toJson().routingLayer.fromUserId = inWs.userId;
		toWs.send(inTransportLayer.toString());*/

	});


}

module.exports = Controller;