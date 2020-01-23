// Projeyi başlatma kısmı
const FS = require('file-system');
let config = JSON.parse(FS.readFileSync("config.json"));
let data = JSON.parse(FS.readFileSync("data.json"));

// Discord
const Discord = require('discord.js');
const client = new Discord.Client({"partials" : ['CHANNEL', 'MESSAGE']});

// Bilgi
const starterEmbed = new Discord.MessageEmbed()
  .setColor(config.defaultColour)
  .setTitle('Starboard Kurulumuna Hoşgeldin!')
  .setDescription(`Herhangi bir mesaja ⭐ emoji ile tepki verebilirsiniz ve ${config.minimumStars} yıldızına sahip olduktan sonra panoya eklenir! ⭐ :sunglasses:`);

client.on("ready", () => {
  console.log("StarBot Başlatıldı");
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
    if (message.content == "başlat") {
      console.log("Başlatıldı");
      starboard.send(starterEmbed);
    }
});

// Reaksiyonu kontrol eder ve buna göre cevap verir
async function checkReaction(reaction, user, starAmount) {
  
  let message = reaction.message;
  let image = message.attachments.size > 0 ? await extension(message.attachments.array()[0].url) : '';
  
  // Reaction isn't a star
  if (reaction.emoji.name !== '⭐') return;
  
  // Message is from a bot
  if (message.author.bot)
    return message.channel.send(`${user} botlardan gelen mesajlara yıldız ekleyemezsin.`);
  // Message is empty
  if (image === '' && message.cleanContent.length < 1)
    return message.channel.send(`${user} boş bir mesaja yıldız ekleyemezsin.`);
  
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
  // Eski mesaj

    console.log("old message");
    let starCount = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(starboardMessage.embeds[0].footer.text);
    console.log(starCount);
    let embed = starboardMessage.embeds[0];
    let newStarCount = parseInt(starCount[1]) + starAmount;
    console.log("Miktar: " + newStarCount);
    
    if (newStarCount < config.minimumStars) {
      console.log("Mesaj Silindi");
      return starboardMessage.delete(1500);
    }
    
    // Mesajı oluştur
    let newEmbed = new Discord.MessageEmbed()
      .setColor(embed.color)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .addField(`Mesaj içeriği`, embed.description)
      .addField('Orijinal mesaj ', `[Mesaja Git](${message.url})` + "**  **")
      .setTimestamp()
      .setFooter(`🌟 ${parseInt(starCount[1]) + starAmount} | ${message.id} `);
    
    if (image)
      newEmbed.setImage(image);
    
    let starMsg = await starboard.messages.fetch(starboardMessage.id);
    await starMsg.edit({ embed:newEmbed });   
  } else {
  // Yeni mesaj
    console.log("new message");
    let starCount = message.reactions.get(reaction.emoji.name).count;
    //if (message.reactions.get(reaction.emoji.name).users.has(message.author.id)) starCount--;
    
    if (starCount >= config.minimumStars) {
      
      // Mesajı oluştur
      let newEmbed = new Discord.MessageEmbed()
        .setColor(config.defaultColour)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addField(`Mesaj içeriği`, message.cleanContent)
        .addField('Orijinal mesaj', `[Mesaja Git](${message.url})`+ "**  **")
        .setTimestamp(new Date())
        .setFooter(`🌟 ${starCount} | ${message.id}`);
      
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

// Giriş
client.login(process.env.TOKEN);

// Kaydet
function save() {
  FS.writeFile("data.json", JSON.stringify(data));
}