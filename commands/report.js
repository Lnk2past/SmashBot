module.exports = 
{
report_player: async function(pool, discord_msg, content) {
    if (content === undefined)
    {
        content = discord_msg.author.username
    }
    content = content.toLowerCase();

    var player_list_res = await pool.query('SELECT * FROM player');
    var players = convertResultRowsToDict(player_list_res);
    var char_list_res = await pool.query('SELECT * FROM character');
    var chars = convertResultRowsToDict(char_list_res);
    var player_res = await pool.query('SELECT id FROM player WHERE name=$1', [content]);
    var player_id = player_res.rows[0].id;

    var games_played_res = await pool.query('SELECT * FROM game WHERE player1=$1 OR player2=$1', [player_id]);
    var games_won_res = await pool.query('SELECT COUNT(*) FROM game WHERE winner=$1', [player_id]);
    var matches_played_res = await pool.query('SELECT COUNT(DISTINCT match_id) FROM game WHERE player1=$1 OR player2=$1', [player_id]);
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
        game.player1 = players[game.player1];
        game.player2 = players[game.player2];
        game.player1_char = chars[game.player1_char];
        game.player2_char = chars[game.player2_char];
        game.winner = players[game.winner];
        if (game.player1 == content) {
            if (!(game.player1_char in chars_played)) {
                chars_played[game.player1_char] = [0,0];
            }
            chars_played[game.player1_char][0] += 1;
            if (game.winner == content) {
                chars_played[game.player1_char][1] += 1;
            }
        }
        else if (game.player2 == content) {
            if (!(game.player2_char in chars_played)) {
                chars_played[game.player2_char] = [0,0];
            }
            chars_played[game.player2_char][0] += 1;
            if (game.winner == content) {
                chars_played[game.player2_char][1] += 1;
            }
        }
    });

    var player_char_data = Object.keys(chars_played).map(function(key) {
        return [key, chars_played[key]];
    });
    player_char_data.sort(function(first, second) {
        var wp1 = (first[1][1]/first[1][0]).toPrecision(3);
        var wp2 = (second[1][1]/second[1][0]).toPrecision(3);
        return wp2 - wp1;
    });

    report += 'Top 5 Characters:\n'
    for (var char_idx = 0; char_idx < 5 && char_idx < player_char_data.length; char_idx++) {
        var p = player_char_data[char_idx][1][0];
        var w = player_char_data[char_idx][1][1];
        var char_str = (player_char_data[char_idx][0] + ':').padEnd(20);
        report += '   ' + char_str + getRecordString(p, w);
    }
    report += '```';
    discord_msg.channel.send(report);
},
report_matches: async function(pool, discord_msg, content) {
    if (content === undefined)
    {
        content = discord_msg.author.username
    }
    content = content.toLowerCase();

    var player_list_res = await pool.query('SELECT * FROM player');
    var players = convertResultRowsToDict(player_list_res);
    var char_list_res = await pool.query('SELECT * FROM character');
    var chars = convertResultRowsToDict(char_list_res);
    var player_res = await pool.query('SELECT id FROM player WHERE name=$1', [content]);
    var player_id = player_res.rows[0].id;

    var report = '```'
    report += 'Game Summary: ' + content + '\n';
    var games_played_res = await pool.query('SELECT * FROM game WHERE player1=$1 OR player2=$1', [player_id]);
    await asyncForEach(games_played_res.rows, async (game) => {
        game.player1 = players[game.player1];
        game.player2 = players[game.player2];
        game.player1_char = chars[game.player1_char];
        game.player2_char = chars[game.player2_char];
        game.winner = players[game.winner];


    });
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

function formatGameString(game) {
    var game_id_str = (game.id + ':').padEnd(4, ' ');
    return game_id_str;
}
