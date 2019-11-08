// Init project
const FS = require('file-system');
let config = JSON.parse(FS.readFileSync("config.json"));
let data = JSON.parse(FS.readFileSync("data.json"));

// Discord
const Discord = require('discord.js');
const client = new Discord.Client();

client.on("ready", () => {
  console.log("StarBot started");
});

client.on("messageReactionAdd", async (reaction, user) => {
  
});

function

function extension(attachment) {
    let imageLink = attachment.split('.');
    let typeOfImage = imageLink[imageLink.length - 1];
    let image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return '';
    return attachment;
}

// Log in bot
client.login(process.env.TOKEN);

// Save
function save() {
  FS.writeFile("data.json", JSON.stringify(data));
}