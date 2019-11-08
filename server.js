// Init project
const FS = require('file-system');
let config = JSON.parse(FS.readFileSync("config.json"));
let data ) JSON.parse

// Discord
const Discord = require('discord.js');
const Client = new Discord.Client();

Client.on("ready", () => {
  console.log("StarBot started");
});


Client.on("MessageReactionAdd", async (reaction, user) => {
  let message = reaction.message;
  
  // Reaction isn't a star
  if (reaction.emoji.name !== '⭐') return;
  // Reacting to your own message
  if (message.author.id === user.id)
    return message.channel.send(`${user}, you cannot star your own messages.`);
  // Message is from a bot
  if (message.author.bot)
    return message.channel.send(`${user}, you cannot star bot messages.`);
  
  let starboard = message.guild.channels.find(channel => channel.name === config.starboardChannel);
  let fetchedMessages = await starboard.fetchMessages({ limit: 100 });
  let starboardMessage = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
  if (starboardMessage !== undefined) {
    let stars = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(starboardMessage.embeds[0].footer.text);
    let embed = starboardMessage.embeds[0];
    let image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
    const newEmbed = new Discord.RichEmbed()
      .setColor(embed.color)
      .setDescription(embed.description)
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTimestamp()
      .setFooter(`⭐ ${parseInt(stars[1])+1} | ${message.id}`)
      .setImage(image);
    const starMsg = await starboard.fetchMessage(starboardMessage.id);
    await starMsg.edit({ embed });
  } else {
    const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
    if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`);
    const embed = new Discord.RichEmbed()
      .setColor(15844367)
      .setDescription(message.cleanContent)
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTimestamp(new Date())
      .setFooter(`⭐ 1 | ${message.id}`)
      .setImage(image);
    await starboard.send({ embed });
  }
  
});


// Log in bot
Client.login(process.env.TOKEN);

// Save
function save() {
  FS.writeFile("data.json", JSON.stringify(data));
}