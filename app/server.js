var express = require('express');
var path = require('path');
var app = express();

app.get('/', function(req, res){
    res.sendFile('index.html', {root: path.join(__dirname, '/')})
});

app.get(/^(.+)$/, function(req, res){
    res.sendFile(req.params[0], {root: path.join(__dirname, '/')})
})

app.listen(8080, function(){
    console.log("Listening at port 8080")
});