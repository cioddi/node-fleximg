var fleximg = require('./lib/fleximg');
var express = require('express');

var app = express();
server = require('http').createServer(app);

server.listen(4444);

app.use(fleximg());
app.use("/", express.static(__dirname + '/img'));