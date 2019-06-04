# SmashBot
A SSBU Discord bot for tracking and reporting on player statistics

## Installation
Clone this repo and configure the `config/db_config.son`and `config/discord_config.json` with the necessary information. The database config contains the basic info to log into your PostgreSQL database. The Discord config contains the token needed to access your Discord server.

Once cloned and configured, use something like [pm2](http://pm2.keymetrics.io/) to run the bot.

## Motivation
I made SmashBot because I wanted to start hosting SSBU seasons. Part of this meant integrating into Discord (which is where all of the communication is) and the other part of it meant storing everything in a database. I wanted to be able to track stats not just for seasons, but overall, and build information on the meta within my playgroup.

## How It Works
`SmashBot` uses [discord.js](https://discord.js.org) to connect to the Discord server as a bot. The bot then listens for preset commands and forwards them along appropriately. The bot ultimately makes calls to a PostgreSQL to retrieve data, and then does some processing to compute some statistics and format the data before sending it back to Discord.

## Database
TODO

## License
See [LICENSE](LICENSE) for the specifics, but it is an MIT license.

## TODO
- document database
- add common queries
- add random stage selector
- add character query commands
- add game and match reporting/query commands
- add weekly round-robin organizer
