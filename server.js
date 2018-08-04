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
console.log("Loaded JSON:");
console.log(info);

var orgMsg = "";
var orgName = "";

//Discord
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on("ready", () => {
  console.log("Bot started");
});

bot.on("message", (message) => {
  let msg = message.content;
  
  //Commands
  if (msg.substring(0, 1)=="!"){
    let str = msg.substring(1, msg.length);
    let args = str.split(' ');
    let cmd = args[0];
    args.splice(0, 1);
    
    //Commands
    switch (cmd){
      case "hi":
        message.channel.send("hi");
      break;
    }
  }
  //Other
  else if (message.author.id != "465945834517823488"){
    let channel = message.channel.name;
    
    //crazy-talk
    if (channel=="crazy-talk"){
      let timesToReplace = 1 + Math.floor(Math.random()*2);
      let words = msg.split(' ');
      let newMsg;

      for(let i=0; i<timesToReplace; i++){
        //Replace a word with a random word
        let indexToReplace = Math.floor(Math.random()*words.length);

        words[indexToReplace] = randomWords();
      }

      //To string
      newMsg = words.join(' ');

      //Add name
      newMsg = "**" + message.author.username + "**: " + newMsg;

      //Send
      message.channel.send(newMsg);

      //Delete
      message.delete(0);
    }
    //guess-what
    else if (channel=="guess-what"){
      let timesToReplace = 1 + Math.floor(Math.random()*2);
      let words = msg.split(' ');
      let newMsg;

      for(let i=0; i<timesToReplace; i++){
        //Replace a word with a random word
        let indexToReplace = Math.floor(Math.random()*words.length);

        words[indexToReplace] = randomWords();
      }

      //To string
      newMsg = words.join(' ');

      //Name
      let name = "**" + message.author.username + "**";

      //Send
      //Entering first message
      if (orgMsg==""){
        orgMsg = msg;
        orgName = message.author.username;
        
        message.channel.send(name + ": " + newMsg);
        message.channel.send("One or two words have been replaced. Guess what they originally said!");
      }
      //Guessing
      else{
        //Correct
        if (msg.toLowerCase() == orgMsg.toLowerCase()){
          message.channel.send(name + ", that's right! You win.");
          orgMsg = "";
          orgName = "";
          message.channel.send("Now someone say something so that I can mess it up!");
        }
        else{
          
        }
      }

      //Delete
      message.delete(0);
    }
  }
  
  //Other
  //if (msg=="lol") message.channel.send("loool");
});

bot.login(process.env.TOKEN);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

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
  FS.writeFile("info.json", info);
}