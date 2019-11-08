// Init project
const FS = require('file-system');
let info = JSON.parse(FS.readFileSync("info.json"));

// Discord
const Discord = require('discord.js');
const Client = new Discord.Client();

Client.on("ready", () => {
  console.log("StarBot started");
});




// Log in bot
Client.login(process.env.TOKEN);

// Save
function save() {
  FS.writeFile("info.json", JSON.stringify(info));
}