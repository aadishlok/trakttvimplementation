var express = require('express');
var bodyParser= require('body-parser');

var app= express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/node_modules'));

var bc= require('./private/app');
bc(app);

var port= process.env.PORT || 3000;
app.listen(port, "localhost", function () {
    console.log(new Date().toISOString()+" server started on "+port);
    console.log('DIR: '+__dirname);
});

