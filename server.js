var express = require('express');
var app = express();

app.use (function(req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

app.post('/http://*', function (req, res) {
    var responText;
    var responCode;
    if (req.get('Content-Type') == 'application/json' && !!req.body) {
        var url = require('url').parse(req.url.substr(1));
        if (url.hostname != null && url.hostname != req.hostname) {
            var options = {
                host: url.hostname,
                port: url.port || 80,
                path: url.path,
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            };
            var request = require('http').request(options);
            request.write(req.body);
            request.end();

            responCode = 200;
            responText = 'Forwarded';
        } else {
            responCode = 401;
            responText = 'Url is not valid';
        }
    } else {
        responCode = 403;
        responText = 'Access not allowed';
    }

    res.status(responCode).send(responText);
});

app.use(express.static(__dirname + '/static'));

app.use(function (req, res, next) {
    res.status(404).send('What are you looking for?');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port, ipaddress);