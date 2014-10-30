var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/resume.conf', 'utf8');
configData = JSON.parse(configData);
var basePath = path.dirname(require.main.filename);

module.exports.controller = function(app){

	app.get('/demo', function(req, res){
		console.log("/resume");
		res.render('demo/demo.jade',
			{
				userId:req.cookies.userId,
				deviceId:"815",//req.cookies.deviceId,
				URL:configData.domain.address + ":" + configData.domain.port,
				webSocketClient:configData.webSocketClient,
				data:
					{
					}
			}
		);

	});


	app.get('/androidSetup', function(req, res){
		console.log("/androidSetup");
		res.render('demo/androidsetup.jade',
			{
				data:
					{
					}
			}
		);
	});



	app.get('/video', function(req, res){
		console.log("/video");
		res.render('video/demosample.jade',
			{
				data:
					{
					}
			}
		);
	});


	app.get('/menu', function(req, res){
		console.log("/menu");
		res.render('demo/menu.php',
			{
				data:
					{
					}
			}

		);
	});

	app.get('/instruction', function(req, res){
		console.log("/menu");
		res.render('demo/instruction.jade',
			{
				data:
					{
					}
			}

		);

	});



	app.get('/widget_memberPanel', function(req, res){
		console.log("/widget_memberPanel");
		res.render('memberpanel/widget_memberpanel.jade',
		{
				members:
					[
						{
							name:'Beverly Smith2'
						},
						
						{
							name:'Dirty Joe'
						},

						{
							name:'Dark Lisa'
						}
					]
			});


	});


	app.post('/widget_memberPanel', function(req, res){
		console.log("/widget_memberPanel");
		res.render('memberpanel/widget_memberpanel.jade',req.body);
	});

	app.post('/widget_activeAndroidConnects', function(req, res){
		console.log("/menu");
		console.dir(req.body.devices);
		res.render('demo/widget_activeandroidconnects.jade',req.body);
	});

	app.get('/noConnection', function(req, res){
		console.log("/noConnection");
		res.render('demo/noconnection.jade',
			{
				data:
					{
					}
			}

		);
	});

}