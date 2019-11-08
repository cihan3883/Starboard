// Init project
const FS = require('file-system');
let config = JSON.parse(FS.readFileSync("config.json"));

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
  
  let starChannel = message.guild.channels.find(channel => channel.name === config.starboardChannel);
  let fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
  const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
  if (stars) {
    const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
    const foundStar = stars.embeds[0];
    const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
    const embed = new Discord.RichEmbed()
      .setColor(foundStar.color)
      .setDescription(foundStar.description)
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTimestamp()
      .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
      .setImage(image);
    const starMsg = await starChannel.fetchMessage(stars.id);
    await starMsg.edit({ embed });
  }
  if (!stars) {
    const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
    if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`);
    const embed = new Discord.RichEmbed()
      .setColor(15844367)
      .setDescription(message.cleanContent)
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTimestamp(new Date())
      .setFooter(`⭐ 1 | ${message.id}`)
      .setImage(image);
    await starChannel.send({ embed });
  }
  
});


// Log in bot
Client.login(process.env.TOKEN);

// Save
function save() {
  FS.writeFile("info.json", JSON.stringify(info));
}