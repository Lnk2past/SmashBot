dbqueries = require('../dbqueries');

module.exports = 
{
report_player: async function(pool, discord_msg, content) {
    var [player, character] = parseArguments(content, discord_msg.author.username);
    var [player_id, player_display_name] = await dbqueries.get_primary_player(pool, player);

    var players = await mapPlayerNames(pool);
    var chars = await mapCharacterNames(pool);

    var games_played = await dbqueries.get_games_played_by_player(pool, player_id);
    var pcgs_played = await dbqueries.get_pcgs_played_by_player(pool, player_id);
    var pcg_play_count = pcgs_played.length;
    var pcg_win_count = await dbqueries.get_pcgs_won_by_player(pool, player_id);
    var match_play_count = await dbqueries.get_matches_played_by_player(pool, player_id);
    var matches_win_count = await dbqueries.get_matches_won_by_player(pool, player_id);

    var chars_played = {};
    await asyncForEach(pcgs_played, async (pcg) => {
        var char = chars[pcg.character_id];
        if (!(char in chars_played)) {
            chars_played[char] = [0,0];
        }
        chars_played[char][0] += 1;
        if (pcg.win == true) {
            chars_played[char][1] += 1;
        }
    });

    var player_char_data = Object.keys(chars_played).map(function(key) {
        return [key, chars_played[key]];
    });

    player_char_data.sort(function(first, second) {
        var wp1 = first[1][0];
        var wp2 = second[1][0];
        return wp2 - wp1;
    });

    var char_matchups = {};
    await asyncForEach(games_played, async (game) => {
        var [player_pcg, opponent_pcg] = await dbqueries.get_pcgs_from_games_ordered(pool, game.game_id, player_id);
        var char = chars[player_pcg.character_id];
        var opponent = chars[opponent_pcg.character_id];

        if (!(char in char_matchups)) {
            char_matchups[char] = {};
        }
        if (!(opponent in char_matchups[char])) {
            char_matchups[char][opponent] = [0,0];
        }

        char_matchups[char][opponent][0] += 1;
        if (player_pcg.win == true) {
            char_matchups[char][opponent][1] += 1;
        }
    });

    var report = '```' + generateOverallReport(player_display_name, match_play_count, matches_win_count, pcg_play_count, pcg_win_count, player_char_data) + '```'
    if (character != '') {
        if (character in char_matchups) {
            var character_id = await dbqueries.get_primary_character(pool, character);
            var pcg_player_as_char = await dbqueries.get_pcgs_played_by_player_as_char(pool, player_id, character_id);
            char_matchup = char_matchups[character];
            var char_matchup_data = Object.keys(char_matchup).map(function(key) {
                return [key, char_matchup[key]];
            });
        
            char_matchup_data.sort(function(first, second) {
                var wp1 = first[1][0];
                var wp2 = second[1][0];
                return wp2 - wp1;
            });    
            report += '```' + generateMatchupReport(character, char_matchup_data, pcg_player_as_char) + '```'
        }
        else {
            report += '```Could not find any matchup data for player ' + player_display_name + ' and character ' + character + '```';
        }
    }

    discord_msg.channel.send(report);
},

report_character: async function() {}

}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function parseArguments(content, message_username) {
    var [player,character] = content.split('|')
    if (player == '')
    {
        player = message_username;
    }
    player = player.toLowerCase().trim();

    if (character === undefined) {
        character = '';
    }
    character = character.toLowerCase().trim();
    return [player, character];
}

async function mapPlayerNames(pool) {
    var player_list = await dbqueries.get_players(pool);
    var players = player_list.reduce(function(map, obj) {
        map[obj.player_id] = obj.player_name;
        return map;
    }, {});
    return players;
}

async function mapCharacterNames(pool) {
    var char_list = await dbqueries.get_characters(pool);
    var chars = char_list.reduce(function(map, obj) {
        map[obj.character_id] = obj.character_name;
        return map;
    }, {});
    return chars;
}


function convertResultRowsToDict(result) {
    return result.rows.reduce(function(map, obj) {
        map[obj.id] = obj.name;
        return map;
    }, {});
}

function getRecordString(played, won) {
    var lost = played-won;
    var win_percentage = (100.0 * won / played).toPrecision(3);
    return (won + '-' + lost).padEnd(8) + ' (' + win_percentage + '% of ' + played + ' total)\n';
}

function getCharacterRecordString(total_played, played, won) {
    var lost = played-won;
    var play_percentage = (100.0 * played / total_played).toPrecision(3);
    var win_percentage = (100.0 * won / played).toPrecision(3);
    var play_stats_str = '(played: ' + play_percentage + '%'
    var win_stats_str = ', won: ' + win_percentage + '%)'
    return (won + '-' + lost).padEnd(8)  + ' ' + play_stats_str + win_stats_str + '\n';
}

function generateOverallReport(player_display_name, matches_played, matches_win_count, pcg_play_count, pcg_win_count, player_char_data) {
    report = '';
    report += 'Player Summary: ' + player_display_name + '\n';
    report += 'Matches Record: ' + getRecordString(matches_played, matches_win_count);
    report += 'Game Record:    ' + getRecordString(pcg_play_count, pcg_win_count);
    report += 'Top 5 Characters:\n'
    for (var char_idx = 0; char_idx < 5 && char_idx < player_char_data.length; char_idx++) {
        var p = player_char_data[char_idx][1][0];
        var w = player_char_data[char_idx][1][1];
        var char_str = (player_char_data[char_idx][0] + ':').padEnd(20);
        report += '   ' + char_str + getCharacterRecordString(pcg_play_count, p, w);
    }
    return report;
}

function generateMatchupReport(character, char_matchup_data, pcg_player_as_char) {
    report = '';
    report += 'Matchup Summary: ' + character + '\n';
    for (var char_idx = 0; char_idx < char_matchup_data.length; char_idx++) {
        var p = char_matchup_data[char_idx][1][0];
        var w = char_matchup_data[char_idx][1][1];
        var char_str = (char_matchup_data[char_idx][0] + ':').padEnd(20);
        report += '   ' + char_str + getCharacterRecordString(pcg_player_as_char, p, w);
    }
    return report;
}
