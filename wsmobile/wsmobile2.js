var path = require('path');
var basePath = path.dirname(require.main.filename);
var ConnectionsObject = require(basePath + '/models/connectionsmodel.js');
var connectionsObject = new ConnectionsObject();
var TransportLayer = require(basePath + '/libs/transportlayer.js');
var fs = require('fs');


console.log('ws Mobile Service........loading');
var theUrl = require('url');
console.log("theUrl:"+theUrl.href);


//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync('wsmobile.conf', 'utf8');
configData = JSON.parse(configData);


var Connection = require(__dirname + '/models/connection.js');
//---done statically here so connection will be prepared for future and share
var connection = Connection.getMaybeCreate(
	{
		instanceName:'arf',
		host:configData.mysqlServerConnection.hostIp,
		user:configData.mysqlServerConnection.user,
		password:configData.mysqlServerConnection.password,
		database:configData.mysqlServerConnection.databaseName
	}
);



//{port: 30300}
var WebSocketServer = require(basePath + '/node_modules/ws').Server
  , wss = new WebSocketServer(
	{
		host:configData.webSocketServer.address,
		port: configData.webSocketServer.port
	}
);

console.log('WebSocketServer on ip:port ' + configData.webSocketServer.address + ':' + configData.webSocketServer.port);





wss.connectedDeviceHash = {};

wss.connectedClientHistoryData = {};

var HashOfArrayObject = require(__dirname + '/libs/hashofarrayobject.js');
wss.userHashArrayOfDeviceTokenId = new HashOfArrayObject(false);



var CommunicationRouter = require(basePath + '/node_modules/communicationrouter/communicationrouter.js');
var communicationRouter = new CommunicationRouter();
console.log('path:' + __dirname + '/controllers');
communicationRouter.loadAllFilesInFolderAsControllers(__dirname + '/controllers');




wss.on('connection', function(ws){
	communicationRouter.reportOnConnect(wss, ws);
	ws['isConnected'] = false;
	console.log('onConnection -evt-');
	console.log('info:');

	ws.on('close', function() {
		communicationRouter.reportOnDisconnect(wss, ws);
	});

	ws.on('message', function(message){
		console.log('onMessage');
		console.dir(message);
		transportLayer = new TransportLayer();
		transportLayer.fromClientBuild(message);
		var transportLayer_json = transportLayer.toJson();
		console.dir(transportLayer_json.routingLayer);

		communicationRouter.reportOnRoute(wss, ws, transportLayer);







		//client not connected and not sending login details is rejected with routing type...
		if(!(ws.isConnected) && !(transportLayer_json.routingLayer.type == 'setupToServer')){
			TL_fromClient_notConnected = new TransportLayer();
			TL_fromClient_notConnected.fromClientBuild(message);
			var fromClient_notConnected_json = TL_fromClient_notConnected.toJson();


			var TL_requestForClient = new TransportLayer();
			TL_requestForClient.toClientBuild(fromClient_notConnected_json.userId, fromClient_notConnected_json.deviceId, fromClient_notConnected_json.securityToken, fromClient_notConnected_json.transactionId);
			TL_requestForClient.addRoutingLayer(
				{
					type:'requestClientCredentials'
				}
			);
			
			ws.send(TL_requestForClient.toString());
			return;
		}
	});




});
