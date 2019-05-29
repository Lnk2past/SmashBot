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

    message_hook: function(pool, message) {
        var message_str = message.content
        var command = message_str.split(' ', 1)[0];
        var content = message_str.split(' ').slice(1).join(' ')
        if (command.substr(0, 6) == '!smash') {
            if (command == '!smash-record') {
                commands.recorders.record_match(content);
            }
            else if (command == '!smash-report') {
                commands.reports.report_player(pool, message, content);
            }
            else if (command == '!smash-character') {
                commands.reports.report_character(pool, message, content);
            }
            else if (command == '!smash-stage') {
                commands.stages.get_stage(pool, message, content);
            }
            else if (command == '!smash-help') {
                message.channel.send('Sorry, no help is coming. For now...')
            }
            else {
                message.channel.send(commands.stuff.get_cool_phrase());
            }
        }
    }
}