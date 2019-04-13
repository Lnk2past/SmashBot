// Modules
var fs = require('fs');
var csv = require('csv-parser');
var pg = require('pg');
var discord = require('discord.js');

// Commands
var recorders = require('./commands/record.js');
var reports = require('./commands/report.js');
var stages = require('./commands/stages.js');
var stuff = require('./commands/stuff.js');

// Configuration
var auth = require('./auth.json');
var db_config = require('./db_config.json');

// Initialize discord Bot
var bot = new discord.Client();
var monitoring_enabled = false;
var monitoring_interval = null;

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
    var d = new Date();
    console.log('Connected', d.toLocaleDateString(), d.toLocaleTimeString());
    console.log(`Logged in as ${bot.user.tag}!`);
});

// Disconnect confirmation
bot.on('disconnect', () => {
    var d = new Date();
    console.log('Disconnected!', d.toLocaleDateString(), d.toLocaleTimeString());
});

// Reconnect confirmation
bot.on('reconnect', () => {
    var d = new Date();
    console.log('Reconnecting...', d.toLocaleDateString(), d.toLocaleTimeString());
});

bot.on('error', console.error);

// Message hook
bot.on('message', msg => {
    var message_str = msg.content
    var command = message_str.split(' ', 1)[0];
    var content = message_str.split(' ').slice(1).join(' ')
    if (command.substr(0, 6) == '!smash') {
        if (command == '!smash-record') {
            recorders.record_match(content);
        }
        else if (command == '!smash-report') {
            reports.report_player(pool, msg, content);
        }
        else if (command == '!smash-character') {
            reports.report_character(pool, msg, content);
        }
        else if (command == '!smash-stage') {
            stages.get_stage(pool, msg, content);
        }
        else if (command == '!smash-help') {
            msg.channel.send('Sorry, no help is coming. For now...')
        }
        else {
            msg.channel.send(stuff.get_cool_phrase());
        }
    }
});

bot.login(auth.token);
