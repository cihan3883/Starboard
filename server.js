// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var randomWords = require('random-words');
var FS = require('file-system');

var info = JSON.parse(FS.readFileSync("info.json"));

//Discord
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on("ready", () => {
  console.log("Bot started");
});

bot.on("message", (message) => {
  let msg = message.content;
  
  //Commands
  if (msg.substring(0, 1)=="!"){ //Command prefix, like !command
    let str = msg.substring(1, msg.length);
    let args = str.split(' ');
    let cmd = args[0];
    args.splice(0, 1);
    
    //Commands
    switch (cmd){ //Commands here
      case "hi": //Example of a simple command. Use !hi and it says "hi"
        message.channel.send("hi");
      break;
    }
  }
  //Message replies
  else if (message.author.id != "465945834517823488"){ //Replace this number with your bot's user ID
    let channel = message.channel.name; //Channel name
    
    if (msg=="hello bot"){ //If someone says "hello bot",
      message.channel.send("hello hooman"); //say "hello hooman"
    }
  }
});

bot.login(process.env.TOKEN);

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
function save(){
  FS.writeFile("info.json", JSON.stringify(info));
}

//Choose a random item from an array
function choose(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}