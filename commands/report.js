module.exports = 
{
report_player: async function(pool, discord_msg, content) {
    if (content == '')
    {
        content = discord_msg.author.username
    }
    content = content.toLowerCase();

    var player_list_res = await pool.query('SELECT * FROM player');
    var players = player_list_res.rows.reduce(function(map, obj) {
        map[obj.player_id] = obj.player_name;
        return map;
    }, {});

    var char_list_res = await pool.query('SELECT * FROM character');
    var chars = char_list_res.rows.reduce(function(map, obj) {
        map[obj.character_id] = obj.character_name;
        return map;
    }, {});

    var player_res = await pool.query('SELECT player_id FROM player WHERE player_name=$1', [content]);
    var player_id = player_res.rows[0].player_id;

    var games_played_res = await pool.query('SELECT * FROM pcg WHERE player_id=$1', [player_id]);
    var games_won_res = await pool.query('SELECT COUNT(*) FROM pcg WHERE player_id=$1 and win=true', [player_id]);
    var matches_played_res = await pool.query('SELECT COUNT(DISTINCT match.match_id) FROM match LEFT JOIN game ON game.match_id=match.match_id LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1;', [player_id]);
    var matches_won_res = await pool.query('SELECT COUNT(*) FROM match WHERE winner=$1', [player_id]);

    var games_played = games_played_res.rows.length;
    var games_won = games_won_res.rows[0].count;
    var matches_played = matches_played_res.rows[0].count;
    var matches_won = matches_won_res.rows[0].count;

    var report = '```'
    report += 'Player Summary: ' + content + '\n';
    report += 'Matches Record: ' + getRecordString(matches_played, matches_won);
    report += 'Game Record:    ' + getRecordString(games_played, games_won);

    var chars_played = {};

    await asyncForEach(games_played_res.rows, async (game) => {
        var character = chars[game.character_id];
        if (!(character in chars_played)) {
            chars_played[character] = [0,0];
        }
        chars_played[character][0] += 1;
        if (game.win == true) {
            chars_played[character][1] += 1;
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

    report += 'Top 5 Characters:\n'
    for (var char_idx = 0; char_idx < 5 && char_idx < player_char_data.length; char_idx++) {
        var p = player_char_data[char_idx][1][0];
        var w = player_char_data[char_idx][1][1];
        var char_str = (player_char_data[char_idx][0] + ':').padEnd(20);
        report += '   ' + char_str + getCharacterRecordString(games_played, p, w);
    }
    report += '```';
    discord_msg.channel.send(report);
},

report_matches: async function(pool, discord_msg, content) {

},

report_character: async function(pool, discord_msg, content) {
    if (content === undefined)
    {
        content = discord_msg.author.username
    }
    content = content.toLowerCase();

    var character_res = await pool.query('SELECT character_id FROM character WHERE character_name=$1', [content]);
    var character_id = player_res.rows[0].character_id;

    var games_played_res = await pool.query('SELECT * FROM pcg WHERE character_id=$1', [character_id]);
    var games_won_res = await pool.query('SELECT COUNT(*) FROM pcg WHERE character_id=$1 and win=true', [character_id]);

    var games_played = games_played_res.rows.length;
    var games_won = games_won_res.rows[0].count;

    var report = '```'
    report += 'Character Summary: ' + content + '\n';
    report += 'Game Record:    ' + getRecordString(games_played, games_won);
    report += '```';
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
    return won + '-' + lost + ' (' + win_percentage + '% of ' + played + ' total)\n';
}

function getCharacterRecordString(total_played, played, won) {
    var lost = played-won;
    var play_percentage = (100.0 * played / total_played).toPrecision(3);
    var win_percentage = (100.0 * won / played).toPrecision(3);
    var play_stats_str = '(played: ' + play_percentage + '% of ' + total_played + ' games'
    var win_stats_str = ', won: ' + win_percentage + '% of ' + played + ' games)'
    return (won + '-' + lost).padEnd(8)  + ' ' + play_stats_str + win_stats_str + '\n';
}

function formatGameString(game) {
    var game_id_str = (game.id + ':').padEnd(4, ' ');
    return game_id_str;
}
