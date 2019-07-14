var dbqueries = require('../dbqueries');


function Matchup(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
}

function MatchupEquality(m1, m2) {
    return m1.p1 == m2.p1 && m1.p2 == m2.p2;
}

Array.prototype.contains = function(element) {
    var i = this.length;
    while (i--) {
       if (MatchupEquality(this[i], element)) {
           return true;
       }
    }
    return false;
};

module.exports = 
{
    set_new_weekly_date: async function(pool, discord_msg, content) {
        var [date, season] = parseArguments(content);
        var current = await dbqueries.get_latest_weekly_date(pool);
        if (date == '') {
            date = new Date();
        }
        else {
            date =  new Date(date);
        }
        if (season == '') {
            if (current !== undefined) {
                season = current.season;
            }
        }
        date = date.toISOString().replace(/\T.+/, '').replace(/-/g, '/');
        await dbqueries.insert_latest_weekly_date(pool, date, season);
    },

    update_bracket: async function(pool, stats_channel) {
        var active_players = await dbqueries.get_active_players(pool);
        var start_date = await dbqueries.get_latest_weekly_date(pool);
        var date_1 = new Date(start_date.date)
        var date_2 = new Date(date_1.getTime() + 7 * 86400000)
        date_1 = date_1.toISOString().replace(/\T.+/, '').replace(/-/g, '/');
        date_2 = date_2.toISOString().replace(/\T.+/, '').replace(/-/g, '/');

        tracker = []

        await asyncForEach(active_players, async (ap) => {
            var played_matches = await dbqueries.get_matches_played_by_player_during_period_with_type(pool, ap.player_id, date_1, date_2, 'mss1');
            if (played_matches === undefined) {
                played_matches = [];
            }
    
            if (played_matches.length != active_players.length - 1) {
                players = []
                await asyncForEach(played_matches, async (pm) => {
                    players_in_match = await dbqueries.get_players_in_match(pool, pm.match_id);
                    await asyncForEach(difference, async (pim) => {
                        if (pim.display_name != ap.display_name && ! players.includes(pim.display_name )) {
                            players.push(pim.display_name);
                        }
                    })
                })
                var difference = active_players.filter(x => !players.includes(x.display_name));
                await asyncForEach(difference, async (d) => {
                    if (d.display_name != ap.display_name) {
                        var m = [ap.display_name, d.display_name]
                        m.sort()
                        matchup = new Matchup(m[0], m[1]);
                        if (!tracker.contains(matchup)) {
                            tracker.push(matchup);
                        }
                    }
                })
            }
        });
        report = 'Matches ' + date_1 + ' through ' + date_2 + '\n';
        report += 'Player 1'.padEnd(20) + ' | ' + 'Player 2'.padEnd(20) + '\n';
        report += ''.padEnd(43, '-') + '\n'

        await asyncForEach(tracker, async (m) => {
            report += m.p1.padEnd(20) + ' | ' + m.p2.padEnd(20) + '\n';
        })
        
        stats_channel.send('```' + report + '```');
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function parseArguments(content) {
    var [date,season] = content.split('|')
    date = date.toLowerCase().trim();
    if (season == undefined) {
        season = '';
    }
    season = season.toLowerCase().trim();
    return [date, season];
}
