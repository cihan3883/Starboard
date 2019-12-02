Discord.js Bot Template
=================

**~ Creating Your Glitch Bot ~**

----------

Click on `leo-discord-bot-template` in the top-left corner of this window, and click "Remix Project".

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

Discord -> Settings -> Appearance -> Enable "Developer Mode"

Right-click on your bot (in Discord) and click "Copy ID"
.
Paste that ID to the BOT_ID in the `.env` file, like this:

```BOT_ID="YOUR_BOT_ID" //Quotes are required```

----------

Copy your bot's Client ID from its Discord Apps page.

In the following link, replace YOUR_CLIENT_ID with your actual Client ID to get an invite link for the bot:

https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=0

You could also use the permissions calculator on Discord Apps and replace the 0 in the link with a new value to give the bot the specified permissions directly. This step is optional though, as it also works to just edit the bot's permissions after joining the server.

**~ Saving Data ~**

----------

Add your data to the `data` object and then use the `save()` function.

It will be saved into `data.json` and will be loaded back into the `data` object whenever the bot restarts.

**~ Keeping the bot up ~**

----------

Glitch.com automatically shuts down a bot after 5 minutes. To make it always be up, sign up on [Uptime Robot](https://uptimerobot.com/).

On Glitch, click on "Share" under your bot's name, and copy the **App** link.

On Uptime Robot, add a new monitor, and select `HTTP(s)` as its type. Add a name and paste the app link in the URL text field. Then create the monitor.

It should keep the bot up.

Made by Qweleo based on [Matharoo](https://twitter.com/itsmatharoo)'s original tutorial
-------------------

\ (゜o゜)ノ