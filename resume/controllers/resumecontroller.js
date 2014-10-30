var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/resume.conf', 'utf8');
configData = JSON.parse(configData);

//---put as iniload for demo speed....
/*var resumeData = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/resume_001.json', 'utf8');
resumeData = JSON.parse(resumeData);*/

module.exports.controller = function(app){

	app.get('/resume', function(req, res){
		console.log("/resume");

		var resumeData = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/resume_001.json', 'utf8');
		resumeData = JSON.parse(resumeData);

		res.render('resume/resume.jade',
			{
				resumeData:resumeData
			}
		);
	});



	app.get('/resume2', function(req, res){
		console.log("/resume2");

		var resumeData = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/resume_001.json', 'utf8');
		resumeData = JSON.parse(resumeData);

		res.render('resume/resume2.jade',
			{
				resumeData:resumeData
			}
		);
	});

	app.get('/currentResume', function(req, res){
		console.log("/resume2");

		var resumeData = fs.readFileSync(path.dirname(require.main.filename) + '/public/json/resume_001.json', 'utf8');
		resumeData = JSON.parse(resumeData);

		res.render('resume/currentresume.jade',
			{
				resumeData:resumeData
			}
		);
	});


};