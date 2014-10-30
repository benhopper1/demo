var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/resume.conf', 'utf8');
configData = JSON.parse(configData);

module.exports.controller = function(app){

	app.get('/welcome', function(req, res){
		console.log("/welcome");
		res.render('welcome/welcome.jade',
			{

			}
		);
	});
}