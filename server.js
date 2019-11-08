// Init project
const FS = require('file-system');
let config = JSON.parse(FS.readFileSync("config.json"));
let data = JSON.parse(FS.readFileSync("data.json"));

// Discord
const Discord = require('discord.js');
const client = new Discord.Client({"partials" : ['CHANNEL', 'MESSAGE']});

// Global
const starterEmbed = new Discord.MessageEmbed()
  .setColor(config.defaultColour)
  .setTitle('Welcome to the starboard!')
  .setDescription(`You can react to any message with the ⭐ emoji, and once it has ${config.minimumStars} stars it will be added to the board! ⭐:sunglasses:

  [source code](https://glitch.com/~leo-starboard-bot)`);

client.on("ready", () => {
  console.log("StarBot started");
});

client.on("messageReactionAdd", async (reaction, user) => {
  console.log("add reaction");
  if (reaction.message.partial) await reaction.message.fetch();
  checkReaction(reaction, user, +1);
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  checkReaction(reaction, user, -1);
})


client.on("guildCreate", guild => {
    let starboard = guild.channels.find(channel => channel.name === config.starboardChannel);   
    starboard.send(starterEmbed);
});

client.on("message", message => {
    let starboard = message.guild.channels.find(channel => channel.name === config.starboardChannel);   
    if (message.content == "start") {
      console.log("start");
      starboard.send(starterEmbed);
    }
});

// Checks the reaction and responds accordingly
async function checkReaction(reaction, user, starAmount) {
  
  let message = reaction.message;
  let image = message.attachments.size > 0 ? await extension(message.attachments.array()[0].url) : '';
  
  // Reaction isn't a star
  if (reaction.emoji.name !== '⭐') return;
  
  // Message is from a bot
  if (message.author.bot)
    return message.channel.send(`${user} you can't star messages from bots.`);
  // Message is empty
  if (image === '' && message.cleanContent.length < 1)
    return message.channel.send(`${user} you can't star an empty message.`);
  
  let starboard = message.guild.channels.find(channel => channel.name === config.starboardChannel);
  let fetchedMessages = await starboard.messages.fetch({ limit: 100 });
  let starboardMessage;
  try {
    starboardMessage = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
  } catch(err) {
    starboardMessage = false;
    console.log(err);
  }
  
  if (starboardMessage) {
  // Old message
    console.log("old message");
    console.log(starboardMessage.description);
    let starCount = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(starboardMessage.embeds[0].footer.text);
    let embed = starboardMessage.embeds[0];
    let newStarCount = parseInt(starCount[1]) + starAmount;
    console.log("count: " + newStarCount);
    
    // Remove from starboard if under minimum stars
    if (newStarCount < config.minimumStars) {
      console.log("delete message");
      return starboardMessage.delete(1500);
    }
    
    // Create embed message
    let newEmbed = new Discord.MessageEmbed()
      .setColor(embed.color)
      .setDescription(embed.description)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`⭐ ${parseInt(starCount[1]) + starAmount} | ${message.id}`);
    
    if (image)
      newEmbed.setImage(image);
    
    let starMsg = await starboard.messages.fetch(starboardMessage.id);
    await starMsg.edit({ embed:newEmbed });   
  } else {
  // New message
    console.log("new message");
    let starCount = message.reactions.get(reaction.emoji.name).count;
    //if (message.reactions.get(reaction.emoji.name).users.has(message.author.id)) starCount--;
    
    // Add to starboard if over minimum stars
    if (starCount >= config.minimumStars) {
      
      // Create embed message
      let newEmbed = new Discord.MessageEmbed()
        .setColor(config.defaultColour)
        .setDescription(message.cleanContent)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp(new Date())
        .setFooter(`⭐ ${starCount} | ${message.id}`);
      
      if (image)
        newEmbed.setImage(image);

      await starboard.send({ embed:newEmbed });
    }    
  }
}

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