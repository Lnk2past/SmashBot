var PLAYERS = 'SELECT * FROM player';
var CHARACTERS = 'SELECT * FROM character';
var MAIN_PLAYER = 'SELECT player_id,display_name FROM player WHERE player_name=$1';
var MAIN_CHARACTER = 'SELECT * FROM character WHERE character_name=$1';
var GAMES_PLAYED_BY_PLAYER = 'SELECT game.game_id FROM game LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1 ORDER BY game.game_id';
var PCG_FROM_GAME_ORDERED_BY_PLAYER = 'SELECT * FROM pcg WHERE game_id=$1 ORDER BY CASE player_id WHEN $2 THEN 1 ELSE 2 END';
var PCG_FROM_GAME = 'SELECT * from pcg WHERE game_id=$1';
var PCG_PLAYED_BY_PLAYER = 'SELECT * FROM pcg WHERE player_id=$1';
var PCG_PLAYED_BY_PLAYER_AS_CHAR = 'SELECT COUNT(*) FROM pcg WHERE player_id=$1 AND character_id=$2';
var PCG_WON_BY_PLAYER = 'SELECT COUNT(*) FROM pcg WHERE player_id=$1 and win=true';
var MATCHES_PLAYED_BY_PLAYER = 'SELECT COUNT(DISTINCT match.match_id) FROM match LEFT JOIN game ON game.match_id=match.match_id LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1';
var MATCHES_WON_BY_PLAYER = 'SELECT COUNT(*) FROM match WHERE winner=$1';

module.exports = 
{
report_player: async function(pool, discord_msg, content) {
    var [player,character] = content.split('|')
    if (player == '')
    {
        player = discord_msg.author.username
    }
    player = player.toLowerCase().trim();

    if (character === undefined) {
        character = '';
    }
    character = character.toLowerCase().trim();

    var player_list_res = await pool.query(PLAYERS);
    var players = player_list_res.rows.reduce(function(map, obj) {
        map[obj.player_id] = obj.player_name;
        return map;
    }, {});

    var char_list_res = await pool.query(CHARACTERS);
    var chars = char_list_res.rows.reduce(function(map, obj) {
        map[obj.character_id] = obj.character_name;
        return map;
    }, {});

    var player_res = await pool.query(MAIN_PLAYER, [player]);
    var player_id = player_res.rows[0].player_id;
    var player_display_name = player_res.rows[0].display_name;

    var games_played_res = await pool.query(GAMES_PLAYED_BY_PLAYER, [player_id]);
    var pcg_played_res = await pool.query(PCG_PLAYED_BY_PLAYER, [player_id]);
    var pcg_won_res = await pool.query(PCG_WON_BY_PLAYER, [player_id]);
    var matches_played_res = await pool.query(MATCHES_PLAYED_BY_PLAYER, [player_id]);
    var matches_won_res = await pool.query(MATCHES_WON_BY_PLAYER, [player_id]);

    var pcg_played = pcg_played_res.rows.length;
    var pcg_won = pcg_won_res.rows[0].count;
    var matches_played = matches_played_res.rows[0].count;
    var matches_won = matches_won_res.rows[0].count;

    var chars_played = {};
    await asyncForEach(pcg_played_res.rows, async (pcg) => {
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
    await asyncForEach(games_played_res.rows, async (game) => {
        pcg_from_game_res = await pool.query(PCG_FROM_GAME_ORDERED_BY_PLAYER, [game.game_id, player_id]);
        player_pcg = pcg_from_game_res.rows[0];
        opponent_pcg = pcg_from_game_res.rows[1];

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

    var report = '```' + generateOverallReport(player_display_name, matches_played, matches_won, pcg_played, pcg_won, player_char_data) + '```'
    if (character != '') {
        if (character in char_matchups) {
            var character_res = await pool.query(MAIN_CHARACTER, [character]);
            var character_id = character_res.rows[0].character_id;
            var pcg_played_as_char_res = await pool.query(PCG_PLAYED_BY_PLAYER_AS_CHAR, [player_id, character_id]);
            var pcg_player_as_char = pcg_played_as_char_res.rows[0].count;

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
}
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
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

function generateOverallReport(player_display_name, matches_played, matches_won, pcg_played, pcg_won, player_char_data) {
    report = '';
    report += 'Player Summary: ' + player_display_name + '\n';
    report += 'Matches Record: ' + getRecordString(matches_played, matches_won);
    report += 'Game Record:    ' + getRecordString(pcg_played, pcg_won);
    report += 'Top 5 Characters:\n'
    for (var char_idx = 0; char_idx < 5 && char_idx < player_char_data.length; char_idx++) {
        var p = player_char_data[char_idx][1][0];
        var w = player_char_data[char_idx][1][1];
        var char_str = (player_char_data[char_idx][0] + ':').padEnd(20);
        report += '   ' + char_str + getCharacterRecordString(pcg_played, p, w);
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
    return report;}




