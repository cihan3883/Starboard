Discord.js Bot Template
=================

**~ Creating Your Glitch Bot ~**

----------

Click on `discord-js-bot-template` in the top-left corner of this window, and click "Remix Project".

It should duplicate this template into your account. You can then edit it and create your own bot.

**~ Editing ~**

----------

The bot's code is in `server.js`.

**~ How to use ~**

----------

Go here and create a new app: [Discord Apps](https://discordapp.com/developers/applications/)

(Make sure you enable the bot for it)

Copy its token and paste it in the `.env` file, like this:

```TOKEN="YOUR_TOKEN_VALUE" //Quotes are required```

----------

Copy your bot's Client ID

Replace YOUR_CLIENT_ID with your actual Client ID in this link, to get an invite link for the bot:

https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=0

----------

Discord -> Settings -> Appearance -> Enable "Developer Mode"

Right-click on your bot (in Discord) and click "Copy ID"
.
Paste that ID in line 40 of `server.js`

**~ Commands ~**

----------

Under the switch() at line 33 of `server.js`.

**~ Message Replies ~**

----------

Inside the if() block at line 40 of `server.js`.

**~ Saving Data ~**

----------

Add your stuff inside the `info` object and use `save()`.

It will be saved into `info.json` and will be loaded back into the `info` object whenever the bot restarts.


Made by [Matharoo](https://twitter.com/itsmatharoo)
-------------------

\ (゜o゜)ノ
