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

app.post('/https?://*', function (req, res) {
    if (req.get('Content-Type') == 'application/json' && !!req.body) {
        var url = req.url.substr(1);
        var host = require('url').parse(url).hostname;
        var blacklist = ['127.0.0.1', 'localhost', req.hostname];
        if (host != null && blacklist.indexOf(host) == -1) {
            var options = {
                url: url,
                method: 'POST',
                headers: {
                    'Content-Length': req.body.length,
                    'Content-Type': 'application/json'
                },
                body: req.body
            };

            request(options, function (error, response, body) {
                if (error) {
                    return res.status(418).send('I\'m a teapot');
                } else {
                    return res.status(response.statusCode).send(body);
                }
            });
        } else {
            return res.status(403).send('Url is not valid');
        }
    } else {
        return res.status(400).send('Access not allowed');
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