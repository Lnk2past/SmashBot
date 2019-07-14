var commands = require('../commands');
var config = require('../config')

module.exports = 
{
    ready_hook: function() {
        var d = new Date();
        console.log('Connected', d.toLocaleDateString(), d.toLocaleTimeString());
    },

    disconnect_hook: function() {
        var d = new Date();
        console.log('Disconnected!', d.toLocaleDateString(), d.toLocaleTimeString());
    },

    reconnect_hook: function() {
        var d = new Date();
        console.log('Reconnecting...', d.toLocaleDateString(), d.toLocaleTimeString());
    },

    message_hook: function(bot, pool, discord_msg) {
        var message_str = discord_msg.content
        var command = message_str.split(' ', 1)[0];
        var content = message_str.split(' ').slice(1).join(' ')
        if (command.substr(0, 6) == '!smash') {
            command = command.substr(1);
            command_config = config.discord_config.permissions[command];
            if (command_config != undefined) {
                if (command_config == "admins") {
                    command_config = config.discord_config.identifications.admins;
                }
                if (!command_config.includes(discord_msg.author.id)) {
                    discord_msg.channel.send("You do not have permission to do that!");
                    return;
                }
            }

            if (command == 'smash-record') {
                commands.recorders.record_match(content);
            }
            else if (command == 'smash-report') {
                commands.reports.report_player(pool, discord_msg, content);
            }
            else if (command == 'smash-character') {
                commands.reports.report_character(pool, discord_msg, content);
            }
            else if (command == 'smash-stage') {
                commands.stages.get_stage(pool, discord_msg, content);
            }
            else if (command == 'smash-set-new-weekly') {
                commands.bracket.set_new_weekly_date(pool, discord_msg, content);
            }
            else if (command == 'smash-upbracket') {
                var stats_channel = bot.channels.get(config.discord_config.identifications.sandbox_channel);
                commands.bracket.update_bracket(pool, stats_channel);
            }
            else if (command == 'smash-help') {
                discord_msg.channel.send('Sorry, no help is coming. For now...');
            }
            else {
                discord_msg.channel.send(commands.stuff.get_cool_phrase());
            }
        }
    }
}