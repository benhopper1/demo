var path = require('path');
var fs = require('fs');
var configData = fs.readFileSync(path.dirname(require.main.filename) + '/resume.conf', 'utf8');
configData = JSON.parse(configData);

module.exports.controller = function(app){

      app.get('/websocket/androidtest', function(req, res){
            console.log("/websocket/androidtest");
            res.render('androidtest/androidtest.jade',
                {
                	userId:req.cookies.userId,
                	deviceId:req.cookies.deviceId,
                	URL:configData.domain.address + ":" + configData.domain.port,
                	webSocketClient:configData.webSocketClient,
                    data:
                        {
                            fName:'ben',
                            lName:'hopper'

                        }
                }
            );

            

      });















    var securityGaurd = function(inReq, inRes){
        if(!(inReq.cookies.userId)){
            inRes.redirect('/login');
            return true
        }
        return false;
    }




}