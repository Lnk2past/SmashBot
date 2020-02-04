dbqueries = require('../dbqueries');

module.exports =
{
report_player: async function(pool, discord_msg, content) {
    var [player_name, fighter_name] = parseArguments(content, discord_msg.author.username);
    var [player_id, player_name] = await dbqueries.get_primary_player(pool, player_name);

    // var players = await mapPlayerNames(pool);
    var fighters = await mapCharacterNames(pool);

    var games_played = await dbqueries.get_games_played_by_player(pool, player_id);
    var games_won = await dbqueries.get_games_won_by_player(pool, player_id);
    var games_played_count = games_played.length;
    var games_won_count = games_won.length;

    var matches_played = await dbqueries.get_matches_played_by_player(pool, player_id);
    var matches_won = await dbqueries.get_matches_won_by_player(pool, player_id);
    var matches_played_count = matches_played.length;
    var matches_won_count = matches_won.length;

    var fighters_played = {};
    await asyncForEach(games_played, async (game) => {
        var fighter = fighters[game.fighter];
        if (!(fighter in fighters_played)) {
            fighters_played[fighter] = [0,0];
        }
        fighters_played[fighter][0] += 1;
        if (game.win == true) {
            fighters_played[fighter][1] += 1;
        }
    });

    var player_fighter_data = Object.keys(fighters_played).map(function(key) {
        return [key, fighters_played[key]];
    });
    player_fighter_data.sort(function(first, second) {
        var wp1 = first[1][0];
        var wp2 = second[1][0];
        return wp2 - wp1;
    });

    var fighter_matchups = {};
    await asyncForEach(games_played, async (game) => {
        var games = await dbqueries.get_games_by_id(pool, game.game_id);
        games.sort((a, b) => {
            if (a.player == player_id) {
                return -1;
            }
            if (a.win == true) {
                return -1;
            }
            return 0;
        });

        var fighter = fighters[games[0].fighter];
        var opponent_fighter = fighters[games[1].fighter];

        if (!(fighter in fighter_matchups)) {
            fighter_matchups[fighter] = {};
        }
        if (!(opponent_fighter in fighter_matchups[fighter])) {
            fighter_matchups[fighter][opponent_fighter] = [0,0];
        }

        fighter_matchups[fighter][opponent_fighter][0] += 1;
        if (games[0].win == true) {
            fighter_matchups[fighter][opponent_fighter][1] += 1;
        }
    });

    var report = '```' + generateOverallReport(player_name, matches_played_count, matches_won_count, games_played_count, games_won_count, player_fighter_data) + '```';
    if (fighter_name != '') {
        if (fighter_name in fighter_matchups) {
            var fighter_id = await dbqueries.get_fighter_by_name(pool, fighter_name);
            var games_as_fighter = await dbqueries.get_games_played_by_player_as_fighter(pool, player_id, fighter_id);
            var matchup = fighter_matchups[fighter_name];
            var matchup_data = Object.keys(matchup).map(function(key) {
                return [key, matchup[key]];
            });
            matchup_data.sort(function(first, second) {
                var wp1 = first[1][0];
                var wp2 = second[1][0];
                return wp2 - wp1;
            });
            report += '```' + generateMatchupReport(fighter_name, matchup_data, games_as_fighter) + '```'
        }
        else {
            report += '```Could not find any matchup data for player ' + player_name + ' and fighter ' + fighter_name + '```';
        }
    }

    discord_msg.channel.send(report);
},

report_fighter: async function() {}

}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function parseArguments(content, message_username) {
    var [player,fighter] = content.split('|')
    if (player == '')
    {
        player = message_username;
    }
    if (fighter === undefined) {
        fighter = '';
    }
    return [player, fighter];
}

// async function mapPlayerNames(pool) {
//     var player_list = await dbqueries.get_players(pool);
//     var players = player_list.reduce(function(map, obj) {
//         map[obj.player_id] = obj.player_name;
//         return map;
//     }, {});
//     return players;
// }

async function mapCharacterNames(pool) {
    var fighters = await dbqueries.get_fighters(pool);
    fighters = fighters.reduce(function(map, obj) {
        map[obj.id] = obj.name;
        return map;
    }, {});
    return fighters;
}


// function convertResultRowsToDict(result) {
//     return result.rows.reduce(function(map, obj) {
//         map[obj.id] = obj.name;
//         return map;
//     }, {});
// }

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

function generateOverallReport(player_name, matches_played, matches_won_count, games_played_count, games_won_count, player_fighter_data) {
    report = '';
    report += 'Player Summary: ' + player_name + '\n';
    report += 'Matches Record: ' + getRecordString(matches_played, matches_won_count);
    report += 'Game Record:    ' + getRecordString(games_played_count, games_won_count);
    report += 'Top 5 Fighters:\n'
    for (var fighter_idx = 0; fighter_idx < 5 && fighter_idx < player_fighter_data.length; fighter_idx++) {
        var p = player_fighter_data[fighter_idx][1][0];
        var w = player_fighter_data[fighter_idx][1][1];
        var fighter_str = (player_fighter_data[fighter_idx][0] + ':').padEnd(20);
        report += '   ' + fighter_str + getCharacterRecordString(games_played_count, p, w);
    }
    return report;
}

function generateMatchupReport(fighter, matchup_data, games_played_as_char) {
    report = '';
    report += 'Matchup Summary: ' + fighter + '\n';
    for (var fighter_idx = 0; fighter_idx < matchup_data.length; fighter_idx++) {
        var p = matchup_data[fighter_idx][1][0];
        var w = matchup_data[fighter_idx][1][1];
        var fighter_str = (matchup_data[fighter_idx][0] + ':').padEnd(20);
        report += '   ' + fighter_str + getCharacterRecordString(games_played_as_char, p, w);
    }
    return report;
}
