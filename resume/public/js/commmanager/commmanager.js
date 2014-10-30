/*
*USE LIKE:
*var commManager = commManagerNameSpace.getCommManagerInstance();
*put this in file that this inclusion exist...
*
*/

console.log('CommManagerNameSpace loading');


var CommManagerNameSpace = function(){

	var commManagerInstance;
	this.getCommManagerInstance = function(inData){
		if(!(commManagerInstance)){
			commManagerInstance = new CommManager(inData);
			globalFilters = new GlobalFilters(commManagerInstance, inData);
		}
		return commManagerInstance;
	}


	var GlobalFilters = function(inCommManagerInstance, inInstanceData){
		var filterObj = new inCommManagerInstance.FilterObject();
		filterObj.add('advise', function(inMsg, inLocal, inData, inRefObj){
			if(inData){
				if(inData.dataLayer.deviceType == 'androidApp'){

					if(inData.dataLayer.action == 'login'){
						if(inInstanceData.onFamilyDeviceConnect){
							inInstanceData.onFamilyDeviceConnect(inMsg, inLocal, inData, inRefObj);
						}
					}

					if(inData.dataLayer.action == 'logout'){
						if(inInstanceData.onFamilyDeviceDisconnect){
							inInstanceData.onFamilyDeviceDisconnect(inMsg, inLocal, inData, inRefObj);
						}
					}
				}
			}

		});
	}


	//##########################################################################
	//C o m m M a n g e r
	//##########################################################################
	var CommManager = function(inData){
		var _this = this;
		var filterSets = [];
		var filterIndex = 0;

		var filterSetHashOfArray;

		var connectedDevices = {};
		var connectedDeviceId = getDeviceId();

		var webSocketClient;

		//##--CALLBACK FUNCTIONS--
		var function_onMessageReceive;
		var function_onConnect;

		this.getFamilyDevicesCredentials = function(inPostFunction){
			var transportLayer = new TransportLayer();
				transportLayer
					.userId(getUserId())
					.deviceId(getDeviceId())
					.securityToken('$ecurity4')
				;
				transportLayer.routingLayer()
					.type('transactionToServer')
					.add('command', 'returnAllCredentialsForUser')
				;
				transportLayer.dataLayer()
					.add('dataTest55key', '55Value')

			_this.sendTransaction(transportLayer, function(inTransportLayer){
				if(inPostFunction){
					inPostFunction(inTransportLayer.toJson().dataLayer.credentialsPackage);
				}
			});
		}

		this.login = function(inData){
			var transportLayer = new TransportLayer();
			transportLayer
				.userId(getUserId())
				.deviceId(getDeviceId())
				.securityToken('$ecurity4')
				.transactionId(false)
			;
			transportLayer.routingLayer()
				.type('setupToServer')
			;
			transportLayer.dataLayer()
				.add('userName', inData.userName)
				.add('password', inData.password)
				.add('deviceNumber', 'devNumber$rr')
				.add('userAgent', 'userAgent$$')
				.add('deviceType', 'desktopBrowser')
			;

			webSocketClient.sendString(transportLayer.toString());
		}

		$.getScript("/js/commmanager/transportlayer.js", function(ignored, inStatusText){
			console.log('Loading ---------> transportlayer');
			console.log('transportlayer :' + inStatusText);

			//#######################################################################################
			//
			//----WebSocketClient  ---------------A R E A
			//
			//#######################################################################################

			$.getScript("/js/commmanager/websocketclient.js", function(ignored, inStatusText){
				console.log('Loading ---------> webSocketClient');
				console.log('webSocketClient :' + inStatusText);
				webSocketClient = new WebSocketClient(inData.webSocketClient.address, inData.webSocketClient.port, inData.webSocketClient.connectString);

				//#################################################
				//EVENT -> onError                  WebSocketClient
				//#################################################
				webSocketClient.setOnError(function(data){
					console.log("onError:"+JSON.stringify(data));
					console.log('####################--WebSocketClient--##############################################');
					console.log('------> C O N N E C T I O N   F A I L E D , check host(ip, is launched etc...)<------');
					console.log('#####################################################################################');
				});


				//#################################################
				//EVENT -> onOpen                   WebSocketClient
				//#################################################
				webSocketClient.setOnOpen(function(data){
					console.log("onOpen:"+JSON.stringify(data));
					if(inData.onReady){inData.onReady();}
					if(function_onConnect){function_onConnect(data);}

				});

				//#################################################
				//EVENT -> onMessage                WebSocketClient
				//#################################################
				webSocketClient.setOnMessage(function(data){
					console.log('webSocketClient.setOnMessage!!');
					console.dir(data);
					processMessages(data);
					if(inData.onMessage){inData.onMessage(data);}
				});

				//#################################################
				//EVENT -> OnLoginSuccess           WebSocketClient
				//#################################################
				webSocketClient.setOnLoginSuccess(inData.onLoginSuccess);

				//#################################################
				//EVENT -> OnLoginFailure          WebSocketClient
				//#################################################
				webSocketClient.setOnLoginFailure(inData.onLoginFailure);

				webSocketClient.open('Browser Device');

			});//websocketclient end--
		});//transportlayer end--


		this.getFilterSets = function(){
			return filterSets;
		}

		this.removeFilterSet = function(inFilterSetId){	
			var theBigHash = filterSetHashOfArray.getHash();
			for(key in theBigHash){
				var arrayForThatKey = filterSetHashOfArray.getArrayFromHash(key);
				for(index in arrayForThatKey){
					if(arrayForThatKey[index].id == inFilterSetId){
						console.log('removeing filter:' + arrayForThatKey[index].id);
						filterSetHashOfArray.removeItemFromSpecificHash(key, arrayForThatKey[index]);
					}
				}
			}
		}

		this.addFilterSet = function(inFilterSet){
			if(!(filterSetHashOfArray)){
				filterSetHashOfArray = new HashOfArrayObject(true);
			}
			console.log('FilterSet.addFilterSet:'+JSON.stringify(inFilterSet));
			inFilterSet.id = filterIndex++;
			filterSetHashOfArray.add(inFilterSet.filter[0].filterKey, inFilterSet);

			return inFilterSet.id;
		} 

		var processMessages = function(inMsg){
			var TL_fromServer = new TransportLayer();
			TL_fromServer.fromServerBuild(inMsg);

			if(TL_fromServer.toJson().routingLayer){
				if(TL_fromServer.toJson().routingLayer.type == 'tokenToTokenUseFilter'){
					if(TL_fromServer.toJson().routingLayer.filterKey == 'filter' && TL_fromServer.toJson().routingLayer.filterValue){
						var arrayForThatKey = filterSetHashOfArray.getArrayFromHash(TL_fromServer.toJson().routingLayer.filterValue);
						for(filterEntry in arrayForThatKey){
							arrayForThatKey[filterEntry].execute(_this, arrayForThatKey[filterEntry].filter[0], TL_fromServer.toJson(), '');
						}
					}
					return;
				}

				if(TL_fromServer.toJson().routingLayer.type == 'transactionToClient'){
					var transactionId = TL_fromServer.toJson().transactionId;
					var postFunction = transactionHash[TL_fromServer.toJson().transactionId];
					if(postFunction){
						postFunction(TL_fromServer);
						delete transactionHash[TL_fromServer.toJson().transactionId];
					}
					return;
				}
			}
		}

		this.set_callback_onConnect = function(inFunction){
			function_onConnect = inFunction;
		}

		this.set_callback_onMessageReceive = function(inFunction){
			function_onMessageReceive = inFunction;
		}

		this.send = function(inMessage){
			webSocketClient.send(inMessage);
		}

		this.sendString = function(inString){
			webSocketClient.sendString(inString);
		}

		var transactionHash = {};
		this.sendTransaction = function(inTransportLayer, inPostFunction){
			var uuid = new Date().getTime();
			inTransportLayer.transactionId(uuid);
			console.log('sending transaction' + uuid);
			transactionHash[uuid] = inPostFunction;
			_this.sendString(inTransportLayer.toString());
		}
//------------ F I L T E R   O B  J E C T  -------------------------------------------------------------

		this.FilterObject = function(inData){
			var _this = this;
			var commManager = commManagerNameSpace.getCommManagerInstance();
			var filterIdHash = {};

			// store filters passed in constructor...instance only, allows cleanup 
			if(inData){
				for(index in inData){
					var thisFilterId = commManager.addFilterSet(inData[index]);
					filterIdHash[thisFilterId] = thisFilterId;
				}
			}

			this.addFilter = function(inFilter){
				var thisFilterId = commManager.addFilterSet(inFilter);
				filterIdHash[thisFilterId] = thisFilterId;
				return thisFilterId;
			}

			this.removeFilter = function(inFilterId){
				delete filterIdHash[inFilterId];
			}

			//remove all filters for this instance
			this.destroy = function(){
				for(index in filterIdHash){
					commManager.removeFilterSet(filterIdHash[index]);
				}
			}

			this.test = function(){
				console.log('testtttt1111112222233333');
			}

			this.add = function(inFilterKey, inFunction){
				var filterId = _this.addFilter(
					{
						'filter':
							[
								{
									'filterKey' : inFilterKey
								}
							],

						'execute' : inFunction
					}
				);
				return filterId;
			}
		}

		var connectedDeviceTokenId;
		this.setConnectedDeviceTokenId = function(inDeviceTokenId){
			connectedDeviceTokenId = inDeviceTokenId;
		}
		this.getConnectedDeviceTokenId = function(){return connectedDeviceTokenId;}

		this.sendCommand = function(toDeviceTokenId, inCommand, inCommandData){
			var transportLayer = new TransportLayer();
			transportLayer
				.userId(getUserId())
				.deviceId(getDeviceId())
				.securityToken('$ecurity4')
				.transactionId(false)
			;
			transportLayer.routingLayer()
				.type('tokenToTokenUseFilter')
				.add('toDeviceTokenId', toDeviceTokenId)
				.add('filterKey', 'filter')
				.add('filterValue', inCommand)
			;
			transportLayer.dataLayer()
				.buildFromJson(inCommandData)
			;

			webSocketClient.sendString(transportLayer.toString());
		}



	}


	var HashOfArrayObject = function(inAllowDuplicates){
		var _this = this;
		var hash = {};
		var allowDuplicates = inAllowDuplicates;



		this.add = function(inKey, inValue){
			inKey = inKey.toString();
			if(!(hash[inKey])){
				hash[inKey] = [];
			}
			if(allowDuplicates){
				hash[inKey].push(inValue);
			}else{
				if(hash[inKey].indexOf(inValue) == -1){
					hash[inKey].push(inValue);
				}
			}
			
		}

		this.removeItemFromSpecificHash = function(inKey, inValue){
			inKey = inKey.toString();
			var attemptValue = hash[inKey];
			if(!(attemptValue)){
				return false;
			}
			var arrayOfValues = attemptValue;
			for(var i = 0; i < arrayOfValues.length; i++){
				if(arrayOfValues[i] == inValue){
				   delete arrayOfValues[i];
				   hash[inKey] = arrayOfValues.filter(function(e){return e});
				   return true;
				}
			}
			return false;        
		}

		this.removeItemFromAnyHash = function(inValue){
			var retBool = false;        
			for(hashKey in hash){        
				var arrayOfValues = hash[hashKey];
				for(var i = 0; i < arrayOfValues.length; i++){
					if(arrayOfValues[i] == inValue){
					   delete arrayOfValues[i];
					   hash[hashKey] = arrayOfValues.filter(function(e){return e});
					   retBool = true;
					}
				}
			}
			return retBool;
		};

		this.removeArrayFromHash = function(inKey){
			inKey = inKey.toString();
			var attemptValue = hash[inKey];
			if(!(attemptValue)){
				return false;
			}
			delete hash[inKey];
		}

		this.copy = function(inSourceKey, inTargetKey){
			var inSourceKey = inSourceKey.toString();
			var inTargetKey = inTargetKey.toString();

			if(!(inSourceKey in hash)){
				return false;
			}

			if(!(inTargetKey in hash)){
				hash[inTargetKey] = [];
			}

			//copy
			var arrayFromSource = hash[inSourceKey];
			var arrayFromTarget = hash[inTargetKey];
			for(var i = 0; i < arrayFromSource.length; i++){
				arrayFromTarget.push(arrayFromSource[i]);
			}
		}

		this.dump = function(inHead){
			for(hashKey in hash){        
				var arrayOfValues = hash[hashKey];
				for(var i = 0; i < arrayOfValues.length; i++){
					if(inHead){                    
						console.log(inHead+"->"+hashKey+"[" + i + "]:"+JSON.stringify(hash[hashKey][i]));
					}else{
						console.log(hashKey+"[" + i + "]:"+JSON.stringify(hash[hashKey][i]));
					}
					
				}
			}
		}



		this.getArrayFromHash = function(inKey){
			inKey = inKey.toString();
			var attemptValue = hash[inKey];
			if(!(attemptValue)){
				return false;
			}

			return attemptValue;
		}

		this.getItemFromArray = function(inKey, inIndex){
			if(!(inKey in hash)){
				return false;
			}

			var arrayOfItems = hash[inKey];
			if(inIndex < arrayOfItems.length){
				return arrayOfItems[inIndex];
			}
			return false;  

		}

		this.getLengthOfArray = function(inKey){
			if(!(inKey in hash)){
				return false;
			}
			return hash[inKey].length;
		}

		this.getHash = function(){
			return hash;
		}


	}

};



if(typeof commManagerNameSpace == 'undefined' || !(commManagerNameSpace)){
	commManagerNameSpace = new CommManagerNameSpace();
}


