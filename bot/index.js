var pg = require('pg');
var discord = require('discord.js');
var config = require('../config')
var hooks = require('./hooks.js')

module.exports = 
{
start: function() {
    var discord_config = config.discord_config
    var db_config = config.db_config

    var bot = new discord.Client();
    
    // Configure Database
    const pool = new pg.Pool({
        user: db_config.user,
        host: db_config.host,
        database: db_config.database,
        password: db_config.password,
        port: db_config.port,
    });
    
    // Log-on confirmation
    bot.on('ready', () => {
        hooks.ready_hook();
    });
    
    // Disconnect confirmation
    bot.on('disconnect', () => {
        hooks.disconnect_hook();
    });
    
    // Reconnect confirmation
    bot.on('reconnect', () => {
        hooks.reconnect_hook();
    });
    
    bot.on('error', console.error);
    
    // Message hook
    bot.on('message', message => {
        hooks.message_hook(pool, message);
    });
    
    bot.login(discord_config.token);
}
}
