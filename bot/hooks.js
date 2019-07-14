var commands = require('../commands');

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

    message_hook: function(pool, discord_msg) {
        var message_str = discord_msg.content
        var command = message_str.split(' ', 1)[0];
        var content = message_str.split(' ').slice(1).join(' ')
        if (command.substr(0, 6) == '!smash') {
            if (command == '!smash-record') {
                commands.recorders.record_match(content);
            }
            else if (command == '!smash-report') {
                commands.reports.report_player(pool, discord_msg, content);
            }
            else if (command == '!smash-character') {
                commands.reports.report_character(pool, discord_msg, content);
            }
            else if (command == '!smash-stage') {
                commands.stages.get_stage(pool, discord_msg, content);
            }
            else if (command == '!smash-bracket') {
                commands.bracket.create_matches(pool, discord_msg, content);
            }
            else if (command == '!smash-help') {
                discord_msg.channel.send('Sorry, no help is coming. For now...');
            }
            else {
                discord_msg.channel.send(commands.stuff.get_cool_phrase());
            }
        }
    }
}