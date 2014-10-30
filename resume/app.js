
//TODO: create rel-paths for libs
var express = require('./node_modules/express');
var http = require('http');
var path = require('path');
var app = express();
var fs = require('fs');

var addressToIp = function(inAddress){
	var resultIp;
	resultIp = inAddress.toLowerCase().replace('http://','');
	resultIp = resultIp.toLowerCase().replace('https://','');
	console.log('iplllll:' + resultIp);
	return resultIp;
}

//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync('resume.conf', 'utf8');
configData = JSON.parse(configData);

var basePath = path.dirname(require.main.filename);
console.log('basePath:'+basePath);


var phpExpress = require('./node_modules/php-express')({
		binPath: '/usr/bin/php'
});

var bodyParser = require('./node_modules/body-parser');

var logger = require('./node_modules/morgan');
var methodOverride = require('./node_modules/method-override');
var cookieParser = require('./node_modules/cookie-parser');
var expressSession = require('./node_modules/express-session');
var router = require('./node_modules/router')();

//TODO: --build db connection HERE--------
var Connection = require(__dirname + '/models/connection.js');
//---done statically here so connection will be prepared for future and share
var connection = Connection.getMaybeCreate(
	{
		instanceName:'arf',
		host:configData.mysqlServerConnection.host,
		user:configData.mysqlServerConnection.user,
		password:configData.mysqlServerConnection.password,
		database:configData.mysqlServerConnection.database

	}
);


// some environment variables
app.set('httpServerIp', addressToIp(configData.domain.address));
app.set('httpsServerIp', addressToIp(configData.secureDomain.address));
app.set('httpServerPort', process.env.PORT || configData.domain.port);
app.set('httpsServerPort', process.env.PORT || configData.secureDomain.port);
//app.set('port', process.env.PORT || 35001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//---------setup for PHP RENDERING---------------
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.all(/.+\.php$/, phpExpress.router);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser('server secret here'));
app.use(expressSession({secret: 'server secret cat man do', saveUninitialized: true, resave: true}));
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));


var busboy = require('./node_modules/connect-busboy');
app.use(busboy());


//---CUSTOM DATA FOR ROUTES AND JADE-------------------------
app.use(function (req, res, next){
	req.custom = 
		{
			tester:function(){
				console.log('tester worked!!');
				return 77;
			},
			tester2:function(){
				console.log('tester worked!!');
				return 77;
			},
			basePath:path.dirname(require.main.filename),
			imageFolderPath:path.dirname(require.main.filename) + '/public/images',
			audioFolderPath:path.dirname(require.main.filename) + '/public/audio'

		}
	next();
});



var RequestModel = require(__dirname + '/models/requestmodel.js');
var requestModel = new RequestModel();

var userData = {};
app.all('*', function(req, res, next){
	userData.requestUrl = req.url;
	userData.agent = req.headers['user-agent'];
	userData.referrer = req.headers['referrer'];
	userData.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('userData:');
	console.dir(userData);

	requestModel.logData(userData);
	next();
});


//----------dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file){
	if(file.substr(-3) == '.js'){
		console.log(file);
		route = require('./controllers/' + file);
		route.controller(app);
	}
});

//----H T T P   S E R V E R -----------------------
http.createServer(app).listen(app.get('httpServerPort'),app.get('httpServerIp'), function(){
	console.log('Express server listening on ip:port ' + app.get('httpServerIp') + ':' + app.get('httpServerPort'));
});



//-------S E C U R E   H T T P S   S E R V E R---------------------------------
var https = require('https');
var fs = require('fs');

var options = {
	key: fs.readFileSync('./node_modules/key.pem'),
	cert: fs.readFileSync('./node_modules/cert.pem')
};

console.log('https server ip:port  ' + app.get('httpsServerPort') + '/' + app.get('httpsServerIp'));
https.createServer(options, app).listen(app.get('httpsServerPort'),app.get('httpsServerIp'));
