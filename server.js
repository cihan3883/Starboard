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

client.on("message", (message) => {
  console.log("message");
});

client.on("messageReactionAdd", async (reaction, user) => {
  console.log("reacted");
  let message = reaction.message;
  let image = message.attachments.size > 0 ? await extension(message.attachments.array()[0].url) : '';
  
  console.log("passed image");
  
  // Reaction isn't a star
  if (reaction.emoji.name !== '⭐') return;
  // Message is your own
  if (message.author.id === user.id)
    //return message.channel.send(`${user}, you can't star your own messages.`);
  // Message is from a bot
  if (message.author.bot)
    return message.channel.send(`${user}, you can't star bot messages.`);
  // Message is empty
  if (image === '' && message.cleanContent.length < 1)
    return message.channel.send(`${user}, you cannot star an empty message.`);
  
  let starboard = message.guild.channels.find(channel => channel.name === config.starboardChannel);
  let fetchedMessages = await starboard.fetchMessages({ limit: 100 });
  //let starboardMessage = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
  
  //starboard.send("star");
  
  /*if (starboardMessage) {
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
  } else*/ {
  // New message
    let starCount = message.reactions.get(reaction.emoji.name).count;
    //if (message.reactions.get(reaction.emoji.name).users.has(message.author.id)) starCount--;
    
    // Only add to starboard if over minimum stars
    if (starCount >= config.minimumStars) {
      
      // Create embed message
      /*let newEmbed = new Discord.RichEmbed()
        .setColor(config.defaultColour)
        .setDescription(message.cleanContent)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp(new Date())
        .setFooter(`⭐ ${starCount} | ${message.id}`)
        .setImage(image);*/
      console.log("Starting embed");
      let newEmbed = new Discord.RichEmbed()
        .setTitle("This is your title, it can hold 256 characters")
        .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00AE86)
        .setDescription("This is the main body of text, it can hold 2048 characters.")
        .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
        .setImage("http://i.imgur.com/yVpymuV.png")
        .setThumbnail("http://i.imgur.com/p2qNFag.png")
        /*
         * Takes a Date object, defaults to current date.
         */
        .setTimestamp()
        .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
        .addField("This is a field title, it can hold 256 characters",
          "This is a field value, it can hold 1024 characters.")
        /*
         * Inline fields may not display as inline if the thumbnail and/or image is too big.
         */
        .addField("Inline Field", "They can also be inline.", true)
        /*
         * Blank field, useful to create some space.
         */
        .addBlankField(true)
        .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);

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
client.login(process.env.TOKEN);

// Save
function save() {
  FS.writeFile("data.json", JSON.stringify(data));
}