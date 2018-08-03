// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var randomWords = require('random-words');

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
  
  //Other
  //if (msg=="lol") message.channel.send("loool");
});

bot.login(process.env.TOKEN);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Dreams (dream TEXT)');
    console.log('New table Dreams created!');
    
    // insert default dreams
    db.serialize(function() {
      db.run('INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")');
    });
  }
  else {
    console.log('Database "Dreams" ready to go!');
    db.each('SELECT * from Dreams', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getDreams', function(request, response) {
  db.all('SELECT * from Dreams', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
