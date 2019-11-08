// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var FS = require('file-system');

var info = JSON.parse(FS.readFileSync("info.json"));

//Discord
const Discord = require('discord.js');
const Client = new Discord.Client();

Client.on("ready", () => {
  console.log("Bot started");
});



Client.login(process.env.TOKEN);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//Save
function save() {
  FS.writeFile("info.json", JSON.stringify(info));
}