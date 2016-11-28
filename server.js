var express = require('express');
var request = require('request');
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
    if (req.get('Content-Type') == 'application/json' && !!req.body) {
        var url = req.url.substr(1);
        var host = require('url').parse(url).hostname;
        if (host != null && host != req.hostname) {
            var options = {
                url: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: req.body
            };

            request(options, function (error, response, body) {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    return res.status(response.statusCode).send(body);
                }
            });
        } else {
            return res.status(401).send('Url is not valid');
        }
    } else {
        return res.status(403).send('Access not allowed');
    }
});

app.use(express.static(__dirname + '/static'));

app.use(function (req, res, next) {
    res.status(404).send('What are you looking for?');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port, ipaddress, function () {
    console.log('Setwebhook listening at %s:%s', ipaddress, port);
});