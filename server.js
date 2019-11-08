// Init project
const FS = require('file-system');
let config = JSON.parse(FS.readFileSync("config.json"));
let data = JSON.parse(FS.readFileSync("data.json"));

// Discord
const Discord = require('discord.js');
const Client = new Discord.Client();

Client.on("ready", () => {
  console.log("StarBot started");
});


Client.on("messageReactionAdd", async (reaction, user) => {
  let message = reaction.message;
  let image = message.attachments.size > 0 ? await this.extension(message.attachments.array()[0].url) : '';
  
  // Reaction isn't a star
  if (reaction.emoji.name !== '⭐') return;
  // Message is your own
  if (message.author.id === user.id)
    return message.channel.send(`${user}, you can't star your own messages.`);
  // Message is from a bot
  if (message.author.bot)
    return message.channel.send(`${user}, you can't star bot messages.`);
  // Message is empty
  if (image === '' && message.cleanContent.length < 1)
    return message.channel.send(`${user}, you cannot star an empty message.`);
  
  let starboard = message.guild.channels.find(channel => channel.name === config.starboardChannel);
  let fetchedMessages = await starboard.fetchMessages({ limit: 100 });
  let starboardMessage = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
  
  console.log("channel: " + starboard);
  starboard.send("star");
  
  if (starboardMessage !== undefined) {
  // Old message    
    let starCount = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(starboardMessage.embeds[0].footer.text);
    let embed = starboardMessage.embeds[0];
    
    // Create embed message
    const newEmbed = new Discord.RichEmbed()
      .setColor(embed.color)
      .setDescription(embed.description)
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTimestamp()
      .setFooter(`⭐ ${parseInt(starCount[1]) + 1} | ${message.id}`)
      .setImage(image);
    
    let starMsg = await starboard.fetchMessage(starboardMessage.id);
    await starMsg.edit({ newEmbed });   
  } else {
  // New message
    let starCount = message.reactions.get(reaction.emoji.name).count;
    if (message.reactions.get(reaction.emoji.name).users.has(message.author.id)) starCount--;
    
    // Only add to starboard if over minimum stars
    if (starCount >= config.minimumStars) {
      
      // Create embed message
      let newEmbed = new Discord.RichEmbed()
        .setColor(config.defaultColour)
        .setDescription(message.cleanContent)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp(new Date())
        .setFooter(`⭐ ${starCount} | ${message.id}`)
        .setImage(image);

      await starboard.send({ newEmbed });
    }    
  }  
});

function extension(attachment) {
    let imageLink = attachment.split('.');
    let typeOfImage = imageLink[imageLink.length - 1];
    let image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return '';
    return attachment;
}

// Log in bot
Client.login(process.env.TOKEN);

// Save
function save() {
  FS.writeFile("data.json", JSON.stringify(data));
}