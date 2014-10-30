

var Controller = function(router){

	router.type('deviceToDeviceUseFilter', function(inWss, inWs, inTransportLayer){
		console.log('deviceToDeviceUseFilter in router routs!!!!!');
	});

	router.type('deviceToDeviceUseFilter2', function(inWss, inWs, inTransportLayer){
		console.log('deviceToDeviceUseFilter22 in router routs!!!!!');
	});

		router.type('deviceToDeviceUseFilter2', function(inWss, inWs, inTransportLayer){
		console.log('deviceToDeviceUseFilter23 in router routs!!!!!');
	});
};

module.exports = Controller;